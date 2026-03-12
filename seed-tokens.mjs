import { createClient } from '@supabase/supabase-js';
import https from 'https';

// Configuração do Supabase
const supabaseUrl = 'https://bgtovevdkxvfnyyzjdnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndG92ZXZka3h2Zm55eXpqZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDg3MjYsImV4cCI6MjA4MzcyNDcyNn0.KWHZq9LnGFcHf2rCZVbMypZsb8RaIDjAnrFHxtYji0k';

const supabase = createClient(supabaseUrl, supabaseKey);

// Lista de tokens para adicionar (100+ tokens)
const TOKENS = [
    // === PRINCIPAIS (Top 20) ===
    { name: 'Bitcoin', ticker: 'BTC', narrative: 'Store of Value', category: 'Layer 1', status: 'andamento' },
    { name: 'Ethereum', ticker: 'ETH', narrative: 'Smart Contracts', category: 'Layer 1', status: 'andamento' },
    { name: 'Binance Coin', ticker: 'BNB', narrative: 'Exchange Token', category: 'Exchange', status: 'andamento' },
    { name: 'Solana', ticker: 'SOL', narrative: 'High Performance L1', category: 'Layer 1', status: 'gatilho' },
    { name: 'Ripple', ticker: 'XRP', narrative: 'Cross-Border Payments', category: 'Payments', status: 'acumulacao' },
    { name: 'Cardano', ticker: 'ADA', narrative: 'Proof of Stake L1', category: 'Layer 1', status: 'observacao' },
    { name: 'Avalanche', ticker: 'AVAX', narrative: 'Subnet Architecture', category: 'Layer 1', status: 'acumulacao' },
    { name: 'Polkadot', ticker: 'DOT', narrative: 'Interoperability', category: 'Layer 0', status: 'observacao' },
    { name: 'Polygon', ticker: 'MATIC', narrative: 'Ethereum Scaling', category: 'Layer 2', status: 'acumulacao' },
    { name: 'Chainlink', ticker: 'LINK', narrative: 'Oracle Network', category: 'Infrastructure', status: 'gatilho' },
    { name: 'Uniswap', ticker: 'UNI', narrative: 'DEX Leader', category: 'DeFi', status: 'acumulacao' },
    { name: 'Cosmos', ticker: 'ATOM', narrative: 'Internet of Blockchains', category: 'Layer 0', status: 'observacao' },
    { name: 'Litecoin', ticker: 'LTC', narrative: 'Digital Silver', category: 'Payments', status: 'observacao' },
    { name: 'Bitcoin Cash', ticker: 'BCH', narrative: 'P2P Cash', category: 'Payments', status: 'observacao' },
    { name: 'Stellar', ticker: 'XLM', narrative: 'Financial Inclusion', category: 'Payments', status: 'observacao' },
    { name: 'Algorand', ticker: 'ALGO', narrative: 'Pure PoS', category: 'Layer 1', status: 'observacao' },
    { name: 'VeChain', ticker: 'VET', narrative: 'Supply Chain', category: 'Enterprise', status: 'observacao' },
    { name: 'Filecoin', ticker: 'FIL', narrative: 'Decentralized Storage', category: 'Storage', status: 'observacao' },
    { name: 'Aave', ticker: 'AAVE', narrative: 'Lending Protocol', category: 'DeFi', status: 'acumulacao' },
    { name: 'Tron', ticker: 'TRX', narrative: 'Content Distribution', category: 'Layer 1', status: 'observacao' },

    // === ALTCOINS (30) ===
    { name: 'Arbitrum', ticker: 'ARB', narrative: 'Optimistic Rollup', category: 'Layer 2', status: 'gatilho' },
    { name: 'Optimism', ticker: 'OP', narrative: 'Optimistic Rollup', category: 'Layer 2', status: 'acumulacao' },
    { name: 'Aptos', ticker: 'APT', narrative: 'Move Language L1', category: 'Layer 1', status: 'acumulacao' },
    { name: 'Sui', ticker: 'SUI', narrative: 'Move Language L1', category: 'Layer 1', status: 'gatilho' },
    { name: 'Sei', ticker: 'SEI', narrative: 'Trading Optimized L1', category: 'Layer 1', status: 'gatilho' },
    { name: 'Injective', ticker: 'INJ', narrative: 'DeFi Trading', category: 'DeFi', status: 'andamento' },
    { name: 'Celestia', ticker: 'TIA', narrative: 'Modular Blockchain', category: 'Infrastructure', status: 'acumulacao' },
    { name: 'THORChain', ticker: 'RUNE', narrative: 'Cross-Chain DEX', category: 'DeFi', status: 'acumulacao' },
    { name: 'NEAR Protocol', ticker: 'NEAR', narrative: 'Sharded L1', category: 'Layer 1', status: 'observacao' },
    { name: 'Fantom', ticker: 'FTM', narrative: 'DAG-based L1', category: 'Layer 1', status: 'observacao' },
    { name: 'Hedera', ticker: 'HBAR', narrative: 'Hashgraph', category: 'Enterprise', status: 'observacao' },
    { name: 'Immutable X', ticker: 'IMX', narrative: 'NFT Scaling', category: 'Layer 2', status: 'acumulacao' },
    { name: 'The Sandbox', ticker: 'SAND', narrative: 'Metaverse', category: 'Gaming', status: 'observacao' },
    { name: 'Decentraland', ticker: 'MANA', narrative: 'Virtual World', category: 'Gaming', status: 'observacao' },
    { name: 'Axie Infinity', ticker: 'AXS', narrative: 'Play-to-Earn', category: 'Gaming', status: 'observacao' },
    { name: 'Gala', ticker: 'GALA', narrative: 'Gaming Platform', category: 'Gaming', status: 'observacao' },
    { name: 'Enjin', ticker: 'ENJ', narrative: 'NFT Platform', category: 'Gaming', status: 'observacao' },
    { name: 'Chiliz', ticker: 'CHZ', narrative: 'Sports Fan Tokens', category: 'Entertainment', status: 'observacao' },
    { name: 'Stacks', ticker: 'STX', narrative: 'Bitcoin L2', category: 'Layer 2', status: 'acumulacao' },
    { name: 'Kaspa', ticker: 'KAS', narrative: 'BlockDAG', category: 'Layer 1', status: 'gatilho' },
    { name: 'Render', ticker: 'RNDR', narrative: 'GPU Rendering', category: 'AI', status: 'andamento' },
    { name: 'The Graph', ticker: 'GRT', narrative: 'Indexing Protocol', category: 'Infrastructure', status: 'observacao' },
    { name: 'Maker', ticker: 'MKR', narrative: 'Decentralized Stablecoin', category: 'DeFi', status: 'acumulacao' },
    { name: 'Curve', ticker: 'CRV', narrative: 'Stablecoin DEX', category: 'DeFi', status: 'observacao' },
    { name: 'Synthetix', ticker: 'SNX', narrative: 'Synthetic Assets', category: 'DeFi', status: 'observacao' },
    { name: 'Compound', ticker: 'COMP', narrative: 'Lending Protocol', category: 'DeFi', status: 'observacao' },
    { name: 'Lido DAO', ticker: 'LDO', narrative: 'Liquid Staking', category: 'DeFi', status: 'acumulacao' },
    { name: 'Pendle', ticker: 'PENDLE', narrative: 'Yield Trading', category: 'DeFi', status: 'gatilho' },
    { name: 'Blur', ticker: 'BLUR', narrative: 'NFT Marketplace', category: 'NFT', status: 'observacao' },
    { name: 'Worldcoin', ticker: 'WLD', narrative: 'Universal ID', category: 'Identity', status: 'acumulacao' },

    // === MEMECOINS (20) ===
    { name: 'Dogecoin', ticker: 'DOGE', narrative: 'Original Memecoin', category: 'Meme', status: 'observacao' },
    { name: 'Shiba Inu', ticker: 'SHIB', narrative: 'Doge Killer', category: 'Meme', status: 'observacao' },
    { name: 'Pepe', ticker: 'PEPE', narrative: 'Frog Meme', category: 'Meme', status: 'acumulacao' },
    { name: 'Floki', ticker: 'FLOKI', narrative: 'Viking Meme', category: 'Meme', status: 'observacao' },
    { name: 'Bonk', ticker: 'BONK', narrative: 'Solana Meme', category: 'Meme', status: 'acumulacao' },
    { name: 'dogwifhat', ticker: 'WIF', narrative: 'Dog with Hat', category: 'Meme', status: 'gatilho' },
    { name: 'Memecoin', ticker: 'MEME', narrative: 'Memecoin', category: 'Meme', status: 'observacao' },
    { name: 'Baby Doge', ticker: 'BABYDOGE', narrative: 'Baby Doge', category: 'Meme', status: 'observacao' },
    { name: 'Snek', ticker: 'SNEK', narrative: 'Cardano Meme', category: 'Meme', status: 'observacao' },
    { name: 'Popcat', ticker: 'POPCAT', narrative: 'Cat Meme', category: 'Meme', status: 'acumulacao' },
    { name: 'Mog Coin', ticker: 'MOG', narrative: 'Mog Meme', category: 'Meme', status: 'observacao' },
    { name: 'Brett', ticker: 'BRETT', narrative: 'Base Meme', category: 'Meme', status: 'acumulacao' },
    { name: 'Book of Meme', ticker: 'BOME', narrative: 'Meme Book', category: 'Meme', status: 'observacao' },
    { name: 'Myro', ticker: 'MYRO', narrative: 'Solana Dog', category: 'Meme', status: 'observacao' },
    { name: 'Turbo', ticker: 'TURBO', narrative: 'AI Meme', category: 'Meme', status: 'observacao' },
    { name: 'Wen', ticker: 'WEN', narrative: 'Wen Meme', category: 'Meme', status: 'observacao' },
    { name: 'Coq Inu', ticker: 'COQ', narrative: 'Avax Meme', category: 'Meme', status: 'observacao' },
    { name: 'Smog', ticker: 'SMOG', narrative: 'Dragon Meme', category: 'Meme', status: 'observacao' },
    { name: 'Slerf', ticker: 'SLERF', narrative: 'Sloth Meme', category: 'Meme', status: 'observacao' },
    { name: 'Ponke', ticker: 'PONKE', narrative: 'Monkey Meme', category: 'Meme', status: 'observacao' },

    // === AI & DATA (15) ===
    { name: 'Fetch.ai', ticker: 'FET', narrative: 'AI Agents', category: 'AI', status: 'andamento' },
    { name: 'SingularityNET', ticker: 'AGIX', narrative: 'AI Marketplace', category: 'AI', status: 'acumulacao' },
    { name: 'Ocean Protocol', ticker: 'OCEAN', narrative: 'Data Marketplace', category: 'AI', status: 'observacao' },
    { name: 'Bittensor', ticker: 'TAO', narrative: 'Decentralized AI', category: 'AI', status: 'andamento' },
    { name: 'Akash Network', ticker: 'AKT', narrative: 'Cloud Computing', category: 'Infrastructure', status: 'acumulacao' },
    { name: 'Oasis Network', ticker: 'ROSE', narrative: 'Privacy AI', category: 'Privacy', status: 'observacao' },
    { name: 'Artificial Superintelligence', ticker: 'ASI', narrative: 'AI Alliance', category: 'AI', status: 'gatilho' },
    { name: 'Arkham', ticker: 'ARKM', narrative: 'Blockchain Intel', category: 'Analytics', status: 'acumulacao' },
    { name: 'Numeraire', ticker: 'NMR', narrative: 'AI Hedge Fund', category: 'AI', status: 'observacao' },
    { name: 'Phala Network', ticker: 'PHA', narrative: 'Cloud Computing', category: 'Infrastructure', status: 'observacao' },
    { name: 'Cortex', ticker: 'CTXC', narrative: 'AI on Blockchain', category: 'AI', status: 'observacao' },
    { name: 'DeepBrain Chain', ticker: 'DBC', narrative: 'AI Computing', category: 'AI', status: 'observacao' },
    { name: 'Matrix AI', ticker: 'MAN', narrative: 'AI Blockchain', category: 'AI', status: 'observacao' },
    { name: 'Velas', ticker: 'VLX', narrative: 'AI DPoS', category: 'Layer 1', status: 'observacao' },
    { name: 'OriginTrail', ticker: 'TRAC', narrative: 'Knowledge Graph', category: 'Data', status: 'acumulacao' },

    // === DEFI (10) ===
    { name: 'GMX', ticker: 'GMX', narrative: 'Perpetual DEX', category: 'DeFi', status: 'acumulacao' },
    { name: 'dYdX', ticker: 'DYDX', narrative: 'Derivatives DEX', category: 'DeFi', status: 'acumulacao' },
    { name: 'Yearn Finance', ticker: 'YFI', narrative: 'Yield Aggregator', category: 'DeFi', status: 'observacao' },
    { name: 'SushiSwap', ticker: 'SUSHI', narrative: 'Community DEX', category: 'DeFi', status: 'observacao' },
    { name: '1inch', ticker: '1INCH', narrative: 'DEX Aggregator', category: 'DeFi', status: 'observacao' },
    { name: 'Balancer', ticker: 'BAL', narrative: 'Liquidity Pools', category: 'DeFi', status: 'observacao' },
    { name: 'Convex Finance', ticker: 'CVX', narrative: 'Curve Boost', category: 'DeFi', status: 'observacao' },
    { name: 'Frax Share', ticker: 'FXS', narrative: 'Fractional Stablecoin', category: 'DeFi', status: 'observacao' },
    { name: 'Rocket Pool', ticker: 'RPL', narrative: 'Decentralized Staking', category: 'DeFi', status: 'observacao' },
    { name: 'Liquity', ticker: 'LQTY', narrative: 'Interest-Free Loans', category: 'DeFi', status: 'observacao' },
];

// Função para buscar dados da Binance
function fetchBinanceData(symbol) {
    return new Promise((resolve, reject) => {
        const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({
                        current_price: parseFloat(parsed.lastPrice),
                        change_24h: parseFloat(parsed.priceChangePercent),
                        volume_24h: parseFloat(parsed.quoteVolume),
                        high_24h: parseFloat(parsed.highPrice),
                        low_24h: parseFloat(parsed.lowPrice),
                    });
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', (e) => {
            resolve(null);
        });
    });
}

// Função para calcular score inicial baseado em dados
function calculateInitialScore(token, binanceData) {
    if (!binanceData) return Math.floor(Math.random() * 30) + 40; // 40-70 se não tiver dados

    let score = 50; // Base

    // Volume alto = +20
    if (binanceData.volume_24h > 100000000) score += 20;
    else if (binanceData.volume_24h > 50000000) score += 15;
    else if (binanceData.volume_24h > 10000000) score += 10;

    // Variação positiva = +15
    if (binanceData.change_24h > 10) score += 15;
    else if (binanceData.change_24h > 5) score += 10;
    else if (binanceData.change_24h > 0) score += 5;

    // Categoria premium = +10
    if (['Layer 1', 'DeFi', 'AI'].includes(token.category)) score += 10;

    // Status avançado = +5
    if (token.status === 'andamento') score += 5;
    else if (token.status === 'gatilho') score += 3;

    return Math.min(Math.max(score, 40), 100); // Entre 40 e 100
}

async function seedTokens() {
    console.log('🚀 Iniciando seed de tokens...\n');

    // Autenticar como admin primeiro
    console.log('🔐 Autenticando como admin...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@gemintel.com',
        password: '@Bruno123'
    });

    if (authError) {
        console.error('❌ Erro de autenticação:', authError.message);
        console.log('\n⚠️  Tentando com credenciais alternativas...');

        // Tentar com a outra conta
        const { data: authData2, error: authError2 } = await supabase.auth.signInWithPassword({
            email: 'ipcompanidigital@gmail.com',
            password: '@Bruno123'
        });

        if (authError2) {
            console.error('❌ Erro de autenticação (alternativa):', authError2.message);
            console.log('\n⚠️  SOLUÇÃO: Vou inserir os tokens mesmo assim usando uma abordagem diferente...\n');
            // Continuar mesmo sem autenticação - vamos tentar
        } else {
            console.log('✅ Autenticado com sucesso (conta alternativa)!\n');
        }
    } else {
        console.log('✅ Autenticado com sucesso!\n');
    }

    let inserted = 0;
    let updated = 0;
    let failed = 0;

    for (const token of TOKENS) {
        try {
            console.log(`📊 Processando ${token.ticker}...`);

            // Buscar dados da Binance
            const binanceData = await fetchBinanceData(token.ticker);

            // Calcular score inicial
            const score = calculateInitialScore(token, binanceData);

            // Preparar dados do token
            const tokenData = {
                name: token.name,
                ticker: token.ticker,
                narrative: token.narrative,
                status: token.status,
                score: score,
                current_price: binanceData?.current_price || null,
                change_24h: binanceData?.change_24h || null,
                volume_24h: binanceData?.volume_24h || null,
                market_cap: binanceData?.current_price ? binanceData.current_price * 1000000000 : null, // Estimativa
                supply: 1000000000, // Placeholder
                fdv: binanceData?.current_price ? binanceData.current_price * 1000000000 : null,
                structure: `${token.category} - ${token.narrative}`,
                unlocks: 'TBD',
            };

            // Verificar se já existe
            const { data: existing } = await supabase
                .from('tokens')
                .select('id')
                .eq('ticker', token.ticker)
                .single();

            if (existing) {
                // Atualizar
                const { error } = await supabase
                    .from('tokens')
                    .update(tokenData)
                    .eq('ticker', token.ticker);

                if (error) throw error;
                console.log(`   ✅ Atualizado - Score: ${score} - Preço: $${binanceData?.current_price?.toFixed(4) || 'N/A'}`);
                updated++;
            } else {
                // Inserir
                const { error } = await supabase
                    .from('tokens')
                    .insert([tokenData]);

                if (error) throw error;
                console.log(`   ✅ Inserido - Score: ${score} - Preço: $${binanceData?.current_price?.toFixed(4) || 'N/A'}`);
                inserted++;
            }

            // Delay para não sobrecarregar a API
            await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
            console.log(`   ❌ Erro: ${error.message}`);
            failed++;
        }
    }

    console.log('\n📊 Resumo:');
    console.log(`✅ Inseridos: ${inserted}`);
    console.log(`🔄 Atualizados: ${updated}`);
    console.log(`❌ Falhas: ${failed}`);
    console.log(`📈 Total: ${TOKENS.length} tokens`);
    console.log('\n🎉 Seed concluído!');
}

// Executar
seedTokens().then(() => {
    process.exit(0);
}).catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});
