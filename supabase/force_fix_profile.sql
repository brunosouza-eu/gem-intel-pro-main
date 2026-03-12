-- SOLUÇÃO DEFINITIVA: Criar perfil vinculado ao seu Login
-- O problema é que o sistema não criou seu perfil na tabela certa quando você logou.

-- 1. Inserir perfil na tabela user_profiles vinculado ao seu ID de usuário
INSERT INTO public.user_profiles (id, credits, username, created_at, updated_at)
SELECT 
  id, 
  100,          -- 100 Créditos
  email,        -- Usar email como username inicial
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'souzadecarvalho1988@gmail.com' -- SEU EMAIL
ON CONFLICT (id) DO UPDATE 
SET credits = 100; -- Se já existir, garante 100 créditos

-- 2. Verificar se deu certo
SELECT * FROM public.user_profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'souzadecarvalho1988@gmail.com');
