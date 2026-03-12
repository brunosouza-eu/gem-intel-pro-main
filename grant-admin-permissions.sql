-- Script para conceder permissões de Administrador
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Dar permissão de admin para o seu usuário principal (ipcompanidigital@gmail.com)
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'ipcompanidigital@gmail.com';
  
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    RAISE NOTICE 'Admin granted to ipcompanidigital@gmail.com';
  ELSE
    RAISE NOTICE 'User ipcompanidigital@gmail.com not found';
  END IF;
END $$;

-- 2. Dar permissão de admin para o usuário de backup (admin@gemintel.com)
-- ID conhecido: 2aa08a29-920f-42fb-b3e5-facb736b2886
INSERT INTO public.user_roles (user_id, role)
VALUES ('2aa08a29-920f-42fb-b3e5-facb736b2886', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Verificar permissões atuais
SELECT u.email, ur.role
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';
