-- Add AI analysis columns to token_analysis table

ALTER TABLE token_analysis 
ADD COLUMN IF NOT EXISTS ai_analysis JSONB,
ADD COLUMN IF NOT EXISTS technical_indicators JSONB,
ADD COLUMN IF NOT EXISTS support_levels NUMERIC[],
ADD COLUMN IF NOT EXISTS resistance_levels NUMERIC[],
ADD COLUMN IF NOT EXISTS last_ai_update TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS analysis_version INTEGER DEFAULT 1;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_token_analysis_last_ai_update ON token_analysis(last_ai_update DESC);
CREATE INDEX IF NOT EXISTS idx_token_analysis_ticker ON token_analysis(ticker);

-- Add comment explaining the structure
COMMENT ON COLUMN token_analysis.ai_analysis IS 'AI-generated strategic analysis in JSON format';
COMMENT ON COLUMN token_analysis.technical_indicators IS 'Real-time technical indicators (RSI, MACD, Bollinger, EMA, etc.)';
COMMENT ON COLUMN token_analysis.support_levels IS 'Array of support price levels';
COMMENT ON COLUMN token_analysis.resistance_levels IS 'Array of resistance price levels';
COMMENT ON COLUMN token_analysis.last_ai_update IS 'Timestamp of last AI analysis update';
