-- Create enum for token status
CREATE TYPE public.token_status AS ENUM ('observacao', 'acumulacao', 'gatilho', 'andamento');

-- Create enum for user plan
CREATE TYPE public.user_plan AS ENUM ('free', 'pro');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  plan user_plan NOT NULL DEFAULT 'free',
  language TEXT NOT NULL DEFAULT 'pt',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tokens table
CREATE TABLE public.tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ticker TEXT NOT NULL,
  narrative TEXT,
  market_cap NUMERIC,
  volume_24h NUMERIC,
  supply NUMERIC,
  fdv NUMERIC,
  unlocks TEXT,
  structure TEXT,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  status token_status NOT NULL DEFAULT 'observacao',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES public.tokens(id) ON DELETE CASCADE NOT NULL,
  entry_zone TEXT,
  stop TEXT,
  targets TEXT,
  risk_reward TEXT,
  invalidation TEXT,
  volatility_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create radar_weekly table
CREATE TABLE public.radar_weekly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_label TEXT NOT NULL,
  macro_view TEXT,
  observation TEXT,
  accumulation TEXT,
  trigger_ready TEXT,
  removed TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create macro_view table
CREATE TABLE public.macro_view (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  btc_trend TEXT,
  dominance TEXT,
  liquidity TEXT,
  cycle_view TEXT,
  weekly_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radar_weekly ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.macro_view ENABLE ROW LEVEL SECURITY;

-- Profiles policies (users can only access their own profile)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tokens policies (PRO users can read all tokens)
CREATE POLICY "Authenticated users can read tokens" ON public.tokens
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert tokens" ON public.tokens
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update tokens" ON public.tokens
  FOR UPDATE TO authenticated USING (true);

-- Alerts policies
CREATE POLICY "Authenticated users can read alerts" ON public.alerts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert alerts" ON public.alerts
  FOR INSERT TO authenticated WITH CHECK (true);

-- Radar weekly policies
CREATE POLICY "Authenticated users can read radar" ON public.radar_weekly
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert radar" ON public.radar_weekly
  FOR INSERT TO authenticated WITH CHECK (true);

-- Macro view policies
CREATE POLICY "Authenticated users can read macro" ON public.macro_view
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update macro" ON public.macro_view
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert macro" ON public.macro_view
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tokens_updated_at
  BEFORE UPDATE ON public.tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_macro_view_updated_at
  BEFORE UPDATE ON public.macro_view
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan, language)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'pt')
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();