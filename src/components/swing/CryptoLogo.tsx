import React, { useState, useCallback } from 'react';

interface CryptoLogoProps {
  symbol: string;
  size?: number;
  className?: string;
}

/**
 * Known CoinGecko image IDs for popular tokens.
 * CoinGecko image URLs follow the pattern:
 * https://assets.coingecko.com/coins/images/{ID}/small/{slug}.png
 */
const COINGECKO_IDS: Record<string, { id: number; slug: string; ext?: string }> = {
  'BTC': { id: 1, slug: 'bitcoin' },
  'ETH': { id: 279, slug: 'ethereum' },
  'BNB': { id: 825, slug: 'binancecoin' },
  'SOL': { id: 4128, slug: 'solana' },
  'XRP': { id: 44, slug: 'ripple' },
  'DOGE': { id: 5, slug: 'dogecoin' },
  'ADA': { id: 975, slug: 'cardano' },
  'AVAX': { id: 12559, slug: 'avalanche-2' },
  'DOT': { id: 12171, slug: 'polkadot' },
  'LINK': { id: 877, slug: 'chainlink' },
  'MATIC': { id: 4713, slug: 'matic-network' },
  'POL': { id: 4713, slug: 'matic-network' },
  'UNI': { id: 12504, slug: 'uniswap' },
  'LTC': { id: 2, slug: 'litecoin' },
  'ATOM': { id: 1481, slug: 'cosmos' },
  'NEAR': { id: 10365, slug: 'near' },
  'ARB': { id: 16547, slug: 'arbitrum' },
  'OP': { id: 25244, slug: 'optimism' },
  'INJ': { id: 12882, slug: 'injective-protocol' },
  'FET': { id: 5681, slug: 'fetch-ai' },
  'ASI': { id: 5681, slug: 'fetch-ai' },
  'RNDR': { id: 11636, slug: 'render-token' },
  'RENDER': { id: 11636, slug: 'render-token' },
  'APT': { id: 26455, slug: 'aptos' },
  'SUI': { id: 28453, slug: 'sui' },
  'SEI': { id: 28205, slug: 'sei-network' },
  'TIA': { id: 31967, slug: 'celestia' },
  'SHIB': { id: 11939, slug: 'shiba-inu' },
  'PEPE': { id: 29850, slug: 'pepe' },
  'WIF': { id: 33566, slug: 'dogwifcoin' },
  'BONK': { id: 28600, slug: 'bonk' },
  'KAS': { id: 25767, slug: 'kaspa' },
  'HBAR': { id: 4642, slug: 'hedera-hashgraph' },
  'FIL': { id: 12817, slug: 'filecoin' },
  'VET': { id: 3077, slug: 'vechain' },
  'ALGO': { id: 4030, slug: 'algorand' },
  'GRT': { id: 13397, slug: 'the-graph' },
  'SAND': { id: 12129, slug: 'the-sandbox' },
  'MANA': { id: 1966, slug: 'decentraland' },
  'AXS': { id: 13029, slug: 'axie-infinity' },
  'APE': { id: 24383, slug: 'apecoin' },
  'CHZ': { id: 10808, slug: 'chiliz' },
  'EOS': { id: 738, slug: 'eos' },
  'XLM': { id: 100, slug: 'stellar' },
  'XTZ': { id: 2713, slug: 'tezos' },
  'THETA': { id: 2538, slug: 'theta-token' },
  'GALA': { id: 12493, slug: 'gala' },
  'FLOW': { id: 13446, slug: 'flow' },
  'EGLD': { id: 11033, slug: 'elrond-erd-2' },
  'DYDX': { id: 17500, slug: 'dydx' },
  'CFX': { id: 7060, slug: 'conflux-token' },
  'QNT': { id: 3155, slug: 'quant-network' },
  'KAVA': { id: 6461, slug: 'kava' },
  'TAO': { id: 28452, slug: 'bittensor' },
  'LDO': { id: 13573, slug: 'lido-dao' },
  'IMX': { id: 17233, slug: 'immutable-x' },
  'PENGU': { id: 36450, slug: 'pudgy-penguins' },
  'AR': { id: 5632, slug: 'arweave' },
  'PENDLE': { id: 15585, slug: 'pendle' },
  'STRK': { id: 36042, slug: 'starknet' },
  'ARKM': { id: 30403, slug: 'arkham' },
  'JUP': { id: 29210, slug: 'jupiter-exchange-solana' },
  'PYTH': { id: 28177, slug: 'pyth-network' },
  'WLD': { id: 31069, slug: 'worldcoin-wld' },
  'ORDI': { id: 30162, slug: 'ordinals' },
  'BLUR': { id: 28453, slug: 'blur' },
  'STG': { id: 18432, slug: 'stargate-finance' },
  'IOTA': { id: 692, slug: 'iota' },
  'CELO': { id: 10365, slug: 'celo' },
  'ZRO': { id: 36045, slug: 'layerzero' },
  'OM': { id: 11171, slug: 'mantra-dao' },
  'TURBO': { id: 29940, slug: 'turbo' },
  'IO': { id: 36408, slug: 'io-net' },
  'PAXG': { id: 9956, slug: 'pax-gold' },
  'ASTR': { id: 12885, slug: 'astar' },
  'MOVE': { id: 36489, slug: 'movement' },
  'RSR': { id: 8365, slug: 'reserve-rights-token' },
  'GLM': { id: 764, slug: 'golem' },
  'POPCAT': { id: 33760, slug: 'popcat' },
  'AIXBT': { id: 36523, slug: 'aixbt' },
  'BANANA': { id: 28634, slug: 'banana-gun' },
  'ALT': { id: 33985, slug: 'altlayer' },
  'DUSK': { id: 4092, slug: 'dusk-network' },
  'KSM': { id: 9258, slug: 'kusama' },

  // Newly requested missing tokens
  'W': { id: 35087, slug: 'W_Token_%283%29' },
  'PNUT': { id: 51301, slug: 'Peanut_the_Squirrel' },
  'BOME': { id: 36071, slug: 'bome' },
  'XAI': { id: 34258, slug: 'round_icon_2048_px' },
  'MAGIC': { id: 18623, slug: 'magic' },
  'CATI': { id: 50236, slug: 'cati' },
  'DYM': { id: 34182, slug: 'dym' },
  'DOGS': { id: 39699, slug: 'dogs_logo_200x200' },
  'TNSR': { id: 35972, slug: 'tnsr' },
  'SAGA': { id: 25691, slug: 'zcPXETKs_400x400', ext: 'jpg' },
  'HMSTR': { id: 39102, slug: 'hamster-removebg-preview' },
  'PORTAL': { id: 35436, slug: 'portal', ext: 'jpeg' },
  'PIXEL': { id: 35100, slug: 'pixel-icon' },
  'PIXELS': { id: 35100, slug: 'pixel-icon' },
  'NEIRO': { id: 39411, slug: 'logo_new_%281%29' }, // Neiro Ethereum (fallback)
  'FIRST-NEIRO': { id: 49454, slug: 'neiro' },
  'LISTA': { id: 38247, slug: 'lista_logo', ext: 'jpg' },
};

/**
 * Multiple fallback sources for maximum reliability.
 * Each returns a URL for a given ticker symbol.
 */
const FALLBACK_SOURCES = [
  // 1. CoinCap coin images (very reliable, works by symbol)
  (s: string) => `https://assets.coincap.io/assets/icons/${s.toLowerCase()}@2x.png`,
  // 2. SpotHQ cryptocurrency-icons (good coverage)
  (s: string) => `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${s.toLowerCase()}.png`,
  // 3. Crypto Icons CDN SVG
  (s: string) => `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${s.toLowerCase()}.svg`,
  // 4. CryptoCompare
  (s: string) => `https://www.cryptocompare.com/media/37746238/${s.toLowerCase()}.png`,
];

const getCryptoLogoUrl = (symbol: string): string => {
  if (!symbol) {
    return 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/generic.svg';
  }

  const s = symbol.toUpperCase();

  // Best source: CoinGecko with known numeric ID + slug
  const cg = COINGECKO_IDS[s];
  if (cg) {
    const ext = cg.ext || 'png';
    return `https://assets.coingecko.com/coins/images/${cg.id}/small/${cg.slug}.${ext}`;
  }

  // Primary fallback: CoinCap (works for most tickers)
  return `https://assets.coincap.io/assets/icons/${s.toLowerCase()}@2x.png`;
};

const CryptoLogo: React.FC<CryptoLogoProps> = ({ symbol, size = 32, className = '' }) => {
  const [imgSrc, setImgSrc] = useState(() => getCryptoLogoUrl(symbol));
  const [fallbackIdx, setFallbackIdx] = useState(0);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    setImgSrc(getCryptoLogoUrl(symbol));
    setFallbackIdx(0);
    setHasError(false);
  }, [symbol]);

  const handleError = useCallback(() => {
    if (fallbackIdx < FALLBACK_SOURCES.length) {
      setImgSrc(FALLBACK_SOURCES[fallbackIdx](symbol));
      setFallbackIdx(prev => prev + 1);
    } else {
      setHasError(true);
    }
  }, [fallbackIdx, symbol]);

  if (hasError) {
    // Text-based avatar with a gradient
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-yellow-500',
      'from-red-500 to-rose-500',
    ];
    const colorIndex = (symbol?.charCodeAt(0) || 0) % colors.length;

    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br ${colors[colorIndex]} text-white font-bold shadow-lg shrink-0 ${className}`}
        style={{ width: size, height: size, minWidth: size, minHeight: size, fontSize: size * 0.4 }}
      >
        {symbol?.slice(0, 2) || '??'}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={symbol}
      width={size}
      height={size}
      className={`rounded-full shrink-0 object-cover ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        color: 'transparent',
      }}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default CryptoLogo;
