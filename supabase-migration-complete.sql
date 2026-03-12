-- ============================================================================
-- MIGRAÇÃO COMPLETA - GEM INTEL / TRADE MASTER PRO
-- Execute este script no seu NOVO projeto Supabase
-- ============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TIPOS PERSONALIZADOS
-- ============================================================================

CREATE TYPE app_role AS ENUM ('admin', 'user');
CREATE TYPE subscription_tier AS ENUM ('FREE', 'PRO');

-- ============================================================================
-- FUNÇÕES AUXILIARES
-- ============================================================================

-- Função para verificar se usuário tem role específica
CREATE OR REPLACE FUNCTION has_role(user_id UUID, role app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND user_roles.role = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABELAS
-- ============================================================================

-- Tabela: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier subscription_tier DEFAULT 'FREE',
  language TEXT DEFAULT 'pt',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Tabela: tokens
CREATE TABLE IF NOT EXISTS public.tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ticker TEXT NOT NULL UNIQUE,
  score INTEGER,
  status TEXT,
  narrative TEXT,
  current_price NUMERIC,
  market_cap NUMERIC,
  fdv NUMERIC,
  supply NUMERIC,
  volume_24h NUMERIC,
  change_24h NUMERIC,
  structure TEXT,
  unlocks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: token_analysis
CREATE TABLE IF NOT EXISTS public.token_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker TEXT NOT NULL,
  timeframe TEXT NOT NULL DEFAULT '4h',
  score INTEGER,
  signal TEXT,
  trend TEXT,
  ema_20 NUMERIC,
  ema_50 NUMERIC,
  ema_200 NUMERIC,
  adx NUMERIC,
  supertrend NUMERIC,
  rsi NUMERIC,
  macd NUMERIC,
  macd_signal NUMERIC,
  ichimoku_conversion NUMERIC,
  ichimoku_base NUMERIC,
  volume_ratio NUMERIC,
  fib_0 NUMERIC,
  fib_236 NUMERIC,
  fib_382 NUMERIC,
  fib_50 NUMERIC,
  fib_618 NUMERIC,
  fib_100 NUMERIC,
  stop_loss NUMERIC,
  take_profit_1 NUMERIC,
  take_profit_2 NUMERIC,
  take_profit_3 NUMERIC,
  entry_price NUMERIC,
  risk_reward NUMERIC,
  analysis_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ticker, timeframe)
);

-- Tabela: alerts
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES public.tokens(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  alert_type TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: radar_weekly
CREATE TABLE IF NOT EXISTS public.radar_weekly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id UUID REFERENCES public.tokens(id) ON DELETE CASCADE,
  week_number INTEGER,
  year INTEGER,
  status TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: macro_view
CREATE TABLE IF NOT EXISTS public.macro_view (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  btc_trend TEXT,
  dominance TEXT,
  liquidity TEXT,
  cycle TEXT,
  cycle_view TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: alert_preferences
CREATE TABLE IF NOT EXISTS public.alert_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_id UUID NOT NULL REFERENCES public.tokens(id) ON DELETE CASCADE,
  notify_entry BOOLEAN DEFAULT true,
  notify_stop BOOLEAN DEFAULT true,
  notify_target BOOLEAN DEFAULT true,
  notify_signals BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token_id)
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_tokens_ticker ON public.tokens(ticker);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON public.tokens(status);
CREATE INDEX IF NOT EXISTS idx_token_analysis_ticker ON public.tokens(ticker);
CREATE INDEX IF NOT EXISTS idx_token_analysis_ticker_timeframe ON public.token_analysis(ticker, timeframe);
CREATE INDEX IF NOT EXISTS idx_alerts_created_by ON public.alerts(created_by);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tokens_updated_at
  BEFORE UPDATE ON public.tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_token_analysis_updated_at
  BEFORE UPDATE ON public.token_analysis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_preferences_updated_at
  BEFORE UPDATE ON public.alert_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radar_weekly ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.macro_view ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Políticas para user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

-- Políticas para tokens
CREATE POLICY "Authenticated users can read tokens" ON public.tokens
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert tokens" ON public.tokens
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update tokens" ON public.tokens
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Políticas para token_analysis
CREATE POLICY "Authenticated users can read token analysis" ON public.token_analysis
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert token analysis" ON public.token_analysis
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

-- Políticas para alerts
CREATE POLICY "Authenticated users can read alerts" ON public.alerts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert alerts" ON public.alerts
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own alerts" ON public.alerts
  FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Admins can delete any alerts" ON public.alerts
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Políticas para radar_weekly
CREATE POLICY "Authenticated users can read radar" ON public.radar_weekly
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert radar" ON public.radar_weekly
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

-- Políticas para macro_view
CREATE POLICY "Authenticated users can read macro" ON public.macro_view
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can insert macro" ON public.macro_view
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update macro" ON public.macro_view
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Políticas para alert_preferences
CREATE POLICY "Users can view their own preferences" ON public.alert_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" ON public.alert_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.alert_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" ON public.alert_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Bloquear acesso anônimo a profiles
CREATE POLICY "Deny anonymous select on profiles" ON public.profiles
  FOR SELECT TO anon USING (false);

CREATE POLICY "Deny anonymous insert on profiles" ON public.profiles
  FOR INSERT TO anon WITH CHECK (false);

CREATE POLICY "Deny anonymous update on profiles" ON public.profiles
  FOR UPDATE TO anon USING (false);

CREATE POLICY "Deny anonymous delete on profiles" ON public.profiles
  FOR DELETE TO anon USING (false);

-- ============================================================================
-- TRIGGER PARA CRIAR PROFILE AUTOMATICAMENTE
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'language', 'pt')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- DADOS INICIAIS
-- ============================================================================

-- Inserir dados macro padrão
INSERT INTO public.macro_view (btc_trend, dominance, liquidity, cycle, cycle_view)
VALUES ('neutral', 'Média', 'Média', 'Expansão', 'Acumulação')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICAÇÃO
-- ============================================================================

SELECT 'Migração concluída com sucesso!' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
