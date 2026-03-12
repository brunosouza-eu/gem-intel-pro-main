import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ExchangeFloatingBar } from '@/components/ExchangeReferral';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { SwingAnalysis } from '@/hooks/useSwingAnalysis';
import { analyzeToken } from '@/lib/swingAnalysisService';
import SwingDashboard from '@/components/swing/SwingDashboard';
import StrategicAnalysis from '@/components/swing/StrategicAnalysis';
import CandlestickChart from '@/components/swing/CandlestickChart';
import FloatingGuru from '@/components/swing/FloatingGuru';
import TokenTable from '@/components/swing/TokenTable';
import { TradeMasterTutorial } from '@/components/swing/TradeMasterTutorial';
import { CreditWall } from '@/components/monetization/CreditWall';
import { Loader2, Zap, Wifi, WifiOff, HelpCircle, RefreshCw, Clock, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRealtimePrices } from '@/lib/realtimeService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateBtcContext } from '@/lib/tradingIntelligence';

const SwingAnalysisPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token');

  const [analyses, setAnalyses] = useState<SwingAnalysis[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string>(tokenFromUrl || 'BTC');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshingToken, setIsRefreshingToken] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState('');
  const [lastAnalysisUpdate, setLastAnalysisUpdate] = useState<Date | null>(null);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('');

  // Get all tickers for real-time prices
  const tickers = analyses.map(a => a.ticker);
  const { prices, isConnected } = useRealtimePrices(tickers);

  // Debounce ref for realtime updates
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate time since last update
  useEffect(() => {
    const updateTimer = () => {
      if (!lastAnalysisUpdate) {
        setTimeSinceUpdate('');
        return;
      }
      const diff = Math.floor((Date.now() - lastAnalysisUpdate.getTime()) / 1000);
      if (diff < 60) setTimeSinceUpdate(String(t('secondsAgo' as any)).replace('{time}', diff.toString()));
      else if (diff < 3600) {
        const min = Math.floor(diff / 60);
        setTimeSinceUpdate(String(t('minutesAgo' as any)).replace('{time}', min.toString()));
      } else {
        const hr = Math.floor(diff / 3600);
        setTimeSinceUpdate(String(t('hoursAgo' as any)).replace('{time}', hr.toString()));
      }
    };
    updateTimer();
    const timer = setInterval(updateTimer, 10000);
    return () => clearInterval(timer);
  }, [lastAnalysisUpdate, t]);

  // Merge analyses with real-time prices
  const analysesWithRealtimePrices = analyses.map(analysis => {
    const realtimeData = prices.get(analysis.ticker.toUpperCase());
    if (realtimeData) {
      return {
        ...analysis,
        current_price: realtimeData.price,
        change_24h: realtimeData.change24h,
      };
    }
    return analysis;
  });

  // Quick stats from analyses
  const quickStats = (() => {
    const buySignals = analyses.filter(a => a.signal?.includes('buy')).length;
    const sellSignals = analyses.filter(a => a.signal?.includes('sell')).length;
    const eliteSignals = analyses.filter(a => a.signal?.includes('elite')).length;
    return { buySignals, sellSignals, eliteSignals, total: analyses.length };
  })();

  // Smooth data merge - updates existing items without resetting state
  const mergeAnalyses = useCallback((newData: SwingAnalysis[]) => {
    setAnalyses(prev => {
      if (!prev.length) return newData;

      const existingMap = new Map(prev.map(item => [item.ticker, item]));

      return newData.map(newItem => {
        const existing = existingMap.get(newItem.ticker);
        if (existing && JSON.stringify(existing) === JSON.stringify(newItem)) {
          return existing;
        }
        return newItem;
      });
    });
  }, []);

  // Silent background refresh - no loading spinner
  const silentRefresh = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('token_analysis')
        .select('*')
        .order('buy_score', { ascending: false });

      if (error) throw error;

      mergeAnalyses((data || []) as unknown as SwingAnalysis[]);

      // Update timestamp from most recent analysis
      if (data && data.length > 0) {
        const mostRecent = data.reduce((latest, item) =>
          new Date(item.updated_at) > new Date(latest.updated_at) ? item : latest
        );
        setLastAnalysisUpdate(new Date(mostRecent.updated_at));
      }
    } catch (error) {
      console.error('Error in silent refresh:', error);
    }
  }, [mergeAnalyses]);

  // Initial fetch with loading state
  const initialFetch = useCallback(async () => {
    setIsInitialLoading(true);
    try {
      const { data, error } = await supabase
        .from('token_analysis')
        .select('*')
        .order('buy_score', { ascending: false });

      if (error) throw error;

      const analyses = (data || []) as unknown as SwingAnalysis[];
      setAnalyses(analyses);

      // Set last update timestamp
      if (analyses.length > 0) {
        const mostRecent = analyses.reduce((latest, item) =>
          new Date(item.updated_at) > new Date(latest.updated_at) ? item : latest
        );
        setLastAnalysisUpdate(new Date(mostRecent.updated_at));
      }

      // Auto-select first token if available
      if (analyses.length > 0 && !analyses.find(a => a.ticker === selectedTicker)) {
        setSelectedTicker(analyses[0].ticker);
      }
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [selectedTicker]);

  // Initial load
  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  // Debounced refresh for realtime updates
  const debouncedRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = setTimeout(() => {
      silentRefresh();
    }, 500);
  }, [silentRefresh]);

  // Subscribe to real-time database changes
  useEffect(() => {
    const channel = supabase
      .channel('token_analysis_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'token_analysis',
        },
        () => {
          debouncedRefresh();
        }
      )
      .subscribe();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [debouncedRefresh]);

  // Auto-refresh every 30 seconds - silent
  useEffect(() => {
    const interval = setInterval(silentRefresh, 30000);
    return () => clearInterval(interval);
  }, [silentRefresh]);

  const handleSelectToken = (ticker: string) => {
    setSelectedTicker(ticker);
  };

  // Refresh a single token's analysis
  const refreshSingleToken = useCallback(async (ticker: string) => {
    setIsRefreshingToken(true);
    try {
      console.log(`Refreshing analysis for ${ticker}...`);
      const analysis = await analyzeToken(ticker, '4h');

      // Build the local analysis object to apply immediately
      const now = new Date().toISOString();
      const localAnalysis: SwingAnalysis = {
        id: '',
        ticker: analysis.ticker,
        timeframe: analysis.timeframe,
        ema_21: analysis.ema21,
        ema_50: analysis.ema50,
        ema_100: analysis.ema100,
        ema_200: analysis.ema200,
        adx: analysis.adx,
        di_plus: analysis.diPlus,
        di_minus: analysis.diMinus,
        supertrend_value: analysis.supertrendValue,
        supertrend_direction: analysis.supertrendDirection,
        rsi: analysis.rsi,
        stoch_k: analysis.stochK,
        stoch_d: analysis.stochD,
        macd_line: analysis.macdLine,
        macd_signal: analysis.macdSignal,
        macd_histogram: analysis.macdHistogram,
        tenkan: analysis.tenkan,
        kijun: analysis.kijun,
        senkou_a: analysis.senkouA,
        senkou_b: analysis.senkouB,
        cloud_position: analysis.cloudPosition,
        volume_ratio: analysis.volumeRatio,
        buy_pressure: analysis.buyPressure,
        key_support: analysis.keySupport,
        key_resistance: analysis.keyResistance,
        fib_236: analysis.fib236,
        fib_382: analysis.fib382,
        fib_500: analysis.fib500,
        fib_618: analysis.fib618,
        fib_786: analysis.fib786,
        fib_zone: analysis.fibZone,
        buy_score: analysis.buyScore,
        sell_score: analysis.sellScore,
        signal: analysis.signal,
        stop_loss: analysis.stopLoss,
        take_profit: analysis.takeProfit,
        risk_reward: analysis.riskReward,
        atr: analysis.atr,
        patterns_detected: analysis.patternsDetected,
        htf_trend: analysis.htfTrend,
        mtf_trend: analysis.mtfTrend,
        current_price: analysis.currentPrice,
        change_24h: analysis.change24h,
        updated_at: now,
      };

      // Apply fresh data locally IMMEDIATELY so user sees it
      setAnalyses(prev => {
        const idx = prev.findIndex(a => a.ticker === ticker);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...prev[idx], ...localAnalysis };
          return updated;
        }
        return [...prev, localAnalysis];
      });
      setLastAnalysisUpdate(new Date());

      // Try to persist to database (may fail due to RLS policies)
      const { error: upsertError } = await supabase
        .from('token_analysis')
        .upsert({
          ticker: analysis.ticker,
          timeframe: analysis.timeframe,
          ema_21: analysis.ema21,
          ema_50: analysis.ema50,
          ema_100: analysis.ema100,
          ema_200: analysis.ema200,
          adx: analysis.adx,
          di_plus: analysis.diPlus,
          di_minus: analysis.diMinus,
          supertrend_value: analysis.supertrendValue,
          supertrend_direction: analysis.supertrendDirection,
          rsi: analysis.rsi,
          stoch_k: analysis.stochK,
          stoch_d: analysis.stochD,
          macd_line: analysis.macdLine,
          macd_signal: analysis.macdSignal,
          macd_histogram: analysis.macdHistogram,
          tenkan: analysis.tenkan,
          kijun: analysis.kijun,
          senkou_a: analysis.senkouA,
          senkou_b: analysis.senkouB,
          cloud_position: analysis.cloudPosition,
          volume_ratio: analysis.volumeRatio,
          buy_pressure: analysis.buyPressure,
          key_support: analysis.keySupport,
          key_resistance: analysis.keyResistance,
          fib_236: analysis.fib236,
          fib_382: analysis.fib382,
          fib_500: analysis.fib500,
          fib_618: analysis.fib618,
          fib_786: analysis.fib786,
          fib_zone: analysis.fibZone,
          buy_score: analysis.buyScore,
          sell_score: analysis.sellScore,
          signal: analysis.signal,
          stop_loss: analysis.stopLoss,
          take_profit: analysis.takeProfit,
          risk_reward: analysis.riskReward,
          atr: analysis.atr,
          patterns_detected: analysis.patternsDetected,
          htf_trend: analysis.htfTrend,
          mtf_trend: analysis.mtfTrend,
          current_price: analysis.currentPrice,
          change_24h: analysis.change24h,
          updated_at: now,
        }, {
          onConflict: 'ticker,timeframe',
        });

      if (upsertError) {
        console.warn(`[TradeMaster] DB save failed for ${ticker} (data still shown locally):`, upsertError.message);
        // Don't throw - data is already shown locally
      } else {
        // DB save succeeded, do a full refresh to sync
        await silentRefresh();
      }

      console.log(`Analysis for ${ticker} refreshed successfully!`);
    } catch (error) {
      console.error(`Error refreshing ${ticker}:`, error);
      throw error;
    } finally {
      setIsRefreshingToken(false);
    }
  }, [silentRefresh]);

  // Refresh ALL tokens sequentially
  const refreshAllTokens = useCallback(async () => {
    if (isRefreshingToken) return;
    setIsRefreshingToken(true);
    const tokenList = analyses.map(a => a.ticker);
    if (tokenList.length === 0) {
      setIsRefreshingToken(false);
      return;
    }
    console.log(`[TradeMaster] 🔄 Refreshing ALL ${tokenList.length} tokens...`);
    let refreshed = 0;
    for (const ticker of tokenList) {
      try {
        setRefreshProgress(`${ticker} (${refreshed + 1}/${tokenList.length})`);
        await refreshSingleToken(ticker);
        refreshed++;
      } catch (error) {
        console.warn(`[TradeMaster] Skip ${ticker}:`, error);
      }
      // API delay to avoid rate limits
      await new Promise(r => setTimeout(r, 800));
    }
    setRefreshProgress('');
    setIsRefreshingToken(false);
    console.log(`[TradeMaster] ✅ Refreshed ${refreshed}/${tokenList.length} tokens`);
  }, [analyses, isRefreshingToken, refreshSingleToken]);

  // Auto-refresh ALL tokens every 2 minutes
  useEffect(() => {
    if (autoRefreshRef.current) {
      clearTimeout(autoRefreshRef.current);
    }

    const scheduleAutoRefresh = () => {
      autoRefreshRef.current = setTimeout(async () => {
        if (!isRefreshingToken && analyses.length > 0) {
          try {
            console.log(`[AutoRefresh] Refreshing selected token ${selectedTicker}...`);
            await refreshSingleToken(selectedTicker);
          } catch (error) {
            console.error(`[AutoRefresh] Failed:`, error);
          }
        }
        scheduleAutoRefresh();
      }, 120000); // Every 2 minutes
    };

    scheduleAutoRefresh();

    return () => {
      if (autoRefreshRef.current) {
        clearTimeout(autoRefreshRef.current);
      }
    };
  }, [selectedTicker, isRefreshingToken, analyses.length, refreshSingleToken]);


  // M3: Update BTC context from real-time WebSocket data
  useEffect(() => {
    const btcPrice = prices.get('BTC');
    if (btcPrice) {
      const btcAnalysis = analyses.find(a => a.ticker === 'BTC');
      updateBtcContext(
        btcAnalysis?.htf_trend || 'neutral',
        btcPrice.price,
        btcPrice.change24h
      );
    }
  }, [prices, analyses]);

  // Always refresh the selected token immediately when switching
  const lastRefreshedTicker = useRef<string | null>(null);
  useEffect(() => {
    if (!isInitialLoading && selectedTicker && !isRefreshingToken && analyses.length > 0) {
      if (lastRefreshedTicker.current !== selectedTicker) {
        lastRefreshedTicker.current = selectedTicker;
        console.log(`[AutoRefresh] Refreshing ${selectedTicker} on selection...`);
        refreshSingleToken(selectedTicker).catch(e =>
          console.error(`[AutoRefresh] Failed for ${selectedTicker}:`, e)
        );
      }
    }
  }, [selectedTicker, isInitialLoading, isRefreshingToken, analyses.length, refreshSingleToken]);

  // Manual refresh button handler - refreshes ALL tokens
  const handleManualRefresh = async () => {
    try {
      await refreshAllTokens();
      toast({
        title: String(t('allTokensUpdated' as any)),
        description: String(t('tokensRecalculated' as any)).replace('{count}', analyses.length.toString()),
      });
    } catch (error) {
      toast({
        title: String(t('updateError' as any)),
        description: String(error),
        variant: 'destructive',
      });
    }
  };

  const selectedAnalysis = analysesWithRealtimePrices.find(a => a.ticker === selectedTicker) || null;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Tutorial Component */}
      <TradeMasterTutorial />

      {/* Enhanced Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-bold flex items-center gap-1.5 truncate">
              <Zap className="w-5 h-5 md:w-7 md:h-7 text-primary shrink-0" />
              <span className="truncate">TRADE MASTER</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium hidden sm:inline">PRO</span>
            </h1>
          </div>
          {/* Refresh Button */}
          <Button
            onClick={handleManualRefresh}
            disabled={isRefreshingToken}
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshingToken && "animate-spin")} />
            <span className="hidden sm:inline">
              {isRefreshingToken
                ? (refreshProgress || t('updating' as any))
                : t('refresh' as any)}
            </span>
          </Button>
        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {/* Connection Status */}
          {isConnected ? (
            <span className="flex items-center gap-1 text-success">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-destructive">
              <WifiOff className="w-3 h-3" />
              Offline
            </span>
          )}

          {/* Token Count */}
          <span>{quickStats.total} tokens</span>

          {/* Signal Summary */}
          {quickStats.eliteSignals > 0 && (
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <Zap className="w-3 h-3" />
              {quickStats.eliteSignals} ELITE
            </span>
          )}
          {quickStats.buySignals > 0 && (
            <span className="flex items-center gap-1 text-success">
              <TrendingUp className="w-3 h-3" />
              {quickStats.buySignals} {t('buy' as any)}
            </span>
          )}
          {quickStats.sellSignals > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <TrendingDown className="w-3 h-3" />
              {quickStats.sellSignals} {t('sell' as any)}
            </span>
          )}

          {/* Last Update Timestamp */}
          {timeSinceUpdate && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t('updatedTime' as any)} {timeSinceUpdate}
            </span>
          )}

          {/* Auto-analysis indicator */}
          {isRefreshingToken && (
            <span className="flex items-center gap-1 text-primary animate-pulse">
              <Activity className="w-3 h-3" />
              {t('recalculating' as any)}
            </span>
          )}
        </div>
      </div>

      {isInitialLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Zap className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">
            {t('waitingAnalysis' as any)}
          </h3>
          <p className="text-muted-foreground">
            {t('systemAnalyzing' as any)}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">
              {t('autopilotProcessing' as any)}
            </span>
          </div>
        </div>
      ) : (
        <CreditWall
          toolName="Trade Master"
          toolIcon="trademaster"
          storageKey="trade_master_access"
          cost={1}
        >
          <div className="space-y-6 mt-4">
            {/* Large Chart with Token Selector */}
            <CandlestickChart
              symbol={selectedTicker}
              availableTokens={tickers}
              onSymbolChange={handleSelectToken}
            />

            {/* Simplified Token Table - with real-time prices */}
            <TokenTable
              analyses={analysesWithRealtimePrices}
              selectedTicker={selectedTicker}
              onSelectToken={handleSelectToken}
            />

            {/* Dashboard Details - ALWAYS VISIBLE */}
            <div className="border-2 border-primary/30 rounded-xl overflow-hidden shadow-lg">
              <div className="p-4 space-y-6 bg-card/50">
                <SwingDashboard
                  analysis={selectedAnalysis}
                  realtimePrice={selectedAnalysis?.current_price}
                  realtimeChange={selectedAnalysis?.change_24h}
                />

                {selectedAnalysis && (
                  <StrategicAnalysis
                    analysis={selectedAnalysis}
                    onRefresh={refreshSingleToken}
                  />
                )}
              </div>
            </div>

            {/* Floating GURU */}
            <FloatingGuru analyses={analysesWithRealtimePrices} onSelectToken={handleSelectToken} />
          </div>
        </CreditWall>
      )}

      <ExchangeFloatingBar />
    </div>
  );
};

export default SwingAnalysisPage;
