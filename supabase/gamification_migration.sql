-- ============================================================================
-- GAMIFICATION SYSTEM MIGRATION
-- Recuperando dados de gamificação da tabela antiga (user_profiles_backup)
-- para a tabela principal (profiles)
-- ============================================================================

DO $$
BEGIN
  -- 1. Adicionar colunas de gamificação ao profiles (se não existirem)
  
  -- XP
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='xp') THEN
    ALTER TABLE public.profiles ADD COLUMN xp INTEGER DEFAULT 0;
  END IF;

  -- Level
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='level') THEN
    ALTER TABLE public.profiles ADD COLUMN level INTEGER DEFAULT 1;
  END IF;

  -- Streak Days
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='streak_days') THEN
    ALTER TABLE public.profiles ADD COLUMN streak_days INTEGER DEFAULT 0;
  END IF;

  -- Longest Streak
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='longest_streak') THEN
    ALTER TABLE public.profiles ADD COLUMN longest_streak INTEGER DEFAULT 0;
  END IF;

  -- Total Analyses Viewed
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='total_analyses_viewed') THEN
    ALTER TABLE public.profiles ADD COLUMN total_analyses_viewed INTEGER DEFAULT 0;
  END IF;

  -- Total Guru Uses
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='total_guru_uses') THEN
    ALTER TABLE public.profiles ADD COLUMN total_guru_uses INTEGER DEFAULT 0;
  END IF;

  -- VIP Expires At
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='vip_expires_at') THEN
    ALTER TABLE public.profiles ADD COLUMN vip_expires_at TIMESTAMPTZ;
  END IF;

  RAISE NOTICE 'Colunas de gamificação adicionadas ao profiles.';

  -- 2. Migrar dados da tabela de backup (se existir)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles_backup') THEN
    
    UPDATE public.profiles p
    SET 
      xp = COALESCE(up.xp, p.xp, 0),
      level = COALESCE(up.level, p.level, 1),
      streak_days = COALESCE(up.streak_days, p.streak_days, 0),
      longest_streak = COALESCE(up.longest_streak, p.longest_streak, 0),
      total_analyses_viewed = COALESCE(up.total_analyses_viewed, p.total_analyses_viewed, 0),
      total_guru_uses = COALESCE(up.total_guru_uses, p.total_guru_uses, 0),
      vip_expires_at = up.vip_expires_at
    FROM public.user_profiles_backup up
    WHERE p.id = up.id;

    RAISE NOTICE 'Dados de gamificação migrados de user_profiles_backup.';
  END IF;

END $$;

-- 3. Atualizar a View para incluir colunas de gamificação (para compatibilidade)
DROP VIEW IF EXISTS public.user_profiles;

CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
  id,
  email,
  credits,
  plan,
  full_name,
  avatar_url,
  xp,
  level,
  streak_days,
  longest_streak,
  total_analyses_viewed,
  total_guru_uses,
  vip_expires_at,
  -- Mapear last_login_at (profiles) para last_login_date (esperado pelo gamification)
  last_login_at::DATE as last_login_date,
  -- Mapear id para user_id (alguns scripts usam user_id)
  id as user_id,
  -- Mapear email para username (fallback)
  COALESCE(email, 'user') as username,
  -- Mapear plan para plan_type (esperado 'starter' | 'vip')
  CASE WHEN plan = 'pro' THEN 'vip' ELSE 'starter' END as plan_type
FROM public.profiles;

SELECT 'Gamification Migration Completed' as status;
