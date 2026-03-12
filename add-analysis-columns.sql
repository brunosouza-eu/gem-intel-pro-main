-- ============================================================================
-- ATUALIZAÇÃO: Adicionar colunas para análise técnica avançada
-- Execute este script no Supabase SQL Editor
-- ============================================================================

-- Adicionar colunas de indicadores que estão faltando
ALTER TABLE token_analysis 
  ADD COLUMN IF NOT EXISTS atr DECIMAL,
  ADD COLUMN IF NOT EXISTS buy_score DECIMAL,
  ADD COLUMN IF NOT EXISTS sell_score DECIMAL,
  ADD COLUMN IF NOT EXISTS risk_reward DECIMAL,
  ADD COLUMN IF NOT EXISTS stop_loss DECIMAL,
  ADD COLUMN IF NOT EXISTS take_profit DECIMAL;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_token_analysis_buy_score ON token_analysis(buy_score DESC);
CREATE INDEX IF NOT EXISTS idx_token_analysis_signal ON token_analysis(signal);
CREATE INDEX IF NOT EXISTS idx_token_analysis_ticker_timeframe ON token_analysis(ticker, timeframe);

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'token_analysis' 
ORDER BY ordinal_position;
