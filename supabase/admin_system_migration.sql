-- ============================================================================
-- ADMIN CRM SYSTEM MIGRATION
-- Execute este script no SQL Editor do Supabase
-- ============================================================================

-- 1. Adicionar colunas ao profiles para suportar CRM completo
DO $$
BEGIN
  -- Full name
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='full_name') THEN
    ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
  END IF;

  -- Avatar URL
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
  END IF;

  -- Phone
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
  END IF;

  -- Blocked status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='is_blocked') THEN
    ALTER TABLE public.profiles ADD COLUMN is_blocked BOOLEAN DEFAULT FALSE;
  END IF;

  -- Blocked at timestamp
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='blocked_at') THEN
    ALTER TABLE public.profiles ADD COLUMN blocked_at TIMESTAMPTZ;
  END IF;

  -- Blocked reason
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='blocked_reason') THEN
    ALTER TABLE public.profiles ADD COLUMN blocked_reason TEXT;
  END IF;

  -- Last login at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='last_login_at') THEN
    ALTER TABLE public.profiles ADD COLUMN last_login_at TIMESTAMPTZ;
  END IF;

  -- Login count
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='login_count') THEN
    ALTER TABLE public.profiles ADD COLUMN login_count INTEGER DEFAULT 0;
  END IF;

  -- Auth provider (google, email, etc.)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='provider') THEN
    ALTER TABLE public.profiles ADD COLUMN provider TEXT DEFAULT 'email';
  END IF;

  -- Credits (unificado no profiles)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='credits') THEN
    ALTER TABLE public.profiles ADD COLUMN credits INTEGER DEFAULT 50;
  END IF;

  -- Email
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='email') THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;

  -- Plan (sync with subscription_tier if exists)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='plan') THEN
    ALTER TABLE public.profiles ADD COLUMN plan TEXT DEFAULT 'free'; 
  END IF;

  RAISE NOTICE 'Colunas adicionadas ao profiles com sucesso.';
END $$;

-- ============================================================================
-- 2. Tabela de Audit Log para ações administrativas
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'block_user', 'unblock_user', 'adjust_credits', 'change_plan', 'toggle_admin'
  target_user_id UUID REFERENCES auth.users(id),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target ON public.admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created ON public.admin_audit_log(created_at DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can read audit log" ON public.admin_audit_log;
CREATE POLICY "Only admins can read audit log" ON public.admin_audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can insert audit log" ON public.admin_audit_log;
CREATE POLICY "Only admins can insert audit log" ON public.admin_audit_log
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 3. Tabela de Transações de Créditos (se não existir)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'spend', 'admin_adjust')),
  source TEXT NOT NULL,
  description TEXT,
  balance_after INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_user ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_tx_created ON public.credit_transactions(created_at DESC);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;
CREATE POLICY "Users can view own transactions" ON public.credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all transactions" ON public.credit_transactions;
CREATE POLICY "Admins can view all transactions" ON public.credit_transactions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "System can insert transactions" ON public.credit_transactions;
CREATE POLICY "System can insert transactions" ON public.credit_transactions
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 4. RPC: admin_get_users - Buscar todos os usuários com dados completos
-- ============================================================================
CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  plan TEXT,
  credits INTEGER,
  is_blocked BOOLEAN,
  blocked_at TIMESTAMPTZ,
  blocked_reason TEXT,
  last_login_at TIMESTAMPTZ,
  login_count INTEGER,
  provider TEXT,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Verificar se o chamador é admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    COALESCE(p.email, u.email) AS email,
    p.full_name,
    p.avatar_url,
    p.phone,
    COALESCE(p.plan::TEXT, 'free') AS plan,
    COALESCE(p.credits, 0) AS credits,
    COALESCE(p.is_blocked, FALSE) AS is_blocked,
    p.blocked_at,
    p.blocked_reason,
    p.last_login_at,
    COALESCE(p.login_count, 0) AS login_count,
    COALESCE(p.provider, 'email') AS provider,
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = p.id AND ur.role = 'admin'
    ) AS is_admin,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. RPC: admin_get_user_details - Detalhes completos de um usuário
-- ============================================================================
CREATE OR REPLACE FUNCTION public.admin_get_user_details(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT jsonb_build_object(
    'user', jsonb_build_object(
      'id', p.id,
      'email', COALESCE(p.email, u.email),
      'full_name', p.full_name,
      'avatar_url', p.avatar_url,
      'phone', p.phone,
      'plan', COALESCE(p.plan::TEXT, 'free'),
      'credits', COALESCE(p.credits, 0),
      'is_blocked', COALESCE(p.is_blocked, FALSE),
      'blocked_at', p.blocked_at,
      'blocked_reason', p.blocked_reason,
      'last_login_at', p.last_login_at,
      'login_count', COALESCE(p.login_count, 0),
      'provider', COALESCE(p.provider, 'email'),
      'language', p.language,
      'is_admin', EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id AND ur.role = 'admin'),
      'created_at', p.created_at,
      'updated_at', p.updated_at
    ),
    'recent_transactions', COALESCE((
      SELECT jsonb_agg(t ORDER BY t.created_at DESC)
      FROM (
        SELECT ct.id, ct.amount, ct.type, ct.source, ct.description, ct.balance_after, ct.created_at
        FROM public.credit_transactions ct
        WHERE ct.user_id = p_user_id
        ORDER BY ct.created_at DESC
        LIMIT 20
      ) t
    ), '[]'::JSONB)
  ) INTO v_result
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE p.id = p_user_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. RPC: admin_block_user - Bloquear um usuário
-- ============================================================================
CREATE OR REPLACE FUNCTION public.admin_block_user(p_user_id UUID, p_reason TEXT DEFAULT 'Bloqueado pelo administrador')
RETURNS JSONB AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  -- Não pode bloquear a si mesmo
  IF p_user_id = auth.uid() THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Não é possível bloquear a si mesmo');
  END IF;

  UPDATE public.profiles
  SET is_blocked = TRUE,
      blocked_at = NOW(),
      blocked_reason = p_reason,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Registrar na auditoria
  INSERT INTO public.admin_audit_log (admin_id, action, target_user_id, details)
  VALUES (auth.uid(), 'block_user', p_user_id, jsonb_build_object('reason', p_reason));

  RETURN jsonb_build_object('success', TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. RPC: admin_unblock_user - Desbloquear um usuário
-- ============================================================================
CREATE OR REPLACE FUNCTION public.admin_unblock_user(p_user_id UUID)
RETURNS JSONB AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  UPDATE public.profiles
  SET is_blocked = FALSE,
      blocked_at = NULL,
      blocked_reason = NULL,
      updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO public.admin_audit_log (admin_id, action, target_user_id, details)
  VALUES (auth.uid(), 'unblock_user', p_user_id, '{}'::JSONB);

  RETURN jsonb_build_object('success', TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. RPC: admin_adjust_credits - Ajustar créditos de um usuário
-- ============================================================================
CREATE OR REPLACE FUNCTION public.admin_adjust_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'Ajuste administrativo'
)
RETURNS JSONB AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_credits INTEGER;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  -- Buscar créditos atuais
  SELECT COALESCE(credits, 0) INTO v_current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'User not found');
  END IF;

  v_new_credits := GREATEST(0, v_current_credits + p_amount);

  -- Atualizar
  UPDATE public.profiles
  SET credits = v_new_credits, updated_at = NOW()
  WHERE id = p_user_id;

  -- Registrar transação
  INSERT INTO public.credit_transactions (user_id, amount, type, source, description, balance_after)
  VALUES (p_user_id, p_amount, 'admin_adjust', 'admin', p_reason, v_new_credits);

  -- Auditoria
  INSERT INTO public.admin_audit_log (admin_id, action, target_user_id, details)
  VALUES (auth.uid(), 'adjust_credits', p_user_id,
    jsonb_build_object('amount', p_amount, 'reason', p_reason, 'old_balance', v_current_credits, 'new_balance', v_new_credits));

  RETURN jsonb_build_object('success', TRUE, 'new_balance', v_new_credits);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. RPC: admin_change_plan - Alterar plano de um usuário
-- ============================================================================
CREATE OR REPLACE FUNCTION public.admin_change_plan(p_user_id UUID, p_new_plan TEXT)
RETURNS JSONB AS $$
DECLARE
  v_old_plan TEXT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT COALESCE(plan::TEXT, 'free') INTO v_old_plan
  FROM public.profiles WHERE id = p_user_id;

  UPDATE public.profiles
  SET plan = p_new_plan::user_plan, updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO public.admin_audit_log (admin_id, action, target_user_id, details)
  VALUES (auth.uid(), 'change_plan', p_user_id,
    jsonb_build_object('old_plan', v_old_plan, 'new_plan', p_new_plan));

  RETURN jsonb_build_object('success', TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 10. RPC: admin_get_stats - Estatísticas globais para o dashboard
-- ============================================================================
CREATE OR REPLACE FUNCTION public.admin_get_stats()
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM public.profiles),
    'pro_users', (SELECT COUNT(*) FROM public.profiles WHERE plan = 'pro'),
    'free_users', (SELECT COUNT(*) FROM public.profiles WHERE plan = 'free' OR plan IS NULL),
    'admin_users', (SELECT COUNT(DISTINCT user_id) FROM public.user_roles WHERE role = 'admin'),
    'blocked_users', (SELECT COUNT(*) FROM public.profiles WHERE is_blocked = TRUE),
    'total_credits_in_circulation', (SELECT COALESCE(SUM(credits), 0) FROM public.profiles),
    'new_users_7d', (SELECT COUNT(*) FROM public.profiles WHERE created_at >= NOW() - INTERVAL '7 days'),
    'new_users_30d', (SELECT COUNT(*) FROM public.profiles WHERE created_at >= NOW() - INTERVAL '30 days'),
    'credits_spent_30d', (
      SELECT COALESCE(ABS(SUM(amount)), 0)
      FROM public.credit_transactions
      WHERE type = 'spend' AND created_at >= NOW() - INTERVAL '30 days'
    ),
    'credits_earned_30d', (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.credit_transactions
      WHERE type = 'earn' AND created_at >= NOW() - INTERVAL '30 days'
    ),
    'active_users_7d', (
      SELECT COUNT(*) FROM public.profiles
      WHERE last_login_at >= NOW() - INTERVAL '7 days'
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 11. RPC: record_login - Registrar login (chamado pelo frontend)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.record_login()
RETURNS VOID AS $$
DECLARE
  v_provider TEXT;
BEGIN
  -- Detectar provider
  SELECT COALESCE(
    (SELECT raw_app_meta_data->>'provider' FROM auth.users WHERE id = auth.uid()),
    'email'
  ) INTO v_provider;

  UPDATE public.profiles
  SET
    last_login_at = NOW(),
    login_count = COALESCE(login_count, 0) + 1,
    provider = v_provider,
    email = COALESCE(email, (SELECT email FROM auth.users WHERE id = auth.uid())),
    full_name = COALESCE(full_name, (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = auth.uid())),
    avatar_url = COALESCE(avatar_url, (SELECT raw_user_meta_data->>'avatar_url' FROM auth.users WHERE id = auth.uid())),
    updated_at = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 12. Atualizar políticas do profiles para admin
-- ============================================================================
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 13. Sincronizar dados existentes (preencher email/provider de auth.users)
-- ============================================================================
DO $$
BEGIN
  UPDATE public.profiles p
  SET
    email = COALESCE(p.email, u.email),
    full_name = COALESCE(p.full_name, u.raw_user_meta_data->>'full_name'),
    avatar_url = COALESCE(p.avatar_url, u.raw_user_meta_data->>'avatar_url'),
    provider = COALESCE(p.provider, u.raw_app_meta_data->>'provider', 'email')
  FROM auth.users u
  WHERE p.id = u.id;

  RAISE NOTICE 'Dados de perfis sincronizados com auth.users.';
END $$;

-- ============================================================================
SELECT 'Admin CRM Migration concluída com sucesso!' AS status;
