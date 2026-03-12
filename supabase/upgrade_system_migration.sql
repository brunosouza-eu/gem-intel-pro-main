-- ============================================================================
-- UPGRADE SYSTEM MIGRATION
-- Adicionando plano 'elite' ao enum e criando tabela de pacotes de créditos
-- ============================================================================

-- 1. Tentativa de adicionar valor 'elite' ao tipo enum user_plan
-- Se falhar, é porque user_plan não é enum ou já tem
DO $$
BEGIN
  ALTER TYPE public.user_plan ADD VALUE IF NOT EXISTS 'elite';
EXCEPTION
  WHEN duplicate_object THEN null; -- Já existe
  WHEN OTHERS THEN RAISE NOTICE 'Erro ao adicionar user_plan: %', SQLERRM;
END $$;

-- 2. Tabela de Pacotes de Créditos
CREATE TABLE IF NOT EXISTS public.credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  image_url TEXT,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir pacotes padrão se vazia
INSERT INTO public.credit_packages (name, credits, price, popular)
SELECT 'Starter Pack', 100, 9.90, false
WHERE NOT EXISTS (SELECT 1 FROM public.credit_packages WHERE credits = 100);

INSERT INTO public.credit_packages (name, credits, price, popular)
SELECT 'Trader Pack', 500, 39.90, true
WHERE NOT EXISTS (SELECT 1 FROM public.credit_packages WHERE credits = 500);

INSERT INTO public.credit_packages (name, credits, price, popular)
SELECT 'Whale Pack', 2000, 149.90, false
WHERE NOT EXISTS (SELECT 1 FROM public.credit_packages WHERE credits = 2000);

-- 3. Políticas RLS
ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'credit_packages' AND policyname = 'Public read access') THEN
    CREATE POLICY "Public read access" ON public.credit_packages FOR SELECT USING (true);
  END IF;
END $$;

SELECT 'Upgrade System Migration Completed' as status;
