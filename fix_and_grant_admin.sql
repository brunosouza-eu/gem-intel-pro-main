-- Script de Correção e Permissão de Admin
-- Execute no Supabase SQL Editor

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'ipcompanidigital@gmail.com'; -- ALTERE SE NECESSÁRIO
  v_backup_user_id UUID := '2aa08a29-920f-42fb-b3e5-facb736b2886'; -- ID do admin@gemintel.com
BEGIN
  -- 1. Tentar pegar ID do email principal
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  -- Se não achar pelo email, usa o ID do backup
  IF v_user_id IS NULL THEN
    v_user_id := v_backup_user_id;
    RAISE NOTICE 'Usuário principal não encontrado. Usando ID de backup: %', v_user_id;
  ELSE
    RAISE NOTICE 'Usuário principal encontrado: %', v_user_id;
  END IF;

  -- 2. Garantir que o usuário existe na tabela public.users (se ela existir)
  -- Isso corrige o erro de Foreign Key se user_roles referenciar public.users
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    RAISE NOTICE 'Tabela public.users detectada. Sincronizando...';
    
    INSERT INTO public.users (id, email)
    SELECT id, email FROM auth.users WHERE id = v_user_id
    ON CONFLICT (id) DO NOTHING;
    
    -- Se a tabela users tiver outras colunas obrigatórias, isso pode falhar, 
    -- mas geralmente é id e email.
  END IF;

  -- 3. Garantir que o usuário existe na tabela public.profiles
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    RAISE NOTICE 'Tabela public.profiles detectada. Sincronizando...';
    
    INSERT INTO public.profiles (id, email) -- Tenta inserir com email se a coluna existir
    SELECT id, email FROM auth.users WHERE id = v_user_id
    ON CONFLICT (id) DO NOTHING;
    
    -- Se falhar porque não tem email, tenta só ID (tratamento de erro básico via bloco separado seria ideal, 
    -- mas vamos assumir estrutura padrão ou ignorar erro de coluna inexistente se possível. 
    -- Como SQL não deixa "tentar" coluna, vamos assumir que o trigger padrão cuidaria disso, 
    -- mas manual é forçado aqui).
  END IF;

  -- 4. Inserir a Role de Admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Permissão de admin concedida com sucesso para %', v_user_id;

END $$;
