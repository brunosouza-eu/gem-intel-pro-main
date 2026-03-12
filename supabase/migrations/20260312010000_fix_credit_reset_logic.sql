-- ====================================================================
-- FIX: Lógica Robusta de REFILL Diário de Créditos
-- Impede que usuários percam créditos que foram comprados à parte nas resetações
-- ====================================================================

CREATE OR REPLACE FUNCTION public.reset_daily_credits()
RETURNS void AS $$
BEGIN
  -- 1. Usuários FREE recebem no mínimo 5 créditos para uso no dia.
  -- Se ele comprou 100 avulso e gastou 2, ele tem 98 e NÃO VAI PERDER.
  -- Se ele gastou os 5 diários e zerou, volta para 5 no dia seguinte.
  UPDATE public.profiles
  SET credits = GREATEST(credits, 5)
  WHERE plan = 'free';

  -- 2. Usuários PRO recebem no mínimo 20 créditos diários
  UPDATE public.profiles
  SET credits = GREATEST(credits, 20)
  WHERE plan = 'pro';

  -- 3. Usuários ELITE têm sempre o máximo (inclusão de 9999)
  UPDATE public.profiles
  SET credits = 9999
  WHERE plan = 'elite';

  -- 4. Registrar evento de reset no log central do sistema
  -- Apenas para monitoramento do Administrador.
  INSERT INTO public.credit_transactions (user_id, amount, type, source, description, balance_after)
  SELECT 
    id, 
    0, 
    'earn', 
    'daily_reset', 
    'Reset diário processado', 
    credits
  FROM public.profiles
  WHERE plan IN ('free', 'pro', 'elite')
  LIMIT 1; -- Log genérico para não encher a tabela, opcional dependendo do requisito futuro
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
