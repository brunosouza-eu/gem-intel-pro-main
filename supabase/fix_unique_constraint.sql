-- Fix for "there is no unique or exclusion constraint matching the ON CONFLICT specification"

-- 1. Ensure ticker column is unique in token_analysis table
ALTER TABLE token_analysis
ADD CONSTRAINT token_analysis_ticker_key UNIQUE (ticker);

-- Optional: Create an index for faster lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_token_analysis_ticker ON token_analysis(ticker);
