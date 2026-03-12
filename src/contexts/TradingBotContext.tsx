/**
 * 🤖 Trading Bot Context — Background Execution Engine
 * Keeps the AutoPilot Bot running even when the user navigates away from the page.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from './LanguageContext';
import { useRealtimePrices, type RealtimePricesMap } from '@/hooks/useRealtimePrices';
import {
    BotConfig, BotStats, PaperTrade, BotStatus, TradeDirection,
    loadConfig, saveConfig, loadTrades, saveTrades, calculateStats,
    generateDemoTrades, openPaperTrade, closeTrade,
    updateTradePrice, loadCircuitBreaker, getRemainingCooldown,
    type SmartSignalData, type CircuitBreakerState,
} from '@/lib/autoPilotService';
import { analyzeBatch, type SmartSignal } from '@/lib/tradingIntelligence';

interface ActivityLogItem {
    time: string;
    msg: string;
    type: 'info' | 'buy' | 'sell' | 'tp' | 'sl' | 'warn';
}

interface TradingBotState {
    botStatus: BotStatus;
    setBotStatus: (s: BotStatus) => void;
    config: BotConfig;
    updateConfig: (k: keyof BotConfig, v: any) => void;
    trades: PaperTrade[];
    stats: BotStats | null;
    activityLog: ActivityLogItem[];
    circuitBreaker: CircuitBreakerState;
    cooldownMinutes: number;
    sniperSignals: SmartSignal[];
    livePrices: Record<string, number>;
    realtimePrices: RealtimePricesMap;
    realtimeConnected: boolean;
    tradeTickers: string[];
    closeTradeManual: (id: string) => void;
    resetDemo: () => void;
}

const defaultState: TradingBotState = {
    botStatus: 'idle',
    setBotStatus: () => { },
    config: loadConfig(),
    updateConfig: () => { },
    trades: [],
    stats: null,
    activityLog: [],
    circuitBreaker: loadCircuitBreaker(),
    cooldownMinutes: 0,
    sniperSignals: [],
    livePrices: {},
    realtimePrices: {},
    realtimeConnected: false,
    tradeTickers: [],
    closeTradeManual: () => { },
    resetDemo: () => { },
};

const TradingBotContext = createContext<TradingBotState>(defaultState);
export const useTradingBotContext = () => useContext(TradingBotContext);

export const TradingBotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { language } = useLanguage();
    const isPt = language === 'pt';

    // State
    const [botStatus, setBotStatus] = useState<BotStatus>('idle');
    const [config, setConfig] = useState<BotConfig>(loadConfig());
    const [trades, setTrades] = useState<PaperTrade[]>([]);
    const [stats, setStats] = useState<BotStats | null>(null);
    const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);
    const [tradeTickers, setTradeTickers] = useState<string[]>([
        'BTC', 'ETH', 'SOL', 'AVAX', 'LINK', 'DOT', 'ADA', 'DOGE', 'XRP', 'BNB',
    ]);
    const [circuitBreaker, setCircuitBreaker] = useState<CircuitBreakerState>(loadCircuitBreaker());
    const [cooldownMinutes, setCooldownMinutes] = useState(0);

    const [sniperSignals, setSniperSignals] = useState<SmartSignal[]>([]);
    const sniperSignalsRef = useRef<SmartSignal[]>([]);
    const lastSignalFetch = useRef<number>(0);

    const livePricesRef = useRef<Record<string, number>>({});
    const [livePrices, setLivePrices] = useState<Record<string, number>>({});

    // ─── REALTIME WEBSOCKET PRICES (always on) ───
    // Use a ref-based ticker list to avoid circular dependency:
    // Price update → setTrades → openTradeTickers → allRealtimeTickers → WS reconnect → loop
    const wsTickersRef = useRef<string[]>([]);

    // Only update WS tickers when trades actually open/close (not on every price update)
    const openTradeTickerKey = useMemo(() => {
        const open = trades.filter(t => t.status === 'open' || t.status === 'partial');
        return [...new Set(open.map(t => t.ticker))].sort().join(',');
    }, [trades]);

    // Compute stable ticker list only when open trades or DB tickers change
    const stableRealtimeTickers = useMemo(() => {
        const openTickers = openTradeTickerKey.split(',').filter(Boolean);
        const all = [...new Set([...openTickers, ...tradeTickers.slice(0, 20)])];
        wsTickersRef.current = all;
        return all;
    }, [openTradeTickerKey, tradeTickers]);

    const { prices: realtimePrices, connected: realtimeConnected } = useRealtimePrices(stableRealtimeTickers);

    const addLog = useCallback((msg: string, type: ActivityLogItem['type'] = 'info') => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setActivityLog(prev => [{ time, msg, type }, ...prev].slice(0, 50));
    }, []);

    // ─── INITIALIZATION ───
    useEffect(() => {
        const savedTrades = loadTrades();
        if (savedTrades.length === 0) {
            const demo = generateDemoTrades();
            saveTrades(demo);
            setTrades(demo);
        } else {
            setTrades(savedTrades);
        }
        setStats(calculateStats(config));
    }, []); // Run once on mount

    // ─── LIVE PRICE SYNC: Update open trades with WebSocket prices ───
    // Use a ref so the interval always reads the LATEST prices, not a stale closure snapshot
    const realtimePricesRef = useRef<RealtimePricesMap>({});
    useEffect(() => {
        realtimePricesRef.current = realtimePrices;
    }, [realtimePrices]);

    // Single stable interval that reads from refs — no stale closures
    useEffect(() => {
        const interval = setInterval(() => {
            const currentPrices = realtimePricesRef.current;
            if (Object.keys(currentPrices).length === 0) return;

            // Merge realtime prices into livePrices
            const merged: Record<string, number> = { ...livePricesRef.current };
            for (const [ticker, data] of Object.entries(currentPrices)) {
                merged[ticker] = data.price;
            }
            livePricesRef.current = merged;
            setLivePrices({ ...merged });

            // Update open trades with new prices for reactive UI
            const currentTrades = loadTrades();
            let anyUpdated = false;

            for (const trade of currentTrades) {
                if (trade.status !== 'open' && trade.status !== 'partial') continue;
                const rt = currentPrices[trade.ticker];
                if (!rt) continue;

                const newPrice = rt.price;
                // Only update if price actually changed meaningfully
                if (Math.abs(trade.currentPrice - newPrice) < 0.0000001) continue;

                trade.currentPrice = newPrice;
                // Recalculate P&L
                if (trade.direction === 'LONG') {
                    trade.pnl = (newPrice - trade.entryPrice) * trade.quantity;
                    trade.pnlPct = ((newPrice - trade.entryPrice) / trade.entryPrice) * 100;
                } else {
                    trade.pnl = (trade.entryPrice - newPrice) * trade.quantity;
                    trade.pnlPct = ((trade.entryPrice - newPrice) / trade.entryPrice) * 100;
                }
                anyUpdated = true;
            }

            if (anyUpdated) {
                saveTrades(currentTrades);
                setTrades([...currentTrades]);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, []); // Empty deps — reads from refs, never stale

    // ─── LOAD TICKERS FROM DB ───
    useEffect(() => {
        const loadTickersFromDB = async () => {
            try {
                const { data, error } = await supabase.from('tokens').select('ticker').order('score', { ascending: false });
                if (!error && data && data.length > 0) {
                    setTradeTickers(data.map(t => t.ticker));
                }
            } catch (err) { }
        };
        loadTickersFromDB();
    }, []);

    // ─── FETCH REAL PRICES ───
    const fetchRealPrices = useCallback(async (): Promise<Record<string, number>> => {
        try {
            const tickersToFetch = tradeTickers.slice(0, 100);
            const symbols = tickersToFetch.map(t => `"${t}USDT"`).join(',');
            const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=[${symbols}]`);
            if (!res.ok) throw new Error('Binance API error');
            const data: Array<{ symbol: string; price: string }> = await res.json();
            const prices: Record<string, number> = {};
            for (const item of data) {
                const ticker = item.symbol.replace('USDT', '');
                prices[ticker] = parseFloat(item.price);
            }
            livePricesRef.current = prices;
            setLivePrices(prices);
            return prices;
        } catch (err) {
            return livePricesRef.current;
        }
    }, [tradeTickers]);

    // ─── FETCH SNIPER SIGNALS ───
    const fetchSniperSignals = useCallback(async () => {
        try {
            const { data: analyses, error } = await supabase.from('token_analysis').select('*').order('buy_score', { ascending: false });
            if (error) throw error;
            const signals = analyzeBatch(analyses as any);
            setSniperSignals(signals);
            sniperSignalsRef.current = signals;
            lastSignalFetch.current = Date.now();
            return signals;
        } catch (err) {
            return [];
        }
    }, []);

    // ─── CIRCUIT BREAKER TIMER ───
    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = getRemainingCooldown();
            setCooldownMinutes(remaining);
            if (remaining === 0) {
                setCircuitBreaker(loadCircuitBreaker());
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // ─── MAIN BOT LOOP ───
    useEffect(() => {
        if (botStatus !== 'running') return;

        addLog(isPt ? '🤖 Bot iniciado em background! Conectando à Binance...' : '🤖 Background bot started! Connecting to Binance...', 'info');

        // Immediately fetch prices + signals on start (no 30s delay)
        const bootSequence = async () => {
            const prices = await fetchRealPrices();
            const signals = await fetchSniperSignals();
            const priceCount = Object.keys(prices).length;
            const signalCount = signals.length;
            const qualifiedCount = signals.filter(s => s.direction !== 'NEUTRAL' && (s.level === 'ELITE' || s.level === 'FORTE' || s.level === 'MODERADO')).length;
            addLog(isPt
                ? `📡 Conectado! ${priceCount} preços, ${signalCount} sinais (${qualifiedCount} qualificados)`
                : `📡 Connected! ${priceCount} prices, ${signalCount} signals (${qualifiedCount} qualified)`, 'info');
        };
        bootSequence();

        const interval = setInterval(async () => {
            const cb = loadCircuitBreaker();
            setCircuitBreaker(cb);
            if (cb.isActive) {
                const remaining = getRemainingCooldown();
                setCooldownMinutes(remaining);
                if (remaining > 0) return;
            }

            const prices = await fetchRealPrices();
            if (Object.keys(prices).length === 0) {
                addLog(isPt ? '⚠️ Sem preços da Binance neste tick' : '⚠️ No Binance prices this tick', 'warn');
                return;
            }

            const currentTrades = loadTrades();
            let changed = false;

            // 1. Update open trades with real prices
            for (const trade of currentTrades) {
                if (trade.status !== 'open' && trade.status !== 'partial') continue;
                const realPrice = prices[trade.ticker];
                if (!realPrice) continue;

                const { events } = updateTradePrice(trade.id, realPrice, config);
                if (events.length > 0) {
                    changed = true;
                    for (const event of events) {
                        const logType = event.includes('STOP LOSS') || event.includes('ANTI-DUMP') || event.includes('CIRCUIT') ? 'sl'
                            : event.includes('TAKE PROFIT') || event.includes('TP1') ? 'tp'
                                : event.includes('TRAILING') || event.includes('BREAK-EVEN') ? 'info' : 'warn';
                        addLog(event, logType as any);
                    }
                }
            }

            const refreshedTrades = loadTrades();

            // 2. Refresh signals periodically
            const now = Date.now();
            if (now - lastSignalFetch.current > 25000) {
                await fetchSniperSignals();
            }

            const openCount = refreshedTrades.filter(t => t.status === 'open' || t.status === 'partial').length;
            const currentSignals = sniperSignalsRef.current;

            // 3. Evaluate and open new trades
            if (openCount < config.maxOpenTrades && currentSignals.length > 0) {
                const openTickers = refreshedTrades.filter(t => t.status === 'open' || t.status === 'partial').map(t => t.ticker);
                const recentlyClosed = refreshedTrades
                    .filter(t => t.status === 'closed' && t.closedAt && (Date.now() - new Date(t.closedAt).getTime()) < 3 * 60 * 1000)
                    .map(t => t.ticker);
                const excludedTickers = [...openTickers, ...recentlyClosed];

                // Step A: Filter valid signals (direction + level + score)
                const validSignals = currentSignals.filter(s =>
                    !excludedTickers.includes(s.ticker) &&
                    prices[s.ticker] &&
                    (s.level === 'ELITE' || s.level === 'FORTE' || s.level === 'MODERADO') &&
                    s.direction !== 'NEUTRAL' &&
                    s.confidenceScore >= config.minScore
                );

                // Step B: Apply strategy-specific R:R and confluence thresholds
                const isAggressive = config.strategy === 'grid_adaptive' || config.strategy === 'dca_smart';
                const minRR = isAggressive ? 0.8 : 1.5;
                const minConf = isAggressive ? 1 : 2;

                // Qualify signals by R:R and confluence (staleness is a soft factor, not a blocker)
                const qualifiedSignals = validSignals
                    .filter(s => s.riskReward >= minRR && s.confluenceCount >= minConf)
                    .sort((a, b) => {
                        // Prefer fresh signals, but don't block stale ones
                        if (a.isStale !== b.isStale) return a.isStale ? 1 : -1;
                        // Then sort by confidence score descending
                        return b.confidenceScore - a.confidenceScore;
                    });

                // Log scanning status every ~30s (every 6th tick)
                if (now % 30000 < 5500) {
                    const totalNonNeutral = currentSignals.filter(s => s.direction !== 'NEUTRAL').length;
                    const staleCount = qualifiedSignals.filter(s => s.isStale).length;
                    const freshCount = qualifiedSignals.length - staleCount;
                    addLog(isPt
                        ? `🔍 Scan: ${currentSignals.length} sinais, ${totalNonNeutral} com direção, ${validSignals.length} válidos, ${qualifiedSignals.length} qualificados (${freshCount} frescos, ${staleCount} antigos) — RR≥${minRR} Conf≥${minConf}`
                        : `🔍 Scan: ${currentSignals.length} signals, ${totalNonNeutral} directional, ${validSignals.length} valid, ${qualifiedSignals.length} qualified (${freshCount} fresh, ${staleCount} stale) — RR≥${minRR} Conf≥${minConf}`, 'info');
                }

                // Open up to 2 trades per tick
                const slotsAvailable = Math.min(2, config.maxOpenTrades - openCount);
                const signalsToTrade = qualifiedSignals.slice(0, slotsAvailable);

                for (const bestSignal of signalsToTrade) {
                    const realPrice = prices[bestSignal.ticker];
                    if (!realPrice) continue;

                    const direction: TradeDirection = bestSignal.direction as TradeDirection;
                    const signalLabel = `Sniper ${bestSignal.level} ${direction === 'LONG' ? 'BUY' : 'SELL'}`;

                    const signalData: SmartSignalData = {
                        confluences: bestSignal.confluences,
                        level: bestSignal.level,
                        setupName: bestSignal.setupName,
                        entryReason: `${bestSignal.setupDescription} — ${bestSignal.confluenceCount} confluências técnicas. R:R ${bestSignal.riskReward.toFixed(1)}:1`,
                        riskReward: bestSignal.riskReward,
                        warnings: bestSignal.warnings,
                    };

                    openPaperTrade(bestSignal.ticker, direction, realPrice, config, signalLabel, bestSignal.confidenceScore, bestSignal.stopLoss, bestSignal.takeProfit, bestSignal.tp1, signalData);

                    addLog(
                        `${direction === 'LONG' ? '📈' : '📉'} ${isPt ? 'NOVO TRADE' : 'NEW TRADE'}: ${bestSignal.ticker} ${direction} @ $${realPrice.toLocaleString()} — ${bestSignal.level} | RR ${bestSignal.riskReward.toFixed(1)} | ${bestSignal.confluenceCount} conf | Score ${bestSignal.confidenceScore}`,
                        direction === 'LONG' ? 'buy' : 'sell'
                    );
                    changed = true;
                }
            }

            if (changed) {
                const finalTrades = loadTrades();
                setTrades([...finalTrades]);
                setStats(calculateStats(config));
            }

            // Sync visual UI state even if no trades opened/closed
            setTrades([...loadTrades()]);

        }, 5000); // 5 sec tick

        return () => {
            clearInterval(interval);
            addLog(isPt ? '⏸️ Bot pausado (Background).' : '⏸️ Background Bot paused.', 'warn');
        };
    }, [botStatus, config, isPt, tradeTickers, fetchRealPrices, fetchSniperSignals, addLog]);

    // Update stats on trade changes
    useEffect(() => {
        setStats(calculateStats(config));
    }, [trades, config]);

    // ─── ACTIONS ───
    const updateConfig = (key: keyof BotConfig, value: any) => {
        const updated = { ...config, [key]: value };
        setConfig(updated);
        saveConfig(updated);
    };

    const closeTradeManual = (id: string) => {
        const trade = trades.find(t => t.id === id);
        if (trade && livePrices[trade.ticker]) {
            updateTradePrice(trade.id, livePrices[trade.ticker], config);
        }
        closeTrade(id, 'manual');
        const updated = loadTrades();
        setTrades([...updated]);
        setStats(calculateStats(config));

        const closedTrade = updated.find(t => t.id === id);
        if (closedTrade) {
            addLog(`✋ ${isPt ? 'Fechado manualmente' : 'Closed manually'}: ${closedTrade.ticker}`, closedTrade.pnl >= 0 ? 'tp' : 'sl');
        }
    };

    const resetDemo = () => {
        const demo = generateDemoTrades();
        saveTrades(demo);
        setTrades(demo);
        setStats(calculateStats(config));
        setActivityLog([]);
        addLog(isPt ? '🔄 Demo resetado' : '🔄 Demo reset', 'info');
    };

    return (
        <TradingBotContext.Provider value={{
            botStatus, setBotStatus,
            config, updateConfig,
            trades, stats, activityLog,
            circuitBreaker, cooldownMinutes,
            sniperSignals, livePrices, realtimePrices, realtimeConnected, tradeTickers,
            closeTradeManual, resetDemo
        }}>
            {children}
        </TradingBotContext.Provider>
    );
};
