import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Lista de stablecoins e tokens problemáticos para ignorar
const EXCLUDED_TOKENS = new Set([
    'USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'USDP', 'USDD', 'FDUSD',
    'EUR', 'GBP', 'AUD', 'BRL', 'TRY', 'RUB', 'UAH', 'NGN', 'LUNC',
    'LUNA', 'UST', 'USTC', 'BTTC', 'WIN', 'SHIB', 'PEPE', 'BONK', 'FLOKI'
]);

// Top narrativas de 2024/2025
const TOP_NARRATIVES: Record<string, string> = {
    'BTC': 'Store of Value', 'ETH': 'Smart Contracts', 'SOL': 'High Performance L1',
    'AVAX': 'High Performance L1', 'NEAR': 'High Performance L1', 'SUI': 'High Performance L1',
    'SEI': 'High Performance L1', 'APT': 'High Performance L1', 'MATIC': 'Layer 2',
    'POL': 'Layer 2', 'ARB': 'Layer 2', 'OP': 'Layer 2', 'STRK': 'Layer 2',
    'LINK': 'Oracle', 'PYTH': 'Oracle', 'FET': 'AI', 'RNDR': 'AI/GPU',
    'TAO': 'AI', 'WLD': 'AI', 'ARKM': 'AI', 'DOGE': 'Meme', 'INJ': 'DeFi',
    'MKR': 'DeFi', 'AAVE': 'DeFi', 'UNI': 'DeFi', 'CRV': 'DeFi', 'SNX': 'DeFi',
    'DYDX': 'DeFi', 'GMX': 'DeFi', 'PENDLE': 'DeFi', 'LDO': 'Liquid Staking',
    'ATOM': 'Cosmos', 'TIA': 'Cosmos/Modular', 'DOT': 'Interoperability',
    'RUNE': 'Interoperability', 'STX': 'Bitcoin L2', 'ORDI': 'Bitcoin Ordinals',
    'GRT': 'Infrastructure', 'FIL': 'Storage', 'AR': 'Storage', 'ICP': 'Infrastructure',
    'KAS': 'PoW', 'VET': 'Supply Chain', 'GALA': 'Gaming', 'IMX': 'Gaming',
    'AXS': 'Gaming', 'SAND': 'Metaverse', 'MANA': 'Metaverse', 'ENS': 'Identity',
    'XRP': 'Payments', 'ADA': 'Smart Contracts', 'TRX': 'Payments', 'LTC': 'Store of Value',
    'FTM': 'Smart Contracts', 'ASTR': 'Smart Contracts', 'ZK': 'Layer 2',
    'BLUR': 'NFT', 'APE': 'NFT/Metaverse', 'SKL': 'Layer 2', 'CELO': 'Payments',
    'KAVA': 'DeFi', 'HBAR': 'Enterprise', 'QNT': 'Interoperability', 'EGLD': 'Smart Contracts',
    'ALGO': 'Algorand', 'XLM': 'Payments', 'FLOW': 'NFT/Gaming', 'CHZ': 'Sports',
    'TON': 'Telegram', 'ONDO': 'RWA', 'JUP': 'DeFi', 'JTO': 'Liquid Staking',
    'MANTA': 'Layer 2', 'DYM': 'Modular', 'ALT': 'Layer 2', 'PIXEL': 'Gaming',
    'PORTAL': 'Gaming', 'XAI': 'Gaming', 'RON': 'Gaming L2', 'BEAM': 'Gaming',
    'ENA': 'DeFi', 'ETHFI': 'Liquid Staking', 'WIF': 'Meme', 'BOME': 'Meme',
    'NOT': 'Telegram/Gaming', 'IO': 'AI/GPU', 'ZRO': 'Interoperability',
    'EIGEN': 'Restaking', 'SAFE': 'Infrastructure', 'SCR': 'Layer 2',
    'HMSTR': 'Gaming', 'CATI': 'Gaming', 'NEIRO': 'Meme', 'POPCAT': 'Meme',
    'GOAT': 'Meme', 'ACT': 'Meme/AI', 'PNUT': 'Meme', 'DOGS': 'Meme',
    'CAKE': 'DeFi', 'SUSHI': 'DeFi', 'YFI': 'DeFi', 'COMP': 'DeFi',
    'MAGIC': 'Gaming', 'YGG': 'Gaming', 'PRIME': 'Gaming', 'ILV': 'Gaming',
    'W': 'Interoperability', 'AEVO': 'DeFi', 'SAGA': 'Modular', 'OMNI': 'Infrastructure',
};

// Token names
const TOKEN_NAMES: Record<string, string> = {
    'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'SOL': 'Solana', 'BNB': 'Binance Coin',
    'XRP': 'Ripple', 'ADA': 'Cardano', 'DOGE': 'Dogecoin', 'AVAX': 'Avalanche',
    'DOT': 'Polkadot', 'MATIC': 'Polygon', 'POL': 'Polygon', 'LINK': 'Chainlink',
    'UNI': 'Uniswap', 'ATOM': 'Cosmos', 'LTC': 'Litecoin', 'TRX': 'Tron',
    'NEAR': 'NEAR Protocol', 'ARB': 'Arbitrum', 'OP': 'Optimism', 'INJ': 'Injective',
    'IMX': 'Immutable X', 'FET': 'Fetch.ai', 'RNDR': 'Render', 'GRT': 'The Graph',
    'FIL': 'Filecoin', 'AAVE': 'Aave', 'MKR': 'Maker', 'SNX': 'Synthetix',
    'CRV': 'Curve', 'LDO': 'Lido DAO', 'APT': 'Aptos', 'SUI': 'Sui', 'SEI': 'Sei',
    'TIA': 'Celestia', 'STX': 'Stacks', 'KAS': 'Kaspa', 'TAO': 'Bittensor',
    'PENDLE': 'Pendle', 'GMX': 'GMX', 'DYDX': 'dYdX', 'AR': 'Arweave', 'ZK': 'zkSync',
    'ICP': 'Internet Computer', 'VET': 'VeChain', 'GALA': 'Gala', 'AXS': 'Axie Infinity',
    'SAND': 'The Sandbox', 'MANA': 'Decentraland', 'ENS': 'Ethereum Name Service',
    'TON': 'Toncoin', 'WLD': 'Worldcoin', 'FTM': 'Fantom', 'ASTR': 'Astar',
    'PYTH': 'Pyth Network', 'JUP': 'Jupiter', 'JTO': 'Jito', 'STRK': 'Starknet',
    'BLUR': 'Blur', 'APE': 'ApeCoin', 'ORDI': 'Ordinals', 'RUNE': 'THORChain',
    'CFX': 'Conflux', 'AGIX': 'SingularityNET', 'OCEAN': 'Ocean Protocol',
    'ARKM': 'Arkham', 'MANTA': 'Manta Network', 'DYM': 'Dymension', 'ALT': 'Altlayer',
    'PIXEL': 'Pixels', 'PORTAL': 'Portal', 'XAI': 'Xai', 'ONDO': 'Ondo Finance',
    'ENA': 'Ethena', 'ETHFI': 'Ether.fi', 'WIF': 'dogwifhat', 'BOME': 'Book of Meme',
    'NOT': 'Notcoin', 'IO': 'io.net', 'ZRO': 'LayerZero', 'EIGEN': 'EigenLayer',
    'BEAM': 'Beam', 'RON': 'Ronin', 'SKL': 'SKALE', 'CELO': 'Celo', 'KAVA': 'Kava',
    'HBAR': 'Hedera', 'QNT': 'Quant', 'EGLD': 'MultiversX', 'ALGO': 'Algorand',
    'XLM': 'Stellar', 'FLOW': 'Flow', 'CHZ': 'Chiliz', 'ENJ': 'Enjin Coin',
    'SAFE': 'Safe', 'SCR': 'Scroll', 'HMSTR': 'Hamster Kombat', 'CATI': 'Catizen',
    'NEIRO': 'Neiro', 'POPCAT': 'Popcat', 'GOAT': 'Goatseus Maximus', 'ACT': 'Act I',
    'PNUT': 'Peanut', 'DOGS': 'Dogs', 'CAKE': 'PancakeSwap', 'SUSHI': 'SushiSwap',
    'YFI': 'yearn.finance', 'COMP': 'Compound', 'MAGIC': 'Magic', 'YGG': 'Yield Guild Games',
    'PRIME': 'Echelon Prime', 'ILV': 'Illuvium', 'W': 'Wormhole', 'AEVO': 'Aevo',
    'SAGA': 'Saga', 'OMNI': 'Omni Network',
    'ZEC': 'Zcash', 'ZEN': 'Horizen', 'ZIL': 'Zilliqa', 'ZKF': 'ZKFair'
};

function getTokenName(ticker: string): string {
    return TOKEN_NAMES[ticker] || ticker;
}

/**
 * Improved Score Calculation with better distribution
 */
function calculateScore(ticker: string, volume24h: number, change24h: number, hasNarrative: boolean): number {
    let score = 40;

    // Volume scoring (up to +25 points)
    const volumeInMillions = volume24h / 1_000_000;
    if (volumeInMillions > 500) score += 25;
    else if (volumeInMillions > 200) score += 20;
    else if (volumeInMillions > 100) score += 15;
    else if (volumeInMillions > 50) score += 10;
    else if (volumeInMillions > 20) score += 7;
    else if (volumeInMillions > 10) score += 5;
    else if (volumeInMillions > 5) score += 3;
    else score += 1;

    // Price momentum scoring (up to +20 points)
    if (change24h > 0) {
        if (change24h >= 5 && change24h < 15) score += 20;
        else if (change24h >= 2 && change24h < 5) score += 15;
        else if (change24h >= 0 && change24h < 2) score += 10;
        else if (change24h >= 15 && change24h < 30) score += 12;
        else if (change24h >= 30) score += 5;
    } else {
        if (change24h > -3) score += 8;
        else if (change24h > -10) score += 3;
        else if (change24h > -20) score -= 5;
        else score -= 10;
    }

    // Narrative bonus (+15 points)
    if (hasNarrative) score += 15;

    // Quality bonus for well-known tokens
    const topTier = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'AVAX', 'DOT', 'LINK'];
    const midTier = ['MATIC', 'POL', 'ARB', 'OP', 'ATOM', 'UNI', 'AAVE', 'INJ', 'SUI', 'APT', 'SEI', 'TIA', 'NEAR', 'FET', 'RNDR', 'TAO', 'WLD'];

    if (topTier.includes(ticker)) score += 10;
    else if (midTier.includes(ticker)) score += 5;

    return Math.min(100, Math.max(0, Math.round(score)));
}

function determineStatus(score: number): string {
    if (score >= 80) return 'andamento';
    if (score >= 65) return 'gatilho';
    if (score >= 50) return 'acumulacao';
    return 'observacao';
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        console.log('🚀 Starting token sync...');

        // 1. Delete all existing tokens
        console.log('🗑️ Deleting all existing tokens...');
        const { error: deleteError } = await supabase
            .from('tokens')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (deleteError) {
            console.error('Delete error:', deleteError);
            throw new Error(`Failed to delete tokens: ${deleteError.message}`);
        }

        // 2. Fetch from Binance
        console.log('📡 Fetching from Binance...');
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const tickers = await response.json();

        const validTokens: any[] = [];
        for (const ticker of tickers) {
            if (ticker.symbol.endsWith('USDT')) {
                const baseAsset = ticker.symbol.replace('USDT', '');
                if (!EXCLUDED_TOKENS.has(baseAsset) && baseAsset.length >= 2) {
                    const volume = parseFloat(ticker.quoteVolume);
                    if (volume >= 5_000_000) { // Min $5M volume
                        validTokens.push({
                            symbol: baseAsset,
                            price: parseFloat(ticker.lastPrice),
                            change: parseFloat(ticker.priceChangePercent),
                            volume: volume,
                        });
                    }
                }
            }
        }

        // Sort by volume and take top 150
        validTokens.sort((a, b) => b.volume - a.volume);
        const topTokens = validTokens.slice(0, 150);

        console.log(`✅ Found ${topTokens.length} valid tokens`);

        // 3. Insert tokens
        const statusCounts = { observacao: 0, acumulacao: 0, gatilho: 0, andamento: 0 };
        let inserted = 0;

        for (const token of topTokens) {
            const hasNarrative = TOP_NARRATIVES[token.symbol] !== undefined;
            const score = calculateScore(token.symbol, token.volume, token.change, hasNarrative);
            const status = determineStatus(score);

            statusCounts[status as keyof typeof statusCounts]++;

            const { error: insertError } = await supabase
                .from('tokens')
                .insert({
                    ticker: token.symbol,
                    name: getTokenName(token.symbol),
                    current_price: token.price,
                    change_24h: token.change,
                    volume_24h: token.volume,
                    score: score,
                    status: status,
                    narrative: TOP_NARRATIVES[token.symbol] || null,
                    updated_at: new Date().toISOString(),
                });

            if (!insertError) inserted++;
        }

        const result = {
            success: true,
            message: `Synced ${inserted} tokens from Binance`,
            distribution: statusCounts,
            total: inserted
        };

        console.log('📊 Sync complete:', result);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error: any) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
