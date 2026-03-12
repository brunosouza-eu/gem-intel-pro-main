-- FIX: Adicionar coluna 'credits' na tabela profiles
-- E criar trigger para inicializar novos usuários com 50 créditos

-- PASSO 1: Adicionar coluna credits
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 50;

-- PASSO 2: Atualizar usuários existentes que têm 0 ou NULL
UPDATE public.profiles 
SET credits = 50 
WHERE credits IS NULL OR credits = 0;

-- PASSO 3: Modificar trigger para incluir créditos iniciais
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan, language, credits)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'pt'),
    50  -- 🎁 Créditos iniciais!
  );
  RETURN NEW;
END;
$$;

-- PASSO 4: Criar view 'user_profiles' para compatibilidade com código existente
CREATE OR REPLACE VIEW user_profiles AS
SELECT * FROM profiles;

-- PASSO 5: Permitir INSERT/UPDATE via view
CREATE OR REPLACE RULE user_profiles_insert AS
ON INSERT TO user_profiles
DO INSTEAD
  INSERT INTO profiles VALUES (NEW.*);

CREATE OR REPLACE RULE user_profiles_update AS
ON UPDATE TO user_profiles
DO INSTEAD
  UPDATE profiles 
  SET 
    email = NEW.email,
    plan = NEW.plan,
    language = NEW.language,
    credits = NEW.credits,
    updated_at = NOW()
  WHERE id = OLD.id;
