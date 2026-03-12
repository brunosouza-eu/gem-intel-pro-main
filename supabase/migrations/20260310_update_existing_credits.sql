-- ====================================================================
-- SCRIPT DE AJUSTE PARA CONTAS EXISTENTES
-- Este script irá ajustar os créditos atuais de todas as contas 
-- cadastradas, redefinindo-os de acordo com o plano do usuário.
-- ====================================================================

-- 1. Redefine contas Gratuitas para 5 créditos
UPDATE public.profiles 
SET credits = 5, updated_at = NOW()
WHERE plan = 'free' OR plan IS NULL;

-- 2. Redefine contas Pro para 20 créditos (ou o limite base que decidimos)
UPDATE public.profiles 
SET credits = 20, updated_at = NOW()
WHERE plan = 'pro';

-- 3. Redefine contas Elite para 9999 créditos (ilimitado)
UPDATE public.profiles 
SET credits = 9999, updated_at = NOW()
WHERE plan = 'elite';

-- Opcional: Registrar que essas contas foram resetadas administrativamente
INSERT INTO public.credit_transactions (user_id, amount, type, source, description, balance_after)
SELECT id, 0, 'earn', 'system_reset', 'Ajuste de Saldo Administrativo', credits 
FROM public.profiles;
