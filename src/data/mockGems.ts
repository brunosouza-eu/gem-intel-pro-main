export type GemStatus = 'trending' | 'hot' | 'new_launch' | 'hidden_gem';
export type RiskLevel = 'medium' | 'high' | 'very_high' | 'extreme';

export interface GemToken {
    id: string;
    name: string;
    ticker: string;
    network: 'SOL' | 'BASE' | 'ETH' | 'BSC';
    price: number;
    change24h: number;
    marketCap: number; // in millions
    volume24h: number; // in millions
    liquidity: number; // in millions
    holders: number;
    score: number; // 0-100 (Gem Potential)
    status: GemStatus;
    riskLevel: RiskLevel;
    description?: { pt: string; en: string };
    buyLinks: {
        label: string;
        url: string;
        type: 'cex' | 'dex' | 'bot';
        isAffiliate: boolean;
    }[];
    contractAddress?: string;
}

// ─── Affiliate link templates (replace YOUR_CODE_HERE with actual codes) ─────
const AFFILIATE = {
    mexc: 'https://www.mexc.com/pt-BR/acquisition/custom-sign-up?shareCode=mexc-3tNJW',
    gateio: 'https://gate.io/signup/YOUR_CODE_HERE',
    bybit: 'https://partner.bybit.com/b/155513',
    kucoin: 'https://kucoin.com/r/YOUR_CODE_HERE',
    trojan: 'https://t.me/solana_trojan_bot?start=r-YOUR_CODE_HERE',
    banana: 'https://t.me/BananaGunSniper_bot?start=YOUR_CODE_HERE',
    maestro: 'https://t.me/maestro?start=YOUR_CODE_HERE',
    bonkbot: 'https://t.me/bonkbot_bot?start=ref_YOUR_CODE_HERE',
};

export const mockGems: GemToken[] = [
    {
        id: 'wif-sol',
        name: 'dogwifhat',
        ticker: 'WIF',
        network: 'SOL',
        price: 2.45,
        change24h: 18.7,
        marketCap: 2450,
        volume24h: 890,
        liquidity: 85,
        holders: 420000,
        score: 96,
        status: 'trending',
        riskLevel: 'high',
        description: {
            pt: 'Maior memecoin da Solana. Listada na Binance e Bybit. Comunidade gigantesca.',
            en: 'Largest Solana memecoin. Listed on Binance and Bybit. Massive community.',
        },
        contractAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
        buyLinks: [
            { label: 'Bybit', url: AFFILIATE.bybit, type: 'cex', isAffiliate: true },
            { label: 'MEXC', url: AFFILIATE.mexc, type: 'cex', isAffiliate: true },
            { label: 'Trojan Bot 🔥', url: AFFILIATE.trojan, type: 'bot', isAffiliate: true },
        ],
    },
    {
        id: 'bonk-sol',
        name: 'Bonk',
        ticker: 'BONK',
        network: 'SOL',
        price: 0.0000285,
        change24h: 8.2,
        marketCap: 1900,
        volume24h: 320,
        liquidity: 60,
        holders: 680000,
        score: 88,
        status: 'trending',
        riskLevel: 'medium',
        description: {
            pt: 'A memecoin do povo de Solana. Ecossistema de dApps ativo. Listada em todas exchanges.',
            en: "Solana's people memecoin. Active dApp ecosystem. Listed on all exchanges.",
        },
        contractAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        buyLinks: [
            { label: 'MEXC', url: AFFILIATE.mexc, type: 'cex', isAffiliate: true },
            { label: 'Gate.io', url: AFFILIATE.gateio, type: 'cex', isAffiliate: true },
            { label: 'BonkBot', url: AFFILIATE.bonkbot, type: 'bot', isAffiliate: true },
        ],
    },
    {
        id: 'brett-base',
        name: 'Brett',
        ticker: 'BRETT',
        network: 'BASE',
        price: 0.1245,
        change24h: 34.2,
        marketCap: 1200,
        volume24h: 154,
        liquidity: 25.1,
        holders: 280000,
        score: 92,
        status: 'hot',
        riskLevel: 'high',
        description: {
            pt: 'A maior memecoin da rede Base. Inspirada no amigo de Pepe. Crescimento explosivo.',
            en: "Base network's biggest memecoin. Inspired by Pepe's friend. Explosive growth.",
        },
        contractAddress: '0x532f27101965dd16442E59d40670FaF5eBB142E4',
        buyLinks: [
            { label: 'Bybit', url: AFFILIATE.bybit, type: 'cex', isAffiliate: true },
            { label: 'MEXC', url: AFFILIATE.mexc, type: 'cex', isAffiliate: true },
            { label: 'Banana Gun', url: AFFILIATE.banana, type: 'bot', isAffiliate: true },
        ],
    },
    {
        id: 'pepe-eth',
        name: 'Pepe',
        ticker: 'PEPE',
        network: 'ETH',
        price: 0.0000125,
        change24h: 5.4,
        marketCap: 5200,
        volume24h: 1200,
        liquidity: 180,
        holders: 250000,
        score: 85,
        status: 'trending',
        riskLevel: 'medium',
        description: {
            pt: 'O meme original. Top 30 do mercado. Listada em todas as grandes exchanges.',
            en: 'The OG meme. Top 30 by market cap. Listed on all major exchanges.',
        },
        contractAddress: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
        buyLinks: [
            { label: 'Bybit', url: AFFILIATE.bybit, type: 'cex', isAffiliate: true },
            { label: 'MEXC', url: AFFILIATE.mexc, type: 'cex', isAffiliate: true },
        ],
    },
    {
        id: 'mew-sol',
        name: 'cat in a dogs world',
        ticker: 'MEW',
        network: 'SOL',
        price: 0.005123,
        change24h: 12.5,
        marketCap: 450,
        volume24h: 89,
        liquidity: 12.5,
        holders: 145000,
        score: 85,
        status: 'hot',
        riskLevel: 'high',
        description: {
            pt: 'A gata que desafia os cachorros. Narrativa forte de "cat season" em Solana.',
            en: 'The cat challenging the dogs. Strong "cat season" narrative on Solana.',
        },
        contractAddress: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHoQVREqwuz6vqM',
        buyLinks: [
            { label: 'MEXC', url: AFFILIATE.mexc, type: 'cex', isAffiliate: true },
            { label: 'Gate.io', url: AFFILIATE.gateio, type: 'cex', isAffiliate: true },
            { label: 'Trojan Bot', url: AFFILIATE.trojan, type: 'bot', isAffiliate: true },
        ],
    },
    {
        id: 'jup-sol',
        name: 'Jupiter',
        ticker: 'JUP',
        network: 'SOL',
        price: 1.12,
        change24h: 3.8,
        marketCap: 1500,
        volume24h: 210,
        liquidity: 95,
        holders: 320000,
        score: 82,
        status: 'trending',
        riskLevel: 'medium',
        description: {
            pt: 'Maior DEX aggregator de Solana. Utilidade real. Launchpad de novos tokens.',
            en: "Solana's largest DEX aggregator. Real utility. Launchpad for new tokens.",
        },
        contractAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
        buyLinks: [
            { label: 'Bybit', url: AFFILIATE.bybit, type: 'cex', isAffiliate: true },
            { label: 'MEXC', url: AFFILIATE.mexc, type: 'cex', isAffiliate: true },
        ],
    },
    {
        id: 'ondo-eth',
        name: 'Ondo Finance',
        ticker: 'ONDO',
        network: 'ETH',
        price: 1.35,
        change24h: 6.2,
        marketCap: 1900,
        volume24h: 280,
        liquidity: 75,
        holders: 85000,
        score: 90,
        status: 'trending',
        riskLevel: 'medium',
        description: {
            pt: 'Líder em Real World Assets (RWA). Tokenização de títulos do tesouro americano.',
            en: 'Leader in Real World Assets (RWA). Tokenization of US treasury bonds.',
        },
        contractAddress: '0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3',
        buyLinks: [
            { label: 'Bybit', url: AFFILIATE.bybit, type: 'cex', isAffiliate: true },
            { label: 'Gate.io', url: AFFILIATE.gateio, type: 'cex', isAffiliate: true },
        ],
    },
    {
        id: 'pnut-sol',
        name: 'Peanut the Squirrel',
        ticker: 'PNUT',
        network: 'SOL',
        price: 0.045,
        change24h: 155.8,
        marketCap: 45,
        volume24h: 120,
        liquidity: 4.2,
        holders: 35000,
        score: 94,
        status: 'hot',
        riskLevel: 'very_high',
        description: {
            pt: 'Memecoin viral com narrativa emocional forte. Altamente volátil mas com comunidade crescente.',
            en: 'Viral memecoin with strong emotional narrative. Highly volatile but growing community.',
        },
        contractAddress: '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump',
        buyLinks: [
            { label: 'MEXC', url: AFFILIATE.mexc, type: 'cex', isAffiliate: true },
            { label: 'Trojan Bot 🔥', url: AFFILIATE.trojan, type: 'bot', isAffiliate: true },
            { label: 'Raydium', url: 'https://raydium.io/swap/', type: 'dex', isAffiliate: false },
        ],
    },
    {
        id: 'popcat-sol',
        name: 'POPCAT',
        ticker: 'POPCAT',
        network: 'SOL',
        price: 1.25,
        change24h: 5.4,
        marketCap: 1200,
        volume24h: 85,
        liquidity: 30,
        holders: 180000,
        score: 80,
        status: 'trending',
        riskLevel: 'medium',
        description: {
            pt: 'Memecoin do gato clicável. Top memecoins de Solana por market cap.',
            en: 'The clickable cat memecoin. Top Solana memecoins by market cap.',
        },
        contractAddress: '7GCihgDB8fe6KNjn2JZzBkSmUf1V1o1uRUy1fV12M9mF',
        buyLinks: [
            { label: 'Gate.io', url: AFFILIATE.gateio, type: 'cex', isAffiliate: true },
            { label: 'MEXC', url: AFFILIATE.mexc, type: 'cex', isAffiliate: true },
        ],
    },
    {
        id: 'fartcoin-sol',
        name: 'Fartcoin',
        ticker: 'FART',
        network: 'SOL',
        price: 0.85,
        change24h: 42.5,
        marketCap: 850,
        volume24h: 450,
        liquidity: 18,
        holders: 95000,
        score: 91,
        status: 'hot',
        riskLevel: 'very_high',
        description: {
            pt: 'Memecoin AI Agent. Uma das primeiras moedas geradas por IA autônoma no mercado.',
            en: 'AI Agent memecoin. One of the first coins generated by autonomous AI.',
        },
        contractAddress: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
        buyLinks: [
            { label: 'Trojan Bot 🔥', url: AFFILIATE.trojan, type: 'bot', isAffiliate: true },
            { label: 'MEXC', url: AFFILIATE.mexc, type: 'cex', isAffiliate: true },
            { label: 'Maestro Bot', url: AFFILIATE.maestro, type: 'bot', isAffiliate: true },
        ],
    },
    {
        id: 'mog-eth',
        name: 'Mog Coin',
        ticker: 'MOG',
        network: 'ETH',
        price: 0.0000015,
        change24h: -2.3,
        marketCap: 580,
        volume24h: 32,
        liquidity: 15,
        holders: 45000,
        score: 75,
        status: 'hidden_gem',
        riskLevel: 'high',
        description: {
            pt: 'Cultura de internet pura. Comunidade cult dedicada. Potencial de retorno alto.',
            en: 'Pure internet culture. Dedicated cult community. High return potential.',
        },
        contractAddress: '0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a',
        buyLinks: [
            { label: 'MEXC', url: AFFILIATE.mexc, type: 'cex', isAffiliate: true },
            { label: 'Banana Gun', url: AFFILIATE.banana, type: 'bot', isAffiliate: true },
            { label: 'Uniswap', url: 'https://app.uniswap.org/', type: 'dex', isAffiliate: false },
        ],
    },
    {
        id: 'render-sol',
        name: 'Render Network',
        ticker: 'RENDER',
        network: 'SOL',
        price: 7.85,
        change24h: 4.1,
        marketCap: 3200,
        volume24h: 190,
        liquidity: 120,
        holders: 150000,
        score: 78,
        status: 'trending',
        riskLevel: 'medium',
        description: {
            pt: 'Renderização GPU descentralizada. Narrativa forte de IA + DePIN. Migrou de ETH para SOL.',
            en: 'Decentralized GPU rendering. Strong AI + DePIN narrative. Migrated from ETH to SOL.',
        },
        contractAddress: 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof',
        buyLinks: [
            { label: 'Bybit', url: AFFILIATE.bybit, type: 'cex', isAffiliate: true },
            { label: 'MEXC', url: AFFILIATE.mexc, type: 'cex', isAffiliate: true },
        ],
    },
];
