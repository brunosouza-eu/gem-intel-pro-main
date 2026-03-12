import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Brain,
  X,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  Search,
  ChevronRight,
  Activity,
  BarChart3,
  Shield,
  Target,
  ArrowRight,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Clock,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreditGuard } from '@/hooks/useCreditGuard';
import CryptoLogo from './CryptoLogo';
import { MarketPulseTutorial } from './MarketPulseTutorial';
import { SwingAnalysis } from '@/hooks/useSwingAnalysis';
import {
  analyzeBatch,
  getBtcMarketContext,
  type SmartSignal,
} from '@/lib/tradingIntelligence';

interface FloatingGuruProps {
  analyses: SwingAnalysis[];
  onSelectToken: (ticker: string) => void;
}

// Grade based on confidence + confluences
function getGrade(signal: SmartSignal): { letter: string; color: string } {
  const score = signal.confidenceScore;
  if (score >= 85) return { letter: 'A+', color: 'text-emerald-400' };
  if (score >= 70) return { letter: 'A', color: 'text-green-400' };
  if (score >= 55) return { letter: 'B+', color: 'text-cyan-400' };
  if (score >= 40) return { letter: 'B', color: 'text-blue-400' };
  if (score >= 25) return { letter: 'C+', color: 'text-yellow-400' };
  return { letter: 'C', color: 'text-orange-400' };
}

// Mini gauge component (pure CSS) — now with delta
const MiniGauge: React.FC<{
  value: number; // 0-100
  delta: number; // change from previous
  label: string;
  icon: React.ReactNode;
  colorClass: string;
}> = ({ value, delta, label, icon, colorClass }) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const angle = (clampedValue / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-9 overflow-hidden">
        {/* Background arc */}
        <div className="absolute inset-0 rounded-t-full border-4 border-muted-foreground/15" />
        {/* Colored fill */}
        <div
          className={cn("absolute inset-0 rounded-t-full border-4 transition-all duration-700", colorClass)}
          style={{
            clipPath: `polygon(0% 100%, 0% 0%, ${50 + clampedValue / 2}% 0%, 50% 100%)`,
          }}
        />
        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 w-0.5 h-7 bg-white/90 origin-bottom transition-transform duration-700 rounded-full"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        />
        {/* Center dot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
      </div>
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-1 -mt-1">
        <span className={cn("text-sm font-bold", colorClass)}>{clampedValue}%</span>
        {delta !== 0 && (
          <span className={cn("text-[9px] font-bold flex items-center", delta > 0 ? 'text-emerald-400' : 'text-red-400')}>
            {delta > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
            {Math.abs(delta)}
          </span>
        )}
      </div>
    </div>
  );
};

const FloatingGuru: React.FC<FloatingGuruProps> = ({ analyses, onSelectToken }) => {
  const { language } = useLanguage();
  const { checkAndUse } = useCreditGuard();
  const pt = language === 'pt';
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [signals, setSignals] = useState<SmartSignal[]>([]);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<SmartSignal | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevSignalsRef = useRef<SmartSignal[]>([]);
  const lastComputeRef = useRef<number>(0);
  const computeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastComputeTimestamp = useRef<Date | null>(null);

  // Track previous gauge values for delta
  const prevSentimentRef = useRef<number>(0);
  const prevStrengthRef = useRef<number>(0);

  // ===== STABLE SNAPSHOT to prevent flicker =====
  // analyses changes on every WebSocket tick; we only update our snapshot every 10s
  const [stableAnalyses, setStableAnalyses] = useState<SwingAnalysis[]>(analyses);
  const snapshotTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestAnalysesRef = useRef(analyses);
  latestAnalysesRef.current = analyses;

  useEffect(() => {
    // Set initial snapshot immediately
    if (stableAnalyses.length === 0 && analyses.length > 0) {
      setStableAnalyses(analyses);
    }
    // Then update every 10 seconds
    if (!snapshotTimerRef.current) {
      snapshotTimerRef.current = setInterval(() => {
        setStableAnalyses(latestAnalysesRef.current);
      }, 10_000);
    }
    return () => {
      if (snapshotTimerRef.current) {
        clearInterval(snapshotTimerRef.current);
        snapshotTimerRef.current = null;
      }
    };
  }, [analyses.length]);

  // Generate signals — debounced to avoid flickering from real-time price ticks
  useEffect(() => {
    if (analyses.length === 0) return;

    const now = Date.now();
    const DEBOUNCE_MS = 30_000; // 30 seconds

    // First load: compute immediately
    if (lastComputeRef.current === 0) {
      const allSignals = analyzeBatch(analyses);
      prevSignalsRef.current = signals;
      setSignals(allSignals);
      lastComputeRef.current = now;
      lastComputeTimestamp.current = new Date();
      return;
    }

    // Already scheduled? skip
    if (computeTimerRef.current) return;

    const elapsed = now - lastComputeRef.current;
    const delay = Math.max(0, DEBOUNCE_MS - elapsed);

    computeTimerRef.current = setTimeout(() => {
      const allSignals = analyzeBatch(analyses);
      prevSignalsRef.current = signals;
      setSignals(allSignals);
      lastComputeRef.current = Date.now();
      lastComputeTimestamp.current = new Date();
      computeTimerRef.current = null;
    }, delay);

    return () => {
      if (computeTimerRef.current) {
        clearTimeout(computeTimerRef.current);
        computeTimerRef.current = null;
      }
    };
  }, [analyses]);

  // ===== CLEAN ANALYSES: filter junk tickers + deduplicate =====
  const cleanAnalyses = useMemo(() => {
    // 1. Only valid A-Z0-9 tickers with real price and some volume
    const valid = stableAnalyses.filter(a =>
      /^[A-Z0-9]{2,10}$/.test(a.ticker) &&
      (a.current_price || 0) > 0 &&
      (a.volume_ratio || 0) >= 0.05
    );
    // 2. Deduplicate by ticker (keep highest volume)
    const map = new Map<string, typeof valid[0]>();
    valid.forEach(a => {
      const existing = map.get(a.ticker);
      if (!existing || (a.volume_ratio || 0) > (existing.volume_ratio || 0)) {
        map.set(a.ticker, a);
      }
    });
    return Array.from(map.values());
  }, [stableAnalyses]);

  // ===== TOP MOVERS (from clean snapshot) =====
  const topMovers = useMemo(() => {
    const withChange = cleanAnalyses.filter(a => (a.change_24h ?? null) !== null);
    const sorted = [...withChange].sort((a, b) => (b.change_24h || 0) - (a.change_24h || 0));
    const gainers = sorted.filter(a => (a.change_24h || 0) > 0 && (a.change_24h || 0) < 300).slice(0, 3);
    const losers = sorted.filter(a => (a.change_24h || 0) < 0 && (a.change_24h || 0) > -95).reverse().slice(0, 3);
    return { gainers, losers };
  }, [cleanAnalyses]);

  // ===== MARKET SUMMARY =====
  const marketSummary = useMemo(() => {
    if (signals.length === 0 || cleanAnalyses.length === 0) return null;

    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const freshAnalyses = cleanAnalyses.filter(a => {
      const updatedAt = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      return (now - updatedAt) < TWENTY_FOUR_HOURS_MS;
    });
    const activeAnalyses = freshAnalyses.length >= 5 ? freshAnalyses : cleanAnalyses;

    const btcAnalysis = cleanAnalyses.find(a => a.ticker === 'BTC');
    const btcPrice = btcAnalysis?.current_price || 0;
    const btcChange = btcAnalysis?.change_24h || 0;
    const btcContext = getBtcMarketContext();

    // Market strength
    const strongTrendTokens = activeAnalyses.filter(a =>
      (a.current_price || 0) > (a.ema_200 || 0) &&
      (a.ema_50 || 0) > (a.ema_200 || 0)
    ).length;
    const strengthPct = Math.round((strongTrendTokens / activeAnalyses.length) * 100);

    // Sentiment
    const bullishSentimentTokens = activeAnalyses.filter(a =>
      (a.macd_histogram || 0) > 0 || a.htf_trend === 'bullish'
    ).length;
    const sentiment = Math.round((bullishSentimentTokens / activeAnalyses.length) * 100);

    // Calculate deltas
    const sentimentDelta = sentiment - prevSentimentRef.current;
    const strengthDelta = strengthPct - prevStrengthRef.current;
    // Only update prev after first load
    if (prevSentimentRef.current !== 0 || prevStrengthRef.current !== 0) {
      // keep deltas
    } else {
      // First load, set base
    }
    prevSentimentRef.current = sentiment;
    prevStrengthRef.current = strengthPct;

    // Top 3 picks
    const top3 = signals
      .filter(s => s.direction !== 'NEUTRAL' && s.level !== 'PERIGO' && s.level !== 'AGUARDAR' && /^[A-Z0-9]{2,10}$/.test(s.ticker))
      .slice(0, 3);

    // Buy vs sell count
    const buyCount = signals.filter(s => s.direction === 'LONG').length;
    const sellCount = signals.filter(s => s.direction === 'SHORT').length;

    return {
      sentiment,
      sentimentDelta,
      strengthPct,
      strengthDelta,
      btcContext,
      btcPrice,
      btcChange,
      top3,
      buyCount,
      sellCount,
    };
  }, [signals, cleanAnalyses, language]);

  // ===== OPPORTUNITIES =====
  const opportunities = useMemo(() => {
    if (cleanAnalyses.length === 0) return [];
    const activeAnalyses = cleanAnalyses;
    const opps: { ticker: string; type: 'oversold' | 'volume' | 'golden'; reason: string; icon: string }[] = [];

    // RSI oversold + bullish supertrend = buy zone
    activeAnalyses.forEach(a => {
      if ((a.rsi || 0) < 30 && (a.rsi || 0) >= 1 && a.supertrend_direction === 'bull') {
        opps.push({
          ticker: a.ticker,
          type: 'oversold',
          reason: pt ? `RSI ${(a.rsi || 0).toFixed(0)} + Supertrend Bull` : `RSI ${(a.rsi || 0).toFixed(0)} + Supertrend Bull`,
          icon: '🔥',
        });
      }
    });

    // Volume spikes > 2x
    activeAnalyses.forEach(a => {
      if ((a.volume_ratio || 0) >= 2 && !opps.find(o => o.ticker === a.ticker)) {
        opps.push({
          ticker: a.ticker,
          type: 'volume',
          reason: pt ? `Volume ${(a.volume_ratio || 0).toFixed(1)}x acima da média` : `Volume ${(a.volume_ratio || 0).toFixed(1)}x above average`,
          icon: '📊',
        });
      }
    });

    // Golden cross (EMA50 > EMA200 with price above both)
    activeAnalyses.forEach(a => {
      if (
        (a.ema_50 || 0) > (a.ema_200 || 0) &&
        (a.current_price || 0) > (a.ema_50 || 0) &&
        (a.change_24h || 0) > 3 &&
        !opps.find(o => o.ticker === a.ticker)
      ) {
        opps.push({
          ticker: a.ticker,
          type: 'golden',
          reason: pt ? `Golden Cross + Alta de ${(a.change_24h || 0).toFixed(1)}%` : `Golden Cross + ${(a.change_24h || 0).toFixed(1)}% gain`,
          icon: '🌟',
        });
      }
    });

    return opps.slice(0, 5);
  }, [cleanAnalyses, pt]);

  // ===== SMART ALERTS =====
  const smartAlerts = useMemo(() => {
    const alerts: { icon: string; text: string; severity: 'danger' | 'warning' | 'info' }[] = [];
    if (signals.length === 0) return alerts;

    const btcContext = getBtcMarketContext();

    if (btcContext === 'BEARISH') {
      alerts.push({
        icon: '🔴',
        text: pt ? 'BTC em tendência de baixa — cuidado com longs' : 'BTC trending down — be careful with longs',
        severity: 'danger',
      });
    }

    const validRsiAnalyses = cleanAnalyses;
    const overbought = validRsiAnalyses.filter(a => (a.rsi || 0) > 70 && (a.rsi || 0) <= 100);
    if (overbought.length >= 3) {
      alerts.push({
        icon: '⚠️',
        text: pt
          ? `${overbought.length} tokens com RSI sobrecomprado (>70)`
          : `${overbought.length} tokens with overbought RSI (>70)`,
        severity: 'warning',
      });
    }

    const oversold = validRsiAnalyses.filter(a => (a.rsi || 0) < 30 && (a.rsi || 0) >= 1);
    if (oversold.length >= 2) {
      alerts.push({
        icon: '🔥',
        text: pt
          ? `${oversold.length} tokens em sobrevenda (RSI<30): ${oversold.map(a => a.ticker).slice(0, 3).join(', ')}`
          : `${oversold.length} tokens oversold (RSI<30): ${oversold.map(a => a.ticker).slice(0, 3).join(', ')}`,
        severity: 'info',
      });
    }

    const volumeSpikes = cleanAnalyses.filter(a => (a.volume_ratio || 0) >= 2);
    if (volumeSpikes.length > 0) {
      alerts.push({
        icon: '📊',
        text: pt
          ? `Volume explosivo em ${volumeSpikes.map(a => a.ticker).slice(0, 3).join(', ')}`
          : `Volume spike in ${volumeSpikes.map(a => a.ticker).slice(0, 3).join(', ')}`,
        severity: 'info',
      });
    }

    const potentialFlips = cleanAnalyses.filter(a =>
      a.supertrend_direction === 'bull' &&
      (a.change_24h || 0) > 3 &&
      (a.buy_score || 0) > 60
    );
    if (potentialFlips.length > 0) {
      alerts.push({
        icon: '🚀',
        text: pt
          ? `Momentum forte em ${potentialFlips.map(a => a.ticker).slice(0, 3).join(', ')}`
          : `Strong momentum in ${potentialFlips.map(a => a.ticker).slice(0, 3).join(', ')}`,
        severity: 'info',
      });
    }

    return alerts.slice(0, 4);
  }, [signals, cleanAnalyses, pt]);

  // ===== QUICK LOOKUP =====
  const handleLookup = useCallback(() => {
    const query = lookupQuery.trim().toUpperCase();
    if (!query) {
      setLookupResult(null);
      return;
    }
    const found = signals.find(s => s.ticker.toUpperCase() === query);
    setLookupResult(found || null);
  }, [lookupQuery, signals]);

  useEffect(() => {
    const timer = setTimeout(handleLookup, 300);
    return () => clearTimeout(timer);
  }, [lookupQuery, handleLookup]);

  // ===== TIME SINCE LAST COMPUTE =====
  const [timeSince, setTimeSince] = useState('');
  useEffect(() => {
    const update = () => {
      if (!lastComputeTimestamp.current) { setTimeSince(''); return; }
      const diff = Math.floor((Date.now() - lastComputeTimestamp.current.getTime()) / 1000);
      if (diff < 60) setTimeSince(`${diff}s`);
      else setTimeSince(`${Math.floor(diff / 60)}min`);
    };
    update();
    const timer = setInterval(update, 5000);
    return () => clearInterval(timer);
  }, [signals]);

  // Sentiment label + color
  const sentimentInfo = useMemo(() => {
    if (!marketSummary) return { label: '—', color: 'text-muted-foreground', borderColor: 'border-muted' };
    const s = marketSummary.sentiment;
    if (s >= 70) return { label: pt ? 'Forte Alta' : 'Strong Bull', color: 'text-emerald-400', borderColor: 'border-emerald-500' };
    if (s >= 55) return { label: pt ? 'Alta' : 'Bullish', color: 'text-green-400', borderColor: 'border-green-500' };
    if (s >= 45) return { label: pt ? 'Neutro' : 'Neutral', color: 'text-yellow-400', borderColor: 'border-yellow-500' };
    if (s >= 30) return { label: pt ? 'Baixa' : 'Bearish', color: 'text-orange-400', borderColor: 'border-orange-500' };
    return { label: pt ? 'Forte Baixa' : 'Strong Bear', color: 'text-red-400', borderColor: 'border-red-500' };
  }, [marketSummary, pt]);

  // Button badge color
  const badgeColor = useMemo(() => {
    if (!marketSummary) return 'bg-muted-foreground';
    if (marketSummary.sentiment >= 55) return 'bg-emerald-500';
    if (marketSummary.sentiment >= 45) return 'bg-yellow-500';
    return 'bg-red-500';
  }, [marketSummary]);

  const formatPrice = (price: number) => {
    if (price < 0.001) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 100) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  // ===== MOVER MINI CARD =====
  const renderMoverCard = (analysis: SwingAnalysis, isGainer: boolean) => (
    <button
      key={analysis.ticker}
      onClick={() => { onSelectToken(analysis.ticker); setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg transition-all hover:scale-[1.02] cursor-pointer text-left w-full overflow-hidden',
        isGainer ? 'bg-emerald-500/8 hover:bg-emerald-500/15 border border-emerald-500/20' : 'bg-red-500/8 hover:bg-red-500/15 border border-red-500/20',
      )}
    >
      <CryptoLogo symbol={analysis.ticker} size={22} className="shrink-0" />
      <span className="text-xs font-bold flex-1 truncate">{analysis.ticker}</span>
      <span className={cn('text-xs font-mono font-bold shrink-0', isGainer ? 'text-emerald-400' : 'text-red-400')}>
        {(analysis.change_24h || 0) >= 0 ? '+' : ''}{(analysis.change_24h || 0).toFixed(1)}%
      </span>
    </button>
  );

  // ===== TOP PICK CARD =====
  const renderTopPickCard = (signal: SmartSignal, rank: number) => {
    const grade = getGrade(signal);
    const isLong = signal.direction === 'LONG';
    const tokenAnalysis = cleanAnalyses.find(a => a.ticker === signal.ticker);
    const change24h = tokenAnalysis?.change_24h || 0;

    return (
      <button
        key={signal.ticker}
        onClick={() => {
          onSelectToken(signal.ticker);
          setIsOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={cn(
          'w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
          'hover:scale-[1.01] hover:shadow-md group cursor-pointer text-left',
          rank === 0 && 'bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30',
          rank === 1 && 'bg-gradient-to-r from-slate-400/10 via-slate-400/5 to-transparent border border-slate-400/20',
          rank === 2 && 'bg-gradient-to-r from-amber-700/10 via-amber-700/5 to-transparent border border-amber-700/20',
        )}
      >
        {/* Rank */}
        <div className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0',
          rank === 0 && 'bg-amber-500/20 text-amber-400',
          rank === 1 && 'bg-slate-400/20 text-slate-300',
          rank === 2 && 'bg-amber-700/20 text-amber-600',
        )}>
          #{rank + 1}
        </div>

        {/* Logo + Info */}
        <CryptoLogo symbol={signal.ticker} size={28} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{signal.ticker}</span>
            <span className={cn('text-xs font-black', grade.color)}>{grade.letter}</span>
            {isLong ? (
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            ) : signal.direction === 'SHORT' ? (
              <TrendingDown className="w-3 h-3 text-red-400" />
            ) : (
              <Minus className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-muted-foreground truncate">
              {signal.setupName.replace(/[🎯💎🔥🚀⚡☁️📊📐🛡️🌟💥]/g, '').trim()}
            </p>
          </div>
        </div>

        {/* Price + Change */}
        <div className="text-right shrink-0">
          <span className="text-xs font-mono text-muted-foreground block">{formatPrice(signal.currentPrice)}</span>
          <span className={cn('text-[10px] font-bold', change24h >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            {change24h >= 0 ? '+' : ''}{change24h.toFixed(1)}%
          </span>
        </div>
      </button>
    );
  };

  const handleOpenPanel = async () => {
    if (isUnlocked) {
      setIsOpen(true);
      return;
    }
    const success = await checkAndUse('guru');
    if (success) {
      setIsUnlocked(true);
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* ===== FLOATING BUTTON ===== */}
      <button
        onClick={handleOpenPanel}
        className={cn(
          'fixed bottom-20 right-4 z-50',
          'flex items-center gap-2 px-4 py-3 rounded-full',
          'bg-gradient-to-r from-violet-600 to-cyan-600',
          'text-white font-semibold shadow-lg shadow-violet-500/25',
          'hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300',
          'border border-white/20',
        )}
      >
        <Brain className="w-5 h-5" />
        <span className="hidden sm:inline text-sm">PULSE</span>
        <span className={cn('w-2.5 h-2.5 rounded-full animate-pulse', badgeColor)} />
      </button>

      {/* ===== PANEL ===== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Content */}
          <div className="relative w-full sm:w-[420px] max-h-[95vh] sm:max-h-[90vh] bg-background border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:animate-in sm:slide-in-from-right-4 flex flex-col">

            {/* ===== HEADER ===== */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-violet-500/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 shadow-lg shadow-violet-500/20">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold flex items-center gap-2">
                    MARKET PULSE
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">⚡ LIVE</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] text-muted-foreground">
                      {pt ? 'Inteligência de mercado em tempo real' : 'Real-time market intelligence'}
                    </p>
                    {timeSince && (
                      <span className="text-[9px] text-muted-foreground/60 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {timeSince}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* ===== SCROLLABLE CONTENT ===== */}
            <div className="overflow-y-auto flex-1 overscroll-contain">
              <div className="p-4 space-y-4">

                <MarketPulseTutorial />

                {/* ===== 1. TOP MOVERS ===== */}
                {(topMovers.gainers.length > 0 || topMovers.losers.length > 0) && (
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      {pt ? 'MOVERS DO DIA' : 'TOP MOVERS TODAY'}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase">🟢 {pt ? 'Maiores Altas' : 'Top Gainers'}</span>
                        {topMovers.gainers.map(a => renderMoverCard(a, true))}
                        {topMovers.gainers.length === 0 && (
                          <p className="text-[10px] text-muted-foreground/50 py-2">{pt ? 'Nenhum em alta' : 'None rising'}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-red-400 font-semibold uppercase">🔴 {pt ? 'Maiores Quedas' : 'Top Losers'}</span>
                        {topMovers.losers.map(a => renderMoverCard(a, false))}
                        {topMovers.losers.length === 0 && (
                          <p className="text-[10px] text-muted-foreground/50 py-2">{pt ? 'Nenhum em queda' : 'None falling'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== 2. GAUGES ===== */}
                {marketSummary && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-xl bg-card border border-border text-center">
                      <MiniGauge
                        value={marketSummary.sentiment}
                        delta={marketSummary.sentimentDelta}
                        label={pt ? 'Sentimento' : 'Sentiment'}
                        icon={<Activity className="w-3 h-3 text-muted-foreground" />}
                        colorClass={
                          marketSummary.sentiment >= 60 ? 'border-emerald-500'
                            : marketSummary.sentiment >= 40 ? 'border-yellow-500'
                              : 'border-red-500'
                        }
                      />
                      <span className={cn('text-[10px] font-medium mt-1', sentimentInfo.color)}>
                        {sentimentInfo.label}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-card border border-border text-center">
                      <MiniGauge
                        value={marketSummary.strengthPct}
                        delta={marketSummary.strengthDelta}
                        label={pt ? 'Força' : 'Strength'}
                        icon={<BarChart3 className="w-3 h-3 text-muted-foreground" />}
                        colorClass={
                          marketSummary.strengthPct >= 60 ? 'border-emerald-500'
                            : marketSummary.strengthPct >= 40 ? 'border-yellow-500'
                              : 'border-red-500'
                        }
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {marketSummary.buyCount}🟢 {marketSummary.sellCount}🔴
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-card border border-border text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center text-lg font-black border-2',
                          marketSummary.btcContext === 'BULLISH' && 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
                          marketSummary.btcContext === 'BEARISH' && 'border-red-500 text-red-400 bg-red-500/10',
                          marketSummary.btcContext === 'NEUTRAL' && 'border-yellow-500 text-yellow-400 bg-yellow-500/10',
                        )}>
                          {marketSummary.btcContext === 'BULLISH' ? '₿↑' : marketSummary.btcContext === 'BEARISH' ? '₿↓' : '₿→'}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">BTC</span>
                        <span className={cn(
                          'text-[11px] font-bold',
                          marketSummary.btcChange >= 0 ? 'text-emerald-400' : 'text-red-400',
                        )}>
                          {marketSummary.btcChange >= 0 ? '+' : ''}{marketSummary.btcChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== 3. OPPORTUNITIES ===== */}
                {opportunities.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      {pt ? 'OPORTUNIDADES AGORA' : 'OPPORTUNITIES NOW'}
                    </h3>
                    <div className="space-y-1.5">
                      {opportunities.map((opp, i) => (
                        <button
                          key={`${opp.ticker}-${i}`}
                          onClick={() => { onSelectToken(opp.ticker); setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gradient-to-r from-cyan-500/5 to-violet-500/5 border border-cyan-500/15 hover:border-cyan-500/30 transition-all w-full text-left group"
                        >
                          <span className="text-base shrink-0">{opp.icon}</span>
                          <CryptoLogo symbol={opp.ticker} size={20} />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold">{opp.ticker}</span>
                            <p className="text-[10px] text-muted-foreground truncate">{opp.reason}</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-cyan-400 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ===== 4. TOP 3 PICKS ===== */}
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    TOP PICKS
                  </h3>
                  <div className="space-y-2">
                    {marketSummary && marketSummary.top3.length > 0 ? (
                      marketSummary.top3.map((signal, i) => renderTopPickCard(signal, i))
                    ) : (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        <Minus className="w-5 h-5 mx-auto mb-1 opacity-50" />
                        {pt ? 'Sem picks fortes no momento' : 'No strong picks right now'}
                      </div>
                    )}
                  </div>
                </div>

                {/* ===== 5. SMART ALERTS ===== */}
                {smartAlerts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      {pt ? 'ALERTAS' : 'ALERTS'}
                    </h3>
                    <div className="space-y-1.5">
                      {smartAlerts.map((alert, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex items-start gap-2 p-2.5 rounded-lg text-xs',
                            alert.severity === 'danger' && 'bg-red-500/10 border border-red-500/20 text-red-300',
                            alert.severity === 'warning' && 'bg-amber-500/10 border border-amber-500/20 text-amber-300',
                            alert.severity === 'info' && 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300',
                          )}
                        >
                          <span className="shrink-0">{alert.icon}</span>
                          <span className="leading-relaxed">{alert.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ===== 6. QUICK LOOKUP ===== */}
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-violet-400" />
                    {pt ? 'CONSULTAR TOKEN' : 'LOOKUP TOKEN'}
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={lookupQuery}
                      onChange={e => setLookupQuery(e.target.value)}
                      placeholder={pt ? 'Ex: SOL, ETH, LINK...' : 'e.g. SOL, ETH, LINK...'}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    />
                  </div>
                  {lookupQuery.trim() && !lookupResult && (
                    <p className="mt-2 text-xs text-muted-foreground text-center">
                      {pt
                        ? `"${lookupQuery.toUpperCase()}" não encontrado nos ${signals.length} tokens`
                        : `"${lookupQuery.toUpperCase()}" not found in ${signals.length} tokens`}
                    </p>
                  )}
                  {lookupResult && <LookupResultCard signal={lookupResult} />}
                </div>

                {/* ===== FOOTER ===== */}
                <div className="text-center text-[10px] text-muted-foreground/50 pb-2">
                  {signals.length} tokens • {pt ? 'Atualizado em tempo real' : 'Updated in real-time'}
                  {timeSince && ` • ${timeSince} ${pt ? 'atrás' : 'ago'}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingGuru;
