-- Add unique constraint on ticker+timeframe for proper upsert
ALTER TABLE public.token_analysis 
ADD CONSTRAINT token_analysis_ticker_timeframe_unique UNIQUE (ticker, timeframe);