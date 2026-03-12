/**
 * 🤖 AutoPilot Page — Premium Trading Bot Dashboard
 * Full trading bot management with paper trading, P&L, and configuration
 * Locked behind Master VIP + Admin access control
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ExchangeFloatingBar } from '@/components/ExchangeReferral';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import {
    BotConfig, BotStats, PaperTrade, BotStatus, TradeDirection,
    DEFAULT_BOT_CONFIG, loadConfig, saveConfig,
    loadTrades, saveTrades, calculateStats,
    generateDemoTrades, openPaperTrade, closeTrade,
    updateTradePrice, loadCircuitBreaker, getRemainingCooldown,
    loadEquityCurve, getPerformanceByToken,
    type SmartSignalData,
    type EquityPoint, type TokenPerformance, type CircuitBreakerState,
} from '@/lib/autoPilotService';
import { useTradingBotContext } from '@/contexts/TradingBotContext';
import { analyzeBatch, type SmartSignal } from '@/lib/tradingIntelligence';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
    Bot, Lock, Shield, Play, Pause, Settings, TrendingUp, TrendingDown,
    Zap, Target, DollarSign, BarChart3, Activity, Timer, Award,
    AlertTriangle, CheckCircle, XCircle, ArrowUpRight, ArrowDownRight,
    Crosshair, Sparkles, Crown, Eye, RefreshCw, Wallet,
    ToggleLeft, ToggleRight, Flame, ChevronRight, Info, Pencil, Clock,
    ChevronDown, ChevronUp, Star, Radar, Brain, Wifi, WifiOff
} from 'lucide-react';
import { type RealtimePrice } from '@/hooks/useRealtimePrices';
import { AutoPilotTutorial } from '@/components/autopilot/AutoPilotTutorial';

// ─── Access Gate (Locked Screen) ─────────────────────────────────

const LockedGate: React.FC<{ isPt: boolean }> = ({ isPt }) => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        {/* Animated Lock + BETA Badge */}
        <div className="relative mb-8">
            <div className="absolute inset-0 w-36 h-36 -m-2 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/20 blur-2xl animate-pulse" />
            <div className="absolute inset-0 w-36 h-36 -m-2 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-amber-500/30 flex items-center justify-center shadow-2xl">
                <Lock className="w-14 h-14 text-amber-400" />
            </div>
            <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[11px] font-black tracking-wider shadow-lg shadow-amber-500/30 animate-bounce" style={{ animationDuration: '2s' }}>
                BETA
            </div>
        </div>

        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            AutoPilot Bot
        </h1>

        <div className="mb-3">
            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 gap-1.5 px-3 py-1 text-xs">
                <Sparkles className="w-3 h-3" />
                {isPt ? 'Versão Beta — Acesso Restrito' : 'Beta Version — Restricted Access'}
            </Badge>
        </div>

        <p className="text-lg text-muted-foreground max-w-md mb-2">
            {isPt
                ? 'O bot de trading automático mais avançado do mercado crypto.'
                : 'The most advanced automatic trading bot in the crypto market.'}
        </p>
        <p className="text-sm text-muted-foreground/70 max-w-sm mb-8">
            {isPt
                ? 'Esta ferramenta está em fase de testes. Em breve será liberada para todos os membros. Aguarde o lançamento oficial!'
                : 'This tool is in testing phase. It will be available to all members soon. Stay tuned for the official launch!'}
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mb-8">
            {[
                { icon: Bot, label: isPt ? 'Trading Automático' : 'Auto Trading' },
                { icon: Shield, label: isPt ? 'Gestão de Risco' : 'Risk Management' },
                { icon: BarChart3, label: isPt ? 'Dashboard P&L' : 'P&L Dashboard' },
                { icon: Crosshair, label: isPt ? 'Segue o Sniper' : 'Follows Sniper' },
                { icon: Activity, label: isPt ? 'Tempo Real' : 'Real-Time' },
                { icon: Target, label: isPt ? 'Multi Estratégia' : 'Multi Strategy' },
            ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card/50 border border-border/30 hover:border-amber-500/20 transition-colors">
                    <f.icon className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs text-muted-foreground">{f.label}</span>
                </div>
            ))}
        </div>

        <Badge variant="outline" className="border-amber-500/40 text-amber-400 px-4 py-2 text-sm gap-2">
            <Crown className="w-4 h-4" />
            {isPt ? '🚀 Em breve para todos' : '🚀 Coming soon for everyone'}
        </Badge>

        <p className="text-[10px] text-muted-foreground/40 mt-6 max-w-xs">
            {isPt
                ? 'Apenas administradores têm acesso durante a fase beta.'
                : 'Only administrators have access during the beta phase.'}
        </p>
    </div>
);

// ─── Stat Card ───────────────────────────────────────────────────

const StatCard: React.FC<{
    icon: React.ElementType;
    label: string;
    value: string | number;
    sub?: string;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
}> = ({ icon: Icon, label, value, sub, color = 'text-primary', trend }) => (
    <div className={cn(
        'p-3 sm:p-4 rounded-xl border border-border/30',
        'bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-colors'
    )}>
        <div className="flex items-center gap-2 mb-2">
            <Icon className={cn('w-4 h-4', color)} />
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase font-medium truncate">{label}</span>
        </div>
        <p className={cn('text-lg sm:text-xl font-bold font-mono', color)}>{value}</p>
        {sub && (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                {trend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
                {trend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-400" />}
                {sub}
            </p>
        )}
    </div>
);

// ─── Trade Row ───────────────────────────────────────────────────

// ─── Duration helper ────────────────────────────────────────────
const formatDuration = (openedAt: string, closedAt?: string) => {
    const start = new Date(openedAt).getTime();
    const end = closedAt ? new Date(closedAt).getTime() : Date.now();
    const diff = Math.max(0, end - start);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs < 24) return `${hrs}h ${remMins}m`;
    const days = Math.floor(hrs / 24);
    return `${days}d ${hrs % 24}h`;
};

// ─── Premium Trade Card ─────────────────────────────────────────
const TradeRow: React.FC<{
    trade: PaperTrade;
    isPt: boolean;
    onClose: (id: string) => void;
    realtimePrice?: RealtimePrice;
}> = ({ trade, isPt, onClose, realtimePrice }) => {
    const [expanded, setExpanded] = useState(false);
    const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);
    const prevPriceRef = React.useRef(trade.currentPrice);

    // Animate price flash when direction changes
    React.useEffect(() => {
        if (!realtimePrice) return;
        if (realtimePrice.direction === 'neutral') return;
        if (Math.abs(realtimePrice.price - prevPriceRef.current) < 0.0000001) return;

        prevPriceRef.current = realtimePrice.price;
        setPriceFlash(realtimePrice.direction);
        const timer = setTimeout(() => setPriceFlash(null), 600);
        return () => clearTimeout(timer);
    }, [realtimePrice?.price, realtimePrice?.direction]);
    const isProfit = trade.pnl >= 0;
    const isOpen = trade.status === 'open' || trade.status === 'partial';
    const rr = trade.riskReward || 0;
    const confluences = trade.confluences || [];
    const level = trade.level || 'MODERADO';
    const posSize = trade.positionSize || 0;
    const posPct = trade.positionPct || 0;

    // SL/TP progress bar
    const entry = trade.entryPrice;
    const cur = trade.currentPrice;
    const sl = trade.stopLoss;
    const tp = trade.takeProfit;
    const range = tp - sl;
    const progress = range !== 0 ? Math.max(0, Math.min(100, ((cur - sl) / range) * 100)) : 50;

    const levelColor = level === 'ELITE' ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
        : level === 'FORTE' ? 'text-blue-400 border-blue-500/40 bg-blue-500/10'
            : 'text-purple-400 border-purple-500/40 bg-purple-500/10';

    return (
        <div className={cn(
            'rounded-xl border transition-all overflow-hidden',
            isOpen
                ? 'border-primary/20 bg-gradient-to-br from-card/80 to-primary/5'
                : isProfit
                    ? 'border-emerald-500/20 bg-gradient-to-br from-card/80 to-emerald-500/5'
                    : 'border-red-500/20 bg-gradient-to-br from-card/80 to-red-500/5'
        )}>
            {/* Main row */}
            <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className={cn(
                            'p-1.5 sm:p-2 rounded-lg shrink-0',
                            trade.direction === 'LONG' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                        )}>
                            {trade.direction === 'LONG'
                                ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                                : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm sm:text-base">{trade.ticker}</span>
                                <Badge variant="outline" className={cn(
                                    'text-[9px] px-1.5',
                                    trade.direction === 'LONG' ? 'border-emerald-500/40 text-emerald-400' : 'border-red-500/40 text-red-400'
                                )}>
                                    {trade.direction}
                                </Badge>
                                <Badge variant="outline" className={cn('text-[9px] px-1.5', levelColor)}>
                                    {level === 'ELITE' ? '💎' : level === 'FORTE' ? '🔥' : '⚡'} {level}
                                </Badge>
                                {isOpen && (
                                    <span className="relative flex h-2 w-2 shrink-0">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                                <span className="font-mono">${entry.toLocaleString()}</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className={cn(
                                    'font-mono font-semibold transition-all duration-300',
                                    priceFlash === 'up' ? 'text-emerald-300 scale-110' :
                                        priceFlash === 'down' ? 'text-red-300 scale-110' :
                                            isProfit ? 'text-emerald-400' : 'text-red-400'
                                )} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                    {realtimePrice && realtimePrice.direction !== 'neutral' && (
                                        <span className={cn(
                                            'inline-flex transition-all duration-200',
                                            realtimePrice.direction === 'up' ? 'text-emerald-400 animate-bounce' : 'text-red-400 animate-bounce'
                                        )} style={{ animationDuration: '0.5s', animationIterationCount: '1', fontSize: '8px' }}>
                                            {realtimePrice.direction === 'up' ? '▲' : '▼'}
                                        </span>
                                    )}
                                    ${cur.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right shrink-0">
                        <p className={cn(
                            'text-base sm:text-lg font-bold font-mono',
                            isProfit ? 'text-emerald-400' : 'text-red-400'
                        )}>
                            {isProfit ? '+' : ''}{trade.pnlPct.toFixed(2)}%
                        </p>
                        <p className={cn(
                            'text-[10px] sm:text-xs font-mono',
                            isProfit ? 'text-emerald-400/70' : 'text-red-400/70'
                        )}>
                            {isProfit ? '+' : ''}${trade.pnl.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* SL ─── Progress Bar ─── TP */}
                <div className="mt-3">
                    <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-1">
                        <span className="text-red-400 font-mono">SL ${sl.toLocaleString()}</span>
                        <span className="text-muted-foreground/60">R:R <span className={cn('font-bold', rr >= 2.5 ? 'text-emerald-400' : rr >= 2 ? 'text-blue-400' : 'text-amber-400')}>1:{rr.toFixed(1)}</span></span>
                        <span className="text-emerald-400 font-mono">TP ${tp.toLocaleString()}</span>
                    </div>
                    <div className="relative w-full h-2 rounded-full bg-muted/30 overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full opacity-30" style={{ width: '100%' }} />
                        <div className={cn(
                            'absolute top-0 w-2.5 h-2.5 rounded-full border-2 border-white shadow-lg',
                            isProfit ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-red-400 shadow-red-400/50'
                        )} style={{
                            left: `calc(${progress}% - 5px)`,
                            top: '-1px',
                            transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease',
                        }} />
                    </div>
                </div>

                {/* Quick info row */}
                <div className="mt-2 flex items-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                        <DollarSign className="w-2.5 h-2.5" />
                        ${posSize.toFixed(0)} ({posPct}%)
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatDuration(trade.openedAt, trade.closedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 text-amber-400" />
                        Score {trade.score}
                    </span>
                    {confluences.length > 0 && (
                        <span className="flex items-center gap-1">
                            <Brain className="w-2.5 h-2.5 text-cyan-400" />
                            {confluences.length} conf.
                        </span>
                    )}
                    {trade.trailingStopActive && (
                        <Badge variant="outline" className="text-[8px] px-1 border-blue-500/40 text-blue-400">🔒 Trailing</Badge>
                    )}
                    {trade.breakEvenApplied && (
                        <Badge variant="outline" className="text-[8px] px-1 border-emerald-500/40 text-emerald-400">⚖️ BE</Badge>
                    )}
                    {!isOpen && trade.closeReason && (
                        <Badge variant="outline" className="text-[8px] px-1">
                            {trade.closeReason === 'tp_hit' ? '🎯 TP Hit' :
                                trade.closeReason === 'sl_hit' ? '🛑 SL Hit' :
                                    trade.closeReason === 'trailing_stop' ? '📈 Trailing' :
                                        trade.closeReason === 'anti_dump' ? '🚨 Anti-Dump' : '✋ Manual'}
                        </Badge>
                    )}
                </div>

                {/* Expand/Collapse + Close */}
                <div className="mt-2 flex items-center justify-between">
                    <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {expanded ? (isPt ? 'Menos detalhes' : 'Less') : (isPt ? 'Estratégia & Detalhes' : 'Strategy & Details')}
                    </button>
                    {isOpen && (
                        <button
                            onClick={() => onClose(trade.id)}
                            className="text-[10px] text-muted-foreground hover:text-red-400 transition-colors px-2 py-1 rounded border border-border/30 hover:border-red-500/40"
                        >
                            {isPt ? '✋ Fechar Trade' : '✋ Close Trade'}
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded details */}
            {expanded && (
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 space-y-2 border-t border-border/20">
                    {/* Strategy & Reason */}
                    <div className="pt-2">
                        <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                            {isPt ? '🎯 MOTIVO DA ENTRADA' : '🎯 ENTRY REASON'}
                        </p>
                        <p className="text-xs text-foreground/80">
                            {trade.entryReason || trade.signal}
                        </p>
                        {trade.setupName && trade.setupName !== 'Manual' && (
                            <Badge variant="outline" className="text-[9px] mt-1 border-cyan-500/30 text-cyan-400">
                                📐 {trade.setupName}
                            </Badge>
                        )}
                    </div>

                    {/* Confluences */}
                    {confluences.length > 0 && (
                        <div>
                            <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                                {isPt ? `🧠 CONFLUÊNCIAS (${confluences.length})` : `🧠 CONFLUENCES (${confluences.length})`}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {confluences.map((c, i) => (
                                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary/80">
                                        ✓ {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Warnings */}
                    {(trade.warnings || []).length > 0 && (
                        <div>
                            <p className="text-[10px] font-semibold text-amber-400 mb-1">⚠️ AVISOS</p>
                            <div className="flex flex-wrap gap-1">
                                {(trade.warnings || []).map((w, i) => (
                                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                        {w}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Levels grid */}
                    <div className="grid grid-cols-4 gap-2 text-center text-[9px]">
                        <div className="bg-muted/30 rounded-lg p-1.5">
                            <p className="text-muted-foreground">Entry</p>
                            <p className="font-bold font-mono">${entry.toLocaleString()}</p>
                        </div>
                        <div className="bg-red-500/10 rounded-lg p-1.5">
                            <p className="text-red-400">Stop Loss</p>
                            <p className="font-bold font-mono text-red-400">${sl.toLocaleString()}</p>
                        </div>
                        <div className="bg-emerald-500/10 rounded-lg p-1.5">
                            <p className="text-emerald-400">Take Profit</p>
                            <p className="font-bold font-mono text-emerald-400">${tp.toLocaleString()}</p>
                        </div>
                        <div className="bg-blue-500/10 rounded-lg p-1.5">
                            <p className="text-blue-400">R:R</p>
                            <p className="font-bold font-mono text-blue-400">1:{rr.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Strategy Card ───────────────────────────────────────────────

const StrategyCard: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    active: boolean;
    onClick: () => void;
    color: string;
    features: string[];
}> = ({ title, description, icon: Icon, active, onClick, color, features }) => (
    <button
        onClick={onClick}
        className={cn(
            'p-4 rounded-xl border text-left transition-all w-full',
            active
                ? `border-${color}/40 bg-${color}/10 ring-2 ring-${color}/20`
                : 'border-border/30 bg-card/50 hover:border-border/60'
        )}
    >
        <div className="flex items-center gap-3 mb-2">
            <div className={cn('p-2 rounded-lg', active ? `bg-${color}/20` : 'bg-muted/30')}>
                <Icon className={cn('w-5 h-5', active ? `text-${color}` : 'text-muted-foreground')} />
            </div>
            <div>
                <h4 className="font-bold text-sm">{title}</h4>
                {active && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px] border-0 mt-0.5">ATIVO</Badge>
                )}
            </div>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        <div className="space-y-1">
            {features.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <CheckCircle className={cn('w-3 h-3 shrink-0', active ? 'text-emerald-400' : 'text-muted-foreground/50')} />
                    {f}
                </div>
            ))}
        </div>
    </button>
);

// ─── Main Page ───────────────────────────────────────────────────

const AutoPilotPage: React.FC = () => {
    const { language } = useLanguage();
    const { profile } = useAuth();
    const { isAdmin } = useAdmin();
    const isPt = language === 'pt';

    const {
        botStatus, setBotStatus,
        config, updateConfig: handleConfigChange,
        trades, stats, activityLog,
        circuitBreaker, cooldownMinutes,
        sniperSignals, livePrices, realtimePrices, realtimeConnected, tradeTickers,
        closeTradeManual: handleCloseTrade, resetDemo: handleResetDemo
    } = useTradingBotContext();

    // Access control: admin-only during BETA
    const hasAccess = isAdmin;

    const openTradesList = useMemo(() => trades.filter(t => t.status === 'open' || t.status === 'partial'), [trades]);
    const closedTradesList = useMemo(() => trades.filter(t => t.status === 'closed'), [trades]);

    const handleToggleBot = () => {
        if (botStatus === 'running') {
            setBotStatus('paused');
        } else {
            setBotStatus('running');
        }
    };

    // Gate check
    if (!hasAccess) {
        return <LockedGate isPt={isPt} />;
    }

    return (
        <div className="space-y-6 pb-20 animate-fade-in">
            {/* ═══ HEADER ═══ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        AutoPilot Bot
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isPt ? 'Trading automatizado inteligente com gestão de risco profissional' : 'Intelligent automated trading with professional risk management'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Bot Status */}
                    <div className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium',
                        botStatus === 'running'
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                            : botStatus === 'paused'
                                ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                                : 'border-border/40 bg-muted/30 text-muted-foreground'
                    )}>
                        {botStatus === 'running' && (
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            </span>
                        )}
                        {botStatus === 'paused' && <Pause className="w-4 h-4" />}
                        {botStatus === 'idle' && <Eye className="w-4 h-4" />}
                        {botStatus === 'running' ? (isPt ? 'Rodando' : 'Running') :
                            botStatus === 'paused' ? (isPt ? 'Pausado' : 'Paused') : 'Paper Mode'}
                    </div>

                    {/* Mode Badge */}
                    <Badge variant="outline" className="border-amber-500/40 text-amber-400 gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        {config.mode === 'paper' ? 'PAPER' : 'LIVE'}
                    </Badge>

                    {/* Toggle Bot */}
                    <Button
                        onClick={handleToggleBot}
                        size="sm"
                        className={cn(
                            'gap-2 font-medium',
                            botStatus === 'running'
                                ? 'bg-amber-500 hover:bg-amber-600 text-black'
                                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600'
                        )}
                    >
                        {botStatus === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {botStatus === 'running' ? (isPt ? 'Pausar' : 'Pause') : (isPt ? 'Iniciar' : 'Start')}
                    </Button>
                </div>
            </div>

            {/* ═══ TUTORIAL ═══ */}
            <AutoPilotTutorial />

            {/* ═══ STATS ROW ═══ */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                <StatCard
                    icon={Wallet}
                    label={isPt ? 'Saldo' : 'Balance'}
                    value={`$${(stats?.currentBalance || config.paperBalance).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    sub={stats ? `${stats.totalPnlPct >= 0 ? '+' : ''}${stats.totalPnlPct.toFixed(1)}%` : undefined}
                    color={stats && stats.totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}
                    trend={stats && stats.totalPnl >= 0 ? 'up' : 'down'}
                />
                <StatCard
                    icon={DollarSign}
                    label="P&L"
                    value={stats ? `${stats.totalPnl >= 0 ? '+' : ''}$${stats.totalPnl.toFixed(0)}` : '$0'}
                    color={stats && stats.totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}
                />
                <StatCard
                    icon={Award}
                    label="Win Rate"
                    value={stats ? `${stats.winRate.toFixed(0)}%` : '0%'}
                    sub={stats ? `${stats.totalTrades} trades` : undefined}
                    color={stats && stats.winRate >= 60 ? 'text-emerald-400' : 'text-amber-400'}
                />
                <StatCard
                    icon={Flame}
                    label={isPt ? 'Melhor Trade' : 'Best Trade'}
                    value={stats ? `+${stats.bestTrade.toFixed(1)}%` : '0%'}
                    color="text-emerald-400"
                />
                <StatCard
                    icon={Activity}
                    label={isPt ? 'Drawdown Máx' : 'Max Drawdown'}
                    value={stats ? `${stats.maxDrawdown.toFixed(1)}%` : '0%'}
                    color={stats && stats.maxDrawdown > 10 ? 'text-red-400' : 'text-amber-400'}
                />
                <StatCard
                    icon={BarChart3}
                    label={isPt ? 'Profit Factor' : 'Profit Factor'}
                    value={stats ? (stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)) : '0'}
                    color="text-blue-400"
                />
            </div>

            {/* ═══ MAIN TABS ═══ */}
            <Tabs defaultValue="trades" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-11 bg-muted/30 rounded-xl">
                    <TabsTrigger value="trades" className="text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        {isPt ? 'Trades' : 'Trades'}
                    </TabsTrigger>
                    <TabsTrigger value="strategy" className="text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5">
                        <Crosshair className="w-3.5 h-3.5" />
                        {isPt ? 'Estratégia' : 'Strategy'}
                    </TabsTrigger>
                    <TabsTrigger value="risk" className="text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        {isPt ? 'Risco' : 'Risk'}
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5">
                        <Settings className="w-3.5 h-3.5" />
                        {isPt ? 'Config' : 'Config'}
                    </TabsTrigger>
                </TabsList>

                {/* === TRADES TAB === */}
                <TabsContent value="trades" className="space-y-4">
                    {/* ═══ PENDING SIGNALS — Pre-trade evaluation ═══ */}
                    {sniperSignals.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Radar className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                                {isPt ? 'Sinais em Avaliação' : 'Signals Under Evaluation'} ({sniperSignals.filter(s => s.direction !== 'NEUTRAL').length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {sniperSignals
                                    .filter(s => s.direction !== 'NEUTRAL' && s.riskReward >= (config.strategy === 'sniper_follow' ? 1.0 : 0.5))
                                    .slice(0, 6)
                                    .map((sig, i) => {
                                        const isAggressive = config.strategy === 'grid_adaptive' || config.strategy === 'dca_smart';
                                        const minRR = isAggressive ? 0.8 : 1.5;
                                        const minConf = isAggressive ? 1 : 2;
                                        const meetsEntry = sig.riskReward >= minRR && sig.confluenceCount >= minConf && !sig.isStale;
                                        return (
                                            <div key={sig.ticker + i} className={cn(
                                                'p-2.5 rounded-xl border transition-all text-xs',
                                                meetsEntry
                                                    ? 'border-emerald-500/30 bg-emerald-500/5'
                                                    : 'border-border/20 bg-card/40 opacity-70'
                                            )}>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold">{sig.ticker}</span>
                                                        <Badge variant="outline" className={cn(
                                                            'text-[8px] px-1',
                                                            sig.direction === 'LONG' ? 'border-emerald-500/40 text-emerald-400' : 'border-red-500/40 text-red-400'
                                                        )}>
                                                            {sig.direction}
                                                        </Badge>
                                                        <Badge variant="outline" className={cn(
                                                            'text-[8px] px-1',
                                                            sig.level === 'ELITE' ? 'border-amber-500/40 text-amber-400' :
                                                                sig.level === 'FORTE' ? 'border-blue-500/40 text-blue-400' :
                                                                    'border-purple-500/40 text-purple-400'
                                                        )}>
                                                            {sig.level === 'ELITE' ? '💎' : sig.level === 'FORTE' ? '🔥' : '⚡'} {sig.level}
                                                        </Badge>
                                                    </div>
                                                    {meetsEntry && (
                                                        <span className="text-[8px] font-bold text-emerald-400 animate-pulse">✓ {isPt ? 'QUALIFICADO' : 'QUALIFIED'}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                                                    <span>Score <span className="font-bold text-foreground">{sig.confidenceScore}</span></span>
                                                    <span>R:R <span className={cn('font-bold', sig.riskReward >= 2.5 ? 'text-emerald-400' : sig.riskReward >= 2 ? 'text-blue-400' : 'text-amber-400')}>1:{sig.riskReward.toFixed(1)}</span></span>
                                                    <span><Brain className="w-2.5 h-2.5 inline" /> {sig.confluenceCount}</span>
                                                    <span className="font-mono">${sig.currentPrice.toLocaleString()}</span>
                                                </div>
                                                {sig.setupName && sig.setupName !== 'NONE' && (
                                                    <p className="text-[9px] text-muted-foreground/70 mt-1 truncate">📐 {sig.setupName}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                            <p className="text-[9px] text-muted-foreground/60 mt-1.5 text-center">
                                {isPt
                                    ? `✓ QUALIFICADO = R:R ≥ ${config.strategy === 'sniper_follow' ? '1.5' : '0.8'}, ≥ ${config.strategy === 'sniper_follow' ? '2' : '1'} confluência(s). O bot varia a exigência pela estratégia.`
                                    : `✓ QUALIFIED = R:R ≥ ${config.strategy === 'sniper_follow' ? '1.5' : '0.8'}, ≥ ${config.strategy === 'sniper_follow' ? '2' : '1'} confluence(s). Bot scales requirements by strategy.`}
                            </p>
                        </div>
                    )}
                    {/* Open Trades */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                </span>
                                {isPt ? 'Posições Abertas' : 'Open Positions'} ({openTradesList.length})
                                {/* LIVE WebSocket Badge */}
                                {realtimeConnected ? (
                                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[9px] px-1.5 py-0 gap-1 animate-pulse" style={{ animationDuration: '2s' }}>
                                        <Wifi className="w-2.5 h-2.5" />
                                        LIVE
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 gap-1 text-muted-foreground/60 border-border/30">
                                        <WifiOff className="w-2.5 h-2.5" />
                                        OFF
                                    </Badge>
                                )}
                            </h3>
                            <Badge variant="outline" className="text-[10px]">
                                {isPt ? 'Paper Trading' : 'Paper Trading'}
                            </Badge>
                        </div>
                        {openTradesList.length === 0 ? (
                            <Card className="border-dashed border-2 border-border/30">
                                <CardContent className="py-8 text-center">
                                    <Bot className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">
                                        {isPt ? 'Nenhuma posição aberta. O bot abrirá trades quando detectar sinais qualificados.' :
                                            'No open positions. The bot will open trades when qualified signals are detected.'}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-2">
                                {openTradesList.map(t => (
                                    <TradeRow key={t.id} trade={t} isPt={isPt} onClose={handleCloseTrade} realtimePrice={realtimePrices[t.ticker]} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Closed Trades */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-muted-foreground" />
                            {isPt ? 'Histórico de Trades' : 'Trade History'} ({closedTradesList.length})
                        </h3>
                        {closedTradesList.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-4">
                                {isPt ? 'Nenhum trade finalizado ainda.' : 'No completed trades yet.'}
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {closedTradesList.map(t => (
                                    <TradeRow key={t.id} trade={t} isPt={isPt} onClose={handleCloseTrade} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <Button variant="outline" size="sm" onClick={handleResetDemo} className="gap-2 text-xs">
                            <RefreshCw className="w-3.5 h-3.5" />
                            {isPt ? 'Resetar Demo' : 'Reset Demo'}
                        </Button>
                    </div>

                    {/* ═══ ACTIVITY LOG ═══ */}
                    {activityLog.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-cyan-400" />
                                {isPt ? 'Log de Atividade' : 'Activity Log'}
                                {botStatus === 'running' && (
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                                    </span>
                                )}
                            </h3>
                            <div className="rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm max-h-52 overflow-y-auto">
                                <div className="divide-y divide-border/20">
                                    {activityLog.map((log, i) => (
                                        <div key={i} className={cn(
                                            'flex items-start gap-2 px-3 py-2 text-[11px] transition-all',
                                            i === 0 && 'bg-primary/5',
                                            log.type === 'buy' && 'text-emerald-400',
                                            log.type === 'sell' && 'text-red-400',
                                            log.type === 'tp' && 'text-emerald-400',
                                            log.type === 'sl' && 'text-red-400',
                                            log.type === 'warn' && 'text-amber-400',
                                            log.type === 'info' && 'text-muted-foreground',
                                        )}>
                                            <span className="font-mono text-[9px] text-muted-foreground/60 shrink-0 mt-0.5">{log.time}</span>
                                            <span className="leading-relaxed">{log.msg}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* === STRATEGY TAB === */}
                <TabsContent value="strategy" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <StrategyCard
                            title="Sniper Follow"
                            description={isPt
                                ? 'Segue automaticamente os sinais do Sniper Pro'
                                : 'Automatically follows Sniper Pro signals'}
                            icon={Crosshair}
                            active={config.strategy === 'sniper_follow'}
                            onClick={() => handleConfigChange('strategy', 'sniper_follow')}
                            color="blue-400"
                            features={
                                isPt
                                    ? ['Executa sinais STRONG BUY/SELL', 'SL/TP automático do sinal', 'Score mínimo configurável']
                                    : ['Executes STRONG BUY/SELL signals', 'Auto SL/TP from signal', 'Configurable min score']
                            }
                        />
                        <StrategyCard
                            title="DCA Smart"
                            description={isPt
                                ? 'Dollar Cost Average inteligente com timing de IA'
                                : 'Smart Dollar Cost Average with AI timing'}
                            icon={TrendingUp}
                            active={config.strategy === 'dca_smart'}
                            onClick={() => handleConfigChange('strategy', 'dca_smart')}
                            color="emerald-400"
                            features={
                                isPt
                                    ? ['Compra em quedas significativas', 'Vende em altas com trailing', 'Rebalanceamento automático']
                                    : ['Buys on significant dips', 'Sells on highs with trailing', 'Automatic rebalancing']
                            }
                        />
                        <StrategyCard
                            title="Grid Adaptive"
                            description={isPt
                                ? 'Grid trading adaptativo que se ajusta à volatilidade'
                                : 'Adaptive grid trading that adjusts to volatility'}
                            icon={BarChart3}
                            active={config.strategy === 'grid_adaptive'}
                            onClick={() => handleConfigChange('strategy', 'grid_adaptive')}
                            color="purple-400"
                            features={
                                isPt
                                    ? ['Grid dinâmico baseado no ATR', 'Níveis Fibonacci automáticos', 'Lucra em mercados laterais']
                                    : ['Dynamic grid based on ATR', 'Automatic Fibonacci levels', 'Profits in sideways markets']
                            }
                        />
                    </div>

                    {/* Min Score Slider */}
                    <Card className="border-border/30">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="text-sm font-semibold">{isPt ? 'Score Mínimo do Sniper' : 'Minimum Sniper Score'}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {isPt ? 'Só executa trades com score acima deste valor' : 'Only executes trades with scores above this value'}
                                    </p>
                                </div>
                                <div className={cn(
                                    'text-2xl font-bold font-mono px-3 py-1 rounded-lg',
                                    config.minScore >= 80 ? 'text-emerald-400 bg-emerald-500/10' :
                                        config.minScore >= 70 ? 'text-blue-400 bg-blue-500/10' :
                                            'text-amber-400 bg-amber-500/10'
                                )}>
                                    {config.minScore}
                                </div>
                            </div>
                            <Slider
                                value={[config.minScore]}
                                onValueChange={([v]) => handleConfigChange('minScore', v)}
                                min={50}
                                max={95}
                                step={5}
                                className="w-full"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                <span>{isPt ? 'Agressivo (50)' : 'Aggressive (50)'}</span>
                                <span>{isPt ? 'Conservador (95)' : 'Conservative (95)'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* === RISK TAB === */}
                <TabsContent value="risk" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Position Size */}
                        <Card className="border-border/30">
                            <CardContent className="p-4 sm:p-6">
                                <h4 className="text-sm font-semibold mb-1">{isPt ? 'Tamanho da Posição' : 'Position Size'}</h4>
                                <p className="text-xs text-muted-foreground mb-4">
                                    {isPt ? `Máximo ${config.maxPositionPct}% do capital por trade` : `Maximum ${config.maxPositionPct}% of capital per trade`}
                                </p>
                                <Slider
                                    value={[config.maxPositionPct]}
                                    onValueChange={([v]) => handleConfigChange('maxPositionPct', v)}
                                    min={1}
                                    max={10}
                                    step={0.5}
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                    <span>1%</span>
                                    <span className="font-bold">{config.maxPositionPct}%</span>
                                    <span>10%</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Max Open Trades */}
                        <Card className="border-border/30">
                            <CardContent className="p-4 sm:p-6">
                                <h4 className="text-sm font-semibold mb-1">{isPt ? 'Trades Simultâneos' : 'Simultaneous Trades'}</h4>
                                <p className="text-xs text-muted-foreground mb-4">
                                    {isPt ? `Máximo ${config.maxOpenTrades} posições abertas` : `Maximum ${config.maxOpenTrades} open positions`}
                                </p>
                                <Slider
                                    value={[config.maxOpenTrades]}
                                    onValueChange={([v]) => handleConfigChange('maxOpenTrades', v)}
                                    min={1}
                                    max={5}
                                    step={1}
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                    <span>1</span>
                                    <span className="font-bold">{config.maxOpenTrades}</span>
                                    <span>5</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stop Loss */}
                        <Card className="border-border/30">
                            <CardContent className="p-4 sm:p-6">
                                <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                    Stop Loss
                                </h4>
                                <p className="text-xs text-muted-foreground mb-4">
                                    {isPt ? `Perda máxima de ${config.stopLossDefault}% por trade` : `Maximum ${config.stopLossDefault}% loss per trade`}
                                </p>
                                <Slider
                                    value={[config.stopLossDefault]}
                                    onValueChange={([v]) => handleConfigChange('stopLossDefault', v)}
                                    min={0.5}
                                    max={5}
                                    step={0.5}
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                    <span>0.5%</span>
                                    <span className="font-bold text-red-400">{config.stopLossDefault}%</span>
                                    <span>5%</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Take Profit */}
                        <Card className="border-border/30">
                            <CardContent className="p-4 sm:p-6">
                                <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-emerald-400" />
                                    Take Profit
                                </h4>
                                <p className="text-xs text-muted-foreground mb-4">
                                    {isPt ? `Alvo de lucro de ${config.takeProfitDefault}% por trade` : `${config.takeProfitDefault}% profit target per trade`}
                                </p>
                                <Slider
                                    value={[config.takeProfitDefault]}
                                    onValueChange={([v]) => handleConfigChange('takeProfitDefault', v)}
                                    min={2}
                                    max={20}
                                    step={0.5}
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                                    <span>2%</span>
                                    <span className="font-bold text-emerald-400">{config.takeProfitDefault}%</span>
                                    <span>20%</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Trailing Stop Toggle */}
                    <Card className="border-border/30">
                        <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-blue-400" />
                                    Trailing Stop
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {isPt
                                        ? 'Move o stop loss automaticamente conforme o preço sobe, protegendo lucros.'
                                        : 'Automatically moves stop loss as price rises, protecting profits.'}
                                </p>
                            </div>
                            <Switch
                                checked={config.trailingStop}
                                onCheckedChange={(v) => handleConfigChange('trailingStop', v)}
                            />
                        </CardContent>
                    </Card>

                    {/* Risk Summary */}
                    <Card className="border-amber-500/20 bg-amber-500/5">
                        <CardContent className="p-4 sm:p-6">
                            <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-400 mb-3">
                                <Shield className="w-4 h-4" />
                                {isPt ? 'Resumo de Risco' : 'Risk Summary'}
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                <div className="bg-background/50 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground">{isPt ? 'Risco/Trade' : 'Risk/Trade'}</p>
                                    <p className="text-lg font-bold text-red-400 font-mono">{config.stopLossDefault}%</p>
                                </div>
                                <div className="bg-background/50 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground">R:R</p>
                                    <p className="text-lg font-bold text-blue-400 font-mono">
                                        1:{(config.takeProfitDefault / config.stopLossDefault).toFixed(1)}
                                    </p>
                                </div>
                                <div className="bg-background/50 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground">{isPt ? 'Exposição Máx' : 'Max Exposure'}</p>
                                    <p className="text-lg font-bold text-amber-400 font-mono">
                                        {(config.maxPositionPct * config.maxOpenTrades).toFixed(0)}%
                                    </p>
                                </div>
                                <div className="bg-background/50 rounded-lg p-3">
                                    <p className="text-xs text-muted-foreground">{isPt ? 'Perda Máx Total' : 'Max Total Loss'}</p>
                                    <p className="text-lg font-bold text-red-400 font-mono">
                                        {(config.stopLossDefault * config.maxOpenTrades).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* === SETTINGS TAB === */}
                <TabsContent value="settings" className="space-y-4">
                    {/* Mode */}
                    <Card className="border-border/30">
                        <CardContent className="p-4 sm:p-6">
                            <h4 className="text-sm font-semibold mb-4">{isPt ? 'Modo de Operação' : 'Operation Mode'}</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleConfigChange('mode', 'paper')}
                                    className={cn(
                                        'p-4 rounded-xl border text-center transition-all',
                                        config.mode === 'paper'
                                            ? 'border-amber-500/40 bg-amber-500/10 ring-2 ring-amber-500/20'
                                            : 'border-border/30 bg-card/50 hover:border-border/60'
                                    )}
                                >
                                    <Eye className={cn('w-8 h-8 mx-auto mb-2', config.mode === 'paper' ? 'text-amber-400' : 'text-muted-foreground')} />
                                    <p className="font-bold text-sm">Paper Trading</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {isPt ? 'Simulado, sem risco' : 'Simulated, no risk'}
                                    </p>
                                </button>
                                <button
                                    onClick={() => {/* Live mode not available yet */ }}
                                    className="p-4 rounded-xl border border-border/30 bg-card/50 text-center opacity-50 cursor-not-allowed relative"
                                >
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="outline" className="text-[8px] border-red-500/40 text-red-400">
                                            {isPt ? 'Em Breve' : 'Coming Soon'}
                                        </Badge>
                                    </div>
                                    <Zap className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="font-bold text-sm">Live Trading</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {isPt ? 'Dinheiro real' : 'Real money'}
                                    </p>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Paper Balance — Editable */}
                    <Card className="border-border/30">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-semibold">{isPt ? 'Saldo Paper Trading' : 'Paper Trading Balance'}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {isPt ? 'Capital inicial para simulação' : 'Starting capital for simulation'}
                                    </p>
                                </div>
                                <div className="text-2xl font-bold font-mono text-primary">
                                    ${config.paperBalance.toLocaleString()}
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                                <input
                                    type="number"
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/30 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                                    placeholder={isPt ? 'Novo saldo...' : 'New balance...'}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = parseFloat((e.target as HTMLInputElement).value);
                                            if (val > 0) {
                                                handleConfigChange('paperBalance', val);
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }
                                    }}
                                />
                                <span className="text-[10px] text-muted-foreground">{isPt ? 'Enter para salvar' : 'Enter to save'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card className="border-border/30">
                        <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-semibold">{isPt ? 'Notificações' : 'Notifications'}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {isPt ? 'Receber alertas quando o bot abrir/fechar trades' : 'Receive alerts when the bot opens/closes trades'}
                                </p>
                            </div>
                            <Switch
                                checked={config.enableNotifications}
                                onCheckedChange={(v) => handleConfigChange('enableNotifications', v)}
                            />
                        </CardContent>
                    </Card>

                    {/* Exchange */}
                    <Card className="border-border/30">
                        <CardContent className="p-4 sm:p-6">
                            <h4 className="text-sm font-semibold mb-4">{isPt ? 'Exchange' : 'Exchange'}</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleConfigChange('exchange', 'binance')}
                                    className={cn(
                                        'p-4 rounded-xl border text-center transition-all',
                                        config.exchange === 'binance'
                                            ? 'border-amber-500/40 bg-amber-500/10 ring-2 ring-amber-500/20'
                                            : 'border-border/30 bg-card/50 hover:border-border/60'
                                    )}
                                >
                                    <p className="font-bold text-lg">Binance</p>
                                    <p className="text-xs text-muted-foreground mt-1">#1 {isPt ? 'em volume' : 'by volume'}</p>
                                </button>
                                <button
                                    onClick={() => handleConfigChange('exchange', 'bybit')}
                                    className={cn(
                                        'p-4 rounded-xl border text-center transition-all',
                                        config.exchange === 'bybit'
                                            ? 'border-amber-500/40 bg-amber-500/10 ring-2 ring-amber-500/20'
                                            : 'border-border/30 bg-card/50 hover:border-border/60'
                                    )}
                                >
                                    <p className="font-bold text-lg">Bybit</p>
                                    <p className="text-xs text-muted-foreground mt-1">#2 {isPt ? 'em volume' : 'by volume'}</p>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Disclaimer */}
                    <Card className="border-red-500/20 bg-red-500/5">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-red-400 mb-1">
                                        {isPt ? 'Aviso Importante' : 'Important Warning'}
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {isPt
                                            ? 'O AutoPilot Bot é uma ferramenta de auxílio ao trading. Nenhum sistema automatizado garante lucros. Investimentos em criptomoedas envolvem risco significativo de perda de capital. Use sempre gestão de risco adequada e só invista o que pode perder. O modo Live Trading operará com ativos reais e suas decisões são de sua total responsabilidade.'
                                            : 'The AutoPilot Bot is a trading assistance tool. No automated system guarantees profits. Cryptocurrency investments involve significant risk of capital loss. Always use proper risk management and only invest what you can afford to lose.'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <ExchangeFloatingBar />
        </div>
    );
};

export default AutoPilotPage;
