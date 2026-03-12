-- PASSO 1: Verificar se o usuário existe
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'souzadecarvalho1988@gmail.com';

-- PASSO 2: Verificar se existe profile
SELECT * FROM user_profiles;

-- PASSO 3: Se não existir profile, criar um (RODE ESTE SE PASSO 2 ESTIVER VAZIO)
INSERT INTO user_profiles (id, credits, created_at, updated_at)
SELECT 
  id, 
  100 as credits,  -- Começar com 100 créditos
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users 
WHERE email = 'souzadecarvalho1988@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET credits = 100;

-- PASSO 4: Verificar novamente
SELECT 
  u.email,
  up.credits,
  up.id
FROM user_profiles up
JOIN auth.users u ON u.id = up.id;

-- ALTERNATIVA: Se você souber seu user ID, use direto
-- UPDATE user_profiles SET credits = 100 WHERE id = 'SEU_USER_ID_AQUI';
