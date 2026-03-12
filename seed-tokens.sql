-- ============================================================================
-- SEED DE TOKENS - GEM INTEL / TRADE MASTER PRO
-- Execute este script no Supabase SQL Editor para popular o banco de dados
-- ============================================================================

-- Desabilitar RLS temporariamente para inserção
ALTER TABLE public.tokens DISABLE ROW LEVEL SECURITY;

-- Limpar tokens existentes (opcional - comente se não quiser limpar)
-- TRUNCATE TABLE public.tokens CASCADE;

-- Inserir tokens principais (Top 20)
INSERT INTO public.tokens (name, ticker, narrative, status, score, market_cap, supply, structure, unlocks) VALUES
('Bitcoin', 'BTC', 'Store of Value', 'andamento', 95, 800000000000, 21000000, 'Layer 1 - Store of Value', 'Fully unlocked'),
('Ethereum', 'ETH', 'Smart Contracts', 'andamento', 92, 300000000000, 120000000, 'Layer 1 - Smart Contracts', 'Ongoing issuance'),
('Binance Coin', 'BNB', 'Exchange Token', 'andamento', 88, 50000000000, 200000000, 'Exchange - Exchange Token', 'Quarterly burns'),
('Solana', 'SOL', 'High Performance L1', 'gatilho', 85, 40000000000, 500000000, 'Layer 1 - High Performance L1', 'Ongoing unlocks'),
('Ripple', 'XRP', 'Cross-Border Payments', 'acumulacao', 75, 30000000000, 100000000000, 'Payments - Cross-Border Payments', 'Escrow releases'),
('Cardano', 'ADA', 'Proof of Stake L1', 'observacao', 68, 15000000000, 45000000000, 'Layer 1 - Proof of Stake L1', 'Ongoing unlocks'),
('Avalanche', 'AVAX', 'Subnet Architecture', 'acumulacao', 72, 12000000000, 400000000, 'Layer 1 - Subnet Architecture', 'Vesting schedule'),
('Polkadot', 'DOT', 'Interoperability', 'observacao', 65, 10000000000, 1200000000, 'Layer 0 - Interoperability', 'Parachain auctions'),
('Polygon', 'MATIC', 'Ethereum Scaling', 'acumulacao', 74, 8000000000, 10000000000, 'Layer 2 - Ethereum Scaling', 'Vesting schedule'),
('Chainlink', 'LINK', 'Oracle Network', 'gatilho', 80, 7000000000, 1000000000, 'Infrastructure - Oracle Network', 'Node operator rewards'),
('Uniswap', 'UNI', 'DEX Leader', 'acumulacao', 73, 5000000000, 1000000000, 'DeFi - DEX Leader', '4-year vesting'),
('Cosmos', 'ATOM', 'Internet of Blockchains', 'observacao', 67, 4000000000, 300000000, 'Layer 0 - Internet of Blockchains', 'Staking rewards'),
('Litecoin', 'LTC', 'Digital Silver', 'observacao', 60, 3500000000, 84000000, 'Payments - Digital Silver', 'Halving schedule'),
('Bitcoin Cash', 'BCH', 'P2P Cash', 'observacao', 58, 3000000000, 21000000, 'Payments - P2P Cash', 'Halving schedule'),
('Stellar', 'XLM', 'Financial Inclusion', 'observacao', 62, 2500000000, 50000000000, 'Payments - Financial Inclusion', 'Inflation pool'),
('Algorand', 'ALGO', 'Pure PoS', 'observacao', 64, 2000000000, 10000000000, 'Layer 1 - Pure PoS', 'Governance rewards'),
('VeChain', 'VET', 'Supply Chain', 'observacao', 59, 1800000000, 86000000000, 'Enterprise - Supply Chain', 'Enterprise adoption'),
('Filecoin', 'FIL', 'Decentralized Storage', 'observacao', 66, 1500000000, 2000000000, 'Storage - Decentralized Storage', 'Mining rewards'),
('Aave', 'AAVE', 'Lending Protocol', 'acumulacao', 76, 1400000000, 16000000, 'DeFi - Lending Protocol', 'Ecosystem reserve'),
('Tron', 'TRX', 'Content Distribution', 'observacao', 61, 1300000000, 100000000000, 'Layer 1 - Content Distribution', 'Fully circulating')
ON CONFLICT (ticker) DO UPDATE SET
  name = EXCLUDED.name,
  narrative = EXCLUDED.narrative,
  status = EXCLUDED.status,
  score = EXCLUDED.score,
  market_cap = EXCLUDED.market_cap,
  supply = EXCLUDED.supply,
  structure = EXCLUDED.structure,
  unlocks = EXCLUDED.unlocks,
  updated_at = NOW();

-- Inserir Altcoins (30)
INSERT INTO public.tokens (name, ticker, narrative, status, score, market_cap, supply, structure, unlocks) VALUES
('Arbitrum', 'ARB', 'Optimistic Rollup', 'gatilho', 82, 5000000000, 10000000000, 'Layer 2 - Optimistic Rollup', 'DAO treasury'),
('Optimism', 'OP', 'Optimistic Rollup', 'acumulacao', 78, 4500000000, 4300000000, 'Layer 2 - Optimistic Rollup', 'Ecosystem fund'),
('Aptos', 'APT', 'Move Language L1', 'acumulacao', 77, 4000000000, 1000000000, 'Layer 1 - Move Language L1', 'Vesting schedule'),
('Sui', 'SUI', 'Move Language L1', 'gatilho', 81, 3800000000, 10000000000, 'Layer 1 - Move Language L1', 'Vesting schedule'),
('Sei', 'SEI', 'Trading Optimized L1', 'gatilho', 83, 3500000000, 10000000000, 'Layer 1 - Trading Optimized L1', 'Ecosystem growth'),
('Injective', 'INJ', 'DeFi Trading', 'andamento', 87, 3200000000, 100000000, 'DeFi - DeFi Trading', 'Burn mechanism'),
('Celestia', 'TIA', 'Modular Blockchain', 'acumulacao', 79, 3000000000, 1000000000, 'Infrastructure - Modular Blockchain', 'Staking rewards'),
('THORChain', 'RUNE', 'Cross-Chain DEX', 'acumulacao', 75, 2800000000, 500000000, 'DeFi - Cross-Chain DEX', 'Liquidity mining'),
('NEAR Protocol', 'NEAR', 'Sharded L1', 'observacao', 69, 2500000000, 1000000000, 'Layer 1 - Sharded L1', 'Vesting schedule'),
('Fantom', 'FTM', 'DAG-based L1', 'observacao', 63, 2200000000, 3200000000, 'Layer 1 - DAG-based L1', 'Ecosystem fund'),
('Hedera', 'HBAR', 'Hashgraph', 'observacao', 65, 2000000000, 50000000000, 'Enterprise - Hashgraph', 'Council releases'),
('Immutable X', 'IMX', 'NFT Scaling', 'acumulacao', 74, 1800000000, 2000000000, 'Layer 2 - NFT Scaling', 'Ecosystem rewards'),
('The Sandbox', 'SAND', 'Metaverse', 'observacao', 60, 1600000000, 3000000000, 'Gaming - Metaverse', 'Game fund'),
('Decentraland', 'MANA', 'Virtual World', 'observacao', 58, 1500000000, 2200000000, 'Gaming - Virtual World', 'DAO treasury'),
('Axie Infinity', 'AXS', 'Play-to-Earn', 'observacao', 62, 1400000000, 270000000, 'Gaming - Play-to-Earn', 'Staking rewards'),
('Gala', 'GALA', 'Gaming Platform', 'observacao', 59, 1300000000, 50000000000, 'Gaming - Gaming Platform', 'Node rewards'),
('Enjin', 'ENJ', 'NFT Platform', 'observacao', 61, 1200000000, 1000000000, 'Gaming - NFT Platform', 'Ecosystem growth'),
('Chiliz', 'CHZ', 'Sports Fan Tokens', 'observacao', 57, 1100000000, 9000000000, 'Entertainment - Sports Fan Tokens', 'Fan engagement'),
('Stacks', 'STX', 'Bitcoin L2', 'acumulacao', 76, 1000000000, 1800000000, 'Layer 2 - Bitcoin L2', 'Mining rewards'),
('Kaspa', 'KAS', 'BlockDAG', 'gatilho', 84, 950000000, 28000000000, 'Layer 1 - BlockDAG', 'Mining rewards'),
('Render', 'RNDR', 'GPU Rendering', 'andamento', 86, 900000000, 500000000, 'AI - GPU Rendering', 'Burn mechanism'),
('The Graph', 'GRT', 'Indexing Protocol', 'observacao', 68, 850000000, 10000000000, 'Infrastructure - Indexing Protocol', 'Indexer rewards'),
('Maker', 'MKR', 'Decentralized Stablecoin', 'acumulacao', 77, 800000000, 1000000, 'DeFi - Decentralized Stablecoin', 'Burn mechanism'),
('Curve', 'CRV', 'Stablecoin DEX', 'observacao', 66, 750000000, 3300000000, 'DeFi - Stablecoin DEX', 'Vesting schedule'),
('Synthetix', 'SNX', 'Synthetic Assets', 'observacao', 64, 700000000, 300000000, 'DeFi - Synthetic Assets', 'Staking rewards'),
('Compound', 'COMP', 'Lending Protocol', 'observacao', 67, 650000000, 10000000, 'DeFi - Lending Protocol', 'Governance'),
('Lido DAO', 'LDO', 'Liquid Staking', 'acumulacao', 78, 600000000, 1000000000, 'DeFi - Liquid Staking', 'DAO treasury'),
('Pendle', 'PENDLE', 'Yield Trading', 'gatilho', 82, 550000000, 260000000, 'DeFi - Yield Trading', 'Liquidity mining'),
('Blur', 'BLUR', 'NFT Marketplace', 'observacao', 63, 500000000, 3000000000, 'NFT - NFT Marketplace', 'Airdrop schedule'),
('Worldcoin', 'WLD', 'Universal ID', 'acumulacao', 75, 450000000, 10000000000, 'Identity - Universal ID', 'Grant program')
ON CONFLICT (ticker) DO UPDATE SET
  name = EXCLUDED.name,
  narrative = EXCLUDED.narrative,
  status = EXCLUDED.status,
  score = EXCLUDED.score,
  market_cap = EXCLUDED.market_cap,
  supply = EXCLUDED.supply,
  structure = EXCLUDED.structure,
  unlocks = EXCLUDED.unlocks,
  updated_at = NOW();

-- Inserir Memecoins (20)
INSERT INTO public.tokens (name, ticker, narrative, status, score, market_cap, supply, structure, unlocks) VALUES
('Dogecoin', 'DOGE', 'Original Memecoin', 'observacao', 65, 15000000000, 140000000000, 'Meme - Original Memecoin', 'Inflationary'),
('Shiba Inu', 'SHIB', 'Doge Killer', 'observacao', 62, 8000000000, 590000000000000, 'Meme - Doge Killer', 'Burn mechanism'),
('Pepe', 'PEPE', 'Frog Meme', 'acumulacao', 74, 5000000000, 420000000000000, 'Meme - Frog Meme', 'Fully circulating'),
('Floki', 'FLOKI', 'Viking Meme', 'observacao', 60, 2000000000, 10000000000000, 'Meme - Viking Meme', 'Ecosystem fund'),
('Bonk', 'BONK', 'Solana Meme', 'acumulacao', 72, 1800000000, 100000000000000, 'Meme - Solana Meme', 'Community driven'),
('dogwifhat', 'WIF', 'Dog with Hat', 'gatilho', 80, 1600000000, 1000000000, 'Meme - Dog with Hat', 'Fully circulating'),
('Memecoin', 'MEME', 'Memecoin', 'observacao', 58, 1400000000, 100000000000, 'Meme - Memecoin', 'NFT rewards'),
('Baby Doge', 'BABYDOGE', 'Baby Doge', 'observacao', 56, 1200000000, 420000000000000, 'Meme - Baby Doge', 'Reflection rewards'),
('Snek', 'SNEK', 'Cardano Meme', 'observacao', 59, 1000000000, 77000000000, 'Meme - Cardano Meme', 'Community'),
('Popcat', 'POPCAT', 'Cat Meme', 'acumulacao', 71, 900000000, 1000000000, 'Meme - Cat Meme', 'Fully circulating'),
('Mog Coin', 'MOG', 'Mog Meme', 'observacao', 57, 800000000, 390000000000, 'Meme - Mog Meme', 'Community'),
('Brett', 'BRETT', 'Base Meme', 'acumulacao', 73, 750000000, 10000000000, 'Meme - Base Meme', 'Fully circulating'),
('Book of Meme', 'BOME', 'Meme Book', 'observacao', 61, 700000000, 69000000000, 'Meme - Meme Book', 'Fully circulating'),
('Myro', 'MYRO', 'Solana Dog', 'observacao', 60, 650000000, 1000000000, 'Meme - Solana Dog', 'Fully circulating'),
('Turbo', 'TURBO', 'AI Meme', 'observacao', 59, 600000000, 69000000000, 'Meme - AI Meme', 'Fully circulating'),
('Wen', 'WEN', 'Wen Meme', 'observacao', 58, 550000000, 1000000000000, 'Meme - Wen Meme', 'Community'),
('Coq Inu', 'COQ', 'Avax Meme', 'observacao', 57, 500000000, 69000000000000, 'Meme - Avax Meme', 'Fully circulating'),
('Smog', 'SMOG', 'Dragon Meme', 'observacao', 56, 450000000, 1400000000, 'Meme - Dragon Meme', 'Airdrop'),
('Slerf', 'SLERF', 'Sloth Meme', 'observacao', 55, 400000000, 10000000000, 'Meme - Sloth Meme', 'Fully circulating'),
('Ponke', 'PONKE', 'Monkey Meme', 'observacao', 54, 350000000, 555000000, 'Meme - Monkey Meme', 'Fully circulating')
ON CONFLICT (ticker) DO UPDATE SET
  name = EXCLUDED.name,
  narrative = EXCLUDED.narrative,
  status = EXCLUDED.status,
  score = EXCLUDED.score,
  market_cap = EXCLUDED.market_cap,
  supply = EXCLUDED.supply,
  structure = EXCLUDED.structure,
  unlocks = EXCLUDED.unlocks,
  updated_at = NOW();

-- Inserir AI & Data (15)
INSERT INTO public.tokens (name, ticker, narrative, status, score, market_cap, supply, structure, unlocks) VALUES
('Fetch.ai', 'FET', 'AI Agents', 'andamento', 88, 2500000000, 2700000000, 'AI - AI Agents', 'Vesting schedule'),
('SingularityNET', 'AGIX', 'AI Marketplace', 'acumulacao', 76, 2200000000, 2000000000, 'AI - AI Marketplace', 'Ecosystem fund'),
('Ocean Protocol', 'OCEAN', 'Data Marketplace', 'observacao', 68, 2000000000, 1400000000, 'AI - Data Marketplace', 'Data rewards'),
('Bittensor', 'TAO', 'Decentralized AI', 'andamento', 90, 1800000000, 21000000, 'AI - Decentralized AI', 'Mining rewards'),
('Akash Network', 'AKT', 'Cloud Computing', 'acumulacao', 75, 1600000000, 388000000, 'Infrastructure - Cloud Computing', 'Provider rewards'),
('Oasis Network', 'ROSE', 'Privacy AI', 'observacao', 66, 1400000000, 10000000000, 'Privacy - Privacy AI', 'Staking rewards'),
('Artificial Superintelligence', 'ASI', 'AI Alliance', 'gatilho', 84, 1200000000, 2700000000, 'AI - AI Alliance', 'Merger tokens'),
('Arkham', 'ARKM', 'Blockchain Intel', 'acumulacao', 77, 1000000000, 1000000000, 'Analytics - Blockchain Intel', 'Data rewards'),
('Numeraire', 'NMR', 'AI Hedge Fund', 'observacao', 64, 900000000, 11000000, 'AI - AI Hedge Fund', 'Staking rewards'),
('Phala Network', 'PHA', 'Cloud Computing', 'observacao', 62, 800000000, 1000000000, 'Infrastructure - Cloud Computing', 'Mining rewards'),
('Cortex', 'CTXC', 'AI on Blockchain', 'observacao', 60, 700000000, 300000000, 'AI - AI on Blockchain', 'Mining rewards'),
('DeepBrain Chain', 'DBC', 'AI Computing', 'observacao', 59, 600000000, 10000000000, 'AI - AI Computing', 'Node rewards'),
('Matrix AI', 'MAN', 'AI Blockchain', 'observacao', 58, 500000000, 1000000000, 'AI - AI Blockchain', 'Mining rewards'),
('Velas', 'VLX', 'AI DPoS', 'observacao', 61, 450000000, 2500000000, 'Layer 1 - AI DPoS', 'Staking rewards'),
('OriginTrail', 'TRAC', 'Knowledge Graph', 'acumulacao', 74, 400000000, 500000000, 'Data - Knowledge Graph', 'Node rewards')
ON CONFLICT (ticker) DO UPDATE SET
  name = EXCLUDED.name,
  narrative = EXCLUDED.narrative,
  status = EXCLUDED.status,
  score = EXCLUDED.score,
  market_cap = EXCLUDED.market_cap,
  supply = EXCLUDED.supply,
  structure = EXCLUDED.structure,
  unlocks = EXCLUDED.unlocks,
  updated_at = NOW();

-- Inserir DeFi (10)
INSERT INTO public.tokens (name, ticker, narrative, status, score, market_cap, supply, structure, unlocks) VALUES
('GMX', 'GMX', 'Perpetual DEX', 'acumulacao', 79, 1200000000, 13000000, 'DeFi - Perpetual DEX', 'Vesting schedule'),
('dYdX', 'DYDX', 'Derivatives DEX', 'acumulacao', 78, 1100000000, 1000000000, 'DeFi - Derivatives DEX', 'Ecosystem fund'),
('Yearn Finance', 'YFI', 'Yield Aggregator', 'observacao', 70, 1000000000, 37000, 'DeFi - Yield Aggregator', 'Fully circulating'),
('SushiSwap', 'SUSHI', 'Community DEX', 'observacao', 65, 900000000, 280000000, 'DeFi - Community DEX', 'Vesting schedule'),
('1inch', '1INCH', 'DEX Aggregator', 'observacao', 67, 850000000, 1500000000, 'DeFi - DEX Aggregator', 'Vesting schedule'),
('Balancer', 'BAL', 'Liquidity Pools', 'observacao', 66, 800000000, 100000000, 'DeFi - Liquidity Pools', 'Ecosystem fund'),
('Convex Finance', 'CVX', 'Curve Boost', 'observacao', 68, 750000000, 100000000, 'DeFi - Curve Boost', 'Vesting schedule'),
('Frax Share', 'FXS', 'Fractional Stablecoin', 'observacao', 69, 700000000, 100000000, 'DeFi - Fractional Stablecoin', 'Vesting schedule'),
('Rocket Pool', 'RPL', 'Decentralized Staking', 'observacao', 71, 650000000, 20000000, 'DeFi - Decentralized Staking', 'Node rewards'),
('Liquity', 'LQTY', 'Interest-Free Loans', 'observacao', 67, 600000000, 100000000, 'DeFi - Interest-Free Loans', 'Stability pool')
ON CONFLICT (ticker) DO UPDATE SET
  name = EXCLUDED.name,
  narrative = EXCLUDED.narrative,
  status = EXCLUDED.status,
  score = EXCLUDED.score,
  market_cap = EXCLUDED.market_cap,
  supply = EXCLUDED.supply,
  structure = EXCLUDED.structure,
  unlocks = EXCLUDED.unlocks,
  updated_at = NOW();

-- Reabilitar RLS
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

-- Verificar quantos tokens foram inseridos
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

-- Mostrar total
SELECT COUNT(*) as total_tokens FROM public.tokens;

-- Mostrar top 10 por score
SELECT ticker, name, score, status 
FROM public.tokens 
ORDER BY score DESC 
LIMIT 10;
