-- Adicionar novas colunas para dados da Binance
ALTER TABLE public.tokens 
ADD COLUMN IF NOT EXISTS current_price NUMERIC,
ADD COLUMN IF NOT EXISTS change_24h NUMERIC;

-- Habilitar realtime para a tabela tokens
ALTER TABLE public.tokens REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tokens;