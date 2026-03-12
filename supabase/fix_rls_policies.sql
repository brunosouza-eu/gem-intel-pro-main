-- Verificar Policies da tabela user_profiles
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- SE não houver policies (ou se estiverem bloqueando), liberar leitura para o dono
-- 1. Habilitar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Criar Policy de Leitura
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
FOR SELECT USING (auth.uid() = id);

-- 3. Criar Policy de Update (precisa para gastar créditos)
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE USING (auth.uid() = id);

-- 4. Criar Policy de Insert (para novos usuários)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);
