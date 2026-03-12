/**
 * GemPage - Token Detail Page
 * Beautiful, auto-updating token details with news and quick access to Trade Master
 */

import React, { useEffect, useState, useMemo } from 'react';
import { ExchangeFloatingBar } from '@/components/ExchangeReferral';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Clock,
  TrendingUp,
  TrendingDown,
  Newspaper,
  Info,
  Zap,
  Shield,
  Target,
  ExternalLink,
  Wifi,
  Loader2,
  Globe,
  ChevronRight,
  Bot,
  Sparkles,
  Lock,
  Unlock,
  FileText,
  Copy,
  Share2,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Minus,
  LogIn,
  ShieldAlert,
  Scale,
  Coins
} from 'lucide-react';
import { TradeButton } from '@/components/common/TradeButton';
import { cn } from '@/lib/utils';
import { fetchTokenMarketData } from '@/lib/coinGeckoService';
import { useRealtimePrices } from '@/lib/realtimeService';
import CryptoLogo from '@/components/swing/CryptoLogo';
import { useCreditGuard } from '@/hooks/useCreditGuard';
import { UpgradeModal } from '@/components/monetization';
import { toast } from '@/components/ui/use-toast';
import { useAlerts } from '@/contexts/AlertContext';
import { AlertModal } from '@/components/alerts/AlertModal';
import { calculateRSI, calculateBollingerBands, calculateSMA, calculateSupportResistance } from '@/lib/indicators';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SwingDashboard from '@/components/swing/SwingDashboard';
import { SwingAnalysis } from '@/hooks/useSwingAnalysis';
import { analyzeToken } from '@/lib/swingAnalysisService';
import { jsPDF } from 'jspdf';

interface AIAnalysis {
  summary: {
    situation: string;
    recommendation: string;
    score: number;
    risk_level: string;
  };
  market_context?: {
    fear_greed: { value: number; label: string };
    btc_dominance: string;
    total_market_cap: string;
    market_cap_change_24h: string;
    btc_price: number;
    btc_change_24h: number;
    eth_price: number;
    eth_change_24h: number;
    market_sentiment?: string;
  };
  news?: {
    title: string;
    source: string;
    impact: string;
    sentiment: string;
    summary: string;
  }[];
  analysis_1h: TimeframeAnalysis;
  analysis_4h: TimeframeAnalysis;
  analysis_daily: TimeframeAnalysis;
  multi_timeframe: {
    alignment: string;
    dominant_timeframe: string;
    confluence_setup?: string;
  };
  key_levels?: {
    supports: { price: number; label: string; description: string; distance_pct?: number }[];
    resistances: { price: number; label: string; description: string; distance_pct?: number }[];
  };
  scenarios: {
    bullish: Scenario;
    bearish: Scenario;
    neutral: Scenario;
  };
  setup: TradeSetup;
  risk_management?: {
    rules: string[];
    contingencies?: { scenario: string; action: string }[];
  };
  disclaimers?: {
    risks: string[];
    uncertainties: string[];
  };
}

interface TimeframeAnalysis {
  trend: string;
  indicators_interpretation: string;
  patterns?: string[];
  conclusion: string;
}

interface Scenario {
  probability: number;
  description: string;
  triggers?: string[];
  targets?: string[];
  timeframe?: string;
  invalidation?: string;
}

interface TradeSetup {
  direction: string;
  entry_zone: string;
  stop_loss: number | string;
  take_profit: (number | string)[];
  risk_reward: string;
  position_size?: string;
  validation: string;
}

interface TokenAnalysis {
  ticker: string;
  ai_analysis: AIAnalysis;
  last_ai_update: string | null;
}

const GemPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { checkAndUse, creditsAvailable, isVip, guardModals } = useCreditGuard();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [token, setToken] = useState<Token | null>(null);
  const [analysis, setAnalysis] = useState<TokenAnalysis | null>(null);
  const [tradeAnalysis, setTradeAnalysis] = useState<SwingAnalysis | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Real-time price
  const { prices, isConnected } = useRealtimePrices(token ? [token.ticker] : []);

  // Get real-time price or fallback to stored
  const currentPrice = useMemo(() => {
    if (!token) return null;
    const realtime = prices.get(token.ticker.toUpperCase());
    return realtime?.price || token.current_price;
  }, [token, prices]);

  const currentChange = useMemo(() => {
    if (!token) return null;
    const realtime = prices.get(token.ticker.toUpperCase());
    return realtime?.change24h || token.change_24h;
  }, [token, prices]);

  // Fetch token data
  useEffect(() => {
    if (id) fetchToken();
    if (searchParams.get('refresh')) setSearchParams({}, { replace: true });
  }, [id, searchParams]);

  const fetchToken = async () => {
    try {
      const { data, error } = await supabase.from('tokens').select('*').eq('id', id).single();
      if (error) throw error;
      setToken(data);

      if (data?.ticker) {
        await fetchAnalysis(data.ticker);
        await fetchTradeAnalysis(data.ticker);
        fetchMarketDataSilent(data.ticker);
        fetchNews(data.ticker);
      }
    } catch (error) {
      navigate('/radar');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async (ticker: string) => {
    const { data: analysisData, error } = await supabase
      .from('token_analysis')
      .select('*')
      .eq('ticker', ticker)
      .order('last_ai_update', { ascending: false })
      .maybeSingle();

    if (analysisData) {
      // Freshness Check (4 hours)
      const lastUpdate = new Date(analysisData.last_ai_update);
      const now = new Date();
      const diffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

      if (diffHours < 4) {
        setAnalysis(analysisData as unknown as TokenAnalysis);
      } else {
        console.log("Analysis stale (>4h), requiring refresh.");
        setAnalysis(null); // Force user to regenerate
      }
    }
  };

  // Fetch Trade Master technical analysis from DB
  const fetchTradeAnalysis = async (ticker: string) => {
    const { data, error } = await supabase
      .from('token_analysis')
      .select('*')
      .eq('ticker', ticker)
      .eq('timeframe', '4h')
      .maybeSingle();

    if (data) {
      setTradeAnalysis(data as unknown as SwingAnalysis);

      // Auto-refresh if data is more than 30 minutes old
      const updatedAt = data.updated_at ? new Date(data.updated_at) : null;
      const diffMin = updatedAt ? (Date.now() - updatedAt.getTime()) / (1000 * 60) : 999;
      if (diffMin > 30) {
        console.log(`[GemPage] Trade analysis stale (${Math.round(diffMin)}min), refreshing...`);
        try {
          const fresh = await analyzeToken(ticker, '4h', token?.change_24h);
          // Save to DB
          await supabase.from('token_analysis').upsert({
            ticker: fresh.ticker, timeframe: fresh.timeframe,
            ema_21: fresh.ema21, ema_50: fresh.ema50, ema_100: fresh.ema100, ema_200: fresh.ema200,
            adx: fresh.adx, di_plus: fresh.diPlus, di_minus: fresh.diMinus,
            supertrend_value: fresh.supertrendValue, supertrend_direction: fresh.supertrendDirection,
            rsi: fresh.rsi, stoch_k: fresh.stochK, stoch_d: fresh.stochD,
            macd_line: fresh.macdLine, macd_signal: fresh.macdSignal, macd_histogram: fresh.macdHistogram,
            tenkan: fresh.tenkan, kijun: fresh.kijun, senkou_a: fresh.senkouA, senkou_b: fresh.senkouB,
            cloud_position: fresh.cloudPosition,
            volume_ratio: fresh.volumeRatio, buy_pressure: fresh.buyPressure,
            key_support: fresh.keySupport, key_resistance: fresh.keyResistance,
            fib_236: fresh.fib236, fib_382: fresh.fib382, fib_500: fresh.fib500,
            fib_618: fresh.fib618, fib_786: fresh.fib786, fib_zone: fresh.fibZone,
            buy_score: fresh.buyScore, sell_score: fresh.sellScore, signal: fresh.signal,
            stop_loss: fresh.stopLoss, take_profit: fresh.takeProfit, risk_reward: fresh.riskReward,
            atr: fresh.atr, patterns_detected: fresh.patternsDetected,
            htf_trend: fresh.htfTrend, mtf_trend: fresh.mtfTrend,
            current_price: fresh.currentPrice, change_24h: fresh.change24h,
          }, { onConflict: 'ticker,timeframe' });

          // Re-fetch to get the updated data with all DB columns
          const { data: refreshed } = await supabase
            .from('token_analysis').select('*')
            .eq('ticker', ticker).eq('timeframe', '4h').maybeSingle();
          if (refreshed) setTradeAnalysis(refreshed as unknown as SwingAnalysis);
        } catch (err) {
          console.error('[GemPage] Auto-refresh failed:', err);
        }
      }
    } else if (!error) {
      // No analysis exists, trigger one
      console.log(`[GemPage] No analysis found for ${ticker}, creating...`);
      try {
        const fresh = await analyzeToken(ticker, '4h');
        await supabase.from('token_analysis').upsert({
          ticker: fresh.ticker, timeframe: fresh.timeframe,
          adx: fresh.adx, di_plus: fresh.diPlus, di_minus: fresh.diMinus,
          rsi: fresh.rsi, buy_score: fresh.buyScore, sell_score: fresh.sellScore,
          signal: fresh.signal, current_price: fresh.currentPrice, change_24h: fresh.change24h,
          supertrend_value: fresh.supertrendValue, supertrend_direction: fresh.supertrendDirection,
          macd_line: fresh.macdLine, macd_signal: fresh.macdSignal, macd_histogram: fresh.macdHistogram,
          ema_21: fresh.ema21, ema_50: fresh.ema50, ema_100: fresh.ema100, ema_200: fresh.ema200,
          tenkan: fresh.tenkan, kijun: fresh.kijun, senkou_a: fresh.senkouA, senkou_b: fresh.senkouB,
          cloud_position: fresh.cloudPosition, volume_ratio: fresh.volumeRatio, buy_pressure: fresh.buyPressure,
          key_support: fresh.keySupport, key_resistance: fresh.keyResistance,
          fib_236: fresh.fib236, fib_382: fresh.fib382, fib_500: fresh.fib500,
          fib_618: fresh.fib618, fib_786: fresh.fib786, fib_zone: fresh.fibZone,
          stop_loss: fresh.stopLoss, take_profit: fresh.takeProfit, risk_reward: fresh.riskReward,
          atr: fresh.atr, patterns_detected: fresh.patternsDetected,
          htf_trend: fresh.htfTrend, mtf_trend: fresh.mtfTrend,
          stoch_k: fresh.stochK, stoch_d: fresh.stochD,
        }, { onConflict: 'ticker,timeframe' });
        const { data: newData } = await supabase
          .from('token_analysis').select('*')
          .eq('ticker', ticker).eq('timeframe', '4h').maybeSingle();
        if (newData) setTradeAnalysis(newData as unknown as SwingAnalysis);
      } catch (err) {
        console.error('[GemPage] Initial analysis failed:', err);
      }
    }
  };

  // ... (fetchMarketDataSilent and fetchNews omitted for brevity, keeping existing logic if not changed)
  const fetchMarketDataSilent = async (ticker: string) => {
    try {
      const marketData = await fetchTokenMarketData(ticker);
      if (marketData) {
        setToken(prev => prev ? { ...prev, ...marketData } : null);
      }
    } catch (error) { console.error(error); }
  };

  const fetchNews = async (ticker: string) => {
    setLoadingNews(true);
    try {
      // Fetch news from our edge function wrapper (avoids CORS)
      const { data, error } = await supabase.functions.invoke('crypto-news', {
        body: { ticker }
      });

      if (error) {
        console.error('Error fetching news:', error);
        return;
      }

      if (data && data.results) {
        const formattedNews = data.results.slice(0, 5).map((item: { title: string, url: string, domain: string, created_at: string, votes: { positive: number, negative: number } }) => ({
          title: item.title,
          url: item.url,
          source: item.domain || 'CryptoPanic',
          time: new Date(item.created_at).toLocaleDateString(),
          sentiment: item.votes?.positive > item.votes?.negative ? 'bullish' :
            item.votes?.negative > item.votes?.positive ? 'bearish' : 'neutral'
        }));
        setNews(formattedNews);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  };


  const handleAnalyze = async () => {
    if (!token) return;

    // Check credits BEFORE calling Edge Function (VIP bypass)
    if (!isVip) {
      const canProceed = await checkAndUse('trade_master_analysis');
      if (!canProceed) {
        // useCreditGuard already shows the upgrade modal
        return;
      }
    }

    setAnalyzing(true);
    toast({
      title: "Iniciando Análise Avançada 🧠",
      description: "A IA está processando 3 timeframes e calculando indicadores complexos. Aguarde...",
    });

    try {
      // Invoke AI (Backend handles data fetching and credit deduction)
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('analyze-token-ai', {
        body: { ticker: token.ticker }
      });

      // Handle edge function errors with better detail
      if (aiError) {
        // Handle 402 error from backend (double-check)
        if (aiError.message?.includes('402') || aiError.message?.includes('Créditos insuficientes')) {
          toast({
            title: '💳 Créditos Insuficientes',
            description: 'Você precisa de 1 crédito para gerar análise',
            variant: 'destructive',
          });
          return;
        }

        let errorMessage = aiError.message || 'Erro desconhecido';

        // Try to extract the actual error from the response context
        if ('context' in aiError && aiError.context) {
          try {
            const ctx = aiError.context as Response;
            const body = await ctx.json();
            errorMessage = body?.error || body?.message || errorMessage;
          } catch {
            // If we can't parse context, use the original message
          }
        }

        throw new Error(errorMessage);
      }

      if (!aiResponse?.analysis) throw new Error("Falha ao gerar análise. O servidor retornou resposta vazia.");

      // Update State
      const newAnalysis = {
        ticker: token.ticker,
        ai_analysis: aiResponse.analysis,
        last_ai_update: new Date().toISOString()
      };

      setAnalysis(newAnalysis as TokenAnalysis);
      queryClient.invalidateQueries({ queryKey: ['gem', id] });

      toast({
        title: "Análise Concluída! ✨",
        description: "Relatório profissional gerado com sucesso.",
        className: "bg-green-500 text-white border-none"
      });

    } catch (error: unknown) {
      console.error("Analysis Failed:", error);

      const err = error as any;
      const errorMsg = err.message || "Tente novamente mais tarde.";
      const isServerError = errorMsg.includes('non-2xx') || errorMsg.includes('Edge Function');

      toast({
        title: "Erro na Análise ❌",
        description: isServerError
          ? "O servidor de análise está temporariamente indisponível. Verifique se a API key está configurada ou tente novamente."
          : errorMsg,
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <Skeleton className="h-96 w-full" />;
  if (!token) return null;

  const ai = analysis?.ai_analysis;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <CryptoLogo symbol={token.ticker} size={32} className="w-8 h-8" />
            {token.name} <span className="text-muted-foreground text-lg sm:text-xl">({token.ticker})</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-2xl font-mono font-bold flex items-center gap-2">
              {currentPrice ? `$${currentPrice.toLocaleString()}` : '---'}
              {isConnected && (
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" title="Live" />
              )}
            </span>
            <span className={cn("flex items-center px-2 py-1 rounded text-sm font-bold",
              (currentChange || 0) >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
              {(currentChange || 0) >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {currentChange?.toFixed(2)}%
            </span>
            {ai && (
              <Badge variant="outline" className={cn("ml-2",
                ai.summary.score >= 70 ? "border-green-500 text-green-500" :
                  ai.summary.score >= 40 ? "border-yellow-500 text-yellow-500" : "border-red-500 text-red-500")}>
                Score: {ai.summary.score}/100
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons — Stacked vertically on mobile, side by side on desktop */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          onClick={() => setShowAlertModal(true)}
          className="gap-2 border-amber-500/50 hover:bg-amber-500/10 text-amber-400 w-full sm:w-auto"
        >
          <Bell className="w-4 h-4" />
          Criar Alerta
        </Button>

        {!ai && (
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || (!isVip && creditsAvailable < 1)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 w-full sm:w-auto"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analisando...
              </>
            ) : (!isVip && creditsAvailable < 1) ? (
              <>
                <Coins className="w-4 h-4" />
                Sem créditos
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {isVip ? "Gerar Análise" : "Gerar Análise (1)"}
              </>
            )}
          </Button>
        )}
        {ai && (
          <Button
            variant="outline"
            onClick={handleAnalyze}
            disabled={analyzing || (!isVip && creditsAvailable < 1)}
            className="gap-2 disabled:opacity-50 w-full sm:w-auto"
          >
            <RefreshCw className={cn("w-4 h-4", analyzing && "animate-spin")} />
            {(!isVip && creditsAvailable < 1) ? "Sem créditos" : isVip ? "Gerar Nova" : "Gerar Nova (1)"}
          </Button>
        )}
      </div>

      {/* TRADE MASTER - Technical Indicators Dashboard */}
      <SwingDashboard
        analysis={tradeAnalysis}
        onAnalysisUpdate={(updated) => setTradeAnalysis(updated)}
        realtimePrice={currentPrice}
        realtimeChange={currentChange}
      />

      {!ai ? (
        <Card className="border-dashed border-2 min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-muted/5">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes bot-analyzing {
              0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
              25% { transform: translateY(-12px) scale(1.05); opacity: 0.8; }
              50% { transform: translateY(0) scale(1.1); opacity: 1; }
              75% { transform: translateY(-6px) scale(1.05); opacity: 0.8; }
            }
          `}} />
          <Bot 
            className={cn(
              "w-16 h-16 mb-4", 
              analyzing 
                ? "text-blue-400 animate-[bot-analyzing_1.5s_ease-in-out_infinite]" 
                : "text-muted-foreground opacity-20"
            )} 
          />
          <h3 className="text-xl font-semibold mb-2">
            {analyzing ? 'Analisando com IA...' : 'Análise Profunda com IA'}
          </h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {analyzing 
              ? 'Processando 3 timeframes e calculando indicadores complexos. Aguarde...'
              : 'Descubra tendências, setups de trade e cenários probabilísticos analisados em 3 timeframes (1H, 4H, Diário) pelo nosso motor avançado.'
            }
          </p>
          {!analyzing && (
            <Button onClick={handleAnalyze} disabled={analyzing}>
              Desbloquear Insights (1 Crédito)
            </Button>
          )}
          {analyzing && (
            <div className="flex items-center gap-2 text-blue-400 font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando...
            </div>
          )}
        </Card>
      ) : (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="flex w-full overflow-x-auto no-scrollbar mb-8 gap-1">
            <TabsTrigger value="summary" className="shrink-0">Resumo</TabsTrigger>
            <TabsTrigger value="1h" className="shrink-0">1H</TabsTrigger>
            <TabsTrigger value="4h" className="shrink-0">4H</TabsTrigger>
            <TabsTrigger value="daily" className="shrink-0">Diário</TabsTrigger>
            <TabsTrigger value="scenarios" className="shrink-0">Cenários</TabsTrigger>
            <TabsTrigger value="setup" className="shrink-0">Setup</TabsTrigger>
            <TabsTrigger value="news" className="shrink-0">Notícias</TabsTrigger>
          </TabsList>

          {/* SUMMARY TAB */}
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border-l-4 border-l-primary">
                <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Resumo Executivo</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">{ai.summary.situation}</p>
                  <Separator className="my-4" />
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-semibold text-primary mb-1">Recomendação:</p>
                    <p>{ai.summary.recommendation}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Score Técnico</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold mb-2 text-center" style={{ color: ai.summary.score >= 70 ? '#4ade80' : ai.summary.score >= 40 ? '#facc15' : '#f87171' }}>
                      {ai.summary.score}
                    </div>
                    <p className="text-center text-muted-foreground text-sm">de 100</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Nível de Risco</CardTitle></CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <Badge variant={ai.summary.risk_level === 'Alto' ? 'destructive' : ai.summary.risk_level === 'Baixo' ? 'secondary' : 'default'} className="text-lg py-1 px-4">
                      {ai.summary.risk_level}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader><CardTitle>Alinhamento Temporal</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-muted/30 p-4 rounded-lg">
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase mb-1">1 Hora</p>
                      <Badge variant="outline">{ai.analysis_1h.trend}</Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase mb-1">4 Horas</p>
                      <Badge variant="outline">{ai.analysis_4h.trend}</Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase mb-1">Diário</p>
                      <Badge variant="outline">{ai.analysis_daily.trend}</Badge>
                    </div>
                  </div>
                  <div className="flex-1 md:text-right">
                    <p className="text-sm text-muted-foreground">{ai.multi_timeframe.alignment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MACRO CONTEXT STRIP */}
            {ai.market_context && (
              <Card className="border-amber-500/20">
                <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Contexto Macro</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground uppercase mb-1">Fear & Greed</p>
                      <p className={cn("text-2xl font-mono font-bold", ai.market_context.fear_greed.value <= 25 ? "text-red-500" : ai.market_context.fear_greed.value >= 75 ? "text-green-500" : "text-yellow-500")}>
                        {ai.market_context.fear_greed.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{ai.market_context.fear_greed.label}</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground uppercase mb-1">Dom. BTC</p>
                      <p className="text-lg font-mono font-bold">{ai.market_context.btc_dominance}</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground uppercase mb-1">Market Cap</p>
                      <p className="text-lg font-mono font-bold">{ai.market_context.total_market_cap}</p>
                      <p className={cn("text-xs font-mono", parseFloat(ai.market_context.market_cap_change_24h) >= 0 ? "text-green-500" : "text-red-500")}>{ai.market_context.market_cap_change_24h}</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground uppercase mb-1">Bitcoin</p>
                      <p className="text-lg font-mono font-bold">${ai.market_context.btc_price?.toLocaleString()}</p>
                      <p className={cn("text-xs font-mono", ai.market_context.btc_change_24h >= 0 ? "text-green-500" : "text-red-500")}>{ai.market_context.btc_change_24h?.toFixed(2)}%</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground uppercase mb-1">Ethereum</p>
                      <p className="text-lg font-mono font-bold">${ai.market_context.eth_price?.toLocaleString()}</p>
                      <p className={cn("text-xs font-mono", ai.market_context.eth_change_24h >= 0 ? "text-green-500" : "text-red-500")}>{ai.market_context.eth_change_24h?.toFixed(2)}%</p>
                    </div>
                  </div>
                  {ai.market_context.market_sentiment && (
                    <p className="text-sm text-muted-foreground mt-4 italic">{ai.market_context.market_sentiment}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* TIMEFRAME TABS (Reusable Layout) */}
          {['1h', '4h', 'daily'].map((tf) => {
            const data = tf === '1h' ? ai.analysis_1h : tf === '4h' ? ai.analysis_4h : ai.analysis_daily;
            return (
              <TabsContent key={tf} value={tf} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      Análise {tf.toUpperCase()}
                      <Badge>{data.trend}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Indicadores</h4>
                      <p className="text-muted-foreground whitespace-pre-line">{data.indicators_interpretation}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2"><Target className="w-4 h-4" /> Conclusão</h4>
                      <p className="text-muted-foreground">{data.conclusion}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}

          {/* SCENARIOS TAB */}
          <TabsContent value="scenarios" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bullish Scenario */}
              <Card className="border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors">
                <CardHeader>
                  <CardTitle className="text-green-500 flex justify-between items-center text-lg">
                    <span>🐂 Bullish</span>
                    <Badge variant="outline" className="text-green-500 border-green-500 bg-green-500/10 text-base px-3 py-1">
                      {ai.scenarios.bullish.probability}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm font-medium leading-relaxed">{ai.scenarios.bullish.description}</p>

                  {ai.scenarios.bullish.triggers && (
                    <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1"><Zap className="w-3 h-3" /> Gatilhos</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        {ai.scenarios.bullish.triggers.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}

                  {ai.scenarios.bullish.targets && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1"><Target className="w-3 h-3" /> Alvos</p>
                      <div className="grid grid-cols-2 gap-2">
                        {ai.scenarios.bullish.targets.map((t, i) => (
                          <Badge key={i} variant="secondary" className="justify-center font-mono py-1">🎯 {t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {ai.scenarios.bullish.invalidation && (
                    <div className="text-xs text-red-400 bg-red-500/5 p-2 rounded border border-red-500/10 flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>Invalidação: {ai.scenarios.bullish.invalidation}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bearish Scenario */}
              <Card className="border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors">
                <CardHeader>
                  <CardTitle className="text-red-500 flex justify-between items-center text-lg">
                    <span>🐻 Bearish</span>
                    <Badge variant="outline" className="text-red-500 border-red-500 bg-red-500/10 text-base px-3 py-1">
                      {ai.scenarios.bearish.probability}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm font-medium leading-relaxed">{ai.scenarios.bearish.description}</p>

                  {ai.scenarios.bearish.triggers && (
                    <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1"><Zap className="w-3 h-3" /> Gatilhos</p>
                      <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        {ai.scenarios.bearish.triggers.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}

                  {ai.scenarios.bearish.targets && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1"><Target className="w-3 h-3" /> Alvos</p>
                      <div className="grid grid-cols-2 gap-2">
                        {ai.scenarios.bearish.targets.map((t, i) => (
                          <Badge key={i} variant="secondary" className="justify-center font-mono py-1">🎯 {t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {ai.scenarios.bearish.invalidation && (
                    <div className="text-xs text-green-400 bg-green-500/5 p-2 rounded border border-green-500/10 flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>Invalidação: {ai.scenarios.bearish.invalidation}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Neutral Scenario */}
              <Card className="border-gray-500/20 bg-gray-500/5 hover:bg-gray-500/10 transition-colors">
                <CardHeader>
                  <CardTitle className="text-gray-400 flex justify-between items-center text-lg">
                    <span>⚖️ Neutro</span>
                    <Badge variant="outline" className="text-gray-400 border-gray-400 bg-gray-500/10 text-base px-3 py-1">
                      {ai.scenarios.neutral.probability}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium leading-relaxed">{ai.scenarios.neutral.description}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SETUP TAB */}
          <TabsContent value="setup" className="space-y-6">
            <Card className="overflow-hidden border-2 border-primary/20">
              <div className={cn("p-6 text-center font-bold text-2xl tracking-widest text-white flex items-center justify-center gap-4",
                ai.setup.direction === 'LONG' ? 'bg-green-600' : ai.setup.direction === 'SHORT' ? 'bg-red-600' : 'bg-gray-600')}>
                {ai.setup.direction === 'LONG' ? <TrendingUp className="w-8 h-8" /> : ai.setup.direction === 'SHORT' ? <TrendingDown className="w-8 h-8" /> : <Minus className="w-8 h-8" />}
                SETUP {ai.setup.direction}
              </div>
              <CardContent className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="bg-background/50 p-4 rounded-xl border border-border/50">
                    <label className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-2 mb-2"><LogIn className="w-4 h-4" /> Zona de Entrada</label>
                    <div className="text-3xl font-mono font-bold text-primary">{ai.setup.entry_zone}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                      <label className="text-xs text-red-500 uppercase font-bold flex items-center gap-2 mb-2"><ShieldAlert className="w-4 h-4" /> Stop Loss</label>
                      <div className="text-xl font-mono text-red-400 font-bold">{ai.setup.stop_loss}</div>
                    </div>
                    <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                      <label className="text-xs text-blue-500 uppercase font-bold flex items-center gap-2 mb-2"><Scale className="w-4 h-4" /> Risco/Retorno</label>
                      <div className="text-xl font-mono text-blue-400 font-bold">{ai.setup.risk_reward}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase font-bold">Stop Loss</label>
                    <div className="text-2xl font-mono text-red-500">${ai.setup.stop_loss}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase font-bold">Take Profit (Alvos)</label>
                    <div className="space-y-2 mt-1">
                      {ai.setup.take_profit.map((tp, i) => (
                        <div key={i} className="flex justify-between items-center bg-muted p-2 rounded">
                          <span className="text-sm">TP {i + 1}</span>
                          <span className="font-mono text-green-500 font-bold">${tp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase font-bold">Risco:Retorno</label>
                      <div className="text-lg font-mono">{ai.setup.risk_reward}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="bg-muted/30 p-4 text-sm text-muted-foreground italic border-t">
                <span className="font-bold not-italic">Validação: </span> {ai.setup.validation}
              </div>
            </Card>

            {/* KEY LEVELS */}
            {ai.key_levels && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-500/20">
                  <CardHeader><CardTitle className="text-green-500 text-base">📗 Suportes Chave</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {ai.key_levels.supports?.map((lvl, i) => (
                      <div key={i} className="flex justify-between items-center bg-green-500/5 p-3 rounded-lg border border-green-500/10">
                        <div>
                          <Badge variant="outline" className="text-green-500 border-green-500/30 text-xs mb-1">{lvl.label}</Badge>
                          <p className="text-xs text-muted-foreground">{lvl.description}</p>
                        </div>
                        <span className="text-lg font-mono font-bold text-green-500">${typeof lvl.price === 'number' ? lvl.price.toLocaleString() : lvl.price}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-red-500/20">
                  <CardHeader><CardTitle className="text-red-500 text-base">📕 Resistências Chave</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {ai.key_levels.resistances?.map((lvl, i) => (
                      <div key={i} className="flex justify-between items-center bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                        <div>
                          <Badge variant="outline" className="text-red-500 border-red-500/30 text-xs mb-1">{lvl.label}</Badge>
                          <p className="text-xs text-muted-foreground">{lvl.description}</p>
                        </div>
                        <span className="text-lg font-mono font-bold text-red-500">${typeof lvl.price === 'number' ? lvl.price.toLocaleString() : lvl.price}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* RISK MANAGEMENT */}
            {ai.risk_management && (
              <Card className="border-amber-500/20">
                <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-amber-500" /> Gestão de Risco</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ai.risk_management.rules.map((rule, i) => (
                      <div key={i} className="flex gap-3 items-start bg-muted/30 p-3 rounded-lg">
                        <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded shrink-0">{i + 1}</span>
                        <p className="text-sm">{rule.replace(/^\d+\.\s*/, '')}</p>
                      </div>
                    ))}
                  </div>
                  {ai.risk_management.contingencies && ai.risk_management.contingencies.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Contingências</h4>
                      {ai.risk_management.contingencies.map((c, i) => (
                        <div key={i} className="bg-red-500/5 border border-red-500/10 p-3 rounded-lg mb-2">
                          <p className="text-sm font-semibold text-red-400">Se: {c.scenario}</p>
                          <p className="text-sm text-muted-foreground">→ {c.action}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-2 flex-wrap">
              <Button variant="outline"><Copy className="w-4 h-4 mr-2" /> Copiar Setup</Button>
              <Button variant="outline"><Share2 className="w-4 h-4 mr-2" /> Compartilhar</Button>
              <Button 
                variant="outline"
                onClick={() => {
                  if (!ai || !token) return;
                  try {
                    const doc = new jsPDF();
                    const margin = 15;
                    let y = 20;
                    const pageW = doc.internal.pageSize.getWidth() - margin * 2;

                    const addText = (text: string, size: number = 10, isBold: boolean = false) => {
                      doc.setFontSize(size);
                      if (isBold) doc.setFont('helvetica', 'bold');
                      else doc.setFont('helvetica', 'normal');
                      const lines = doc.splitTextToSize(text, pageW);
                      for (const line of lines) {
                        if (y > 275) { doc.addPage(); y = 20; }
                        doc.text(line, margin, y);
                        y += size * 0.5;
                      }
                      y += 3;
                    };

                    const addSeparator = () => { y += 4; doc.setDrawColor(200); doc.line(margin, y, margin + pageW, y); y += 6; };

                    // Header
                    addText(`Analise Completa - ${token.name} (${token.ticker})`, 16, true);
                    addText(`Score: ${ai.summary.score}/100 | Risco: ${ai.summary.risk_level}`, 11, false);
                    addText(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 9);
                    addSeparator();

                    // Summary
                    addText('RESUMO EXECUTIVO', 13, true);
                    addText(ai.summary.situation);
                    addText(`Recomendacao: ${ai.summary.recommendation}`, 10, true);
                    addSeparator();

                    // Timeframes
                    ['1h', '4h', 'daily'].forEach(tf => {
                      const data = tf === '1h' ? ai.analysis_1h : tf === '4h' ? ai.analysis_4h : ai.analysis_daily;
                      addText(`ANALISE ${tf.toUpperCase()} - ${data.trend}`, 12, true);
                      addText(data.indicators_interpretation);
                      addText(`Conclusao: ${data.conclusion}`);
                      addSeparator();
                    });

                    // Scenarios
                    addText('CENARIOS', 13, true);
                    addText(`Bullish (${ai.scenarios.bullish.probability}%): ${ai.scenarios.bullish.description}`);
                    addText(`Bearish (${ai.scenarios.bearish.probability}%): ${ai.scenarios.bearish.description}`);
                    addText(`Neutro (${ai.scenarios.neutral.probability}%): ${ai.scenarios.neutral.description}`);
                    addSeparator();

                    // Setup
                    addText('SETUP DE TRADE', 13, true);
                    addText(`Direcao: ${ai.setup.direction}`);
                    addText(`Entrada: ${ai.setup.entry_zone}`);
                    addText(`Stop Loss: ${ai.setup.stop_loss}`);
                    addText(`Take Profit: ${ai.setup.take_profit.join(', ')}`);
                    addText(`Risco/Retorno: ${ai.setup.risk_reward}`);
                    addText(`Validacao: ${ai.setup.validation}`);

                    doc.save(`analise_${token.ticker}_${new Date().toISOString().slice(0,10)}.pdf`);
                    toast({ title: 'PDF gerado com sucesso! 📄', description: 'O download iniciou automaticamente.' });
                  } catch (err) {
                    console.error('PDF generation error:', err);
                    toast({ title: 'Erro ao gerar PDF', variant: 'destructive' });
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" /> Baixar PDF
              </Button>
            </div>
          </TabsContent>

          {/* NEWS TAB — Enhanced with AI-analyzed news */}
          <TabsContent value="news" className="space-y-4">
            {ai.news && ai.news.length > 0 ? (
              <div className="grid gap-4">
                {ai.news.map((item, i) => (
                  <Card key={i} className={cn("border-l-4", item.sentiment === 'bullish' ? 'border-l-green-500' : item.sentiment === 'bearish' ? 'border-l-red-500' : 'border-l-yellow-500')}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={cn("text-xs",
                              item.impact === 'HIGH' ? 'border-red-500 text-red-500' :
                                item.impact === 'MEDIUM' ? 'border-yellow-500 text-yellow-500' : 'border-gray-500 text-gray-500')}>
                              {item.impact === 'HIGH' ? '🔴 ALTO' : item.impact === 'MEDIUM' ? '🟡 MÉDIO' : '⚪ BAIXO'}
                            </Badge>
                            <Badge variant="outline" className={cn("text-xs",
                              item.sentiment === 'bullish' ? 'border-green-500 text-green-500' :
                                item.sentiment === 'bearish' ? 'border-red-500 text-red-500' : 'border-yellow-500 text-yellow-500')}>
                              {item.sentiment === 'bullish' ? '📈 Bullish' : item.sentiment === 'bearish' ? '📉 Bearish' : '⚖️ Neutro'}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-base mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.summary}</p>
                          <p className="text-xs text-muted-foreground mt-2">Fonte: {item.source}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 min-h-[200px] flex flex-col items-center justify-center p-8 text-center">
                <Newspaper className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-semibold mb-2">Sem notícias recentes</h3>
                <p className="text-muted-foreground">Nenhuma notícia significativa foi encontrada para este token nas últimas 48 horas.</p>
              </Card>
            )}

            {/* DISCLAIMERS */}
            {ai.disclaimers && (
              <Card className="bg-muted/10 border-dashed">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-2 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Avisos Importantes</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ai.disclaimers.risks && (
                      <div>
                        <p className="text-xs font-bold text-red-400 mb-1">Riscos:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          {ai.disclaimers.risks.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    )}
                    {ai.disclaimers.uncertainties && (
                      <div>
                        <p className="text-xs font-bold text-yellow-400 mb-1">Incertezas:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          {ai.disclaimers.uncertainties.map((u, i) => <li key={i}>{u}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

        </Tabs>
      )}

      {/* Credit Guard Modals */}
      {guardModals}

      {/* Alert Modal */}
      {token && currentPrice && (
        <AlertModal
          isOpen={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          ticker={token.ticker}
          currentPrice={currentPrice}
        />
      )}

      <ExchangeFloatingBar />
    </div>
  );
};

export default GemPage;
