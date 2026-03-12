/**
 * 🤖 AutoPilot Service — Paper Trading & Bot Management
 * Handles simulated trading, P&L tracking, and bot configuration
 * Enhanced: Trailing Stop, Break-Even, Circuit Breaker, Anti-Dump
 */

import { supabase } from '@/integrations/supabase/client';

// ─── Types ──────────────────────────────────────────────────────

export type BotStatus = 'idle' | 'running' | 'paused' | 'cooldown' | 'error';
export type BotMode = 'paper' | 'live';
export type TradeDirection = 'LONG' | 'SHORT';
export type TradeStatus = 'open' | 'closed' | 'cancelled' | 'partial';

export interface BotConfig {
    mode: BotMode;
    exchange: 'binance' | 'bybit';
    maxPositionPct: number;       // Max % of portfolio per trade (1-10%)
    maxOpenTrades: number;        // Max simultaneous open trades (1-5)
    stopLossDefault: number;      // Default SL % (1-5%)
    takeProfitDefault: number;    // Default TP % (3-15%)
    trailingStop: boolean;        // Enable trailing stop
    trailingStopPct: number;      // Trailing stop activation % (1-5%)
    strategy: 'sniper_follow' | 'dca_smart' | 'grid_adaptive';
    minScore: number;             // Min Sniper score to trigger (60-90)
    onlyStrong: boolean;          // Only trade "STRONG BUY/SELL" signals
    paperBalance: number;         // Starting balance for paper trading
    enableNotifications: boolean;
    // New fields
    enableBreakeven: boolean;     // Auto move SL to entry at +1.5%
    breakEvenThreshold: number;   // % profit to trigger break-even (default 1.5)
    enablePartialTP: boolean;     // Close 50% at TP1
    circuitBreakerLosses: number; // Consecutive losses to pause (default 3)
    circuitBreakerMinutes: number;// Pause duration in minutes (default 30)
    antiDumpPct: number;          // Flash crash threshold % (default 5)
    antiDumpSeconds: number;      // Time window for anti-dump (default 60)
}

export interface PaperTrade {
    id: string;
    ticker: string;
    direction: TradeDirection;
    entryPrice: number;
    currentPrice: number;
    quantity: number;
    positionSize: number;
    positionPct: number;          // % of balance used
    stopLoss: number;
    originalStopLoss: number;
    takeProfit: number;
    tp1: number;
    status: TradeStatus;
    pnl: number;
    pnlPct: number;
    openedAt: string;
    closedAt?: string;
    closeReason?: 'tp_hit' | 'tp1_partial' | 'sl_hit' | 'trailing_stop' | 'breakeven_sl' | 'anti_dump' | 'manual' | 'signal_reverse' | 'circuit_breaker';
    signal: string;
    score: number;
    // Premium intelligence fields
    riskReward: number;           // R:R ratio at entry
    confluences: string[];        // List of technical confluences
    strategy: string;             // Strategy name (e.g. "Sniper Follow")
    level: string;                // ELITE / FORTE / MODERADO
    entryReason: string;          // Human-readable reason for entry
    setupName: string;            // Setup type name
    warnings: string[];           // Warnings at entry time
    // Trailing stop tracking
    highWatermark: number;
    trailingStopActive: boolean;
    breakEvenApplied: boolean;
    partialTPApplied: boolean;
    originalQuantity: number;
    priceHistory: { price: number; timestamp: number }[];
}

export interface BotStats {
    totalTrades: number;
    winRate: number;
    totalPnl: number;
    totalPnlPct: number;
    bestTrade: number;
    worstTrade: number;
    avgHoldTime: string;
    sharpeRatio: number;
    maxDrawdown: number;
    currentBalance: number;
    profitFactor: number;
    consecutiveWins: number;
    consecutiveLosses: number;
}

// ─── Circuit Breaker State ──────────────────────────────────────

const CIRCUIT_BREAKER_KEY = 'gem_autopilot_circuit_breaker';

export interface CircuitBreakerState {
    isActive: boolean;
    activatedAt: number;
    resumeAt: number;
    consecutiveLosses: number;
    reason: string;
}

export function loadCircuitBreaker(): CircuitBreakerState {
    try {
        const raw = localStorage.getItem(CIRCUIT_BREAKER_KEY);
        if (raw) {
            const state = JSON.parse(raw);
            // Check if cooldown has expired
            if (state.isActive && Date.now() >= state.resumeAt) {
                state.isActive = false;
                state.consecutiveLosses = 0;
                saveCircuitBreaker(state);
            }
            return state;
        }
    } catch { }
    return { isActive: false, activatedAt: 0, resumeAt: 0, consecutiveLosses: 0, reason: '' };
}

export function saveCircuitBreaker(state: CircuitBreakerState) {
    localStorage.setItem(CIRCUIT_BREAKER_KEY, JSON.stringify(state));
}

export function getRemainingCooldown(): number {
    const state = loadCircuitBreaker();
    if (!state.isActive) return 0;
    return Math.max(0, Math.ceil((state.resumeAt - Date.now()) / (1000 * 60))); // minutes
}

// ─── Default Configuration ──────────────────────────────────────

export const DEFAULT_BOT_CONFIG: BotConfig = {
    mode: 'paper',
    exchange: 'binance',
    maxPositionPct: 3,
    maxOpenTrades: 3,
    stopLossDefault: 2.5,
    takeProfitDefault: 7.5,
    trailingStop: true,
    trailingStopPct: 1.5,
    strategy: 'sniper_follow',
    minScore: 50,
    onlyStrong: false,
    paperBalance: 10000,
    enableNotifications: true,
    // New defaults
    enableBreakeven: true,
    breakEvenThreshold: 1.5,
    enablePartialTP: true,
    circuitBreakerLosses: 3,
    circuitBreakerMinutes: 30,
    antiDumpPct: 5,
    antiDumpSeconds: 60,
};

// ─── Paper Trading Engine ───────────────────────────────────────

const STORAGE_KEY = 'gem_autopilot_trades';
const CONFIG_KEY = 'gem_autopilot_config';
const EQUITY_KEY = 'gem_autopilot_equity';

export function loadConfig(): BotConfig {
    try {
        const raw = localStorage.getItem(CONFIG_KEY);
        const config = raw ? { ...DEFAULT_BOT_CONFIG, ...JSON.parse(raw) } : DEFAULT_BOT_CONFIG;
        // Migrate: old default minScore was 75 which is too high for the confidence formula
        if (config.minScore >= 75) {
            config.minScore = DEFAULT_BOT_CONFIG.minScore;
        }
        return config;
    } catch {
        return DEFAULT_BOT_CONFIG;
    }
}

export function saveConfig(config: BotConfig) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function loadTrades(): PaperTrade[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as any[];
        // Migrate old trades to include new premium fields
        return parsed.map(t => ({
            ...t,
            positionPct: t.positionPct ?? 0,
            riskReward: t.riskReward ?? 0,
            confluences: t.confluences ?? [],
            strategy: t.strategy ?? 'Sniper Follow',
            level: t.level ?? 'MODERADO',
            entryReason: t.entryReason ?? t.signal ?? '',
            setupName: t.setupName ?? 'Manual',
            warnings: t.warnings ?? [],
            originalStopLoss: t.originalStopLoss ?? t.stopLoss ?? 0,
            highWatermark: t.highWatermark ?? t.entryPrice ?? 0,
            trailingStopActive: t.trailingStopActive ?? false,
            breakEvenApplied: t.breakEvenApplied ?? false,
            partialTPApplied: t.partialTPApplied ?? false,
            originalQuantity: t.originalQuantity ?? t.quantity ?? 0,
            priceHistory: t.priceHistory ?? [],
        })) as PaperTrade[];
    } catch {
        return [];
    }
}

export function saveTrades(trades: PaperTrade[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

// ─── Equity Curve ───────────────────────────────────────────────

export interface EquityPoint {
    timestamp: number;
    balance: number;
    tradeId?: string;
}

export function loadEquityCurve(): EquityPoint[] {
    try {
        const raw = localStorage.getItem(EQUITY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveEquityPoint(balance: number, tradeId?: string) {
    const curve = loadEquityCurve();
    curve.push({ timestamp: Date.now(), balance, tradeId });
    // Keep last 500 points
    if (curve.length > 500) curve.splice(0, curve.length - 500);
    localStorage.setItem(EQUITY_KEY, JSON.stringify(curve));
}

// ─── Trade ID ───────────────────────────────────────────────────

export function generateTradeId(): string {
    return `PT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

// ─── Open Trade ─────────────────────────────────────────────────

export interface SmartSignalData {
    confluences?: string[];
    level?: string;
    setupName?: string;
    entryReason?: string;
    riskReward?: number;
    warnings?: string[];
}

export function openPaperTrade(
    ticker: string,
    direction: TradeDirection,
    price: number,
    config: BotConfig,
    signal: string,
    score: number,
    customSL?: number,
    customTP?: number,
    customTP1?: number,
    signalData?: SmartSignalData
): PaperTrade {
    const positionValue = config.paperBalance * (config.maxPositionPct / 100);
    const quantity = positionValue / price;

    const slMultiplier = direction === 'LONG' ? (1 - config.stopLossDefault / 100) : (1 + config.stopLossDefault / 100);
    const tpMultiplier = direction === 'LONG' ? (1 + config.takeProfitDefault / 100) : (1 - config.takeProfitDefault / 100);

    let stopLoss: number;
    if (direction === 'LONG') {
        stopLoss = (customSL && customSL < price) ? customSL : price * slMultiplier;
    } else {
        stopLoss = (customSL && customSL > price) ? customSL : price * slMultiplier;
    }

    let takeProfit: number;
    if (direction === 'LONG') {
        takeProfit = (customTP && customTP > price) ? customTP : price * tpMultiplier;
    } else {
        takeProfit = (customTP && customTP < price) ? customTP : price * tpMultiplier;
    }

    const risk = Math.abs(price - stopLoss);
    const reward = Math.abs(takeProfit - price);
    const tp1 = customTP1 || (direction === 'LONG' ? price + (risk * 1.5) : price - (risk * 1.5));
    const riskReward = risk > 0 ? reward / risk : 0;

    const trade: PaperTrade = {
        id: generateTradeId(),
        ticker,
        direction,
        entryPrice: price,
        currentPrice: price,
        quantity,
        positionSize: positionValue,
        positionPct: config.maxPositionPct,
        stopLoss,
        originalStopLoss: stopLoss,
        takeProfit,
        tp1,
        status: 'open',
        pnl: 0,
        pnlPct: 0,
        openedAt: new Date().toISOString(),
        signal,
        score,
        riskReward: signalData?.riskReward ?? riskReward,
        confluences: signalData?.confluences ?? [],
        strategy: 'Sniper Follow',
        level: signalData?.level ?? 'MODERADO',
        entryReason: signalData?.entryReason ?? signal,
        setupName: signalData?.setupName ?? 'Manual',
        warnings: signalData?.warnings ?? [],
        highWatermark: price,
        trailingStopActive: false,
        breakEvenApplied: false,
        partialTPApplied: false,
        originalQuantity: quantity,
        priceHistory: [{ price, timestamp: Date.now() }],
    };

    const trades = loadTrades();
    trades.unshift(trade);
    saveTrades(trades);

    const stats = calculateStats(config);
    saveEquityPoint(stats.currentBalance, trade.id);

    return trade;
}

// ─── Update Trade Price (with Trailing Stop, Break-Even, Anti-Dump) ─

export function updateTradePrice(
    tradeId: string,
    newPrice: number,
    config: BotConfig
): { trade: PaperTrade | null; events: string[] } {
    const trades = loadTrades();
    const idx = trades.findIndex(t => t.id === tradeId);
    if (idx === -1) return { trade: null, events: [] };

    const trade = trades[idx];
    if (trade.status !== 'open' && trade.status !== 'partial') return { trade, events: [] };

    const events: string[] = [];
    trade.currentPrice = newPrice;

    // Update price history (keep last 60 entries for anti-dump)
    trade.priceHistory.push({ price: newPrice, timestamp: Date.now() });
    if (trade.priceHistory.length > 60) trade.priceHistory.splice(0, trade.priceHistory.length - 60);

    // Calculate P&L
    if (trade.direction === 'LONG') {
        trade.pnl = (newPrice - trade.entryPrice) * trade.quantity;
        trade.pnlPct = ((newPrice - trade.entryPrice) / trade.entryPrice) * 100;
    } else {
        trade.pnl = (trade.entryPrice - newPrice) * trade.quantity;
        trade.pnlPct = ((trade.entryPrice - newPrice) / trade.entryPrice) * 100;
    }

    // ===== ANTI-DUMP PROTECTION =====
    if (config.antiDumpPct > 0) {
        const cutoffTime = Date.now() - (config.antiDumpSeconds * 1000);
        const recentPrices = trade.priceHistory.filter(p => p.timestamp >= cutoffTime);
        if (recentPrices.length >= 2) {
            const oldest = recentPrices[0].price;
            const dropPct = ((oldest - newPrice) / oldest) * 100;
            if (dropPct >= config.antiDumpPct) {
                trade.status = 'closed';
                trade.closedAt = new Date().toISOString();
                trade.closeReason = 'anti_dump';
                events.push(`🚨 ANTI-DUMP: ${trade.ticker} caiu ${dropPct.toFixed(1)}% em ${config.antiDumpSeconds}s — trade fechado`);
                trades[idx] = trade;
                saveTrades(trades);
                return { trade, events };
            }
        }
    }

    // ===== BREAK-EVEN (move SL to entry at threshold %) =====
    if (config.enableBreakeven && !trade.breakEvenApplied && trade.pnlPct >= config.breakEvenThreshold) {
        trade.stopLoss = trade.entryPrice;
        trade.breakEvenApplied = true;
        events.push(`🛡️ BREAK-EVEN: ${trade.ticker} SL movido para entrada ($${trade.entryPrice.toFixed(2)}) — risco zero`);
    }

    // ===== TRAILING STOP =====
    if (config.trailingStop) {
        if (trade.direction === 'LONG') {
            // Update high watermark
            if (newPrice > trade.highWatermark) {
                trade.highWatermark = newPrice;
            }
            // Activate trailing stop once profit exceeds trailingStopPct
            if (trade.pnlPct >= config.trailingStopPct) {
                trade.trailingStopActive = true;
            }
            // Apply trailing stop: move SL to (highWatermark - trailingStopPct%)
            if (trade.trailingStopActive) {
                const trailingSL = trade.highWatermark * (1 - config.trailingStopPct / 100);
                if (trailingSL > trade.stopLoss) {
                    const oldSL = trade.stopLoss;
                    trade.stopLoss = trailingSL;
                    events.push(`📈 TRAILING: ${trade.ticker} SL atualizado $${oldSL.toFixed(4)} → $${trailingSL.toFixed(4)}`);
                }
            }
        } else {
            // SHORT: track lowest price
            if (newPrice < trade.highWatermark || trade.highWatermark === trade.entryPrice) {
                trade.highWatermark = newPrice;
            }
            if (trade.pnlPct >= config.trailingStopPct) {
                trade.trailingStopActive = true;
            }
            if (trade.trailingStopActive) {
                const trailingSL = trade.highWatermark * (1 + config.trailingStopPct / 100);
                if (trailingSL < trade.stopLoss) {
                    const oldSL = trade.stopLoss;
                    trade.stopLoss = trailingSL;
                    events.push(`📉 TRAILING: ${trade.ticker} SL atualizado $${oldSL.toFixed(4)} → $${trailingSL.toFixed(4)}`);
                }
            }
        }
    }

    // ===== PARTIAL TAKE PROFIT (TP1) =====
    if (config.enablePartialTP && !trade.partialTPApplied) {
        const hitTP1 = trade.direction === 'LONG' ? newPrice >= trade.tp1 : newPrice <= trade.tp1;
        if (hitTP1) {
            // Close 50% of position
            const closedQty = trade.quantity * 0.5;
            trade.quantity = trade.quantity - closedQty;
            trade.partialTPApplied = true;
            trade.status = 'partial';
            // Move SL to entry (protect remaining)
            trade.stopLoss = trade.entryPrice;
            trade.breakEvenApplied = true;
            events.push(`🎯 TP1 PARCIAL: ${trade.ticker} — 50% fechado a $${newPrice.toFixed(4)}, SL movido para entry`);
        }
    }

    // ===== CHECK SL/TP =====
    if (trade.status === 'open' || trade.status === 'partial') {
        if (trade.direction === 'LONG') {
            if (newPrice <= trade.stopLoss) {
                trade.status = 'closed';
                trade.closedAt = new Date().toISOString();
                trade.closeReason = trade.trailingStopActive ? 'trailing_stop' : (trade.breakEvenApplied ? 'breakeven_sl' : 'sl_hit');
                events.push(`❌ ${trade.closeReason === 'trailing_stop' ? 'TRAILING STOP' : trade.closeReason === 'breakeven_sl' ? 'BREAK-EVEN SL' : 'STOP LOSS'}: ${trade.ticker} fechado a $${newPrice.toFixed(4)}`);
            } else if (newPrice >= trade.takeProfit) {
                trade.status = 'closed';
                trade.closedAt = new Date().toISOString();
                trade.closeReason = 'tp_hit';
                events.push(`✅ TAKE PROFIT: ${trade.ticker} alvo atingido a $${newPrice.toFixed(4)}`);
            }
        } else {
            if (newPrice >= trade.stopLoss) {
                trade.status = 'closed';
                trade.closedAt = new Date().toISOString();
                trade.closeReason = trade.trailingStopActive ? 'trailing_stop' : (trade.breakEvenApplied ? 'breakeven_sl' : 'sl_hit');
                events.push(`❌ ${trade.closeReason === 'trailing_stop' ? 'TRAILING STOP' : trade.closeReason === 'breakeven_sl' ? 'BREAK-EVEN SL' : 'STOP LOSS'}: ${trade.ticker} fechado a $${newPrice.toFixed(4)}`);
            } else if (newPrice <= trade.takeProfit) {
                trade.status = 'closed';
                trade.closedAt = new Date().toISOString();
                trade.closeReason = 'tp_hit';
                events.push(`✅ TAKE PROFIT: ${trade.ticker} alvo atingido a $${newPrice.toFixed(4)}`);
            }
        }
    }

    // ===== CIRCUIT BREAKER CHECK =====
    if (trade.status === 'closed' && trade.pnl < 0) {
        const cb = loadCircuitBreaker();
        cb.consecutiveLosses += 1;
        if (cb.consecutiveLosses >= config.circuitBreakerLosses) {
            cb.isActive = true;
            cb.activatedAt = Date.now();
            cb.resumeAt = Date.now() + (config.circuitBreakerMinutes * 60 * 1000);
            cb.reason = `${cb.consecutiveLosses} trades com loss consecutivo`;
            events.push(`⏸️ CIRCUIT BREAKER: Bot pausado por ${config.circuitBreakerMinutes}min após ${cb.consecutiveLosses} losses seguidos`);
        }
        saveCircuitBreaker(cb);
    } else if (trade.status === 'closed' && trade.pnl > 0) {
        // Reset consecutive losses on win
        const cb = loadCircuitBreaker();
        cb.consecutiveLosses = 0;
        saveCircuitBreaker(cb);
    }

    // Save equity point on close
    if (trade.status === 'closed') {
        const updatedStats = calculateStats(config);
        saveEquityPoint(updatedStats.currentBalance, trade.id);
    }

    trades[idx] = trade;
    saveTrades(trades);
    return { trade, events };
}

// ─── Close Trade ────────────────────────────────────────────────

export function closeTrade(tradeId: string, reason: PaperTrade['closeReason'] = 'manual'): PaperTrade | null {
    const trades = loadTrades();
    const idx = trades.findIndex(t => t.id === tradeId);
    if (idx === -1) return null;

    trades[idx].status = 'closed';
    trades[idx].closedAt = new Date().toISOString();
    trades[idx].closeReason = reason;
    saveTrades(trades);
    return trades[idx];
}

// ─── Calculate Stats ────────────────────────────────────────────

export function calculateStats(config: BotConfig): BotStats {
    const trades = loadTrades();
    const closed = trades.filter(t => t.status === 'closed');
    const wins = closed.filter(t => t.pnl > 0);
    const losses = closed.filter(t => t.pnl <= 0);

    const totalPnl = closed.reduce((s, t) => s + t.pnl, 0);
    const grossProfit = wins.reduce((s, t) => s + t.pnl, 0);
    const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));

    // Max drawdown calculation
    let peak = config.paperBalance;
    let maxDD = 0;
    let runningBalance = config.paperBalance;
    for (const t of closed) {
        runningBalance += t.pnl;
        if (runningBalance > peak) peak = runningBalance;
        const dd = ((peak - runningBalance) / peak) * 100;
        if (dd > maxDD) maxDD = dd;
    }

    // Consecutive streaks
    let consWins = 0, consLosses = 0, tempW = 0, tempL = 0;
    for (const t of closed) {
        if (t.pnl > 0) { tempW++; tempL = 0; consWins = Math.max(consWins, tempW); }
        else { tempL++; tempW = 0; consLosses = Math.max(consLosses, tempL); }
    }

    // Average hold time
    let avgMs = 0;
    if (closed.length > 0) {
        avgMs = closed.reduce((s, t) => {
            const diff = new Date(t.closedAt || t.openedAt).getTime() - new Date(t.openedAt).getTime();
            return s + diff;
        }, 0) / closed.length;
    }
    const avgHours = Math.round(avgMs / (1000 * 60 * 60));

    return {
        totalTrades: closed.length,
        winRate: closed.length > 0 ? (wins.length / closed.length) * 100 : 0,
        totalPnl,
        totalPnlPct: config.paperBalance > 0 ? (totalPnl / config.paperBalance) * 100 : 0,
        bestTrade: closed.length > 0 ? Math.max(...closed.map(t => t.pnlPct)) : 0,
        worstTrade: closed.length > 0 ? Math.min(...closed.map(t => t.pnlPct)) : 0,
        avgHoldTime: avgHours >= 24 ? `${Math.round(avgHours / 24)}d` : `${avgHours}h`,
        sharpeRatio: grossLoss > 0 ? (grossProfit / grossLoss) : grossProfit > 0 ? 999 : 0,
        maxDrawdown: maxDD,
        currentBalance: config.paperBalance + totalPnl,
        profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0,
        consecutiveWins: consWins,
        consecutiveLosses: consLosses,
    };
}

// ─── P&L by Token ───────────────────────────────────────────────

export interface TokenPerformance {
    ticker: string;
    trades: number;
    wins: number;
    losses: number;
    winRate: number;
    totalPnl: number;
    avgPnlPct: number;
}

export function getPerformanceByToken(): TokenPerformance[] {
    const trades = loadTrades().filter(t => t.status === 'closed');
    const byTicker: Record<string, PaperTrade[]> = {};

    for (const t of trades) {
        if (!byTicker[t.ticker]) byTicker[t.ticker] = [];
        byTicker[t.ticker].push(t);
    }

    return Object.entries(byTicker).map(([ticker, tds]) => {
        const wins = tds.filter(t => t.pnl > 0);
        return {
            ticker,
            trades: tds.length,
            wins: wins.length,
            losses: tds.length - wins.length,
            winRate: tds.length > 0 ? (wins.length / tds.length) * 100 : 0,
            totalPnl: tds.reduce((s, t) => s + t.pnl, 0),
            avgPnlPct: tds.length > 0 ? tds.reduce((s, t) => s + t.pnlPct, 0) / tds.length : 0,
        };
    }).sort((a, b) => b.totalPnl - a.totalPnl);
}

// ─── Demo Trades (for initial showcase) ─────────────────────────

export function generateDemoTrades(): PaperTrade[] {
    return [];
}
