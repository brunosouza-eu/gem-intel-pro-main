/**
 * CoinGecko Service — Multi-timeframe data, logos, sparklines
 * Free tier: ~30 requests/minute
 * Provides price changes for 1h, 24h, 7d, 30d, 1y
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Ticker → CoinGecko ID mapping (ALL curated tokens) ─────
const TICKER_TO_COINGECKO_ID: Record<string, string> = {
    // === TOP TIER ===
    'BTC': 'bitcoin', 'ETH': 'ethereum', 'SOL': 'solana', 'BNB': 'binancecoin',
    'XRP': 'ripple', 'ADA': 'cardano', 'DOGE': 'dogecoin', 'AVAX': 'avalanche-2',
    'DOT': 'polkadot', 'LINK': 'chainlink',
    // === HIGH PERFORMANCE L1 ===
    'NEAR': 'near', 'SUI': 'sui', 'SEI': 'sei-network', 'APT': 'aptos',
    'FTM': 'fantom', 'ASTR': 'astar', 'EGLD': 'elrond-erd-2', 'ALGO': 'algorand',
    'HBAR': 'hedera-hashgraph', 'ONE': 'harmony', 'ZIL': 'zilliqa', 'CELO': 'celo',
    'KAVA': 'kava',
    // === LAYER 2 ===
    'MATIC': 'matic-network', 'POL': 'matic-network', 'ARB': 'arbitrum', 'OP': 'optimism',
    'STRK': 'starknet', 'ZK': 'zksync', 'SKL': 'skale', 'MANTA': 'manta-network',
    'ALT': 'altlayer', 'SCR': 'scroll', 'CELR': 'celer-network',
    // === AI ===
    'FET': 'fetch-ai', 'AGIX': 'singularitynet', 'OCEAN': 'ocean-protocol',
    'RNDR': 'render-token', 'TAO': 'bittensor', 'WLD': 'worldcoin-wld',
    'ARKM': 'arkham', 'NMR': 'numeraire', 'IO': 'io-net',
    // === DeFi ===
    'INJ': 'injective-protocol', 'MKR': 'maker', 'AAVE': 'aave', 'UNI': 'uniswap',
    'CRV': 'curve-dao-token', 'SNX': 'synthetix-network-token', 'DYDX': 'dydx',
    'GMX': 'gmx', 'PENDLE': 'pendle', 'JUP': 'jupiter-exchange-solana', 'ENA': 'ethena',
    'AEVO': 'aevo-exchange', 'CAKE': 'pancakeswap-token', 'SUSHI': 'sushi',
    'YFI': 'yearn-finance', 'COMP': 'compound-governance-token', 'DODO': 'dodo',
    'PERP': 'perpetual-protocol', 'LQTY': 'liquity', 'QUICK': 'quickswap',
    'UMA': 'uma', 'BNT': 'bancor', 'CVX': 'convex-finance', 'SPELL': 'spell-token',
    'BADGER': 'badger-dao', 'LINA': 'linear', 'BANANA': 'banana-gun',
    'LISTA': 'lista-dao', 'REZ': 'renzo', 'BB': 'bouncebit', 'BAKE': 'bakerytoken',
    // === LIQUID STAKING ===
    'LDO': 'lido-dao', 'RPL': 'rocket-pool', 'FXS': 'frax-share',
    'JTO': 'jito-governance-token', 'ETHFI': 'ether-fi',
    // === COSMOS / MODULAR ===
    'ATOM': 'cosmos', 'TIA': 'celestia', 'OSMO': 'osmosis', 'DYM': 'dymension',
    'SAGA': 'saga-2',
    // === INTEROPERABILITY ===
    'RUNE': 'thorchain', 'QNT': 'quant-network', 'W': 'wormhole', 'ZRO': 'layerzero',
    'SYN': 'synapse-2', 'STG': 'stargate-finance',
    // === BITCOIN ECOSYSTEM ===
    'STX': 'blockstack', 'ORDI': 'ordinals', 'SATS': 'sats-ordinals',
    'CKB': 'nervos-network', 'MERL': 'merlin-chain',
    // === INFRASTRUCTURE ===
    'GRT': 'the-graph', 'FIL': 'filecoin', 'AR': 'arweave', 'ICP': 'internet-computer',
    'THETA': 'theta-token', 'SSV': 'ssv-network', 'OMNI': 'omni-network',
    'SAFE': 'safe', 'RLC': 'iexec-rlc', 'ANKR': 'ankr', 'RAD': 'radicle',
    // === ORACLE ===
    'PYTH': 'pyth-network', 'API3': 'api3', 'BAND': 'band-protocol', 'TRB': 'tellor',
    // === GAMING ===
    'GALA': 'gala', 'IMX': 'immutable-x', 'AXS': 'axie-infinity', 'MAGIC': 'magic',
    'YGG': 'yield-guild-games', 'PRIME': 'echelon-prime', 'ILV': 'illuvium',
    'SUPER': 'superfarm', 'PIXEL': 'pixels', 'PORTAL': 'portal-2',
    'XAI': 'xai-blockchain', 'RON': 'ronin', 'BEAM': 'beam-2',
    'HMSTR': 'hamster-kombat', 'CATI': 'catizen', 'LOKA': 'league-of-kingdoms',
    'PYR': 'vulcan-forged', 'GODS': 'gods-unchained', 'TLM': 'alien-worlds',
    'SLP': 'smooth-love-potion', 'ENJ': 'enjincoin',
    // === METAVERSE ===
    'SAND': 'the-sandbox', 'MANA': 'decentraland', 'ALICE': 'my-neighbor-alice',
    'HIGH': 'highstreet',
    // === NFT ===
    'BLUR': 'blur', 'APE': 'apecoin', 'RARE': 'superrare', 'LOOKS': 'looksrare',
    'WAXP': 'wax', 'TNSR': 'tensor',
    // === MEME ===
    'SHIB': 'shiba-inu', 'PEPE': 'pepe', 'BONK': 'bonk', 'FLOKI': 'floki',
    'WIF': 'dogwifcoin', 'BOME': 'book-of-meme', 'NEIRO': 'neiro',
    'POPCAT': 'popcat', 'GOAT': 'goatseus-maximus', 'ACT': 'act-i-the-ai-prophecy',
    'PNUT': 'peanut-the-squirrel', 'DOGS': 'dogs-2', 'TURBO': 'turbo',
    'MEW': 'cat-in-a-dogs-world', 'BRETT': 'based-brett',
    // === PAYMENTS ===
    'TRX': 'tron', 'LTC': 'litecoin', 'XLM': 'stellar', 'ACH': 'alchemy-pay',
    // === RESTAKING ===
    'EIGEN': 'eigenlayer',
    // === STORE OF VALUE ===
    'BCH': 'bitcoin-cash', 'ETC': 'ethereum-classic',
    // === PRIVACY ===
    'XMR': 'monero', 'ZEC': 'zcash',
    // === SOCIAL / WEB3 ===
    'MASK': 'mask-network', 'ENS': 'ethereum-name-service',
    // === TELEGRAM ===
    'TON': 'the-open-network', 'NOT': 'notcoin',
    // === RWA ===
    'ONDO': 'ondo-finance',
    // === SUPPLY CHAIN ===
    'VET': 'vechain', 'KAS': 'kaspa', 'CFX': 'conflux-token',
    // === SPORTS ===
    'CHZ': 'chiliz',
    // === RECENTLY ADDED / MISSING ===
    'C98': 'coin98', 'XUSD': 'xusd', 'SAHARA': 'sahara', 'DENT': 'dent', 'DRIFT': 'drift-protocol', 'BICO': 'biconomy',
    'ZBT': 'zebec-protocol', 'AIXBT': 'aixbt', 'ZKC': 'zkcandy', 'KITE': 'kite-sync', 'MUBARAK': 'mubarak', 'TURTLE': 'turtlecoin',
    'GIGGLE': 'giggle', 'DUSK': 'dusk-network', 'IDEX': 'idex', 'SXP': 'sxp', 'STEEM': 'steem', 'ZAMA': 'zama',
    // === MISC ===
    'FLOW': 'flow', 'GMT': 'stepn', 'AUDIO': 'audius', 'ROSE': 'oasis-network',
};

// ─── Types ───────────────────────────────────────────────────
export interface CoinGeckoTokenData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number | null;
    total_volume: number;
    price_change_percentage_1h_in_currency: number | null;
    price_change_percentage_24h_in_currency: number | null;
    price_change_percentage_7d_in_currency: number | null;
    price_change_percentage_30d_in_currency: number | null;
    price_change_percentage_1y_in_currency: number | null;
    high_24h: number | null;
    low_24h: number | null;
    sparkline_in_7d?: { price: number[] };
}

export type TimePeriod = '1h' | '24h' | '7d' | '30d' | '1y';

// ─── Cache ───────────────────────────────────────────────────
let cachedData: Map<string, CoinGeckoTokenData> = new Map();
let lastFetchTime = 0;
const CACHE_TTL = 120_000; // 2 minutes

// ─── Fetch all tokens from CoinGecko ─────────────────────────
async function fetchAllCoinGeckoData(): Promise<Map<string, CoinGeckoTokenData>> {
    const now = Date.now();
    if (now - lastFetchTime < CACHE_TTL && cachedData.size > 0) {
        return cachedData;
    }

    const ids = [...new Set(Object.values(TICKER_TO_COINGECKO_ID))].join(',');

    try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h,24h,7d,30d,1y`;

        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`CoinGecko API returned ${response.status}`);
            return cachedData;
        }

        const data: CoinGeckoTokenData[] = await response.json();
        const map = new Map<string, CoinGeckoTokenData>();

        for (const coin of data) {
            map.set(coin.id, coin);
            map.set(coin.symbol.toUpperCase(), coin);
        }

        cachedData = map;
        lastFetchTime = now;
        console.log(`✅ CoinGecko: fetched ${data.length} tokens with multi-timeframe data`);
        return map;
    } catch (error) {
        console.error('Failed to fetch CoinGecko data:', error);
        return cachedData;
    }
}

// ─── Helper functions ────────────────────────────────────────
export function getCoinGeckoId(ticker: string): string | undefined {
    return TICKER_TO_COINGECKO_ID[ticker.toUpperCase()];
}

export function getChangeForPeriod(data: CoinGeckoTokenData, period: TimePeriod): number {
    switch (period) {
        case '1h': return data.price_change_percentage_1h_in_currency ?? 0;
        case '24h': return data.price_change_percentage_24h_in_currency ?? 0;
        case '7d': return data.price_change_percentage_7d_in_currency ?? 0;
        case '30d': return data.price_change_percentage_30d_in_currency ?? 0;
        case '1y': return data.price_change_percentage_1y_in_currency ?? 0;
        default: return 0;
    }
}

export function getLogoUrl(ticker: string): string {
    return `https://assets.coincap.io/assets/icons/${ticker.toLowerCase()}@2x.png`;
}

export function hasCoingeckoSupport(ticker: string): boolean {
    return !!TICKER_TO_COINGECKO_ID[ticker.toUpperCase()];
}

// ─── React Hook ──────────────────────────────────────────────
export function useCoinGeckoData() {
    const [data, setData] = useState<Map<string, CoinGeckoTokenData>>(cachedData);
    const [loading, setLoading] = useState(cachedData.size === 0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const refresh = useCallback(async () => {
        const result = await fetchAllCoinGeckoData();
        setData(new Map(result));
        setLoading(false);
    }, []);

    useEffect(() => {
        refresh();
        intervalRef.current = setInterval(refresh, CACHE_TTL);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [refresh]);

    const getTokenData = useCallback((ticker: string): CoinGeckoTokenData | undefined => {
        const byTicker = data.get(ticker.toUpperCase());
        if (byTicker) return byTicker;
        const cgId = TICKER_TO_COINGECKO_ID[ticker.toUpperCase()];
        if (cgId) return data.get(cgId);
        return undefined;
    }, [data]);

    return { data, loading, getTokenData, refresh };
}

// ─── Fetch Binance Klines for mini chart ─────────────────────
export async function fetchBinanceKlines(
    ticker: string,
    interval = '1h',
    limit = 168
): Promise<{ time: number; close: number }[]> {
    try {
        const symbol = `${ticker.toUpperCase()}USDT`;
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        const response = await fetch(url);
        if (!response.ok) return [];
        const data = await response.json();
        return data.map((k: any[]) => ({
            time: k[0],
            close: parseFloat(k[4]),
        }));
    } catch {
        return [];
    }
}

// ─── Fetch basic token market data ──────────────────────────
export async function fetchTokenMarketData(ticker: string) {
    const id = getCoinGeckoId(ticker);
    if (!id) return null;

    try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        const coinData = data[id];
        if (!coinData) return null;

        return {
            current_price: coinData.usd,
            change_24h: coinData.usd_24h_change,
            market_cap: coinData.usd_market_cap,
            volume_24h: coinData.usd_24h_vol
        };
    } catch {
        return null;
    }
}

