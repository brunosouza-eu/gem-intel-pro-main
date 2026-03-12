-- ============================================================================
-- SOLUÇÃO DEFINITIVA: Recriar tabela token_analysis DO ZERO
-- Versão 2 - SEM ERROS
-- ============================================================================

-- 1. DELETAR todos os índices antigos primeiro
DROP INDEX IF EXISTS idx_token_analysis_ticker CASCADE;
DROP INDEX IF EXISTS idx_token_analysis_timeframe CASCADE;
DROP INDEX IF EXISTS idx_token_analysis_buy_score CASCADE;
DROP INDEX IF EXISTS idx_token_analysis_sell_score CASCADE;
DROP INDEX IF EXISTS idx_token_analysis_signal CASCADE;
DROP INDEX IF EXISTS idx_token_analysis_updated CASCADE;
DROP INDEX IF EXISTS idx_token_analysis_ticker_timeframe CASCADE;

-- 2. BACKUP dos dados existentes (se houver)
DROP TABLE IF EXISTS token_analysis_backup CASCADE;
CREATE TABLE token_analysis_backup AS 
SELECT * FROM token_analysis;

-- 3. DELETAR a tabela antiga
DROP TABLE IF EXISTS token_analysis CASCADE;

-- 4. CRIAR tabela NOVA com TODAS as colunas corretas
CREATE TABLE token_analysis (
  -- IDs e Identificadores
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker TEXT NOT NULL,
  timeframe TEXT NOT NULL DEFAULT '4h',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Score e Sinal (legacy - mantido por compatibilidade)
  score INTEGER,
  signal TEXT,
  trend TEXT,
  
  -- EMAs
  ema_21 DECIMAL,
  ema_50 DECIMAL,
  ema_100 DECIMAL,
  ema_200 DECIMAL,
  
  -- ADX
  adx DECIMAL,
  di_plus DECIMAL,
  di_minus DECIMAL,
  
  -- Supertrend
  supertrend_value DECIMAL,
  supertrend_direction TEXT,
  
  -- RSI
  rsi DECIMAL,
  
  -- Stochastic
  stoch_k DECIMAL,
  stoch_d DECIMAL,
  
  -- MACD
  macd_line DECIMAL,
  macd_signal DECIMAL,
  macd_histogram DECIMAL,
  
  -- Ichimoku
  tenkan DECIMAL,
  kijun DECIMAL,
  senkou_a DECIMAL,
  senkou_b DECIMAL,
  cloud_position TEXT,
  
  -- Volume
  volume_ratio DECIMAL,
  buy_pressure BOOLEAN,
  
  -- Support/Resistance
  key_support DECIMAL,
  key_resistance DECIMAL,
  
  -- Fibonacci
  fib_236 DECIMAL,
  fib_382 DECIMAL,
  fib_500 DECIMAL,
  fib_618 DECIMAL,
  fib_786 DECIMAL,
  fib_zone TEXT,
  
  -- Scores
  buy_score DECIMAL,
  sell_score DECIMAL,
  
  -- Risk Management
  stop_loss DECIMAL,
  take_profit DECIMAL,
  risk_reward DECIMAL,
  atr DECIMAL,
  
  -- Patterns
  patterns_detected TEXT[],
  
  -- Multi-Timeframe
  htf_trend TEXT,
  mtf_trend TEXT,
  
  -- Current Price
  current_price DECIMAL,
  change_24h DECIMAL,
  
  -- Constraint única
  UNIQUE(ticker, timeframe)
);

-- 5. CRIAR índices para performance
CREATE INDEX idx_token_analysis_ticker ON token_analysis(ticker);
CREATE INDEX idx_token_analysis_timeframe ON token_analysis(timeframe);
CREATE INDEX idx_token_analysis_buy_score ON token_analysis(buy_score DESC NULLS LAST);
CREATE INDEX idx_token_analysis_sell_score ON token_analysis(sell_score DESC NULLS LAST);
CREATE INDEX idx_token_analysis_signal ON token_analysis(signal);
CREATE INDEX idx_token_analysis_updated ON token_analysis(updated_at DESC);

-- 6. HABILITAR RLS (Row Level Security)
ALTER TABLE token_analysis ENABLE ROW LEVEL SECURITY;

-- 7. CRIAR políticas RLS (dropar antigas primeiro)
DROP POLICY IF EXISTS "Allow read access to all users" ON token_analysis;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON token_analysis;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON token_analysis;

CREATE POLICY "Allow read access to all users" ON token_analysis
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON token_analysis
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON token_analysis
  FOR UPDATE TO authenticated USING (true);

-- 8. VERIFICAR se tudo foi criado corretamente
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'token_analysis' 
ORDER BY ordinal_position;
