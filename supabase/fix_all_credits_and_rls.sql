-- SCRIPT ROBUSTO DE CORREÇÃO DE CRÉDITOS E PERMISSÕES

-- 1. Garantir que a tabela user_profiles tem a coluna credits
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 50;

-- 2. RESETAR POLÍTICAS DE SEGURANÇA (RLS)
-- Primeiro removemos as existentes para evitar erro de "already exists"
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Habilitar RLS na tabela
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Recriar Policies Permissivas
CREATE POLICY "Users can view own profile" ON public.user_profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. SINCRONIZAR TODOS OS USUÁRIOS (Para consertar sua outra conta também)
-- Isso pega TODOS os usuários do sistema de Auth e garante que eles tenham perfil com 100 créditos
INSERT INTO public.user_profiles (id, credits, username, created_at, updated_at)
SELECT 
  id, 
  100,          -- 100 Créditos para todos
  email,        -- Email como username
  NOW(),
  NOW()
FROM auth.users
ON CONFLICT (id) DO UPDATE 
SET credits = CASE 
    WHEN user_profiles.credits < 10 THEN 100 -- Se tiver menos de 10, recarrega para 100
    ELSE user_profiles.credits           -- Se já tiver saldo, mantém
END;

-- 4. Confirmação
SELECT email, credits FROM public.user_profiles
LEFT JOIN auth.users ON user_profiles.id = auth.users.id;
