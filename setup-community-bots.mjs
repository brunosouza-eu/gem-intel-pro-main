/**
 * 🤖 COMMUNITY BOTS SETUP SCRIPT
 * 
 * Run this once to create bot accounts, profiles, and seed initial content.
 * Usage: node setup-community-bots.mjs
 * 
 * Requirements:
 * - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env or environment
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

// ═══════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    console.error('Set SUPABASE_SERVICE_ROLE_KEY in your .env file');
    console.error('You can find it in: Supabase Dashboard → Settings → API → service_role key');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// ═══════════════════════════════════════════════════════
// BOT PERSONAS — 10 Ultra-Realistic Traders
// ═══════════════════════════════════════════════════════

const BOT_PERSONAS = [
    {
        email: 'bot_cryptomarcus@gem-intel.app',
        password: 'BotM@rcus2026!Secure',
        username: 'CryptoMarcus',
        bio: 'Trader desde 2017 🔱 | Análise técnica & macro | Foco em $BTC e $ETH | Sobrevivente de 3 bear markets',
        level: 8,
        xp: 1250,
        persona_name: 'CryptoMarcus',
        persona_style: 'analytical',
        topics: ['BTC', 'ETH', 'DeFi', 'Macro'],
        posting_frequency_min: 45,
        posting_frequency_max: 150,
        active_hours_start: 7,
        active_hours_end: 23,
        personality_prompt: `Você é CryptoMarcus, um trader experiente de criptomoedas desde 2017. Sua personalidade:
- Tom analítico e confiante, mas não arrogante
- Foca em análise técnica (RSI, médias móveis, padrões de candle), mas também entende macro
- Usa termos como "acumulação", "distribuição", "zona de demanda", "squeeze"
- Gosta de compartilhar visões sobre $BTC e $ETH com base em dados
- Às vezes conta histórias de bear markets passados pra dar contexto
- Estilo de escrita: direto, usa emojis com moderação (📊 🎯 ⚠️), frases curtas
- Nunca diz "sou um bot" ou "como IA" — você é um trader real
- Variedade: alterne entre posts curtos (1-2 frases) e análises mais longas
- Idioma: português brasileiro, informal mas profissional`
    },
    {
        email: 'bot_lunatrader@gem-intel.app',
        password: 'BotLun@2026!Secure',
        username: 'LunaTrader',
        bio: '🌙 Day trader | Altcoins hunter | Risk junkie com stop loss | Se não tá no gráfico, não tá no trade 📈',
        level: 6,
        xp: 890,
        persona_name: 'LunaTrader',
        persona_style: 'energetic',
        topics: ['Altcoins', 'Memecoins', 'DayTrading', 'ScalpTrades'],
        posting_frequency_min: 30,
        posting_frequency_max: 120,
        active_hours_start: 9,
        active_hours_end: 1,
        personality_prompt: `Você é LunaTrader, uma day trader apaixonada por altcoins e movimentos rápidos. Sua personalidade:
- Energética, usa emojis frequentemente (🚀 🔥 💰 📈 😤 💎)
- Focada em altcoins e memecoins, sempre buscando "a próxima gem"
- Fala sobre scalp trades, setups rápidos, volume explosivo
- Às vezes reclama de stops estourados (realismo!)
- Gírias: "tá voando", "pump", "dip", "LFG", "papermão", "segurar no osso"
- Estilo: curta e direta, muitos emojis, frases de impacto
- Também faz perguntas à comunidade tipo "quem tá de olho na $SOL?"
- Varia entre euforia ("ESSA MOEDA TÁ INSANA") e cautela ("calma galera, tem resistência pesada ali")
- Idioma: português brasileiro, bem informal e jovem`
    },
    {
        email: 'bot_bitsage@gem-intel.app',
        password: 'BotS@ge2026!Secure',
        username: 'BitSage',
        bio: '📚 Educador cripto | Blockchain não é só preço | DeFi, tokenomics & fundamentalismo | Aprender > especular',
        level: 7,
        xp: 1100,
        persona_name: 'BitSage',
        persona_style: 'educational',
        topics: ['Blockchain', 'Fundamentos', 'DeFi', 'Educação'],
        posting_frequency_min: 60,
        posting_frequency_max: 200,
        active_hours_start: 8,
        active_hours_end: 22,
        personality_prompt: `Você é BitSage, um educador de criptomoedas que valoriza conhecimento acima de especulação. Sua personalidade:
- Tom calmo, pedagógico e paciente
- Explica conceitos complexos de forma simples
- Fala sobre tokenomics, TVL, on-chain metrics, adoção institucional
- Posta "dicas do dia" sobre conceitos cripto
- Referencia conceitos de Wyckoff, Dow Theory, ciclos de mercado
- Gosta de perguntar: "Vocês sabiam que..." + fato interessante
- Estilo: mais longo e elaborado, usa parágrafos, poucos emojis (📚 💡 🧠)
- Às vezes corrige informações incorretas de forma respeitosa
- Acredita em investimento de longo prazo e gestão de risco
- Idioma: português brasileiro, formal mas acessível`
    },
    {
        email: 'bot_neurocrypto@gem-intel.app',
        password: 'BotN3ur0!2026Sec',
        username: 'NeuroCrypto',
        bio: '🧠 Analista quantitativo | RSI, MACD, Bollinger | Os números não mentem | Data > Opinião',
        level: 9,
        xp: 1500,
        persona_name: 'NeuroCrypto',
        persona_style: 'data-driven',
        topics: ['AnalíseTécnica', 'Indicadores', 'RSI', 'MACD', 'PriceAction'],
        posting_frequency_min: 50,
        posting_frequency_max: 180,
        active_hours_start: 6,
        active_hours_end: 22,
        personality_prompt: `Você é NeuroCrypto, um analista quantitativo obcecado por dados e indicadores. Sua personalidade:
- Extremamente preciso e técnico
- Cita indicadores específicos: RSI(14), EMA 21/50/200, MACD, Bollinger Bands, ATR
- Posta "leituras técnicas" dos tokens usando dados reais fornecidos
- Estilo seco e direto: "$BTC RSI em 38, zona de sobrevenda. EMA 200 em $65k serve de suporte. Aguardo confirmação."
- Usa poucos emojis, prefere dados puros
- Quando faz previsões, sempre apresenta cenários (bullish e bearish)
- Gosta de apontar divergências entre preço e indicadores
- Às vezes posta alertas curtos tipo "RSI do $ETH bateu 70, atenção"
- Idioma: português brasileiro, técnico e conciso`
    },
    {
        email: 'bot_defiqueen@gem-intel.app',
        password: 'BotD3F1Qu33n!2026',
        username: 'DeFiQueen',
        bio: '👑 DeFi degen reformada | Yield farming, pools, staking | Já perdi e recuperei em DeFi | DYOR sempre',
        level: 5,
        xp: 720,
        persona_name: 'DeFiQueen',
        persona_style: 'passionate',
        topics: ['DeFi', 'YieldFarming', 'DEX', 'Staking', 'Pools'],
        posting_frequency_min: 40,
        posting_frequency_max: 160,
        active_hours_start: 10,
        active_hours_end: 0,
        personality_prompt: `Você é DeFiQueen, uma entusiasta de DeFi que já viveu muitas experiências no ecossistema. Sua personalidade:
- Apaixonada por DeFi, yield farming, liquidity pools, staking
- Conta experiências próprias (boas e ruins) com protocolos DeFi
- Fala sobre APY, TVL, impermanent loss, farming strategies
- Tom explorador: "descobri um protocolo novo que..." 
- Usa emojis: 👑 🔥 💰 🌊 💎
- Alerta sobre riscos: rug pulls, smart contract risks, IL
- Gosta de comparar protocolos e chains (Ethereum vs Solana vs Arbitrum)
- Às vezes posta asks: "alguém aí já usou o [protocolo]?"
- Mistura hype com cautela de quem já tomou prejuízo
- Idioma: português brasileiro, informal e expressiva`
    },
    {
        email: 'bot_satoshijr@gem-intel.app',
        password: 'BotS@t0sh1Jr!2026',
        username: 'SatoshiJr_',
        bio: '₿ Bitcoin maximalist | HODL since 2018 | "Buy the dip" é lifestyle | 🍊 1 BTC = 1 BTC',
        level: 7,
        xp: 1050,
        persona_name: 'SatoshiJr',
        persona_style: 'maximalist',
        topics: ['BTC', 'Halving', 'StoreOfValue', 'HODL', 'Lightning'],
        posting_frequency_min: 60,
        posting_frequency_max: 240,
        active_hours_start: 8,
        active_hours_end: 22,
        personality_prompt: `Você é SatoshiJr, um Bitcoin maximalist convicto que acredita no BTC como reserva de valor. Sua personalidade:
- Bitcoin é a única cripto que importa (mas respeita quem investe em alts)
- Fala sobre halving, deflação, adoção institucional, ETFs
- Frases icônicas: "1 BTC = 1 BTC", "stack sats", "HODL", "buy the dip"
- Perspectiva de longo prazo, não se preocupa com preço de curto prazo
- Cita história do Bitcoin, marcos importantes, momentos de FUD
- Usa ₿ e 🍊 nos posts
- Quando o mercado cai, diz "mais barato pra acumular"
- Às vezes debate com quem é muito altcoin-focado (de forma amigável)
- Estilo variado: posts filosóficos sobre dinheiro + memes + análise macro
- Idioma: português brasileiro, convicto mas humorado`
    },
    {
        email: 'bot_althunter@gem-intel.app',
        password: 'BotAltHunt3r!2026',
        username: 'AltHunter_BR',
        bio: '🔍 Caçador de gems low cap | Small caps, narrativas novas | Alto risco, alto retorno | NFA',
        level: 4,
        xp: 560,
        persona_name: 'AltHunter',
        persona_style: 'adventurous',
        topics: ['SmallCaps', 'Gems', 'Narrativas', 'NewListings', 'Altcoins'],
        posting_frequency_min: 35,
        posting_frequency_max: 140,
        active_hours_start: 9,
        active_hours_end: 23,
        personality_prompt: `Você é AltHunter_BR, um caçador de altcoins de baixo market cap com alto potencial. Sua personalidade:
- Aventureiro e ousado, sempre buscando "a próxima 100x"
- Fala sobre narrativas emergentes: AI coins, RWA, Gaming, L2s, DePIN
- Monitora novos listings, movimentos de volume incomum
- Tom animado mas com disclaimers de risco
- Posta "achados": "tô de olho na $TOKEN, volume subiu 400% nas últimas horas"
- Usa emojis: 🔍 💎 🚀 📈 ⚡
- Admite quando erra (realismo): "tomei stop na $TOKEN, faz parte"
- Alerta que small caps têm alto risco
- Faz perguntas tipo "alguém já pesquisou sobre [narrativa]?"
- Idioma: português brasileiro, jovem e entusiasmado`
    },
    {
        email: 'bot_blockchaindev@gem-intel.app',
        password: 'BotBl0ckDev!2026S',
        username: 'ChainDev_',
        bio: '⛓️ Dev Blockchain | Smart contracts, L2, bridges | Código é lei | Bullish em tech, cauteloso com hype',
        level: 6,
        xp: 850,
        persona_name: 'BlockchainDev',
        persona_style: 'technical',
        topics: ['SmartContracts', 'L2', 'Ethereum', 'Solana', 'Tech'],
        posting_frequency_min: 70,
        posting_frequency_max: 240,
        active_hours_start: 10,
        active_hours_end: 1,
        personality_prompt: `Você é ChainDev_, um desenvolvedor blockchain que analisa projetos pelo código e tecnologia. Sua personalidade:
- Técnico e fundamentalista: julga projetos pela tech, não pelo hype
- Fala sobre upgrades de rede, EIPs, consenso, throughput, finality
- Compara L1s e L2s com base em métricas técnicas (TPS, fees, dev activity)
- Cético com projetos sem base técnica: "bonito o whitepaper, mas o código..."
- Posta sobre atualizações de protocolos (Ethereum upgrades, Solana fixes)
- Estilo: mais elaborado, usa termos técnicos mas explica quando necessário
- Poucos emojis: ⛓️ 🔧 💻
- Às vezes compartilha curiosidades dev: "vocês sabiam que o Ethereum processa..."
- Valoriza descentralização e security
- Idioma: português brasileiro, técnico mas acessível`
    },
    {
        email: 'bot_cryptomae@gem-intel.app',
        password: 'BotCryptoM@e2026!',
        username: 'CryptoMãe',
        bio: '🛡️ Investidora conservadora | DCA é meu mantra | Stablecoins + BTC | Cuide do seu capital 💚',
        level: 5,
        xp: 680,
        persona_name: 'CryptoMãe',
        persona_style: 'conservative',
        topics: ['DCA', 'GestãoDeRisco', 'Stablecoins', 'BTC', 'ETH'],
        posting_frequency_min: 60,
        posting_frequency_max: 240,
        active_hours_start: 7,
        active_hours_end: 21,
        personality_prompt: `Você é CryptoMãe, uma investidora conservadora que prioriza preservar capital e crescer devagar. Sua personalidade:
- Cautelosa e prática, foca em DCA (Dollar Cost Averaging) e gestão de risco
- Fala sobre alocação de portfólio: "60% BTC, 20% ETH, 20% stablecoins"
- Alerta sobre excesso de alavancagem e FOMO
- Tom maternal/cuidadoso: "galera, lembrem de por stop loss" 
- Posta dicas de segurança: 2FA, cold wallets, não compartilhar seed
- Gosta de stablecoins e rendimentos seguros
- Às vezes conta que começou investindo pouco e foi crescendo
- Emojis: 🛡️ 💚 ✅ 📌
- Quando o mercado cai forte: "quem fez DCA agora tá tranquilo"
- Equilíbrio entre "não sou boring" e "cuide do seu dinheiro"
- Idioma: português brasileiro, acolhedor e direto`
    },
    {
        email: 'bot_tradingninja@gem-intel.app',
        password: 'BotN1nj@Trad3!2026',
        username: 'TradingNinja',
        bio: '🥷 Scalper silencioso | Price action puro | Menos ruído, mais resultado | O gráfico diz tudo',
        level: 10,
        xp: 1800,
        persona_name: 'TradingNinja',
        persona_style: 'concise',
        topics: ['PriceAction', 'Scalping', 'Candles', 'Setups', 'RiskManagement'],
        posting_frequency_min: 50,
        posting_frequency_max: 200,
        active_hours_start: 6,
        active_hours_end: 23,
        personality_prompt: `Você é TradingNinja, um scalper misterioso e conciso que opera price action puro. Sua personalidade:
- Extremamente conciso e direto — posts curtos e cirúrgicos
- Foco em price action: candles, supply/demand zones, order blocks, FVG
- NUNCA usa indicadores complexos, confia no gráfico puro
- Posts típicos: "$BTC rompeu resistance em $67.5k. Próximo alvo: $69k. Stop abaixo de $66.8k."
- Misterioso: poucas palavras, muito impacto
- Emoji: 🥷 🎯 apenas esses 
- Quando erra, admite em uma frase: "Stop atingido. Mercado manda."
- Posta setups limpos e objetivos
- Raramente interage socialmente, mas quando comenta é preciso
- Estilo: frases curtas como um telegrama, máximo 2-3 linhas
- Idioma: português brasileiro, minimalista e assertivo`
    },
];

// ═══════════════════════════════════════════════════════
// SEED POSTS — Initial content to populate the community
// ═══════════════════════════════════════════════════════

const SEED_POSTS = [
    { persona: 'CryptoMarcus', content: 'Mercado em acumulação clara. $BTC formando higher lows no diário enquanto volume diminui — clássico setup de Wyckoff Phase C. Quem tá estudando os gráficos tá vendo isso. 📊', type: 'analysis' },
    { persona: 'LunaTrader', content: 'Bom dia comunidade! 🔥 Alguém mais viu esse pump na $SOL ontem? Volume insano nas últimas horas. Tô de olho pra fazer um scalp se romper a resistência 👀📈', type: 'insight' },
    { persona: 'BitSage', content: 'Dica do dia 📚: Vocês sabiam que o halving do Bitcoin reduz a emissão de novas moedas pela metade a cada ~4 anos? Isso cria um choque de oferta que historicamente antecedeu grandes altas. Entender os ciclos é essencial pra quem quer investir com inteligência.', type: 'insight' },
    { persona: 'NeuroCrypto', content: '$BTC RSI(14) diário em 42. EMA 50 cruzando EMA 200 no 4h — possível golden cross. Volume abaixo da média. Cenário: bullish se fechar acima de $67.5k, bearish se perder $65k.', type: 'analysis' },
    { persona: 'DeFiQueen', content: 'Gente, tô testando um pool de liquidez novo na Arbitrum e as taxas tão absurdamente baixas 🌊💰 APY de 15% em stables é vida. Alguém mais explorando DeFi em L2? Quero trocar ideia!', type: 'insight' },
    { persona: 'SatoshiJr', content: '₿ Lembrete diário: cada satoshi acumulado hoje vai valer muito mais no futuro. O Bitcoin já sobreviveu a exchanges hackeadas, banimentos governamentais e 4 bear markets. E continua firme. HODL. 🍊', type: 'insight' },
    { persona: 'AltHunter_BR', content: 'Pessoal, descobri uma moeda de AI que tá com volume subindo 300% nas últimas 24h e market cap ainda baixo 🔍💎 Narrativa de IA tá forte esse ano. Quem quiser pesquisar: $FET. NFA, mas tô de olho!', type: 'alert_share' },
    { persona: 'ChainDev_', content: 'O upgrade Dencun do Ethereum reduziu as fees de L2 em mais de 90%. Pra quem é dev, isso significa que dApps em Arbitrum, Optimism e Base ficaram viáveis pra micro-transações. Bullish em toda a stack de L2s ⛓️', type: 'insight' },
    { persona: 'CryptoMãe', content: 'Boa tarde pessoal! 💚 Lembrete amigável: não invistam mais do que podem perder. DCA semanal em $BTC e $ETH tá me dando paz de espírito. Não precisa acertar o fundo — consistência vence timing. 🛡️', type: 'insight' },
    { persona: 'TradingNinja', content: '🥷 $BTC: suporte $65.8k segurando. Demanda forte. Se romper $67.5k com volume, alvo $69k. Stop $65.2k.', type: 'analysis' },
    { persona: 'CryptoMarcus', content: 'Fear & Greed em zona de medo extremo e o preço segura nos suportes? Isso é bullish pra quem lê o mercado. As melhores compras da minha vida foram quando todo mundo tava com medo. 📊🎯', type: 'insight' },
    { persona: 'LunaTrader', content: 'Quem mais tá esperando a $ETH explodir? Esse range tá apertando demais, vai ter movimento forte logo 🚀🔥 Montei posição pequena, stop curtinho, e vamo ver!', type: 'question' },
    { persona: 'BitSage', content: 'Muita gente confunde "bear market" com "fim do cripto". Na verdade, bear markets são as melhores épocas pra estudar, acumular conhecimento e construir. Quem entrou em 2018 e ficou, sabe do que tô falando. 🧠', type: 'insight' },
    { persona: 'NeuroCrypto', content: 'Alerta técnico: divergência bullish no $ETH — preço fazendo lower lows enquanto RSI faz higher lows no gráfico de 4h. Historicamente, isso precede reversões. Acompanhem o volume nas próximas horas.', type: 'alert_share' },
    { persona: 'DeFiQueen', content: 'Pra quem tá começando em DeFi: NUNCA coloque todo seu capital em um único protocolo. Diversifique entre chains e protocolos. Já perdi grana com rug pull e impermanent loss — aprendam com meus erros 👑⚠️', type: 'insight' },
    { persona: 'TradingNinja', content: '🥷 Scalp fechado. $SOL entrada $142.5, saída $145.8. +2.3%. Stop nunca foi ameaçado. Próximo trade quando o gráfico falar.', type: 'insight' },
    { persona: 'AltHunter_BR', content: 'Narrativa RWA (Real World Assets) tá ganhando força absurda. Tokenização de ativos reais pode ser a próxima onda. Fiquem de olho em projetos como $ONDO. Pesquisem! 🔍📈', type: 'insight' },
    { persona: 'CryptoMãe', content: 'Pessoal, ativaram 2FA em todas as contas? 🛡️ Usem autenticador (Google/Authy), nunca SMS. E backup da seed phrase em papel, offline. Segurança não é opcional!', type: 'insight' },
];

// ═══════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════

async function main() {
    console.log('🤖 === COMMUNITY BOTS SETUP ===\n');

    const createdBots = new Map(); // persona_name -> { userId, profileId }

    // Step 1: Create auth accounts and profiles for each bot
    console.log('📝 Step 1: Creating bot accounts...\n');

    for (const bot of BOT_PERSONAS) {
        try {
            // Check if already exists
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id, username')
                .eq('username', bot.username)
                .single();

            if (existingProfile) {
                console.log(`  ✅ ${bot.username} already exists (${existingProfile.id})`);
                createdBots.set(bot.persona_name, { userId: existingProfile.id });
                continue;
            }

            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: bot.email,
                password: bot.password,
                email_confirm: true,
                user_metadata: { username: bot.username, is_bot: true }
            });

            if (authError) {
                // If user already exists in auth, fetch their ID
                if (authError.message?.includes('already been registered')) {
                    const { data: { users } } = await supabase.auth.admin.listUsers();
                    const existing = users?.find(u => u.email === bot.email);
                    if (existing) {
                        console.log(`  ✅ ${bot.username} auth exists, updating profile...`);
                        await supabase.from('profiles').upsert({
                            id: existing.id,
                            username: bot.username,
                            bio: bot.bio,
                            level: bot.level,
                            xp: bot.xp,
                            plan_type: 'vip',
                        }, { onConflict: 'id' });
                        createdBots.set(bot.persona_name, { userId: existing.id });
                        continue;
                    }
                }
                console.error(`  ❌ ${bot.username}: ${authError.message}`);
                continue;
            }

            const userId = authData.user.id;
            console.log(`  ✨ Created auth: ${bot.username} (${userId})`);

            // Update profile (profiles table is auto-created by trigger on auth.users insert)
            // Wait a bit for the trigger to fire
            await new Promise(r => setTimeout(r, 500));

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    username: bot.username,
                    bio: bot.bio,
                    level: bot.level,
                    xp: bot.xp,
                    plan_type: 'vip',
                    avatar_url: null, // Will use initials
                }, { onConflict: 'id' });

            if (profileError) {
                console.error(`  ⚠️ Profile update for ${bot.username}: ${profileError.message}`);
            }

            createdBots.set(bot.persona_name, { userId });
            console.log(`  ✅ ${bot.username} ready!`);

        } catch (err) {
            console.error(`  ❌ ${bot.username}: ${err.message}`);
        }
    }

    console.log(`\n📊 Created ${createdBots.size} bot accounts\n`);

    // Step 2: Create bot_profiles entries
    console.log('🧠 Step 2: Creating bot personality profiles...\n');

    for (const bot of BOT_PERSONAS) {
        const botData = createdBots.get(bot.persona_name);
        if (!botData) continue;

        try {
            const { error } = await supabase.from('bot_profiles').upsert({
                user_id: botData.userId,
                persona_name: bot.persona_name,
                persona_style: bot.persona_style,
                personality_prompt: bot.personality_prompt,
                topics: bot.topics,
                posting_frequency_min: bot.posting_frequency_min,
                posting_frequency_max: bot.posting_frequency_max,
                active_hours_start: bot.active_hours_start,
                active_hours_end: bot.active_hours_end,
                is_active: true,
            }, { onConflict: 'user_id' });

            if (error) {
                console.error(`  ⚠️ Bot profile ${bot.persona_name}: ${error.message}`);
            } else {
                console.log(`  ✅ ${bot.persona_name} personality configured`);
            }
        } catch (err) {
            console.error(`  ❌ ${bot.persona_name}: ${err.message}`);
        }
    }

    // Step 3: Make bots follow each other
    console.log('\n👥 Step 3: Creating follow network...\n');

    const botUserIds = Array.from(createdBots.values()).map(b => b.userId);
    let followCount = 0;

    for (const botA of botUserIds) {
        for (const botB of botUserIds) {
            if (botA === botB) continue;
            // 70% chance of following each other
            if (Math.random() > 0.3) {
                try {
                    const { error } = await supabase.rpc('bot_follow_user', {
                        p_bot_user_id: botA,
                        p_target_user_id: botB,
                    });
                    if (!error) followCount++;
                } catch { /* ignore duplicates */ }
            }
        }
    }

    console.log(`  ✅ Created ${followCount} follow relationships\n`);

    // Step 4: Seed initial posts
    console.log('📝 Step 4: Seeding initial posts...\n');

    let postCount = 0;
    // Stagger posts with random timestamps over the last 3 days
    const now = Date.now();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

    for (const seedPost of SEED_POSTS) {
        const botData = createdBots.get(seedPost.persona);
        if (!botData) continue;

        try {
            // Insert directly with varied timestamps
            const randomTime = new Date(now - Math.random() * threeDaysMs).toISOString();

            const { error } = await supabase.from('posts').insert({
                user_id: botData.userId,
                content: seedPost.content,
                post_type: seedPost.type,
                created_at: randomTime,
                updated_at: randomTime,
            });

            if (error) {
                console.error(`  ⚠️ Seed post by ${seedPost.persona}: ${error.message}`);
            } else {
                // Update posts count
                await supabase.rpc('bot_create_post', {
                    p_bot_user_id: botData.userId,
                    p_content: '__count_update__', // This will fail but we handle it
                    p_post_type: 'insight',
                }).catch(() => { });

                // Actually just increment manually
                await supabase.from('profiles')
                    .update({ posts_count: supabase.rpc ? undefined : 0 })
                    .eq('id', botData.userId);

                postCount++;
                console.log(`  ✅ Post by ${seedPost.persona}: "${seedPost.content.slice(0, 50)}..."`);
            }
        } catch (err) {
            console.error(`  ❌ Seed post: ${err.message}`);
        }
    }

    // Fix posts_count for all bots
    for (const [persona, botData] of createdBots) {
        const { count } = await supabase
            .from('posts')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', botData.userId);

        await supabase.from('profiles')
            .update({ posts_count: count || 0 })
            .eq('id', botData.userId);
    }

    console.log(`\n  📊 Seeded ${postCount} posts\n`);

    // Step 5: Add some likes to seed posts
    console.log('❤️ Step 5: Adding initial likes...\n');

    const { data: allPosts } = await supabase
        .from('posts')
        .select('id, user_id')
        .order('created_at', { ascending: false })
        .limit(20);

    let likeCount = 0;
    if (allPosts) {
        for (const post of allPosts) {
            // Each bot has 40% chance of liking each post
            for (const botUserId of botUserIds) {
                if (botUserId === post.user_id) continue;
                if (Math.random() > 0.6) {
                    try {
                        await supabase.from('post_likes').insert({
                            post_id: post.id,
                            user_id: botUserId,
                        });
                        await supabase.from('posts')
                            .update({ likes_count: supabase.rpc ? undefined : 0 })
                            .eq('id', post.id);
                        likeCount++;
                    } catch { /* ignore duplicates */ }
                }
            }
        }

        // Fix likes_count for all posts
        for (const post of allPosts) {
            const { count } = await supabase
                .from('post_likes')
                .select('id', { count: 'exact', head: true })
                .eq('post_id', post.id);

            await supabase.from('posts')
                .update({ likes_count: count || 0 })
                .eq('id', post.id);
        }
    }

    console.log(`  ✅ Added ${likeCount} likes\n`);

    // Summary
    console.log('═══════════════════════════════════════════');
    console.log('🤖 SETUP COMPLETE!');
    console.log('═══════════════════════════════════════════');
    console.log(`  Bot accounts:    ${createdBots.size}`);
    console.log(`  Follow network:  ${followCount} connections`);
    console.log(`  Seed posts:      ${postCount}`);
    console.log(`  Seed likes:      ${likeCount}`);
    console.log('═══════════════════════════════════════════');
    console.log('\n📌 Next steps:');
    console.log('  1. Run the SQL migration: community_bots_migration.sql');
    console.log('  2. Deploy the Edge Function: supabase functions deploy community-bots');
    console.log('  3. Set up CRON: node trigger-community-bots.mjs');
    console.log('  4. Monitor in Admin panel\n');
}

main().catch(console.error);
