/**
 * Strategic Analysis Component (TradingView Parity Edition)
 * Displays detailed analysis matching Swing Master Pro logic
 */

import React, { useState, useEffect } from 'react';
import { SwingAnalysis } from '@/hooks/useSwingAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Shield,
  Zap,
  BarChart3,
  Activity,
  Gauge,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  DollarSign,
  Layers,
  RefreshCw,
  Loader2,
  CalendarDays,
  Timer
} from 'lucide-react';

interface StrategicAnalysisProps {
  analysis: SwingAnalysis | null;
  onRefresh?: (ticker: string) => Promise<void>;
}

const formatPrice = (price: number | null | undefined): string => {
  if (!price) return '-';
  if (price < 0.0001) return `$${price.toFixed(8)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 100) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 rounded-lg bg-primary/10 text-primary">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
);

const IndicatorCard: React.FC<{
  title: string;
  value: string | number;
  explanation: string;
  signal: 'bullish' | 'bearish' | 'neutral';
  icon: React.ReactNode;
}> = ({ title, value, explanation, signal, icon }) => {
  const borderColor = {
    bullish: 'border-l-success',
    bearish: 'border-l-destructive',
    neutral: 'border-l-muted-foreground',
  };
  const bgColor = {
    bullish: 'bg-success/5',
    bearish: 'bg-destructive/5',
    neutral: 'bg-muted/50',
  };

  return (
    <div className={cn(
      'rounded-lg border border-border/50 p-4 border-l-4',
      borderColor[signal],
      bgColor[signal]
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <span className={cn(
          'font-bold text-lg',
          signal === 'bullish' && 'text-success',
          signal === 'bearish' && 'text-destructive',
          signal === 'neutral' && 'text-muted-foreground'
        )}>
          {value}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {explanation}
      </p>
    </div>
  );
};

// New: Score Display Component
const ScoreDisplay: React.FC<{ buyScore: number, sellScore: number }> = ({ buyScore, sellScore }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-xl border border-border p-6 mb-6">
      <SectionHeader
        icon={<Activity className="w-5 h-5" />}
        title={String(t('aiStrengthScore' as any))}
        subtitle={String(t('aiStrengthDesc' as any))}
      />

      <div className="space-y-6">
        {/* Buy Score */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-success flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4" />
              {t('buyingPressure' as any)}
            </span>
            <span className="font-bold text-success">{buyScore.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all duration-1000"
              style={{ width: `${Math.min(buyScore, 100)}%` }}
            />
          </div>
        </div>

        {/* Sell Score */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-destructive flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4" />
              {t('sellingPressure' as any)}
            </span>
            <span className="font-bold text-destructive">{sellScore.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-destructive transition-all duration-1000"
              style={{ width: `${Math.min(sellScore, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MainVerdict: React.FC<{ analysis: SwingAnalysis }> = ({ analysis }) => {
  const { t } = useLanguage();

  // Use the calculated signal from backend/service first
  const signal = analysis.signal || 'neutral';

  let verdict: 'comprar' | 'vender' | 'aguardar';
  let verdictColor: string;
  let verdictIcon: React.ReactNode;
  let verdictExplanation: string;
  let title: string;

  if (signal.includes('buy')) {
    verdict = 'comprar';
    const isElite = signal === 'elite_buy';
    verdictColor = isElite ? 'from-cyan-500 to-blue-600' : 'from-success to-emerald-600';
    verdictIcon = <ArrowUpCircle className="w-8 h-8" />;
    title = isElite ? String(t('eliteBuySignal' as any)) : String(t('strongBuySignal' as any));
    verdictExplanation = String(t('buySignalDesc' as any));
  } else if (signal.includes('sell')) {
    verdict = 'vender';
    const isElite = signal === 'elite_sell';
    verdictColor = isElite ? 'from-fuchsia-600 to-purple-600' : 'from-destructive to-red-600';
    verdictIcon = <ArrowDownCircle className="w-8 h-8" />;
    title = isElite ? String(t('eliteSellSignal' as any)) : String(t('strongSellSignal' as any));
    verdictExplanation = String(t('sellSignalDesc' as any));
  } else {
    verdict = 'aguardar';
    verdictColor = 'from-muted-foreground/50 to-muted/50 border border-border'; // Neutral styling
    verdictIcon = <Minus className="w-8 h-8" />;
    title = String(t('waitForConf' as any));
    verdictExplanation = String(t('waitForConfDesc' as any));
  }

  return (
    <div className={cn(
      'rounded-xl p-6 bg-gradient-to-r text-white relative overflow-hidden',
      verdictColor
    )}>
      {/* Background pattern for visual flair */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent" />

      <div className="flex items-center gap-4 relative z-10">
        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
          {verdictIcon}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-1 tracking-wide">{title}</h2>
          <p className="text-white/90 text-sm font-medium">{verdictExplanation}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{analysis.ticker}</div>
          <div className="text-white/80">{formatPrice(analysis.current_price)}</div>
        </div>
      </div>
    </div>
  );
};

const TradePlan: React.FC<{ analysis: SwingAnalysis }> = ({ analysis }) => {
  const { t } = useLanguage();
  const currentPrice = analysis.current_price || 0;
  const stopLoss = analysis.stop_loss || 0;
  const takeProfit = analysis.take_profit || 0;
  const riskReward = analysis.risk_reward || 0;

  const potentialLoss = currentPrice > 0 ? ((currentPrice - stopLoss) / currentPrice * 100) : 0;
  const potentialGain = currentPrice > 0 ? ((takeProfit - currentPrice) / currentPrice * 100) : 0;

  // Logic: Short if Stop Loss > Price (implied by Sell Signal logic in backend)
  // Or explicitly check signal
  const isShort = analysis.signal?.includes('sell');
  const tradeDirection = isShort ? 'SHORT (VENDA)' : 'LONG (COMPRA)';

  if (!stopLoss || !takeProfit) return null;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <SectionHeader
        icon={<Target className="w-5 h-5" />}
        title={String(t('tradePlan' as any)).replace('{direction}', tradeDirection)}
        subtitle={String(t('tradePlanDesc' as any))}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Stop Loss */}
        <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <Shield className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Stop Loss</span>
          </div>
          <div className="text-2xl font-bold text-destructive relative z-10">{formatPrice(stopLoss)}</div>
          <p className="text-xs text-muted-foreground mt-1 relative z-10">
            {Math.abs(potentialLoss).toFixed(2)}% risk
          </p>
        </div>

        {/* Entry */}
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('entryCurrent' as any)}
            </span>
          </div>
          <div className="text-2xl font-bold text-primary">{formatPrice(currentPrice)}</div>
        </div>

        {/* Take Profit */}
        <div className="bg-success/10 rounded-lg p-4 border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Take Profit</span>
          </div>
          <div className="text-2xl font-bold text-success">{formatPrice(takeProfit)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.abs(potentialGain).toFixed(2)}% gain
          </p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {t('riskRewardRatio' as any)}
        </span>
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xl font-bold',
            riskReward >= 2 ? 'text-success' : riskReward >= 1.5 ? 'text-warning' : 'text-destructive'
          )}>
            1:{riskReward.toFixed(1)}
          </span>
          {riskReward >= 2 && <CheckCircle2 className="w-5 h-5 text-success" />}
        </div>
      </div>
    </div>
  );
};

const TechnicalIndicators: React.FC<{ analysis: SwingAnalysis }> = ({ analysis }) => {
  const { t } = useLanguage();

  // HTF Trend
  const htfTrend = analysis.htf_trend;
  let htfSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let htfText = 'Neutro';
  if (htfTrend === 'bullish') { htfSignal = 'bullish'; htfText = 'Alta (Diário)'; }
  else if (htfTrend === 'bearish') { htfSignal = 'bearish'; htfText = 'Baixa (Diário)'; }

  // RSI
  const rsi = analysis.rsi || 50;
  let rsiSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (rsi < 35) rsiSignal = 'bullish';
  else if (rsi > 65) rsiSignal = 'bearish';

  // MACD
  const macdHist = analysis.macd_histogram || 0;
  let macdSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (macdHist > 0) macdSignal = 'bullish';
  else if (macdHist < 0) macdSignal = 'bearish';

  // Supertrend
  const st = analysis.supertrend_direction;
  let stSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (st === 'bull') stSignal = 'bullish';
  else if (st === 'bear') stSignal = 'bearish';

  // Cloud
  const cloud = analysis.cloud_position;
  let cloudSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (cloud === 'above') cloudSignal = 'bullish';
  else if (cloud === 'below') cloudSignal = 'bearish';

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <SectionHeader
        icon={<BarChart3 className="w-5 h-5" />}
        title={String(t('techIndicators' as any))}
        subtitle={String(t('techIndicatorsDesc' as any))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IndicatorCard
          title={String(t('htfTrendTitle' as any))}
          value={htfText}
          explanation={String(t('htfTrendDesc' as any))}
          signal={htfSignal}
          icon={<CalendarDays className="w-4 h-4" />}
        />

        <IndicatorCard
          title={String(t('stTitle' as any))}
          value={stSignal === 'bullish' ? String(t('buy' as any)).toUpperCase() : stSignal === 'bearish' ? String(t('sell' as any)).toUpperCase() : String(t('neutral' as any))}
          explanation={String(t('stDesc' as any))}
          signal={stSignal}
          icon={<TrendingUp className="w-4 h-4" />}
        />

        <IndicatorCard
          title={String(t('rsiTitle' as any)).replace('{value}', rsi.toFixed(0))}
          value={rsiSignal === 'bullish' ? 'Sobrevenda' : rsiSignal === 'bearish' ? 'Sobrecompra' : String(t('neutral' as any))}
          explanation={String(t('rsiDesc2' as any))}
          signal={rsiSignal}
          icon={<Gauge className="w-4 h-4" />}
        />

        <IndicatorCard
          title={String(t('macdTitle' as any))}
          value={macdSignal === 'bullish' ? 'Positivo' : macdSignal === 'bearish' ? 'Negativo' : String(t('neutral' as any))}
          explanation={String(t('macdDesc2' as any))}
          signal={macdSignal}
          icon={<Activity className="w-4 h-4" />}
        />

        <IndicatorCard
          title={String(t('ichimokuTitle' as any))}
          value={cloud === 'above' ? 'Acima (Alta)' : cloud === 'below' ? 'Abaixo (Baixa)' : 'Dentro (' + String(t('neutral' as any)) + ')'}
          explanation={String(t('ichimokuDesc' as any))}
          signal={cloudSignal}
          icon={<Layers className="w-4 h-4" />}
        />

        <IndicatorCard
          title={String(t('adxTitle' as any))}
          value={(analysis.adx || 0).toFixed(1)}
          explanation={String(t('adxDesc' as any))}
          signal={(analysis.adx || 0) > 20 ? 'bullish' : 'neutral'} // Actually neutral/bullish depends on trend direction, simplified here
          icon={<Zap className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};

const StrategicAnalysis: React.FC<StrategicAnalysisProps> = ({ analysis, onRefresh }) => {
  const { t } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    if (analysis?.ticker && onRefresh) {
      handleRefresh();
    }
  }, [analysis?.ticker]);

  const handleRefresh = async () => {
    if (!analysis?.ticker || !onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh(analysis.ticker);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing analysis:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastUpdate = () => {
    if (!analysis?.updated_at) return '-';
    // Use the latest of analysis.updated_at or lastRefresh (local)
    // Actually analysis object should update after refresh
    const date = new Date(analysis.updated_at);
    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  if (!analysis) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          {t('selectTokenDetailed' as any)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MainVerdict analysis={analysis} />

      {/* New: Scores for Parity */}
      <ScoreDisplay
        buyScore={analysis.buy_score || 0}
        sellScore={analysis.sell_score || 0}
      />

      <TradePlan analysis={analysis} />
      <TechnicalIndicators analysis={analysis} />

      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
        <span>{String(t('lastUpdate' as any)).replace('{time}', formatLastUpdate())}</span>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all',
            'hover:bg-muted text-muted-foreground hover:text-foreground',
            isRefreshing && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isRefreshing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          {isRefreshing ? String(t('updating' as any)) : String(t('refresh' as any))}
        </button>
      </div>
    </div>
  );
};

export default StrategicAnalysis;
