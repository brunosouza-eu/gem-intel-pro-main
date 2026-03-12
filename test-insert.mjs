import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://bgtovevdkxvfnyyzjdnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndG92ZXZka3h2Zm55eXpqZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDg3MjYsImV4cCI6MjA4MzcyNDcyNn0.KWHZq9LnGFcHf2rCZVbMypZsb8RaIDjAnrFHxtYji0k';

const supabase = createClient(supabaseUrl, supabaseKey);

// Tokens básicos para teste inicial
const BASIC_TOKENS = [
    { name: 'Bitcoin', ticker: 'BTC', narrative: 'Store of Value - Digital Gold', status: 'andamento', score: 95 },
    { name: 'Ethereum', ticker: 'ETH', narrative: 'Smart Contract Platform', status: 'andamento', score: 92 },
    { name: 'Binance Coin', ticker: 'BNB', narrative: 'Exchange Token', status: 'andamento', score: 88 },
    { name: 'Solana', ticker: 'SOL', narrative: 'High Performance L1', status: 'gatilho', score: 85 },
    { name: 'Ripple', ticker: 'XRP', narrative: 'Cross-Border Payments', status: 'acumulacao', score: 75 },
    { name: 'Cardano', ticker: 'ADA', narrative: 'Proof of Stake L1', status: 'observacao', score: 68 },
    { name: 'Avalanche', ticker: 'AVAX', narrative: 'Subnet Architecture', status: 'acumulacao', score: 72 },
    { name: 'Polkadot', ticker: 'DOT', narrative: 'Interoperability', status: 'observacao', score: 65 },
    { name: 'Polygon', ticker: 'MATIC', narrative: 'Ethereum Scaling', status: 'acumulacao', score: 74 },
    { name: 'Chainlink', ticker: 'LINK', narrative: 'Oracle Network', status: 'gatilho', score: 80 },
    { name: 'Uniswap', ticker: 'UNI', narrative: 'DEX Leader', status: 'acumulacao', score: 73 },
    { name: 'Dogecoin', ticker: 'DOGE', narrative: 'Original Memecoin', status: 'observacao', score: 65 },
    { name: 'Shiba Inu', ticker: 'SHIB', narrative: 'Doge Killer', status: 'observacao', score: 62 },
    { name: 'Pepe', ticker: 'PEPE', narrative: 'Frog Meme', status: 'acumulacao', score: 74 },
    { name: 'Render', ticker: 'RNDR', narrative: 'GPU Rendering', status: 'andamento', score: 86 },
    { name: 'Fetch.ai', ticker: 'FET', narrative: 'AI Agents', status: 'andamento', score: 88 },
    { name: 'Bittensor', ticker: 'TAO', narrative: 'Decentralized AI', status: 'andamento', score: 90 },
    { name: 'Arbitrum', ticker: 'ARB', narrative: 'Optimistic Rollup', status: 'gatilho', score: 82 },
    { name: 'Optimism', ticker: 'OP', narrative: 'Optimistic Rollup', status: 'acumulacao', score: 78 },
    { name: 'Injective', ticker: 'INJ', narrative: 'DeFi Trading', status: 'andamento', score: 87 },
];

async function insertTokensDirectly() {
    console.log('🚀 Inserindo tokens diretamente no banco...\n');

    let success = 0;
    let failed = 0;

    for (const token of BASIC_TOKENS) {
        try {
            console.log(`📊 Inserindo ${token.ticker}...`);

            // Tentar inserir diretamente
            const { data, error } = await supabase
                .from('tokens')
                .upsert({
                    name: token.name,
                    ticker: token.ticker,
                    narrative: token.narrative,
                    status: token.status,
                    score: token.score,
                    current_price: null,
                    market_cap: null,
                    supply: null,
                    volume_24h: null,
                    change_24h: null,
                    fdv: null,
                    structure: token.narrative,
                    unlocks: 'TBD',
                }, {
                    onConflict: 'ticker',
                    ignoreDuplicates: false
                });

            if (error) {
                console.log(`   ❌ Erro: ${error.message}`);
                failed++;
            } else {
                console.log(`   ✅ Inserido com sucesso!`);
                success++;
            }

            // Pequeno delay
            await new Promise(resolve => setTimeout(resolve, 50));

        } catch (error) {
            console.log(`   ❌ Erro: ${error.message}`);
            failed++;
        }
    }

    console.log('\n📊 Resumo:');
    console.log(`✅ Sucesso: ${success}`);
    console.log(`❌ Falhas: ${failed}`);
    console.log(`📈 Total: ${BASIC_TOKENS.length} tokens`);

    if (success > 0) {
        console.log('\n🎉 Tokens inseridos! Recarregue a página do app.');
    } else {
        console.log('\n⚠️  Nenhum token foi inserido. Problema de permissão RLS.');
        console.log('\n💡 SOLUÇÃO: Execute o arquivo seed-tokens.sql no Supabase SQL Editor');
        console.log('   URL: https://supabase.com/dashboard/project/bgtovevdkxvfnyyzjdnb/sql/new');
    }
}

// Executar
insertTokensDirectly().then(() => {
    process.exit(0);
}).catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});
