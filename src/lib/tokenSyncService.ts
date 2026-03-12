/**
 * Token Sync Service
 * Busca todos os tokens USDT disponíveis na Binance e sincroniza com o banco
 */

import { supabase } from '@/integrations/supabase/client';
import { CURATED_TOKENS } from '@/lib/curatedTokens';

interface BinanceTicker {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    lastPrice: string;
    volume: string;
    quoteVolume: string;
}

// Lista de stablecoins e tokens problemáticos para ignorar
const EXCLUDED_TOKENS = new Set([
    'USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'USDP', 'USDD', 'FDUSD',
    'EUR', 'GBP', 'AUD', 'BRL', 'TRY', 'RUB', 'UAH', 'NGN', 'LUNC',
    'LUNA', 'UST', 'USTC', 'BTTC', 'WIN'
]);

// Top narrativas de 2024/2025
export const TOP_NARRATIVES: Record<string, string> = {
    'BTC': 'Store of Value', 'ETH': 'Smart Contracts', 'SOL': 'High Performance L1',
    'AVAX': 'High Performance L1', 'NEAR': 'High Performance L1', 'SUI': 'High Performance L1',
    'SEI': 'High Performance L1', 'APT': 'High Performance L1', 'MATIC': 'Layer 2',
    'POL': 'Layer 2', 'ARB': 'Layer 2', 'OP': 'Layer 2', 'STRK': 'Layer 2',
    'LINK': 'Oracle', 'PYTH': 'Oracle', 'API3': 'Oracle', 'FET': 'AI',
    'AGIX': 'AI', 'OCEAN': 'AI', 'RNDR': 'AI/GPU', 'TAO': 'AI', 'WLD': 'AI',
    'ARKM': 'AI', 'DOGE': 'Meme', 'INJ': 'DeFi', 'MKR': 'DeFi', 'AAVE': 'DeFi',
    'UNI': 'DeFi', 'CRV': 'DeFi', 'SNX': 'DeFi', 'DYDX': 'DeFi', 'GMX': 'DeFi',
    'PENDLE': 'DeFi', 'LDO': 'Liquid Staking', 'RPL': 'Liquid Staking',
    'FXS': 'Liquid Staking', 'ATOM': 'Cosmos', 'TIA': 'Cosmos/Modular',
    'OSMO': 'Cosmos', 'DOT': 'Interoperability', 'RUNE': 'Interoperability',
    'STX': 'Bitcoin L2', 'ORDI': 'Bitcoin Ordinals', 'SATS': 'Bitcoin Ordinals',
    'GRT': 'Infrastructure', 'FIL': 'Storage', 'AR': 'Storage', 'THETA': 'Video/Streaming',
    'ICP': 'Infrastructure', 'KAS': 'PoW', 'CFX': 'China', 'VET': 'Supply Chain',
    'GALA': 'Gaming', 'IMX': 'Gaming', 'AXS': 'Gaming', 'SAND': 'Metaverse',
    'MANA': 'Metaverse', 'ENS': 'Identity', 'XRP': 'Payments', 'ADA': 'Smart Contracts',
    'TRX': 'Payments', 'LTC': 'Store of Value', 'FTM': 'Smart Contracts',
    'ASTR': 'Smart Contracts', 'ZK': 'Layer 2', 'BLUR': 'NFT', 'APE': 'NFT/Metaverse',
    'SKL': 'Layer 2', 'CELO': 'Payments', 'KAVA': 'DeFi', 'HBAR': 'Enterprise',
    'QNT': 'Interoperability', 'EGLD': 'Smart Contracts', 'ALGO': 'Smart Contracts',
    'XLM': 'Payments', 'FLOW': 'NFT/Gaming', 'CHZ': 'Sports', 'TON': 'Telegram',
    'ONDO': 'RWA', 'JUP': 'DeFi', 'JTO': 'Liquid Staking', 'MANTA': 'Layer 2',
    'DYM': 'Modular', 'ALT': 'Layer 2', 'PIXEL': 'Gaming', 'PORTAL': 'Gaming',
    'XAI': 'Gaming', 'RON': 'Gaming L2', 'BEAM': 'Gaming', 'ENA': 'DeFi',
    'ETHFI': 'Liquid Staking', 'WIF': 'Meme', 'BOME': 'Meme', 'NOT': 'Telegram/Gaming',
    'IO': 'AI/GPU', 'ZRO': 'Interoperability', 'EIGEN': 'Restaking',
    'SAFE': 'Infrastructure', 'SCR': 'Layer 2', 'HMSTR': 'Gaming', 'CATI': 'Gaming',
    'NEIRO': 'Meme', 'POPCAT': 'Meme', 'GOAT': 'Meme', 'ACT': 'Meme/AI',
    'PNUT': 'Meme', 'DOGS': 'Meme', 'CAKE': 'DeFi', 'SUSHI': 'DeFi', 'YFI': 'DeFi',
    'COMP': 'DeFi', 'MAGIC': 'Gaming', 'YGG': 'Gaming', 'PRIME': 'Gaming',
    'ILV': 'Gaming', 'W': 'Interoperability', 'AEVO': 'DeFi', 'SAGA': 'Modular',
    'OMNI': 'Infrastructure', 'SHIB': 'Meme', 'PEPE': 'Meme', 'BONK': 'Meme', 'FLOKI': 'Meme',
    'TURBO': 'Meme', 'MEW': 'Meme', 'BRETT': 'Meme', 'BCH': 'Store of Value',
    'ETC': 'Smart Contracts', 'XMR': 'Privacy', 'ZEC': 'Privacy', 'ONE': 'Smart Contracts',
    'ZIL': 'Smart Contracts', 'ENJ': 'Gaming/NFT', 'MASK': 'Social/Web3',
    'SSV': 'Infrastructure', 'ACH': 'Payments', 'SUPER': 'Gaming', 'LOKA': 'Gaming',
    'BANANA': 'DeFi', 'LISTA': 'DeFi', 'REZ': 'DeFi', 'BB': 'DeFi',
    'BAKE': 'DeFi', 'DODO': 'DeFi', 'PERP': 'DeFi', 'LQTY': 'DeFi', 'QUICK': 'DeFi',
    'RLC': 'Infrastructure', 'ANKR': 'Infrastructure', 'NMR': 'AI', 'BAND': 'Oracle',
    'TRB': 'Oracle', 'UMA': 'DeFi', 'BNT': 'DeFi', 'RAD': 'Developer Tools',
    'CVX': 'DeFi', 'SPELL': 'DeFi', 'BADGER': 'DeFi', 'AUDIO': 'Music',
    'CELR': 'Layer 2', 'SYN': 'Interoperability', 'STG': 'Interoperability',
    'LINA': 'DeFi', 'ALICE': 'Metaverse', 'TLM': 'Gaming', 'SLP': 'Gaming',
    'RARE': 'NFT', 'LOOKS': 'NFT', 'HIGH': 'Metaverse', 'WAXP': 'NFT',
    'GMT': 'Move to Earn', 'PYR': 'Gaming', 'GODS': 'Gaming', 'CKB': 'Bitcoin L2',
    'MERL': 'Bitcoin L2', 'TNSR': 'NFT',
};

// Token names - mapeamento completo
export const TOKEN_NAMES: Record<string, string> = {
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
    'SAGA': 'Saga', 'OMNI': 'Omni Network', 'SHIB': 'Shiba Inu', 'PEPE': 'Pepe',
    'BONK': 'Bonk', 'FLOKI': 'Floki', 'TURBO': 'Turbo', 'MEW': 'cat in a dogs world',
    'BRETT': 'Brett', 'BCH': 'Bitcoin Cash', 'ETC': 'Ethereum Classic', 'XMR': 'Monero',
    'ZEC': 'Zcash', 'ONE': 'Harmony', 'ZIL': 'Zilliqa', 'MASK': 'Mask Network',
    'SSV': 'SSV Network', 'SUPER': 'SuperVerse', 'LOKA': 'League of Kingdoms',
    'BANANA': 'Banana Gun', 'LISTA': 'Lista DAO', 'REZ': 'Renzo', 'BB': 'BounceBit',
    'BAKE': 'BakeryToken', 'DODO': 'DODO', 'PERP': 'Perpetual Protocol',
    'LQTY': 'Liquity', 'QUICK': 'QuickSwap', 'RLC': 'iExec RLC', 'ANKR': 'Ankr',
    'NMR': 'Numeraire', 'BAND': 'Band Protocol', 'TRB': 'Tellor', 'UMA': 'UMA',
    'BNT': 'Bancor', 'RAD': 'Radicle', 'CVX': 'Convex Finance', 'SPELL': 'Spell Token',
    'BADGER': 'Badger DAO', 'AUDIO': 'Audius', 'CELR': 'Celer Network',
    'SYN': 'Synapse', 'STG': 'Stargate Finance', 'LINA': 'Linear',
    'ALICE': 'My Neighbor Alice', 'TLM': 'Alien Worlds', 'SLP': 'Smooth Love Potion',
    'RARE': 'SuperRare', 'LOOKS': 'LooksRare', 'HIGH': 'Highstreet', 'WAXP': 'WAX',
    'GMT': 'STEPN', 'PYR': 'Vulcan Forged', 'GODS': 'Gods Unchained', 'CKB': 'Nervos Network',
    'MERL': 'Merlin Chain', 'TNSR': 'Tensor', 'API3': 'API3', 'RPL': 'Rocket Pool',
    'FXS': 'Frax Share', 'OSMO': 'Osmosis', 'THETA': 'Theta Network', 'ACH': 'Alchemy Pay',
    'SATS': 'SATS Ordinals', 'LUNC': 'Terra Classic',
};

function getTokenName(ticker: string): string {
    return TOKEN_NAMES[ticker] || ticker;
}

/**
 * Busca tickers 24h de todos os pares USDT
 */
async function fetchBinanceTickers(): Promise<Map<string, BinanceTicker>> {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data: BinanceTicker[] = await response.json();

        const tickerMap = new Map<string, BinanceTicker>();

        for (const ticker of data) {
            if (ticker.symbol.endsWith('USDT')) {
                const baseAsset = ticker.symbol.replace('USDT', '');
                // Só aceita tickers que estão na whitelist curada
                if (!EXCLUDED_TOKENS.has(baseAsset) && CURATED_TOKENS.has(baseAsset)) {
                    tickerMap.set(baseAsset, ticker);
                }
            }
        }

        return tickerMap;
    } catch (error) {
        console.error('Error fetching Binance tickers:', error);
        return new Map();
    }
}

/**
 * Improved Score Calculation with better distribution
 * Score ranges:
 * 80-100: Elite/Andamento - Very strong signals
 * 65-79: Gatilho - Ready to trigger
 * 50-64: Acumulação - Accumulating
 * 0-49: Observação - Just watching
 */
function calculateScore(ticker: string, volume24h: number, change24h: number, hasNarrative: boolean): number {
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
    if (change24h > 0) {
        // Positive momentum is good
        if (change24h >= 5 && change24h < 15) score += 20;     // Strong uptrend
        else if (change24h >= 2 && change24h < 5) score += 15; // Healthy uptrend  
        else if (change24h >= 0 && change24h < 2) score += 10; // Stable positive
        else if (change24h >= 15 && change24h < 30) score += 12; // Very strong (but risky)
        else if (change24h >= 30) score += 5;                  // Overextended, risky
    } else {
        // Negative momentum
        if (change24h > -3) score += 8;       // Small dip - buying opportunity
        else if (change24h > -10) score += 3; // Moderate dip
        else if (change24h > -20) score -= 5; // Significant drop
        else score -= 10;                      // Major crash
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
 * Determina status baseado em score
 */
function determineStatus(score: number): 'observacao' | 'acumulacao' | 'gatilho' | 'andamento' {
    if (score >= 80) return 'andamento';   // Elite
    if (score >= 65) return 'gatilho';     // Ready
    if (score >= 50) return 'acumulacao';  // Accumulating  
    return 'observacao';                    // Watching
}

/**
 * Sincroniza todos os tokens da Binance com o banco de dados
 * Esta função deleta todos os tokens existentes e insere os novos
 */
export async function syncAllBinanceTokens(options?: {
    minVolume?: number;
    maxTokens?: number;
    onProgress?: (current: number, total: number, status: string) => void;
}): Promise<{ added: number; updated: number; total: number; distribution: Record<string, number> }> {
    const minVolume = options?.minVolume || 5_000_000; // Mínimo $5M de volume
    const maxTokens = options?.maxTokens || 150;
    const onProgress = options?.onProgress;

    onProgress?.(0, 100, 'Deletando tokens antigos...');

    // 1. Delete ALL existing tokens
    const { error: deleteError } = await supabase
        .from('tokens')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
        console.error('Error deleting tokens:', deleteError);
        throw new Error(`Failed to delete tokens: ${deleteError.message}`);
    }

    onProgress?.(10, 100, 'Buscando dados da Binance...');

    // 2. Fetch tickers from Binance
    const tickers = await fetchBinanceTickers();

    if (tickers.size === 0) {
        console.error('No tickers fetched from Binance');
        return { added: 0, updated: 0, total: 0, distribution: {} };
    }

    onProgress?.(30, 100, 'Processando tokens...');

    // 3. Filter by volume and sort
    const sortedTickers = [...tickers.entries()]
        .map(([symbol, ticker]) => ({
            symbol,
            ticker,
            volume: parseFloat(ticker.quoteVolume),
            change: parseFloat(ticker.priceChangePercent),
            price: parseFloat(ticker.lastPrice),
        }))
        .filter(t => t.volume >= minVolume)
        .sort((a, b) => b.volume - a.volume)
        .slice(0, maxTokens);

    console.log(`Syncing ${sortedTickers.length} tokens...`);

    const statusCounts: Record<string, number> = { observacao: 0, acumulacao: 0, gatilho: 0, andamento: 0 };
    let added = 0;

    // 4. Insert tokens
    for (let i = 0; i < sortedTickers.length; i++) {
        const { symbol, ticker, volume, change, price } = sortedTickers[i];

        const hasNarrative = TOP_NARRATIVES[symbol] !== undefined;
        const score = calculateScore(symbol, volume, change, hasNarrative);
        const status = determineStatus(score);
        const name = getTokenName(symbol);
        const narrative = TOP_NARRATIVES[symbol] || null;

        statusCounts[status]++;

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

        if (!insertError) {
            added++;
        } else {
            console.error(`Error inserting ${symbol}:`, insertError);
        }

        // Update progress every 10 tokens
        if (i % 10 === 0) {
            const progress = 30 + Math.round((i / sortedTickers.length) * 70);
            onProgress?.(progress, 100, `Inserindo token ${i + 1}/${sortedTickers.length}...`);
        }
    }

    onProgress?.(100, 100, 'Sincronização completa!');

    console.log(`Sync complete: ${added} tokens added`);
    console.log('Distribution:', statusCounts);

    return { added, updated: 0, total: sortedTickers.length, distribution: statusCounts };
}

/**
 * Busca os top tokens por volume
 */
export async function getTopTokensByVolume(limit: number = 50): Promise<string[]> {
    const tickers = await fetchBinanceTickers();

    return [...tickers.entries()]
        .map(([symbol, ticker]) => ({
            symbol,
            volume: parseFloat(ticker.quoteVolume),
        }))
        .filter(t => t.volume >= 1000000)
        .sort((a, b) => b.volume - a.volume)
        .slice(0, limit)
        .map(t => t.symbol);
}

/**
 * Conta quantos tokens estão disponíveis na Binance
 */
export async function countAvailableTokens(): Promise<number> {
    const tickers = await fetchBinanceTickers();
    return tickers.size;
}
