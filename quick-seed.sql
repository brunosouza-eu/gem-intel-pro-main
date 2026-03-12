-- Adicionar constraint UNIQUE no ticker e popular tokens
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar constraint UNIQUE no ticker (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'tokens_ticker_unique'
    ) THEN
        ALTER TABLE public.tokens 
        ADD CONSTRAINT tokens_ticker_unique UNIQUE (ticker);
    END IF;
END $$;

-- 2. Desabilitar RLS temporariamente
ALTER TABLE public.tokens DISABLE ROW LEVEL SECURITY;

-- 3. Inserir tokens básicos (20 tokens para teste)
INSERT INTO public.tokens (name, ticker, narrative, status, score, structure, unlocks)
VALUES
  ('Bitcoin', 'BTC', 'Store of Value - Digital Gold', 'andamento', 95, 'Layer 1', 'Fully unlocked'),
  ('Ethereum', 'ETH', 'Smart Contract Platform', 'andamento', 92, 'Layer 1', 'Ongoing issuance'),
  ('Binance Coin', 'BNB', 'Exchange Token', 'andamento', 88, 'Exchange', 'Quarterly burns'),
  ('Solana', 'SOL', 'High Performance L1', 'gatilho', 85, 'Layer 1', 'Ongoing unlocks'),
  ('Ripple', 'XRP', 'Cross-Border Payments', 'acumulacao', 75, 'Payments', 'Escrow releases'),
  ('Cardano', 'ADA', 'Proof of Stake L1', 'observacao', 68, 'Layer 1', 'Ongoing unlocks'),
  ('Avalanche', 'AVAX', 'Subnet Architecture', 'acumulacao', 72, 'Layer 1', 'Vesting schedule'),
  ('Polkadot', 'DOT', 'Interoperability', 'observacao', 65, 'Layer 0', 'Parachain auctions'),
  ('Polygon', 'MATIC', 'Ethereum Scaling', 'acumulacao', 74, 'Layer 2', 'Vesting schedule'),
  ('Chainlink', 'LINK', 'Oracle Network', 'gatilho', 80, 'Infrastructure', 'Node operator rewards'),
  ('Uniswap', 'UNI', 'DEX Leader', 'acumulacao', 73, 'DeFi', '4-year vesting'),
  ('Dogecoin', 'DOGE', 'Original Memecoin', 'observacao', 65, 'Meme', 'Inflationary'),
  ('Shiba Inu', 'SHIB', 'Doge Killer', 'observacao', 62, 'Meme', 'Burn mechanism'),
  ('Pepe', 'PEPE', 'Frog Meme', 'acumulacao', 74, 'Meme', 'Fully circulating'),
  ('Render', 'RNDR', 'GPU Rendering', 'andamento', 86, 'AI', 'Burn mechanism'),
  ('Fetch.ai', 'FET', 'AI Agents', 'andamento', 88, 'AI', 'Vesting schedule'),
  ('Bittensor', 'TAO', 'Decentralized AI', 'andamento', 90, 'AI', 'Mining rewards'),
  ('Arbitrum', 'ARB', 'Optimistic Rollup', 'gatilho', 82, 'Layer 2', 'DAO treasury'),
  ('Optimism', 'OP', 'Optimistic Rollup', 'acumulacao', 78, 'Layer 2', 'Ecosystem fund'),
  ('Injective', 'INJ', 'DeFi Trading', 'andamento', 87, 'DeFi', 'Burn mechanism')
ON CONFLICT (ticker) DO UPDATE SET
  name = EXCLUDED.name,
  narrative = EXCLUDED.narrative,
  status = EXCLUDED.status,
  score = EXCLUDED.score,
  structure = EXCLUDED.structure,
  unlocks = EXCLUDED.unlocks,
  updated_at = NOW();

-- 4. Reabilitar RLS
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

-- 5. Verificar resultado
SELECT 
  status,
  COUNT(*) as total,
  AVG(score)::numeric(10,2) as avg_score
FROM public.tokens
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'andamento' THEN 1
    WHEN 'gatilho' THEN 2
    WHEN 'acumulacao' THEN 3
    WHEN 'observacao' THEN 4
  END;

-- Mostrar todos os tokens inseridos
SELECT ticker, name, score, status 
FROM public.tokens 
ORDER BY score DESC;
