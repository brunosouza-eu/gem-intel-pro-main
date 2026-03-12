-- Create token_analysis table for swing trade indicator data
CREATE TABLE public.token_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES public.tokens(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  timeframe TEXT DEFAULT '1h',
  
  -- EMAs
  ema_21 NUMERIC,
  ema_50 NUMERIC,
  ema_100 NUMERIC,
  ema_200 NUMERIC,
  
  -- Trend
  adx NUMERIC,
  di_plus NUMERIC,
  di_minus NUMERIC,
  supertrend_value NUMERIC,
  supertrend_direction TEXT,
  
  -- Momentum
  rsi NUMERIC,
  stoch_k NUMERIC,
  stoch_d NUMERIC,
  macd_line NUMERIC,
  macd_signal NUMERIC,
  macd_histogram NUMERIC,
  
  -- Ichimoku
  tenkan NUMERIC,
  kijun NUMERIC,
  senkou_a NUMERIC,
  senkou_b NUMERIC,
  cloud_position TEXT,
  
  -- Volume
  volume_ratio NUMERIC,
  buy_pressure BOOLEAN DEFAULT false,
  
  -- Structure
  key_support NUMERIC,
  key_resistance NUMERIC,
  
  -- Fibonacci
  fib_236 NUMERIC,
  fib_382 NUMERIC,
  fib_500 NUMERIC,
  fib_618 NUMERIC,
  fib_786 NUMERIC,
  fib_zone TEXT,
  
  -- Scores (0-100%)
  buy_score NUMERIC,
  sell_score NUMERIC,
  
  -- Sinais
  signal TEXT,
  
  -- Risk Management
  stop_loss NUMERIC,
  take_profit NUMERIC,
  risk_reward NUMERIC,
  atr NUMERIC,
  
  -- Patterns detectados
  patterns_detected JSONB DEFAULT '[]'::jsonb,
  
  -- HTF/MTF Analysis
  htf_trend TEXT,
  mtf_trend TEXT,
  
  -- Current price data
  current_price NUMERIC,
  change_24h NUMERIC,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(ticker, timeframe)
);

-- Enable RLS
ALTER TABLE public.token_analysis ENABLE ROW LEVEL SECURITY;

-- Pro users can read analysis
CREATE POLICY "Pro users can read token analysis"
ON public.token_analysis
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.plan = 'pro'::user_plan
));

-- Only admins can insert/update analysis (edge functions use service role)
CREATE POLICY "Only admins can insert token analysis"
ON public.token_analysis
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update token analysis"
ON public.token_analysis
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_token_analysis_updated_at
BEFORE UPDATE ON public.token_analysis
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.token_analysis;

-- Create index for faster lookups
CREATE INDEX idx_token_analysis_ticker ON public.token_analysis(ticker);
CREATE INDEX idx_token_analysis_signal ON public.token_analysis(signal);