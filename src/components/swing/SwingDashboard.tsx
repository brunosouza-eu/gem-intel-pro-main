// TRADE MASTER PRO - Dashboard de Indicadores (Enhanced)
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SwingAnalysis } from '@/hooks/useSwingAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Shield,
  Zap,
  Cloud,
  Volume2,
  Layers,
  Percent,
  CheckCircle2,
  XCircle,
  MinusCircle,
  RefreshCw,
  AlertTriangle,
  Clock,
  Bell
} from 'lucide-react';
import { analyzeToken } from '@/lib/swingAnalysisService';
import { supabase } from '@/integrations/supabase/client';

interface SwingDashboardProps {
  analysis: SwingAnalysis | null;
  onAnalysisUpdate?: (analysis: SwingAnalysis) => void;
  realtimePrice?: number | null;
  realtimeChange?: number | null;
}

const SwingDashboard: React.FC<SwingDashboardProps> = ({ analysis, onAnalysisUpdate, realtimePrice, realtimeChange }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [flashClass, setFlashClass] = useState('');
  const prevPriceRef = React.useRef(realtimePrice);

  React.useEffect(() => {
    if (realtimePrice && prevPriceRef.current && prevPriceRef.current !== realtimePrice) {
      const isUp = realtimePrice > prevPriceRef.current;
      setFlashClass(isUp ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10');
      const timer = setTimeout(() => setFlashClass(''), 1000);
      prevPriceRef.current = realtimePrice;
      return () => clearTimeout(timer);
    }
    if (realtimePrice) prevPriceRef.current = realtimePrice;
  }, [realtimePrice]);


  // Freshness calculation - simplified for UI clarity
  const isFresh = analysis?.updated_at
    ? (Date.now() - new Date(analysis.updated_at).getTime()) < (1000 * 60 * 60 * 4) // 4 hours
    : false;

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    if (!analysis?.ticker || isRefreshing) return;
    setIsRefreshing(true);
    try {
      const newAnalysis = await analyzeToken(analysis.ticker, '4h');

      // Save to DB
      await supabase.from('token_analysis').upsert({
        ticker: newAnalysis.ticker,
        timeframe: newAnalysis.timeframe,
        ema_21: newAnalysis.ema21, ema_50: newAnalysis.ema50,
        ema_100: newAnalysis.ema100, ema_200: newAnalysis.ema200,
        adx: newAnalysis.adx, di_plus: newAnalysis.diPlus, di_minus: newAnalysis.diMinus,
        supertrend_value: newAnalysis.supertrendValue, supertrend_direction: newAnalysis.supertrendDirection,
        rsi: newAnalysis.rsi, stoch_k: newAnalysis.stochK, stoch_d: newAnalysis.stochD,
        macd_line: newAnalysis.macdLine, macd_signal: newAnalysis.macdSignal, macd_histogram: newAnalysis.macdHistogram,
        tenkan: newAnalysis.tenkan, kijun: newAnalysis.kijun, senkou_a: newAnalysis.senkouA, senkou_b: newAnalysis.senkouB,
        cloud_position: newAnalysis.cloudPosition,
        volume_ratio: newAnalysis.volumeRatio, buy_pressure: newAnalysis.buyPressure,
        key_support: newAnalysis.keySupport, key_resistance: newAnalysis.keyResistance,
        fib_236: newAnalysis.fib236, fib_382: newAnalysis.fib382, fib_500: newAnalysis.fib500,
        fib_618: newAnalysis.fib618, fib_786: newAnalysis.fib786, fib_zone: newAnalysis.fibZone,
        buy_score: newAnalysis.buyScore, sell_score: newAnalysis.sellScore, signal: newAnalysis.signal,
        stop_loss: newAnalysis.stopLoss, take_profit: newAnalysis.takeProfit, risk_reward: newAnalysis.riskReward,
        atr: newAnalysis.atr, patterns_detected: newAnalysis.patternsDetected,
        htf_trend: newAnalysis.htfTrend, mtf_trend: newAnalysis.mtfTrend,
        current_price: newAnalysis.currentPrice, change_24h: newAnalysis.change24h,
      }, { onConflict: 'ticker,timeframe', ignoreDuplicates: false });

      // Notify parent
      if (onAnalysisUpdate) {
        onAnalysisUpdate({
          ...analysis,
          adx: newAnalysis.adx, di_plus: newAnalysis.diPlus, di_minus: newAnalysis.diMinus,
          supertrend_value: newAnalysis.supertrendValue, supertrend_direction: newAnalysis.supertrendDirection,
          rsi: newAnalysis.rsi, macd_line: newAnalysis.macdLine, macd_signal: newAnalysis.macdSignal,
          macd_histogram: newAnalysis.macdHistogram, cloud_position: newAnalysis.cloudPosition,
          volume_ratio: newAnalysis.volumeRatio, buy_pressure: newAnalysis.buyPressure,
          buy_score: newAnalysis.buyScore, sell_score: newAnalysis.sellScore, signal: newAnalysis.signal,
          stop_loss: newAnalysis.stopLoss, take_profit: newAnalysis.takeProfit, risk_reward: newAnalysis.riskReward,
          htf_trend: newAnalysis.htfTrend, mtf_trend: newAnalysis.mtfTrend, fib_zone: newAnalysis.fibZone,
          current_price: newAnalysis.currentPrice, change_24h: newAnalysis.change24h,
          updated_at: new Date().toISOString(),
        } as SwingAnalysis);
      }
    } catch (err) {
      console.error('Error refreshing analysis:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [analysis, isRefreshing, onAnalysisUpdate]);

  if (!analysis) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <Activity className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40 animate-pulse" />
        <p className="text-muted-foreground">
          {t('selectTokenSeeAnalysis' as any)}
        </p>
      </div>
    );
  }

  const getSignalDisplay = () => {
    const signalMap: Record<string, { text: string; color: string; bg: string }> = {
      elite_buy: { text: '💎 ELITE BUY', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
      strong_buy: { text: '🔥 STRONG BUY', color: 'text-success', bg: 'bg-success/10 border-success/30' },
      medium_buy: { text: '⚡ BUY', color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/30' },
      elite_sell: { text: '💎 ELITE SELL', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' },
      strong_sell: { text: '🔥 STRONG SELL', color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/30' },
      medium_sell: { text: '⚡ SELL', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30' },
      wait: { text: String(t('waitingStatus' as any)), color: 'text-muted-foreground', bg: 'bg-muted/20 border-muted-foreground/20' },
    };
    return signalMap[analysis.signal || 'wait'] || signalMap.wait;
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 75) return 'text-cyan-400';
    if (score >= 60) return 'text-success';
    if (score >= 45) return 'text-green-600';
    return 'text-muted-foreground';
  };

  const formatNumber = (num: number | null, decimals: number = 2) => {
    if (num === null || num === undefined) return '—';
    return num.toFixed(decimals);
  };

  const signal = getSignalDisplay();

  // Count confluences (indicators aligned to signal direction)
  const isBuySignal = analysis.signal?.includes('buy');
  const isSellSignal = analysis.signal?.includes('sell');

  const confluences = (() => {
    const items: { label: string; aligned: boolean | null }[] = [
      { label: 'ADX', aligned: (analysis.adx || 0) > 20 ? ((analysis.di_plus || 0) > (analysis.di_minus || 0) ? isBuySignal : isSellSignal) || false : null },
      { label: 'RSI', aligned: (analysis.rsi || 50) < 40 ? isBuySignal || false : (analysis.rsi || 50) > 60 ? isSellSignal || false : null },
      { label: 'MACD', aligned: (analysis.macd_histogram || 0) > 0 ? isBuySignal || false : isSellSignal || false },
      { label: 'Supertrend', aligned: analysis.supertrend_direction === 'bull' ? isBuySignal || false : isSellSignal || false },
      { label: 'Ichimoku', aligned: analysis.cloud_position === 'above' ? isBuySignal || false : analysis.cloud_position === 'below' ? isSellSignal || false : null },
      { label: 'Volume', aligned: (analysis.volume_ratio || 0) > 1.2 ? true : null },
      { label: 'HTF', aligned: analysis.htf_trend === 'bullish' ? isBuySignal || false : analysis.htf_trend === 'bearish' ? isSellSignal || false : null },
      { label: 'Fib Zone', aligned: analysis.fib_zone === 'buy_zone' ? isBuySignal || false : analysis.fib_zone === 'sell_zone' ? isSellSignal || false : null },
    ];
    const aligned = items.filter(i => i.aligned === true).length;
    const against = items.filter(i => i.aligned === false).length;
    const neutral = items.filter(i => i.aligned === null).length;
    return { items, aligned, against, neutral, total: items.length };
  })();

  const confluencePercentage = Math.round((confluences.aligned / confluences.total) * 100);

  const rows = [
    {
      label: '💪 ADX',
      value: formatNumber(analysis.adx, 1),
      context: (analysis.di_plus || 0) > (analysis.di_minus || 0) ? 'BULL' : 'BEAR',
      valueColor: (analysis.adx || 0) > 25 ? 'text-success' : (analysis.adx || 0) > 20 ? 'text-warning' : 'text-muted-foreground',
      contextColor: (analysis.di_plus || 0) > (analysis.di_minus || 0) ? 'text-success' : 'text-destructive',
    },
    {
      label: '📊 Supertrend',
      value: analysis.supertrend_direction === 'bull' ? '▲ BULL' : '▼ BEAR',
      context: `$${formatNumber(analysis.supertrend_value, 2)}`,
      valueColor: analysis.supertrend_direction === 'bull' ? 'text-success' : 'text-destructive',
      contextColor: 'text-foreground/70',
    },
    {
      label: '📈 RSI',
      value: formatNumber(analysis.rsi, 1),
      context: (analysis.rsi || 50) < 30 ? '🟢 OVERSOLD' : (analysis.rsi || 50) > 70 ? '🔴 OVERBOUGHT' : (analysis.rsi || 50) < 40 ? 'Low' : (analysis.rsi || 50) > 60 ? 'High' : 'Neutral',
      valueColor: (analysis.rsi || 50) < 35 ? 'text-success' : (analysis.rsi || 50) > 65 ? 'text-destructive' : 'text-warning',
      contextColor: 'text-foreground/70',
    },
    {
      label: '📉 MACD',
      value: (analysis.macd_histogram || 0) > 0 ? '▲ BULL' : '▼ BEAR',
      context: (analysis.macd_line || 0) > (analysis.macd_signal || 0) ? 'Cross UP ↑' : 'Cross DN ↓',
      valueColor: (analysis.macd_histogram || 0) > 0 ? 'text-success' : 'text-destructive',
      contextColor: (analysis.macd_line || 0) > (analysis.macd_signal || 0) ? 'text-success' : 'text-destructive',
    },
    {
      label: '☁️ Ichimoku',
      value: analysis.cloud_position === 'above' ? '☁️ Above' : analysis.cloud_position === 'below' ? '☁️ Below' : '☁️ Inside',
      context: analysis.cloud_position === 'above' ? 'BULLISH' : analysis.cloud_position === 'below' ? 'BEARISH' : 'NEUTRAL',
      valueColor: analysis.cloud_position === 'above' ? 'text-success' : analysis.cloud_position === 'below' ? 'text-destructive' : 'text-warning',
      contextColor: analysis.cloud_position === 'above' ? 'text-success' : analysis.cloud_position === 'below' ? 'text-destructive' : 'text-muted-foreground',
    },
    {
      label: '📊 Volume',
      value: `${formatNumber(analysis.volume_ratio)}x`,
      context: (analysis.volume_ratio || 0) > 1.5 ? '🔥 MUITO ALTO' : (analysis.volume_ratio || 0) > 1.2 ? 'ALTO' : 'NORMAL',
      valueColor: (analysis.volume_ratio || 0) > 1.5 ? 'text-cyan-400' : (analysis.volume_ratio || 0) > 1 ? 'text-success' : 'text-muted-foreground',
      contextColor: 'text-foreground/70',
    },
    {
      label: '⏱ HTF Trend',
      value: analysis.htf_trend === 'bullish' ? '▲ BULL' : analysis.htf_trend === 'bearish' ? '▼ BEAR' : '— NEUTRAL',
      context: `MTF: ${analysis.mtf_trend === 'bullish' ? '▲' : analysis.mtf_trend === 'bearish' ? '▼' : '—'}`,
      valueColor: analysis.htf_trend === 'bullish' ? 'text-success' : analysis.htf_trend === 'bearish' ? 'text-destructive' : 'text-muted-foreground',
      contextColor: analysis.mtf_trend === 'bullish' ? 'text-success' : analysis.mtf_trend === 'bearish' ? 'text-destructive' : 'text-muted-foreground',
    },
    {
      label: '🎯 Fibonacci',
      value: analysis.fib_zone === 'buy_zone' ? 'BUY ZONE' : analysis.fib_zone === 'sell_zone' ? 'SELL ZONE' : 'NEUTRAL',
      context: `Zone: ${analysis.fib_zone === 'buy_zone' ? 'buy' : analysis.fib_zone === 'sell_zone' ? 'sell' : 'neutral'}`,
      valueColor: analysis.fib_zone === 'buy_zone' ? 'text-success' : analysis.fib_zone === 'sell_zone' ? 'text-destructive' : 'text-muted-foreground',
      contextColor: 'text-foreground/70',
    },
  ];

  return (
    <div className="bg-card border-2 border-primary/30 rounded-xl overflow-hidden">
      {/* Header with Signal + Scores */}
      <div className="bg-gradient-to-r from-primary/20 via-info/10 to-primary/20 p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2 flex-wrap">
              <Zap className="w-5 h-5 shrink-0" />
              {analysis.ticker}
              <span className="text-xs text-muted-foreground font-normal">• {analysis.timeframe}</span>
            </h3>
            {(realtimePrice || analysis.current_price) && (
              <p className={cn(
                "text-lg sm:text-xl font-mono font-semibold mt-0.5 truncate transition-all duration-300 rounded px-1 -ml-1", 
                flashClass
              )}>
                ${formatNumber(realtimePrice || analysis.current_price, (realtimePrice || analysis.current_price || 0) < 1 ? 6 : (realtimePrice || analysis.current_price || 0) < 100 ? 4 : 2)}
                <span className={cn(
                  "text-sm ml-2",
                  ((realtimeChange ?? analysis.change_24h) || 0) >= 0 ? 'text-success' : 'text-destructive'
                )}>
                  {((realtimeChange ?? analysis.change_24h) || 0) >= 0 ? '+' : ''}{formatNumber(realtimeChange ?? analysis.change_24h, 2)}%
                </span>
              </p>
            )}
            <button
              onClick={() => navigate(`/alerts?token=${analysis.ticker}`)}
              className="mt-1 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium transition-all
                hover:bg-amber-500/10 text-amber-400 border border-amber-500/20"
            >
              <Bell className="w-3 h-3" />
              {String(t('createAlert' as any)) || '🔔 Criar Alerta'}
            </button>
          </div>

          {/* Score boxes */}
          <div className="flex gap-2 sm:gap-3 shrink-0">
            <div className="text-center px-3 sm:px-4 py-2 rounded-lg bg-success/10 border border-success/20">
              <p className="text-[10px] uppercase tracking-wider text-success/80">BUY</p>
              <p className={cn("text-xl sm:text-2xl font-bold", getScoreColor(analysis.buy_score))}>
                {formatNumber(analysis.buy_score, 0)}
              </p>
            </div>
            <div className="text-center px-3 sm:px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-[10px] uppercase tracking-wider text-destructive/80">SELL</p>
              <p className={cn("text-xl sm:text-2xl font-bold", getScoreColor(analysis.sell_score))}>
                {formatNumber(analysis.sell_score, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Signal Banner */}
      <div className={cn("py-3 px-4 border-b border-border flex items-center justify-between", signal.bg)}>
        <span className={cn("text-lg font-bold", signal.color)}>
          {signal.text}
        </span>

        {/* Confluence Semaphore */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {confluences.items.map((item, i) => (
              <div
                key={i}
                title={`${item.label}: ${item.aligned === true ? String(t('aligned' as any)) : item.aligned === false ? String(t('against' as any)) : String(t('neutral' as any))}`}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-colors",
                  item.aligned === true ? 'bg-success shadow-sm shadow-success/50' :
                    item.aligned === false ? 'bg-destructive shadow-sm shadow-destructive/50' :
                      'bg-muted-foreground/30'
                )}
              />
            ))}
          </div>
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            confluencePercentage >= 75 ? 'bg-success/20 text-success' :
              confluencePercentage >= 50 ? 'bg-warning/20 text-warning' :
                'bg-destructive/20 text-destructive'
          )}>
            {confluences.aligned}/{confluences.total}
          </span>
        </div>
      </div>

      {/* Indicator Rows - Simplified 2-column */}
      <div className="divide-y divide-border/50">
        {rows.map((row, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 px-4 py-2.5 hover:bg-muted/5 transition-colors">
            <div className="text-sm font-medium text-foreground/80">
              {row.label}
            </div>
            <div className={cn("text-center font-mono text-sm font-semibold", row.valueColor)}>
              {row.value}
            </div>
            <div className={cn("text-center text-xs", row.contextColor)}>
              {row.context}
            </div>
          </div>
        ))}
      </div>

      {/* Trade Plan Summary */}
      <div className="p-4 border-t border-border bg-muted/10">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-[10px] uppercase tracking-wider text-destructive/70">Stop Loss</p>
            <p className="text-sm font-mono font-semibold text-destructive">${formatNumber(analysis.stop_loss, analysis.stop_loss && analysis.stop_loss < 1 ? 6 : 2)}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-success/10 border border-success/20">
            <p className="text-[10px] uppercase tracking-wider text-success/70">Take Profit</p>
            <p className="text-sm font-mono font-semibold text-success">${formatNumber(analysis.take_profit, analysis.take_profit && analysis.take_profit < 1 ? 6 : 2)}</p>
          </div>
          <div className={cn(
            "text-center p-2 rounded-lg border",
            (analysis.risk_reward || 0) >= 2 ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'
          )}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">R:R</p>
            <p className={cn(
              "text-sm font-mono font-semibold",
              (analysis.risk_reward || 0) >= 3 ? 'text-cyan-400' :
                (analysis.risk_reward || 0) >= 2 ? 'text-success' : 'text-warning'
            )}>
              {formatNumber(analysis.risk_reward)}:1
            </p>
          </div>
        </div>
      </div>

      {/* Patterns Detected */}
      {analysis.patterns_detected && analysis.patterns_detected.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/5">
          <p className="text-xs text-muted-foreground mb-2">{t('patternsDetected' as any)}</p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.patterns_detected.map((pattern, i) => (
              <span key={i} className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-[10px] font-medium">
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last Update + Live Status */}
      <div className="p-2.5 border-t border-border flex items-center justify-between bg-muted/5">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-[11px] font-medium text-emerald-400">
            Live
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all",
            "hover:bg-primary/10 text-primary border border-primary/20",
            isRefreshing && "opacity-50 cursor-not-allowed"
          )}
        >
          <RefreshCw className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
          {isRefreshing
            ? t('updating' as any)
            : t('refresh' as any)
          }
        </button>
      </div>
    </div>
  );
};

export default SwingDashboard;

