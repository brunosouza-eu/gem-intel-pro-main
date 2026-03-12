import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://bgtovevdkxvfnyyzjdnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndG92ZXZka3h2Zm55eXpqZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDg3MjYsImV4cCI6MjA4MzcyNDcyNn0.KWHZq9LnGFcHf2rCZVbMypZsb8RaIDjAnrFHxtYji0k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncBinanceData() {
    console.log('🚀 Iniciando sincronização com Binance...\n');

    // Autenticar primeiro
    console.log('🔐 Autenticando...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'ipcompanidigital@gmail.com',
        password: '@Bruno123'
    });

    if (authError) {
        console.error('❌ Erro de autenticação:', authError.message);
        console.log('\n⚠️  Por favor, faça login no app primeiro!');
        return;
    }

    console.log('✅ Autenticado com sucesso!\n');

    // Chamar a Edge Function que já existe
    console.log('📡 Chamando Edge Function fetch-binance-data...');
    console.log('⏳ Isso pode levar 30-60 segundos (buscando dados de 75+ tokens)...\n');

    const { data, error } = await supabase.functions.invoke('fetch-binance-data', {
        body: {}
    });

    if (error) {
        console.error('❌ Erro ao chamar Edge Function:', error.message);
        console.log('\nDetalhes:', error);
        return;
    }

    console.log('\n✅ Sincronização concluída com sucesso!\n');
    console.log('📊 Resultado:');
    console.log(JSON.stringify(data, null, 2));

    console.log('\n🎉 Tokens populados no banco de dados!');
    console.log('\n📋 Categorias adicionadas:');
    console.log('   - Majors: 5 tokens (BTC, ETH, BNB, SOL, XRP)');
    console.log('   - Layer 1: 15 tokens (ADA, AVAX, DOT, NEAR, etc.)');
    console.log('   - DeFi: 12 tokens (AAVE, UNI, MKR, CRV, etc.)');
    console.log('   - AI & Gaming: 12 tokens (RENDER, FET, TAO, IMX, etc.)');
    console.log('   - Memecoins: 10 tokens (DOGE, SHIB, PEPE, WIF, etc.)');
    console.log('   - Infra: 10 tokens (LINK, INJ, ARB, OP, etc.)');
    console.log('   - Gems: 11 tokens (JTO, JUP, STRK, etc.)');
    console.log(`\n📈 Total: ${data.total} tokens`);

    console.log('\n✨ Agora você pode:');
    console.log('   1. Acessar o Radar e ver todos os tokens');
    console.log('   2. Usar o Trade Master PRO para análise');
    console.log('   3. Consultar o Crypto Guru');
    console.log('   4. Ver o Dashboard atualizado');
}

// Executar
syncBinanceData().then(() => {
    console.log('\n✅ Script finalizado!');
    process.exit(0);
}).catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
});
