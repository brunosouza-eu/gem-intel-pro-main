-- ============================================================================
-- MIGRATION COMPLETA: Adicionar TODAS as colunas de análise técnica
-- Execute este script no Supabase SQL Editor
-- ============================================================================

-- Adicionar TODAS as colunas que faltam
ALTER TABLE token_analysis 
  -- Trend Indicators (já existem ema_21, ema_50, ema_100, ema_200)
  ADD COLUMN IF NOT EXISTS adx DECIMAL,
  ADD COLUMN IF NOT EXISTS di_plus DECIMAL,
  ADD COLUMN IF NOT EXISTS di_minus DECIMAL,
  
  -- Supertrend
  ADD COLUMN IF NOT EXISTS supertrend_value DECIMAL,
  ADD COLUMN IF NOT EXISTS supertrend_direction TEXT,
  
  -- Momentum (já existe rsi)
  ADD COLUMN IF NOT EXISTS stoch_k DECIMAL,
  ADD COLUMN IF NOT EXISTS stoch_d DECIMAL,
  ADD COLUMN IF NOT EXISTS macd_line DECIMAL,
  ADD COLUMN IF NOT EXISTS macd_signal DECIMAL,
  ADD COLUMN IF NOT EXISTS macd_histogram DECIMAL,
  
  -- Ichimoku
  ADD COLUMN IF NOT EXISTS tenkan DECIMAL,
  ADD COLUMN IF NOT EXISTS kijun DECIMAL,
  ADD COLUMN IF NOT EXISTS senkou_a DECIMAL,
  ADD COLUMN IF NOT EXISTS senkou_b DECIMAL,
  ADD COLUMN IF NOT EXISTS cloud_position TEXT,
  
  -- Volume
  ADD COLUMN IF NOT EXISTS volume_ratio DECIMAL,
  ADD COLUMN IF NOT EXISTS buy_pressure BOOLEAN,
  
  -- Support/Resistance
  ADD COLUMN IF NOT EXISTS key_support DECIMAL,
  ADD COLUMN IF NOT EXISTS key_resistance DECIMAL,
  
  -- Fibonacci
  ADD COLUMN IF NOT EXISTS fib_236 DECIMAL,
  ADD COLUMN IF NOT EXISTS fib_382 DECIMAL,
  ADD COLUMN IF NOT EXISTS fib_500 DECIMAL,
  ADD COLUMN IF NOT EXISTS fib_618 DECIMAL,
  ADD COLUMN IF NOT EXISTS fib_786 DECIMAL,
  ADD COLUMN IF NOT EXISTS fib_zone TEXT,
  
  -- Scores
  ADD COLUMN IF NOT EXISTS buy_score DECIMAL,
  ADD COLUMN IF NOT EXISTS sell_score DECIMAL,
  
  -- Risk Management
  ADD COLUMN IF NOT EXISTS stop_loss DECIMAL,
  ADD COLUMN IF NOT EXISTS take_profit DECIMAL,
  ADD COLUMN IF NOT EXISTS risk_reward DECIMAL,
  ADD COLUMN IF NOT EXISTS atr DECIMAL,
  
  -- Patterns
  ADD COLUMN IF NOT EXISTS patterns_detected TEXT[],
  
  -- Multi-Timeframe
  ADD COLUMN IF NOT EXISTS htf_trend TEXT,
  ADD COLUMN IF NOT EXISTS mtf_trend TEXT,
  
  -- Current Price
  ADD COLUMN IF NOT EXISTS current_price DECIMAL,
  ADD COLUMN IF NOT EXISTS change_24h DECIMAL;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_token_analysis_buy_score ON token_analysis(buy_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_token_analysis_sell_score ON token_analysis(sell_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_token_analysis_signal ON token_analysis(signal);
CREATE INDEX IF NOT EXISTS idx_token_analysis_ticker_timeframe ON token_analysis(ticker, timeframe);
CREATE INDEX IF NOT EXISTS idx_token_analysis_updated ON token_analysis(updated_at DESC);

-- Verificar todas as colunas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'token_analysis' 
ORDER BY ordinal_position;
