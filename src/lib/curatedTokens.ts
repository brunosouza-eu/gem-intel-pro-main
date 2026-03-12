/**
 * Centralized Curated Token Whitelist
 * Only tokens in this set will be synced from Binance.
 * This prevents obscure/fake tokens (BROCCOLI714, C, D, S, BIO, BREV, etc.) from entering the system.
 */

export const CURATED_TOKENS = new Set([
    // === TOP TIER ===
    'BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'AVAX', 'DOT', 'LINK',

    // === HIGH PERFORMANCE L1 ===
    'NEAR', 'SUI', 'SEI', 'APT', 'FTM', 'ASTR', 'EGLD', 'ALGO', 'HBAR',
    'ONE', 'ZIL', 'CELO', 'KAVA',

    // === LAYER 2 ===
    'MATIC', 'POL', 'ARB', 'OP', 'STRK', 'ZK', 'SKL', 'MANTA', 'ALT',
    'SCR', 'CELR',

    // === AI ===
    'FET', 'AGIX', 'OCEAN', 'RNDR', 'TAO', 'WLD', 'ARKM', 'NMR', 'IO',

    // === DeFi ===
    'INJ', 'MKR', 'AAVE', 'UNI', 'CRV', 'SNX', 'DYDX', 'GMX', 'PENDLE',
    'JUP', 'ENA', 'AEVO', 'CAKE', 'SUSHI', 'YFI', 'COMP', 'DODO', 'PERP',
    'LQTY', 'QUICK', 'UMA', 'BNT', 'CVX', 'SPELL', 'BADGER', 'LINA',
    'BANANA', 'LISTA', 'REZ', 'BB', 'BAKE',

    // === LIQUID STAKING ===
    'LDO', 'RPL', 'FXS', 'JTO', 'ETHFI',

    // === COSMOS / MODULAR ===
    'ATOM', 'TIA', 'OSMO', 'DYM', 'SAGA',

    // === INTEROPERABILITY ===
    'RUNE', 'QNT', 'W', 'ZRO', 'SYN', 'STG',

    // === BITCOIN ECOSYSTEM ===
    'STX', 'ORDI', 'SATS', 'CKB', 'MERL',

    // === INFRASTRUCTURE ===
    'GRT', 'FIL', 'AR', 'ICP', 'THETA', 'SSV', 'OMNI', 'SAFE',
    'RLC', 'ANKR', 'RAD',

    // === ORACLE ===
    'PYTH', 'API3', 'BAND', 'TRB',

    // === GAMING ===
    'GALA', 'IMX', 'AXS', 'MAGIC', 'YGG', 'PRIME', 'ILV', 'SUPER',
    'PIXEL', 'PORTAL', 'XAI', 'RON', 'BEAM', 'HMSTR', 'CATI', 'LOKA',
    'PYR', 'GODS', 'TLM', 'SLP', 'ENJ',

    // === METAVERSE ===
    'SAND', 'MANA', 'ALICE', 'HIGH',

    // === NFT ===
    'BLUR', 'APE', 'RARE', 'LOOKS', 'WAXP', 'TNSR',

    // === MEME ===
    'SHIB', 'PEPE', 'BONK', 'FLOKI', 'WIF', 'BOME', 'NEIRO', 'POPCAT',
    'GOAT', 'ACT', 'PNUT', 'DOGS', 'TURBO', 'MEW', 'BRETT',

    // === PAYMENTS ===
    'TRX', 'LTC', 'XLM', 'ACH',

    // === RESTAKING ===
    'EIGEN',

    // === STORE OF VALUE ===
    'BCH', 'ETC',

    // === PRIVACY ===
    'XMR', 'ZEC',

    // === SOCIAL / WEB3 ===
    'MASK', 'ENS',

    // === TELEGRAM ===
    'TON', 'NOT',

    // === RWA ===
    'ONDO',

    // === SUPPLY CHAIN ===
    'VET', 'KAS', 'CFX',

    // === SPORTS ===
    'CHZ',

    // === MISC ===
    'FLOW', 'GMT', 'AUDIO', 'ROSE',
]);
