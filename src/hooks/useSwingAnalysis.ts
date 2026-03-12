import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { analyzeToken } from '@/lib/swingAnalysisService';
import { updateAllTokensWithTechnicalAnalysis } from '@/lib/radarClassification';

export interface SwingAnalysis {
  id: string;
  ticker: string;
  timeframe: string;
  ema_21: number | null;
  ema_50: number | null;
  ema_100: number | null;
  ema_200: number | null;
  adx: number | null;
  di_plus: number | null;
  di_minus: number | null;
  supertrend_value: number | null;
  supertrend_direction: string | null;
  rsi: number | null;
  stoch_k: number | null;
  stoch_d: number | null;
  macd_line: number | null;
  macd_signal: number | null;
  macd_histogram: number | null;
  tenkan: number | null;
  kijun: number | null;
  senkou_a: number | null;
  senkou_b: number | null;
  cloud_position: string | null;
  volume_ratio: number | null;
  buy_pressure: boolean | null;
  key_support: number | null;
  key_resistance: number | null;
  fib_236: number | null;
  fib_382: number | null;
  fib_500: number | null;
  fib_618: number | null;
  fib_786: number | null;
  fib_zone: string | null;
  buy_score: number | null;
  sell_score: number | null;
  signal: string | null;
  stop_loss: number | null;
  take_profit: number | null;
  risk_reward: number | null;
  atr: number | null;
  patterns_detected: string[] | null;
  htf_trend: string | null;
  mtf_trend: string | null;
  current_price: number | null;
  change_24h: number | null;
  updated_at: string;
}

export function useSwingAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      // Fetch ALL tokens from database (no limit)
      const { data: tokens, error: tokensError } = await supabase
        .from('tokens')
        .select('ticker, current_price, change_24h')
        .order('score', { ascending: false });

      if (tokensError) throw tokensError;

      if (!tokens || tokens.length === 0) {
        throw new Error(language === 'pt'
          ? 'Nenhum token encontrado. Execute a sincronização primeiro.'
          : 'No tokens found. Run sync first.');
      }

      // Silent analysis - no toast

      const analyses = [];
      let eliteSignals = 0;
      let strongSignals = 0;

      // Analyze each token
      for (const token of tokens) {
        try {
          console.log(`Analyzing ${token.ticker}...`);

          const analysis = await analyzeToken(token.ticker, '4h', token.change_24h);

          // Upsert to database
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
            }, {
              onConflict: 'ticker,timeframe',
              ignoreDuplicates: false,
            });

          if (upsertError) {
            console.error(`Error upserting ${token.ticker}:`, upsertError);
          } else {
            analyses.push(analysis);

            // Count elite/strong signals
            if (analysis.signal.includes('elite')) eliteSignals++;
            if (analysis.signal.includes('strong')) strongSignals++;
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Error analyzing ${token.ticker}:`, error);
          // Continue with next token
        }
      }

      // Analysis complete - update Radar classification with technical data
      console.log('Updating Radar classifications...');
      await updateAllTokensWithTechnicalAnalysis();
      console.log('Radar classifications updated!');

      return { analyzed: analyses.length, results: analyses, eliteSignals, strongSignals };
    } catch (error: any) {
      console.error('Error running swing analysis:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast, language]);

  return { runAnalysis, isAnalyzing };
}
