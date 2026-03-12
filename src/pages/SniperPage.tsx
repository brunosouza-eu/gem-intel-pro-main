import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ExchangeFloatingBar } from '@/components/ExchangeReferral';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { SwingAnalysis } from '@/hooks/useSwingAnalysis';
import { useRealtimePrices } from '@/lib/realtimeService';
import {
    analyzeForSmartSignal,
    analyzeBatchForMode,
    updateBtcContext,
    getBtcMarketContext,
    getHotZoneStats,
    sortByUrgency,
    type SmartSignal,
    type TradingMode,
} from '@/lib/tradingIntelligence';
import CryptoLogo from '@/components/swing/CryptoLogo';
import { SniperProTutorial } from '@/components/swing/SniperProTutorial';
import { CreditWall } from '@/components/monetization/CreditWall';
import { AlertModal } from '@/components/alerts/AlertModal';
import { cn } from '@/lib/utils';
import {
    Crosshair,
    TrendingUp,
    TrendingDown,
    Shield,
    Target,
    Zap,
    Clock,
    Calculator,
    ChevronDown,
    ChevronUp,
    Filter,
    Wifi,
    WifiOff,
    AlertTriangle,
    DollarSign,
    Percent,
    ArrowRight,
    Flame,
    Eye,
    Star,
    RefreshCw,
    Minus,
    Pin,
    Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Types ───────────────────────────────────────────────────
type DirectionFilter = 'ALL' | 'LONG' | 'SHORT';
type QualityFilter = 'ALL' | 'A+' | 'A' | 'B+';
type HotZoneFilter = 'ALL' | 'IN_ZONE' | 'CLOSE';

// ─── Grade helper ────────────────────────────────────────────
function getGrade(signal: SmartSignal): { letter: string; color: string; bg: string } {
    const s = signal.confidenceScore;
    if (s >= 85) return { letter: 'A+', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' };
    if (s >= 70) return { letter: 'A', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/30' };
    if (s >= 55) return { letter: 'B+', color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30' };
    if (s >= 40) return { letter: 'B', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' };
    if (s >= 25) return { letter: 'C+', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30' };
    return { letter: 'C', color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' };
}

function formatPrice(price: number): string {
    if (price < 0.0001) return `$${price.toFixed(8)}`;
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 100) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function formatMoney(val: number): string {
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toFixed(2)}`;
}

const SignalCard: React.FC<{
    signal: SmartSignal;
    analysis: SwingAnalysis | undefined;
    isPinned: boolean;
    onTogglePin: (ticker: string) => void;
    onSelectToken: (ticker: string) => void;
    onCreateAlert?: (ticker: string, targetValue: number, note: string) => void;
}> = ({ signal, analysis, isPinned, onTogglePin, onSelectToken, onCreateAlert }) => {
    const { t } = useLanguage();
    const [calcOpen, setCalcOpen] = useState(false);
    const [capital, setCapital] = useState('100');
    const [leverage, setLeverage] = useState('1');

    const grade = getGrade(signal);
    const isLong = signal.direction === 'LONG';
    const isShort = signal.direction === 'SHORT';
    const change24h = analysis?.change_24h || 0;

    // Calculator
    const calcResult = useMemo(() => {
        const cap = parseFloat(capital) || 0;
        const lev = parseFloat(leverage) || 1;
        const effectiveCap = cap * lev;
        const potentialProfit = effectiveCap * (signal.rewardPercent / 100);
        const potentialLoss = effectiveCap * (signal.riskPercent / 100);
        const positionSize = effectiveCap / signal.currentPrice;
        return { effectiveCap, potentialProfit, potentialLoss, positionSize };
    }, [capital, leverage, signal]);

    return (
        <div className={cn(
            'rounded-2xl border overflow-hidden transition-all duration-300 relative',
            'bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm',
            'hover:shadow-lg hover:shadow-primary/5',
            isPinned && 'ring-2 ring-primary/50 border-primary/50 shadow-lg shadow-primary/10',
            !isPinned && isLong ? 'border-emerald-500/20 hover:border-emerald-500/40' : !isPinned && isShort ? 'border-red-500/20 hover:border-red-500/40' : 'border-border',
        )}>
            {/* ── Pin Button ── */}
            <button
                onClick={(e) => { e.stopPropagation(); onTogglePin(signal.ticker); }}
                className={cn(
                    "absolute top-3 right-3 z-10 p-1.5 rounded-full backdrop-blur-md transition-all",
                    isPinned ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50"
                )}
                title={t('pinToTop') as string}
            >
                <Pin className={cn("w-3.5 h-3.5", isPinned && "fill-primary")} />
            </button>

            {/* ── Header ── */}
            <div className={cn(
                'px-4 py-3 flex items-start gap-3 pt-4',
                isLong ? 'bg-gradient-to-r from-emerald-500/8 to-transparent' : isShort ? 'bg-gradient-to-r from-red-500/8 to-transparent' : '',
            )}>
                <CryptoLogo symbol={signal.ticker} size={32} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-base">{signal.ticker}</span>
                        <span className={cn('text-xs font-black px-1.5 py-0.5 rounded border', grade.bg, grade.color)}>
                            {grade.letter}
                        </span>
                        <span className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                            isLong ? 'bg-emerald-500/20 text-emerald-400' : isShort ? 'bg-red-500/20 text-red-400' : 'bg-muted text-muted-foreground',
                        )}>
                            {isLong ? '🟢 LONG' : isShort ? '🔴 SHORT' : '⚪ NEUTRO'}
                        </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {signal.setupName.replace(/[🎯💎🔥🚀⚡☁️📊📐🛡️🌟💥]/g, '').trim()}
                    </p>
                </div>
                <div className="text-right shrink-0 pr-8">
                    <span className="text-sm font-mono font-bold block">{formatPrice(signal.currentPrice)}</span>
                    <span className={cn('text-[10px] font-bold', change24h >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                        {change24h >= 0 ? '▲' : '▼'} {Math.abs(change24h).toFixed(1)}%
                    </span>
                    {/* BTC Impact Badge */}
                    <div className={cn(
                        'text-[8px] font-bold mt-0.5 px-1 py-0.5 rounded inline-block',
                        signal.btcContext === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-400' :
                            signal.btcContext === 'BEARISH' ? 'bg-red-500/10 text-red-400' :
                                'bg-yellow-500/10 text-yellow-400'
                    )}>
                        BTC {signal.btcContext === 'BULLISH' ? '▲ ajuda' : signal.btcContext === 'BEARISH' ? '▼ dificulta' : '→'}
                    </div>
                </div>
            </div>

            {/* ── Trade Plan Grid ── */}
            <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-border/50">
                <div className="text-center relative group">
                    <div className="text-[9px] text-muted-foreground uppercase font-semibold mb-0.5 flex items-center justify-center gap-0.5">
                        <Target className="w-2.5 h-2.5" /> {t('entry')}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-xs font-mono font-bold text-cyan-400">{formatPrice(signal.entry)}</span>
                        {onCreateAlert && (
                            <button onClick={(e) => { e.stopPropagation(); onCreateAlert(signal.ticker, signal.entry, 'Alvo de Entrada - Sniper Pro'); }} className="text-muted-foreground hover:text-primary transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100 focus:opacity-100" title={t('createAlert') as string}>
                                <Bell className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
                <div className="text-center relative group">
                    <div className="text-[9px] text-muted-foreground uppercase font-semibold mb-0.5 flex items-center justify-center gap-0.5">
                        <Shield className="w-2.5 h-2.5" /> Stop Loss
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-xs font-mono font-bold text-red-400">{formatPrice(signal.stopLoss)}</span>
                        {onCreateAlert && (
                            <button onClick={(e) => { e.stopPropagation(); onCreateAlert(signal.ticker, signal.stopLoss, 'Stop Loss - Sniper Pro'); }} className="text-muted-foreground hover:text-red-400 transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100 focus:opacity-100" title={t('createAlert') as string}>
                                <Bell className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    <div className="text-[8px] text-red-400/70">-{signal.riskPercent.toFixed(1)}%</div>
                </div>
                <div className="text-center relative group">
                    <div className="text-[9px] text-muted-foreground uppercase font-semibold mb-0.5 flex items-center justify-center gap-0.5">
                        <TrendingUp className="w-2.5 h-2.5" /> TP1 (50%)
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-xs font-mono font-bold text-emerald-400">{formatPrice(signal.tp1 || signal.takeProfit)}</span>
                        {onCreateAlert && (
                            <button onClick={(e) => { e.stopPropagation(); onCreateAlert(signal.ticker, signal.tp1 || signal.takeProfit, 'TP1 Parcial - Sniper Pro'); }} className="text-muted-foreground hover:text-emerald-400 transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100 focus:opacity-100" title={'Create Alert'}>
                                <Bell className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    <div className="text-[8px] text-emerald-400/70">+{(signal.tp1Pct || signal.rewardPercent * 0.6).toFixed(1)}%</div>
                </div>
                <div className="text-center relative group">
                    <div className="text-[9px] text-muted-foreground uppercase font-semibold mb-0.5 flex items-center justify-center gap-0.5">
                        <TrendingUp className="w-2.5 h-2.5" /> TP2 (Full)
                    </div>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-xs font-mono font-bold text-emerald-400">{formatPrice(signal.tp2 || signal.takeProfit)}</span>
                        {onCreateAlert && (
                            <button onClick={(e) => { e.stopPropagation(); onCreateAlert(signal.ticker, signal.tp2 || signal.takeProfit, 'TP2 Full - Sniper Pro'); }} className="text-muted-foreground hover:text-emerald-400 transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100 focus:opacity-100" title={'Create Alert'}>
                                <Bell className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                    <div className="text-[8px] text-emerald-400/70">+{(signal.tp2Pct || signal.rewardPercent).toFixed(1)}%</div>
                </div>
            </div>

            {/* ── Confluences ── */}
            {signal.confluences.length > 0 && (
                <div className="px-4 py-2 border-t border-border/50">
                    <div className="text-[9px] text-muted-foreground uppercase font-semibold mb-1.5">
                        {t('confluences')} ({signal.confluenceCount})
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {signal.confluences.slice(0, 4).map((c, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary/80 border border-primary/15">
                                {c}
                            </span>
                        ))}
                        {signal.confluences.length > 4 && (
                            <span className="text-[9px] text-muted-foreground/60">+{signal.confluences.length - 4}</span>
                        )}
                    </div>
                </div>
            )}

            {/* ── Warnings ── */}
            {signal.warnings.length > 0 && (
                <div className="px-4 py-2 border-t border-border/50">
                    <div className="flex flex-wrap gap-1.5">
                        {signal.warnings.slice(0, 2).map((w, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400/80 border border-amber-500/15 flex items-center gap-0.5">
                                <AlertTriangle className="w-2.5 h-2.5" /> {w}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Hot Zone Badge + Freshness + Signal Strength ── */}
            <div className="px-4 py-2 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {signal.isInZone ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold animate-pulse">
                            🎯 {signal.urgencyText}
                        </span>
                    ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                            {signal.urgencyText}
                        </span>
                    )}
                    {/* Freshness Warning */}
                    {signal.isStale && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> {signal.dataAge}min atrás
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Signal Strength Meter */}
                    <div className="flex items-center gap-0.5" title={`${signal.confluenceCount}/15 confluências`}>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'w-1 h-3 rounded-sm transition-all',
                                    i < Math.min(10, Math.round(signal.confluenceCount * 10 / 15))
                                        ? signal.confluenceCount >= 10 ? 'bg-emerald-400' : signal.confluenceCount >= 6 ? 'bg-cyan-400' : 'bg-yellow-400'
                                        : 'bg-muted/30'
                                )}
                            />
                        ))}
                        <span className="text-[8px] text-muted-foreground ml-1">{signal.confluenceCount}</span>
                    </div>
                    <button
                        onClick={() => setCalcOpen(!calcOpen)}
                        className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                        <Calculator className="w-3 h-3" />
                        {t('calculateProfit')}
                        {calcOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                </div>
            </div>

            {/* ── Smart Calculator (expandable) ── */}
            {calcOpen && (
                <div className="px-4 py-3 border-t border-primary/20 bg-gradient-to-br from-primary/5 to-cyan-500/5 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[9px] text-muted-foreground uppercase font-semibold block mb-1">
                                <DollarSign className="w-2.5 h-2.5 inline" /> {t('capitalUsd')}
                            </label>
                            <input
                                type="number"
                                value={capital}
                                onChange={e => setCapital(e.target.value)}
                                className="w-full px-2 py-1.5 rounded-lg bg-background/80 border border-border text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
                                placeholder="100"
                            />
                        </div>
                        <div>
                            <label className="text-[9px] text-muted-foreground uppercase font-semibold block mb-1">
                                <Zap className="w-2.5 h-2.5 inline" /> {t('leverage')}
                            </label>
                            <div className="flex gap-1">
                                {['1', '2', '5', '10', '20'].map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setLeverage(l)}
                                        className={cn(
                                            'flex-1 py-1 rounded text-[10px] font-bold transition-all',
                                            leverage === l
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'bg-muted/50 text-muted-foreground hover:bg-muted',
                                        )}
                                    >
                                        {l}x
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                            <div className="text-[8px] text-emerald-400/70 uppercase font-semibold">{t('potentialProfit')}</div>
                            <div className="text-sm font-black text-emerald-400">+{formatMoney(calcResult.potentialProfit)}</div>
                            <div className="text-[8px] text-emerald-400/60">+{signal.rewardPercent.toFixed(1)}%</div>
                        </div>
                        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                            <div className="text-[8px] text-red-400/70 uppercase font-semibold">{t('maxRisk')}</div>
                            <div className="text-sm font-black text-red-400">-{formatMoney(calcResult.potentialLoss)}</div>
                            <div className="text-[8px] text-red-400/60">-{signal.riskPercent.toFixed(1)}%</div>
                        </div>
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                            <div className="text-[8px] text-cyan-400/70 uppercase font-semibold">{t('position')}</div>
                            <div className="text-sm font-black text-cyan-400">{calcResult.positionSize.toFixed(4)}</div>
                            <div className="text-[8px] text-cyan-400/60">{signal.ticker}</div>
                        </div>
                    </div>

                    {parseFloat(leverage) > 5 && (
                        <p className="text-[9px] text-amber-400/80 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {t('highLeverageWarning')}
                        </p>
                    )}
                </div>
            )}

            <button
                onClick={() => onSelectToken(signal.ticker)}
                className="w-full px-4 py-2 border-t border-border/50 text-[11px] text-center font-medium text-primary/80 hover:text-primary hover:bg-primary/5 transition-colors"
            >
                {t('viewAnalysisTradeMaster')}
            </button>
        </div>
    );
};

const SniperPage: React.FC = () => {
    const { t } = useLanguage();
    const [analyses, setAnalyses] = useState<SwingAnalysis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<TradingMode>('sniper');
    const [dirFilter, setDirFilter] = useState<DirectionFilter>('ALL');
    const [qualFilter, setQualFilter] = useState<QualityFilter>('ALL');
    const [zoneFilter, setZoneFilter] = useState<HotZoneFilter>('ALL');
    const [pinnedTickers, setPinnedTickers] = useState<Set<string>>(new Set());
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Alert Modal state
    const [alertModalConfig, setAlertModalConfig] = useState<{ isOpen: boolean, ticker: string, price: number, note: string } | null>(null);

    // Real-time prices
    const tickers = analyses.map(a => a.ticker);
    const { prices, isConnected } = useRealtimePrices(tickers);

    // Merge analyses with real-time prices
    const liveAnalyses = useMemo(() => analyses.map(a => {
        const rt = prices.get(a.ticker.toUpperCase());
        return rt ? { ...a, current_price: rt.price, change_24h: rt.change24h } : a;
    }), [analyses, prices]);

    // Update BTC context
    useEffect(() => {
        const btcPrice = prices.get('BTC');
        if (btcPrice) {
            const btcAnalysis = analyses.find(a => a.ticker === 'BTC');
            updateBtcContext(btcAnalysis?.htf_trend || 'neutral', btcPrice.price, btcPrice.change24h);
        }
    }, [prices, analyses]);

    // Fetch analyses
    const fetchData = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('token_analysis')
                .select('*')
                .order('buy_score', { ascending: false });
            if (error) throw error;
            setAnalyses((data || []) as unknown as SwingAnalysis[]);
            setLastUpdate(new Date());
        } catch (e) {
            console.error('Sniper fetch error:', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Auto-refresh every 30s
    useEffect(() => {
        const interval = setInterval(fetchData, 30_000);
        return () => clearInterval(interval);
    }, [fetchData]);

    // Realtime DB subscription
    useEffect(() => {
        const channel = supabase
            .channel('sniper_analysis_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'token_analysis' }, () => {
                fetchData();
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [fetchData]);

    // Stable snapshot for signals (prevent flicker)
    const [stableAnalyses, setStableAnalyses] = useState<SwingAnalysis[]>([]);
    const latestRef = useRef(liveAnalyses);
    latestRef.current = liveAnalyses;
    useEffect(() => {
        if (stableAnalyses.length === 0 && liveAnalyses.length > 0) setStableAnalyses(liveAnalyses);
        const timer = setInterval(() => setStableAnalyses(latestRef.current), 10_000);
        return () => clearInterval(timer);
    }, [liveAnalyses.length]);

    // Generate signals — MODE-AWARE (different SL/TP/classification per mode)
    const allSignals = useMemo(() => {
        if (stableAnalyses.length === 0) return [];
        return analyzeBatchForMode(stableAnalyses, mode);
    }, [stableAnalyses, mode]);

    // Mode filtering is now baked into analyzeBatchForMode (SL/TP/classification are different)
    // We still do a basic quality gate to remove NEUTRAL/PERIGO
    const modeFilteredSignals = useMemo(() => {
        return allSignals.filter(s => {
            if (s.direction === 'NEUTRAL') return false;
            if (s.level === 'PERIGO') return false;
            // Signals already have mode-appropriate R:R and classification
            // Only filter out very weak signals
            return s.level !== 'AGUARDAR';
        });
    }, [allSignals]);

    // Apply user filters
    const filteredSignals = useMemo(() => {
        let result = modeFilteredSignals;

        if (dirFilter !== 'ALL') {
            result = result.filter(s => s.direction === dirFilter);
        }

        if (qualFilter !== 'ALL') {
            result = result.filter(s => {
                const g = getGrade(s).letter;
                if (qualFilter === 'A+') return g === 'A+';
                if (qualFilter === 'A') return g === 'A+' || g === 'A';
                if (qualFilter === 'B+') return g === 'A+' || g === 'A' || g === 'B+';
                return true;
            });
        }

        // Hot Zone filter
        if (zoneFilter !== 'ALL') {
            result = result.filter(s => {
                if (zoneFilter === 'IN_ZONE') return s.hotZone === 'NA_ZONA';
                if (zoneFilter === 'CLOSE') return s.hotZone === 'NA_ZONA' || s.hotZone === 'PROXIMO';
                return true;
            });
        }

        // Always put pinned signals at the top, and ensure they are visible even if filtered
        const pinnedSignals = allSignals.filter(s => pinnedTickers.has(s.ticker));
        const unpinnedSignals = result.filter(s => !pinnedTickers.has(s.ticker));

        return [...pinnedSignals, ...unpinnedSignals];
    }, [modeFilteredSignals, dirFilter, qualFilter, zoneFilter, allSignals, pinnedTickers]);

    const togglePin = useCallback((ticker: string) => {
        setPinnedTickers(prev => {
            const next = new Set(prev);
            if (next.has(ticker)) next.delete(ticker);
            else next.add(ticker);
            return next;
        });
    }, []);

    // Market stats
    const stats = useMemo(() => {
        const total = allSignals.length;
        const longs = allSignals.filter(s => s.direction === 'LONG').length;
        const shorts = allSignals.filter(s => s.direction === 'SHORT').length;
        const elites = allSignals.filter(s => s.level === 'ELITE').length;
        const inZone = allSignals.filter(s => s.isInZone).length;
        const btcCtx = getBtcMarketContext();
        return { total, longs, shorts, elites, inZone, btcCtx };
    }, [allSignals]);

    // Time since
    const [timeSince, setTimeSince] = useState('');
    useEffect(() => {
        const update = () => {
            if (!lastUpdate) return setTimeSince('');
            const diff = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
            setTimeSince(diff < 60 ? `${diff}s` : `${Math.floor(diff / 60)}min`);
        };
        update();
        const t = setInterval(update, 5000);
        return () => clearInterval(t);
    }, [lastUpdate]);

    const navigate = (ticker: string) => {
        window.location.href = `/swing?token=${ticker}`;
    };

    const isPt = t('sniperModeDesc') !== 'sniperModeDesc'; // crude lang check
    const modes: { key: TradingMode; icon: React.ReactNode; label: string; desc: string }[] = [
        { key: 'sniper', icon: <Crosshair className="w-4 h-4" />, label: '🎯 Sniper', desc: isPt ? 'Entradas cirúrgicas R:R ≥ 3:1' : 'Surgical entries R:R ≥ 3:1' },
        { key: 'daytrade', icon: <Zap className="w-4 h-4" />, label: '⚡ Day Trade', desc: isPt ? 'Operações intraday R:R ≥ 1.8' : 'Intraday ops R:R ≥ 1.8' },
        { key: 'swing', icon: <TrendingUp className="w-4 h-4" />, label: '📈 Swing', desc: isPt ? 'Holds 1-7 dias R:R ≥ 1.5' : 'Multi-day holds R:R ≥ 1.5' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-3">
                    <Crosshair className="w-12 h-12 mx-auto text-primary animate-pulse" />
                    <p className="text-muted-foreground">{t('scanningMarket')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* ===== HEADER ===== */}
            <div>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 shadow-lg shadow-red-500/20">
                            <Crosshair className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black flex items-center gap-2">
                                SNIPER PRO
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold uppercase tracking-wider">
                                    ⚡ {t('realTime')}
                                </span>
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                {t('sniperProDesc')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] text-red-400">
                                <WifiOff className="w-3 h-3" /> Offline
                            </span>
                        )}
                        {timeSince && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" /> {timeSince}
                            </span>
                        )}
                    </div>
                </div>

                {/* ===== QUICK STATS ===== */}
                <div className="flex flex-wrap gap-2 mt-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border text-[11px]">
                        <Eye className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{stats.total} {t('signals')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border text-[11px]">
                        <span className="text-emerald-400 font-bold">{stats.longs} LONG</span>
                        <span className="text-muted-foreground/40">|</span>
                        <span className="text-red-400 font-bold">{stats.shorts} SHORT</span>
                    </div>
                    {stats.elites > 0 && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400 font-bold">
                            <Star className="w-3 h-3" /> {stats.elites} ELITE
                        </div>
                    )}
                    {stats.inZone > 0 && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-400 font-bold animate-pulse">
                            <Crosshair className="w-3 h-3" /> {stats.inZone} {t('inZone')}
                        </div>
                    )}
                    <div className={cn(
                        'flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold',
                        stats.btcCtx === 'BULLISH' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                            stats.btcCtx === 'BEARISH' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
                    )}>
                        BTC {stats.btcCtx === 'BULLISH' ? '▲' : stats.btcCtx === 'BEARISH' ? '▼' : '→'}
                    </div>
                </div>
            </div>

            {/* ===== TUTORIAL ===== */}
            <SniperProTutorial />

            {/* ===== CREDIT WALL (Token Gate) ===== */}
            <CreditWall
                toolName="Sniper Pro"
                toolIcon="sniper"
                storageKey="sniper_pro_access"
                cost={1}
            >
                {/* ===== MODE TABS ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-6">
                    {modes.map(m => (
                        <button
                            key={m.key}
                            onClick={() => setMode(m.key)}
                            className={cn(
                                'p-3 rounded-xl border text-center transition-all duration-200',
                                mode === m.key
                                    ? 'bg-gradient-to-br from-primary/15 to-cyan-500/10 border-primary/40 shadow-md shadow-primary/10'
                                    : 'bg-card border-border hover:border-primary/20 hover:bg-card/80',
                            )}
                        >
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                                <span className="text-sm font-black">{m.label}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                        </button>
                    ))}
                </div>

                {/* ===== FILTERS ===== */}
                <div className="flex items-center gap-2 flex-wrap mt-5">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mr-1">
                        <Filter className="w-3 h-3" /> {t('filters')}:
                    </div>
                    <div className="flex gap-1">
                        {(['ALL', 'LONG', 'SHORT'] as DirectionFilter[]).map(d => (
                            <button
                                key={d}
                                onClick={() => setDirFilter(d)}
                                className={cn(
                                    'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border',
                                    dirFilter === d
                                        ? d === 'LONG' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                                            : d === 'SHORT' ? 'bg-red-500/20 border-red-500/30 text-red-400'
                                                : 'bg-primary/15 border-primary/30 text-primary'
                                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50',
                                )}
                            >
                                {d === 'ALL' ? t('all') : d}
                            </button>
                        ))}
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div className="flex gap-1">
                        {(['ALL', 'A+', 'A', 'B+'] as QualityFilter[]).map(q => (
                            <button
                                key={q}
                                onClick={() => setQualFilter(q)}
                                className={cn(
                                    'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border',
                                    qualFilter === q
                                        ? 'bg-primary/15 border-primary/30 text-primary'
                                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50',
                                )}
                            >
                                {q === 'ALL' ? t('all') : `≥ ${q}`}
                            </button>
                        ))}
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div className="flex gap-1">
                        {(['ALL', 'IN_ZONE', 'CLOSE'] as HotZoneFilter[]).map(z => (
                            <button
                                key={z}
                                onClick={() => setZoneFilter(z)}
                                className={cn(
                                    'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border',
                                    zoneFilter === z
                                        ? z === 'IN_ZONE' ? 'bg-red-500/20 border-red-500/30 text-red-400'
                                            : z === 'CLOSE' ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                                                : 'bg-primary/15 border-primary/30 text-primary'
                                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50',
                                )}
                            >
                                {z === 'ALL' ? t('all') : z === 'IN_ZONE' ? '🔴 Na Zona' : '⚡ Próximo'}
                            </button>
                        ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                        {filteredSignals.length} {t('results')}
                    </span>
                </div>

                {/* ===== SIGNAL CARDS ===== */}
                {filteredSignals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
                        {filteredSignals.slice(0, 30).map(signal => (
                            <SignalCard
                                key={signal.ticker}
                                signal={signal}
                                analysis={stableAnalyses.find(a => a.ticker === signal.ticker)}
                                isPinned={pinnedTickers.has(signal.ticker)}
                                onTogglePin={togglePin}
                                onSelectToken={navigate}
                                onCreateAlert={(ticker, targetValue, note) => {
                                    const currentPrice = liveAnalyses.find(a => a.ticker === ticker)?.current_price || targetValue;
                                    setAlertModalConfig({ isOpen: true, ticker, price: targetValue, note });
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 space-y-3 mt-4 border rounded-2xl bg-card border-border/50">
                        <Crosshair className="w-12 h-12 mx-auto text-muted-foreground/30" />
                        <h3 className="text-lg font-bold text-muted-foreground">
                            {t('noSignalsFound')}
                        </h3>
                        <p className="text-sm text-muted-foreground/60 max-w-md mx-auto">
                            {mode === 'sniper'
                                ? t('sniperRestrictiveDesc')
                                : t('adjustFilters')}
                        </p>
                        <div className="flex gap-2 justify-center mt-2">
                            {mode !== 'swing' && (
                                <Button variant="outline" size="sm" onClick={() => setMode('swing')}>
                                    {t('swingModeButton')}
                                </Button>
                            )}
                            {dirFilter !== 'ALL' && (
                                <Button variant="outline" size="sm" onClick={() => setDirFilter('ALL')}>
                                    {t('showAllButton')}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CreditWall>

            {/* ===== DISCLAIMER ===== */}
            <div className="text-center text-[9px] text-muted-foreground/40 pb-4">
                {t('disclaimerSniper')}
            </div>

            {/* Alert Modal */}
            {alertModalConfig && (
                <AlertModal
                    isOpen={alertModalConfig.isOpen}
                    onClose={() => setAlertModalConfig(null)}
                    ticker={alertModalConfig.ticker}
                    currentPrice={alertModalConfig.price} // Use target as current for prepopulation
                    initialTargetPrice={alertModalConfig.price}
                    initialNote={alertModalConfig.note}
                />
            )}

            <ExchangeFloatingBar />
        </div>
    );
};

export default SniperPage;
