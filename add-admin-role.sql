-- Script para adicionar permissões de administrador
-- User ID: 2aa08a29-920f-42fb-b3e5-facb736b2886
-- Email: admin@gemintel.com

-- 1. Verificar se o usuário existe
SELECT id, email, created_at 
FROM auth.users 
WHERE id = '2aa08a29-920f-42fb-b3e5-facb736b2886';

-- 2. Verificar se o perfil foi criado
SELECT * 
FROM public.profiles 
WHERE id = '2aa08a29-920f-42fb-b3e5-facb736b2886';

-- 3. Adicionar role de admin
INSERT INTO public.user_roles (user_id, role) 
VALUES ('2aa08a29-920f-42fb-b3e5-facb736b2886', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 4. Verificar se a role foi adicionada
SELECT ur.*, u.email 
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.user_id = '2aa08a29-920f-42fb-b3e5-facb736b2886';

-- 5. (Opcional) Atualizar plano para PRO
UPDATE public.profiles 
SET plan = 'pro', updated_at = now()
WHERE id = '2aa08a29-920f-42fb-b3e5-facb736b2886';
