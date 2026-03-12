-- Script de Correção e Permissão de Admin (Versão Robusta)
-- Execute este script no SQL Editor do Supabase Dashboard

DO $$
DECLARE
  v_user_email TEXT := 'ipcompanidigital@gmail.com'; -- SEU EMAIL AQUI
  v_user_backup_email TEXT := 'admin@gemintel.com'; -- EMAIL DE BACKUP
  v_user_id UUID;
  v_count INTEGER;
BEGIN
  -- 1. Buscar ID do usuário (tenta principal, depois backup)
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_email;
  
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_backup_email;
  END IF;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum usuário encontrado com os emails fornecidos.';
  ELSE
    RAISE NOTICE 'Usuário encontrado: %', v_user_id;
  END IF;

  -- 2. Verificar e corrigir tabela public.users (se existir)
  -- Usa SQL dinâmico para evitar erro de compilação se a tabela não existir
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    RAISE NOTICE 'Tabela public.users encontrada. Sincronizando...';
    EXECUTE '
      INSERT INTO public.users (id, email)
      SELECT id, email FROM auth.users WHERE id = $1
      ON CONFLICT (id) DO NOTHING' USING v_user_id;
  END IF;

  -- 3. Verificar e corrigir tabela public.profiles (se existir)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    RAISE NOTICE 'Tabela public.profiles encontrada. Sincronizando...';
    -- Tenta inserir apenas com ID primeiro (mais seguro)
    -- Se precisar de email/nome, o trigger handle_new_user deveria ter cuidado, mas forçamos o registro.
    EXECUTE '
      INSERT INTO public.profiles (id)
      VALUES ($1)
      ON CONFLICT (id) DO NOTHING' USING v_user_id;
  END IF;

  -- 4. Conceder Permissão de Admin
  -- Verifica se user_roles existe
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (v_user_id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
      
      RAISE NOTICE 'SUCESSO! Permissão de admin concedida ao usuário %', v_user_id;
  ELSE
      RAISE EXCEPTION 'Tabela public.user_roles não encontrada. Verifique se as migrações rodaram.';
  END IF;
  
END $$;
