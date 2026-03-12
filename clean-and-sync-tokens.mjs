/**
 * Token Cleanup and Resync Script
 * Run with: node --experimental-modules clean-and-sync-tokens.mjs
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Supabase configuration (Updated from .env)
const SUPABASE_URL = 'https://fwaehmcizeelqbcibbll.supabase.co';
// Using the Anon Key from .env
const SUPABASE_ANON_KEY = 'sb_publishable_heSQn-47fR1DkyVco_iOZg_y3cY0A-w';

if (!SUPABASE_ANON_KEY) {
    console.error('❌ SUPABASE_ANON_KEY not found.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to authenticate
async function authenticate() {
    console.log('🔐 Authenticating as admin...');
    const { error } = await supabase.auth.signInWithPassword({
        email: 'ipcompanidigital@gmail.com',
        password: '@Bruno123'
    });

    if (error) {
        console.error('❌ Authentication failed:', error.message);
        process.exit(1);
    }
    console.log('✅ Authenticated successfully!');
}

// Lista de stablecoins e tokens problemáticos para ignorar
const EXCLUDED_TOKENS = new Set([
    'USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'USDP', 'USDD', 'FDUSD',
    'EUR', 'GBP', 'AUD', 'BRL', 'TRY', 'RUB', 'UAH', 'NGN', 'LUNC',
    'LUNA', 'UST', 'USTC', 'BTTC', 'WIN', 'SHIB', 'PEPE', 'BONK', 'FLOKI'
]);

// Top narrativas de 2024/2025
const TOP_NARRATIVES = {
    'BTC': 'Store of Value',
    'ETH': 'Smart Contracts',
    'SOL': 'High Performance L1',
    'AVAX': 'High Performance L1',
    'NEAR': 'High Performance L1',
    'SUI': 'High Performance L1',
    'SEI': 'High Performance L1',
    'APT': 'High Performance L1',
    'MATIC': 'Layer 2',
    'ARB': 'Layer 2',
    'OP': 'Layer 2',
    'STRK': 'Layer 2',
    'POL': 'Layer 2',
    'LINK': 'Oracle',
    'PYTH': 'Oracle',
    'API3': 'Oracle',
    'FET': 'AI',
    'AGIX': 'AI',
    'OCEAN': 'AI',
    'RNDR': 'AI/GPU',
    'TAO': 'AI',
    'WLD': 'AI',
    'ARKM': 'AI',
    'DOGE': 'Meme',
    'INJ': 'DeFi',
    'MKR': 'DeFi',
    'AAVE': 'DeFi',
    'UNI': 'DeFi',
    'CRV': 'DeFi',
    'SNX': 'DeFi',
    'DYDX': 'DeFi',
    'GMX': 'DeFi',
    'PENDLE': 'DeFi',
    'LDO': 'Liquid Staking',
    'RPL': 'Liquid Staking',
    'FXS': 'Liquid Staking',
    'ATOM': 'Cosmos',
    'TIA': 'Cosmos/Modular',
    'OSMO': 'Cosmos',
    'DOT': 'Interoperability',
    'RUNE': 'Interoperability',
    'STX': 'Bitcoin L2',
    'ORDI': 'Bitcoin Ordinals',
    'SATS': 'Bitcoin Ordinals',
    'GRT': 'Infrastructure',
    'FIL': 'Storage',
    'AR': 'Storage',
    'THETA': 'Video/Streaming',
    'ICP': 'Infrastructure',
    'KAS': 'PoW',
    'CFX': 'China',
    'VET': 'Supply Chain',
    'GALA': 'Gaming',
    'IMX': 'Gaming',
    'AXS': 'Gaming',
    'SAND': 'Metaverse',
    'MANA': 'Metaverse',
    'ENS': 'Identity',
    'XRP': 'Payments',
    'ADA': 'Smart Contracts',
    'TRX': 'Payments',
    'LTC': 'Store of Value',
    'BCH': 'Store of Value',
    'ETC': 'Smart Contracts',
    'XLM': 'Payments',
    'ALGO': 'Smart Contracts',
    'HBAR': 'Enterprise',
    'QNT': 'Interoperability',
    'EGLD': 'Smart Contracts',
    'XMR': 'Privacy',
    'ZEC': 'Privacy',
    'ZK': 'Layer 2',
    'BLUR': 'NFT',
    'APE': 'NFT/Metaverse',
    'SKL': 'Layer 2',
    'CELO': 'Payments',
    'KAVA': 'DeFi',
    'ROSE': 'Privacy',
    'ONE': 'Smart Contracts',
    'ZIL': 'Smart Contracts',
    'ENJ': 'Gaming/NFT',
    'CHZ': 'Sports/Fan Tokens',
    'FLOW': 'NFT/Gaming',
    'MASK': 'Social/Web3',
    'SSV': 'Infrastructure',
    'ACH': 'Payments',
    'SUPER': 'Gaming',
    'YGG': 'Gaming',
    'MAGIC': 'Gaming',
    'PIXEL': 'Gaming',
    'PORTAL': 'Gaming',
    'RON': 'Gaming L2',
    'BEAM': 'Gaming',
    'XAI': 'Gaming',
    'ALT': 'Layer 2',
    'MANTA': 'Layer 2',
    'DYM': 'Modular',
    'JUP': 'DeFi',
    'JTO': 'Liquid Staking',
    'W': 'Interoperability',
    'ENA': 'DeFi',
    'AEVO': 'DeFi',
    'ETHFI': 'Liquid Staking',
    'REZ': 'DeFi',
    'BB': 'DeFi',
    'IO': 'AI/GPU',
    'ZRO': 'Interoperability',
    'LISTA': 'DeFi',
    'NOT': 'Telegram/Gaming',
    'DOGS': 'Meme',
    'TON': 'Telegram',
    'ONDO': 'RWA',
    'ASTR': 'Smart Contracts',
    'FTM': 'Smart Contracts',
    'CKB': 'Bitcoin L2',
    'BOME': 'Meme',
    'BRETT': 'Meme',
    'MEW': 'Meme',
    'TURBO': 'Meme',
    'NEIRO': 'Meme',
    'WIF': 'Meme',
    'POPCAT': 'Meme',
    'GOAT': 'Meme',
    'ACT': 'Meme/AI',
    'PNUT': 'Meme',
    'EIGEN': 'Restaking',
    'SAFE': 'Infrastructure',
    'SCR': 'Layer 2',
    'CATI': 'Gaming',
    'HMSTR': 'Gaming',
    'BANANA': 'DeFi',
    'SAGA': 'Modular',
    'OMNI': 'Infrastructure',
    'MERL': 'Bitcoin L2',
    'TNSR': 'NFT',
    'BAKE': 'DeFi',
    'CAKE': 'DeFi',
    'DODO': 'DeFi',
    'SUSHI': 'DeFi',
    'COMP': 'DeFi',
    'BAL': 'DeFi',
    'BADGER': 'DeFi',
    'YFI': 'DeFi',
    'QUICK': 'DeFi',
    'PERP': 'DeFi',
    'LQTY': 'DeFi',
    'RLC': 'Infrastructure',
    'ANKR': 'Infrastructure',
    'NMR': 'AI',
    'BAND': 'Oracle',
    'TRB': 'Oracle',
    'UMA': 'DeFi',
    'BNT': 'DeFi',
    'SPELL': 'DeFi',
    'CVX': 'DeFi',
    'AUDIO': 'Music',
    'RAD': 'Developer Tools',
    'CELR': 'Layer 2',
    'SYN': 'Interoperability',
    'STG': 'Interoperability',
    'LINA': 'DeFi',
    'ALICE': 'Metaverse',
    'TLM': 'Gaming',
    'SLP': 'Gaming',
    'RARE': 'NFT',
    'LOOKS': 'NFT',
    'X2Y2': 'NFT',
    'HIGH': 'Metaverse',
    'WAXP': 'NFT',
    'NFT': 'NFT',
    'GMT': 'Move to Earn',
    'STEPN': 'Move to Earn',
    'LOKA': 'Gaming',
    'PYR': 'Gaming',
    'PRIME': 'Gaming',
    'ILV': 'Gaming',
    'GODS': 'Gaming',
};

// Nomes dos tokens principais
const TOKEN_NAMES = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'SOL': 'Solana',
    'BNB': 'Binance Coin',
    'XRP': 'Ripple',
    'ADA': 'Cardano',
    'DOGE': 'Dogecoin',
    'AVAX': 'Avalanche',
    'DOT': 'Polkadot',
    'MATIC': 'Polygon',
    'POL': 'Polygon',
    'LINK': 'Chainlink',
    'UNI': 'Uniswap',
    'ATOM': 'Cosmos',
    'LTC': 'Litecoin',
    'TRX': 'Tron',
    'NEAR': 'NEAR Protocol',
    'ARB': 'Arbitrum',
    'OP': 'Optimism',
    'INJ': 'Injective',
    'IMX': 'Immutable X',
    'FET': 'Fetch.ai',
    'RNDR': 'Render',
    'GRT': 'The Graph',
    'FIL': 'Filecoin',
    'AAVE': 'Aave',
    'MKR': 'Maker',
    'SNX': 'Synthetix',
    'CRV': 'Curve',
    'LDO': 'Lido DAO',
    'APT': 'Aptos',
    'SUI': 'Sui',
    'SEI': 'Sei',
    'TIA': 'Celestia',
    'STX': 'Stacks',
    'KAS': 'Kaspa',
    'TAO': 'Bittensor',
    'PENDLE': 'Pendle',
    'GMX': 'GMX',
    'DYDX': 'dYdX',
    'AR': 'Arweave',
    'ZK': 'zkSync',
    'ICP': 'Internet Computer',
    'THETA': 'Theta Network',
    'VET': 'VeChain',
    'GALA': 'Gala',
    'AXS': 'Axie Infinity',
    'SAND': 'The Sandbox',
    'MANA': 'Decentraland',
    'ENS': 'Ethereum Name Service',
    'TON': 'Toncoin',
    'WLD': 'Worldcoin',
    'FTM': 'Fantom',
    'ASTR': 'Astar',
    'PYTH': 'Pyth Network',
    'JUP': 'Jupiter',
    'JTO': 'Jito',
    'STRK': 'Starknet',
    'BLUR': 'Blur',
    'APE': 'ApeCoin',
    'ORDI': 'Ordinals',
    'RUNE': 'THORChain',
    'CFX': 'Conflux',
    'OSMO': 'Osmosis',
    'AGIX': 'SingularityNET',
    'OCEAN': 'Ocean Protocol',
    'ARKM': 'Arkham',
    'MANTA': 'Manta Network',
    'DYM': 'Dymension',
    'ALT': 'Altlayer',
    'PIXEL': 'Pixels',
    'PORTAL': 'Portal',
    'XAI': 'Xai',
    'ONDO': 'Ondo Finance',
    'ENA': 'Ethena',
    'ETHFI': 'Ether.fi',
    'WIF': 'dogwifhat',
    'BOME': 'Book of Meme',
    'NOT': 'Notcoin',
    'IO': 'io.net',
    'ZRO': 'LayerZero',
    'EIGEN': 'EigenLayer',
    'BEAM': 'Beam',
    'RON': 'Ronin',
    'SKL': 'SKALE',
    'CELO': 'Celo',
    'KAVA': 'Kava',
    'ROSE': 'Oasis Network',
    'HBAR': 'Hedera',
    'QNT': 'Quant',
    'EGLD': 'MultiversX',
    'ALGO': 'Algorand',
    'XLM': 'Stellar',
    'BCH': 'Bitcoin Cash',
    'ETC': 'Ethereum Classic',
    'XMR': 'Monero',
    'ZEC': 'Zcash',
    'FLOW': 'Flow',
    'ENJ': 'Enjin Coin',
    'CHZ': 'Chiliz',
    'ONE': 'Harmony',
    'ZIL': 'Zilliqa',
    'MASK': 'Mask Network',
    'SSV': 'SSV Network',
    'CKB': 'Nervos Network',
    'MAGIC': 'Magic',
    'YGG': 'Yield Guild Games',
    'SUPER': 'SuperVerse',
    'PRIME': 'Echelon Prime',
    'ILV': 'Illuvium',
    'GODS': 'Gods Unchained',
    'AEVO': 'Aevo',
    'W': 'Wormhole',
    'SAGA': 'Saga',
    'OMNI': 'Omni Network',
    'MERL': 'Merlin Chain',
    'TNSR': 'Tensor',
    'CAKE': 'PancakeSwap',
    'SUSHI': 'SushiSwap',
    'COMP': 'Compound',
    'BAL': 'Balancer',
    'YFI': 'yearn.finance',
    'AUDIO': 'Audius',
    'CELR': 'Celer Network',
    'SYN': 'Synapse',
    'STG': 'Stargate Finance',
    'ALICE': 'My Neighbor Alice',
    'GMT': 'STEPN',
    'PYR': 'Vulcan Forged',
    'LOKA': 'League of Kingdoms',
    'HMSTR': 'Hamster Kombat',
    'CATI': 'Catizen',
    'NEIRO': 'Neiro',
    'POPCAT': 'Popcat',
    'GOAT': 'Goatseus Maximus',
    'ACT': 'Act I',
    'PNUT': 'Peanut',
    'DOGS': 'Dogs',
    'TURBO': 'Turbo',
    'MEW': 'cat in a dogs world',
    'BRETT': 'Brett',
    'SAFE': 'Safe',
    'SCR': 'Scroll',
    'LISTA': 'Lista DAO',
    'REZ': 'Renzo',
    'BB': 'BounceBit',
    'BANANA': 'Banana Gun',
    'BAKE': 'BakeryToken',
    'DODO': 'DODO',
    'PERP': 'Perpetual Protocol',
    'LQTY': 'Liquity',
    'QUICK': 'QuickSwap',
    'RLC': 'iExec RLC',
    'ANKR': 'Ankr',
    'NMR': 'Numeraire',
    'BAND': 'Band Protocol',
    'TRB': 'Tellor',
    'UMA': 'UMA',
    'BNT': 'Bancor',
    'RAD': 'Radicle',
    'CVX': 'Convex Finance',
    'SPELL': 'Spell Token',
    'BADGER': 'Badger DAO',
    'LINA': 'Linear',
    'TLM': 'Alien Worlds',
    'SLP': 'Smooth Love Potion',
    'RARE': 'SuperRare',
    'LOOKS': 'LooksRare',
    'HIGH': 'Highstreet',
    'WAXP': 'WAX',
    'API3': 'API3',
    'FXS': 'Frax Share',
    'RPL': 'Rocket Pool',
};

async function fetchBinanceTickers() {
    console.log('📡 Fetching tickers from Binance...');
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    const data = await response.json();

    const tickerMap = new Map();

    for (const ticker of data) {
        if (ticker.symbol.endsWith('USDT')) {
            const baseAsset = ticker.symbol.replace('USDT', '');
            if (!EXCLUDED_TOKENS.has(baseAsset) && baseAsset.length >= 2) {
                tickerMap.set(baseAsset, ticker);
            }
        }
    }

    console.log(`✅ Found ${tickerMap.size} valid USDT pairs`);
    return tickerMap;
}

function getTokenName(ticker) {
    return TOKEN_NAMES[ticker] || ticker;
}

/**
 * Improved Score Calculation with better distribution
 * Score ranges:
 * 80-100: Elite/Andamento - Very strong signals
 * 65-79: Gatilho - Ready to trigger
 * 50-64: Acumulação - Accumulating
 * 0-49: Observação - Just watching
 */
function calculateScore(ticker, volume24h, change24h, hasNarrative) {
    let score = 40; // Base score lowered for better distribution

    // 1. Volume scoring (up to +25 points)
    const volumeInMillions = volume24h / 1_000_000;
    if (volumeInMillions > 500) score += 25;      // > $500M
    else if (volumeInMillions > 200) score += 20; // > $200M
    else if (volumeInMillions > 100) score += 15; // > $100M
    else if (volumeInMillions > 50) score += 10;  // > $50M
    else if (volumeInMillions > 20) score += 7;   // > $20M
    else if (volumeInMillions > 10) score += 5;   // > $10M
    else if (volumeInMillions > 5) score += 3;    // > $5M
    else score += 1;                               // Low volume

    // 2. Price momentum scoring (up to +20 points)
    const absChange = Math.abs(change24h);
    if (change24h > 0) {
        // Positive momentum is good
        if (change24h >= 5 && change24h < 15) score += 20;  // Strong uptrend
        else if (change24h >= 2 && change24h < 5) score += 15; // Healthy uptrend  
        else if (change24h >= 0 && change24h < 2) score += 10; // Stable positive
        else if (change24h >= 15 && change24h < 30) score += 12; // Very strong (but risky)
        else if (change24h >= 30) score += 5; // Overextended, risky
    } else {
        // Negative momentum
        if (change24h > -3) score += 8;      // Small dip - buying opportunity
        else if (change24h > -10) score += 3; // Moderate dip
        else if (change24h > -20) score -= 5; // Significant drop
        else score -= 10;                     // Major crash
    }

    // 3. Narrative bonus (up to +15 points)
    if (hasNarrative) {
        score += 15;
    }

    // 4. Quality bonus for well-known tokens
    const topTier = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'AVAX', 'DOT', 'LINK'];
    const midTier = ['MATIC', 'POL', 'ARB', 'OP', 'ATOM', 'UNI', 'AAVE', 'INJ', 'SUI', 'APT', 'SEI', 'TIA', 'NEAR', 'FET', 'RNDR', 'TAO', 'WLD'];

    if (topTier.includes(ticker)) score += 10;
    else if (midTier.includes(ticker)) score += 5;

    // Clamp between 0-100
    return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Determine status based on score
 */
function determineStatus(score) {
    if (score >= 80) return 'andamento';   // Elite
    if (score >= 65) return 'gatilho';     // Ready
    if (score >= 50) return 'acumulacao';  // Accumulating  
    return 'observacao';                    // Watching
}

async function main() {
    await authenticate();
    console.log('🚀 Starting Token Cleanup and Resync...\n');

    // Step 1: Delete ALL existing tokens
    console.log('🗑️  Step 1: Deleting all existing tokens from database...');
    const { error: deleteError } = await supabase
        .from('tokens')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
        console.error('❌ Error deleting tokens:', deleteError);
        process.exit(1);
    }
    console.log('✅ All tokens deleted successfully\n');

    // Step 2: Fetch all tokens from Binance
    console.log('📡 Step 2: Fetching tokens from Binance...');
    const tickers = await fetchBinanceTickers();

    // Step 3: Filter by whitelist (only curated tokens) and sort by volume
    // IMPORTANT: Only insert tokens we have in our curated lists to avoid
    // obscure Binance pairs like 2Z, A, C, D, C98 etc.
    const CURATED_TICKERS = new Set([...Object.keys(TOP_NARRATIVES), ...Object.keys(TOKEN_NAMES)]);
    const MIN_VOLUME = 1_000_000; // Minimum $1M volume (lowered since we're already filtering by whitelist)
    const MAX_TOKENS = 200;

    const sortedTokens = [...tickers.entries()]
        .map(([symbol, ticker]) => ({
            symbol,
            ticker,
            volume: parseFloat(ticker.quoteVolume),
            change: parseFloat(ticker.priceChangePercent),
            price: parseFloat(ticker.lastPrice),
        }))
        .filter(t => CURATED_TICKERS.has(t.symbol) && t.volume >= MIN_VOLUME)
        .sort((a, b) => b.volume - a.volume)
        .slice(0, MAX_TOKENS);

    console.log(`✅ Selected ${sortedTokens.length} curated tokens with volume > $${MIN_VOLUME / 1_000_000}M\n`);

    // Log any curated tokens not found on Binance for awareness
    const foundSymbols = new Set(sortedTokens.map(t => t.symbol));
    const missingFromBinance = [...CURATED_TICKERS].filter(t => !foundSymbols.has(t) && !EXCLUDED_TOKENS.has(t));
    if (missingFromBinance.length > 0) {
        console.log(`⚠️  ${missingFromBinance.length} curated tokens not found on Binance or below volume threshold:`);
        console.log(`   ${missingFromBinance.join(', ')}\n`);
    }

    // Step 4: Insert tokens with proper scoring
    console.log('📥 Step 3: Inserting tokens with calculated scores...\n');

    const statusCounts = { observacao: 0, acumulacao: 0, gatilho: 0, andamento: 0 };
    let inserted = 0;

    for (const { symbol, ticker, volume, change, price } of sortedTokens) {
        const hasNarrative = TOP_NARRATIVES[symbol] !== undefined;
        const score = calculateScore(symbol, volume, change, hasNarrative);
        const status = determineStatus(score);
        const name = getTokenName(symbol);
        const narrative = TOP_NARRATIVES[symbol] || null;

        const { error: insertError } = await supabase
            .from('tokens')
            .insert({
                ticker: symbol,
                name: name,
                current_price: price,
                change_24h: change,
                volume_24h: volume,
                score: score,
                status: status,
                narrative: narrative,
                updated_at: new Date().toISOString(),
            });

        if (insertError) {
            console.error(`❌ Error inserting ${symbol}:`, insertError.message);
        } else {
            inserted++;
            statusCounts[status]++;

            // Show progress every 10 tokens
            if (inserted % 10 === 0) {
                console.log(`   Inserted ${inserted}/${sortedTokens.length} tokens...`);
            }
        }
    }

    console.log(`\n✅ Successfully inserted ${inserted} tokens\n`);

    // Step 5: Show distribution summary
    console.log('📊 Score Distribution Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   🔵 Observação (0-49):    ${statusCounts.observacao} tokens`);
    console.log(`   🟢 Acumulação (50-64):   ${statusCounts.acumulacao} tokens`);
    console.log(`   🟡 Gatilho (65-79):      ${statusCounts.gatilho} tokens`);
    console.log(`   🚀 Em Andamento (80+):   ${statusCounts.andamento} tokens`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   📊 Total: ${inserted} tokens`);
    console.log('\n🎉 Token cleanup and resync complete!');
}

main().catch(console.error);
