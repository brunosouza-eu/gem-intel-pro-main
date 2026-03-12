-- ============================================================================
-- MONETIZATION SYSTEM MIGRATION (FIXED)
-- Execute este script no SQL Editor do Supabase
-- ============================================================================

-- 0. MIGRAÇÃO DE DADOS: user_profiles (tabela) -> profiles
-- Resolvendo conflito se user_profiles já existir como tabela
-- ============================================================================
DO $$
BEGIN
  -- Verificar se user_profiles existe como tabela
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles' AND table_type = 'BASE TABLE') THEN
    
    RAISE NOTICE 'Tabela user_profiles encontrada. Iniciando backup e migração...';

    -- 1. Renomear para backup para liberar o nome
    ALTER TABLE public.user_profiles RENAME TO user_profiles_backup;

    -- 2. Migrar créditos para a tabela profiles
    -- Assume que ambas usam 'id' como chave para usuário (uuid)
    UPDATE public.profiles p
    SET credits = up.credits
    FROM public.user_profiles_backup up
    WHERE p.id = up.id AND up.credits IS NOT NULL;

    RAISE NOTICE 'Dados migrados de user_profiles_backup para profiles.';
    
  END IF;
END $$;

-- 1. RPC: deduct_credits - Deduzir créditos de forma segura e atômica
-- ============================================================================
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_amount INTEGER,
  p_description TEXT DEFAULT 'Uso de ferramenta'
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_current_credits INTEGER;
  v_new_credits INTEGER;
BEGIN
  v_user_id := auth.uid();
  
  -- Verificar se usuário está autenticado
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'User not authenticated');
  END IF;

  -- Bloquear a linha do perfil para evitar race conditions
  SELECT COALESCE(credits, 0) INTO v_current_credits
  FROM public.profiles
  WHERE id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Profile not found');
  END IF;

  -- Verificar saldo suficiente
  IF v_current_credits < p_amount THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Insufficient credits', 'current', v_current_credits);
  END IF;

  v_new_credits := v_current_credits - p_amount;

  -- Atualizar saldo
  UPDATE public.profiles
  SET credits = v_new_credits, updated_at = NOW()
  WHERE id = v_user_id;

  -- Registrar transação
  INSERT INTO public.credit_transactions (user_id, amount, type, source, description, balance_after)
  VALUES (v_user_id, -p_amount, 'spend', 'app_usage', p_description, v_new_credits);

  RETURN jsonb_build_object('success', TRUE, 'new_balance', v_new_credits);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RPC: claim_daily_login - Reivindicar bônus diário (checa se já ganhou hoje)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.claim_daily_login()
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_amount INTEGER := 5; -- Valor do bônus diário
  v_current_credits INTEGER;
  v_new_credits INTEGER;
  v_last_claim TIMESTAMPTZ;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'User not authenticated');
  END IF;

  -- Verificar se já reivindicou hoje (na tabela de transações)
  SELECT created_at INTO v_last_claim
  FROM public.credit_transactions
  WHERE user_id = v_user_id 
    AND source = 'daily_login'
    AND created_at >= CURRENT_DATE
  LIMIT 1;

  IF v_last_claim IS NOT NULL THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Already claimed today');
  END IF;

  -- Bloquear perfil e atualizar
  SELECT COALESCE(credits, 0) INTO v_current_credits
  FROM public.profiles
  WHERE id = v_user_id
  FOR UPDATE;

  v_new_credits := v_current_credits + v_amount;

  UPDATE public.profiles
  SET credits = v_new_credits, updated_at = NOW()
  WHERE id = v_user_id;

  INSERT INTO public.credit_transactions (user_id, amount, type, source, description, balance_after)
  VALUES (v_user_id, v_amount, 'earn', 'daily_login', 'Bônus diário de login', v_new_credits);

  RETURN jsonb_build_object('success', TRUE, 'new_balance', v_new_credits, 'amount', v_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Garantir que a tabela user_profiles (view) existe para compatibilidade
-- Caso algum código legado ainda dependa dela
-- ============================================================================
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
  id,
  email,
  credits,
  plan,
  full_name,
  avatar_url
FROM public.profiles;

-- 4. Função para verificar upgrades de plano automaticamente (opcional, pode ser expandido)
-- ============================================================================
-- (Por enquanto deixamos manual via Admin ou Stripe Webhook futuro)

SELECT 'Monetization Migration Completed' as status;
