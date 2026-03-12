/**
 * Crypto News Service
 * Fetches real-time crypto news from CoinGecko API (free, no API key needed)
 */

export interface CryptoNewsItem {
    id: string;
    title: string;
    description: string;
    url: string;
    thumb_2x: string;
    author: string;
    created_at: string; // ISO date
    // Derived
    source: string;
    timeAgo: string;
    category?: string;
}

// Simple in-memory cache
let newsCache: CryptoNewsItem[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Calculate relative time string
 */
function getTimeAgo(dateString: string): string {
    const now = Date.now();
    const date = new Date(dateString).getTime();
    const diff = now - date;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return `${Math.floor(days / 7)}sem`;
}

/**
 * Extract source/publication name from author or URL
 */
function extractSource(author: string): string {
    if (!author) return 'CryptoNews';
    // CoinGecko news often has format "Author Name" or similar
    return author.split(' - ')[0]?.trim() || author;
}

/**
 * Categorize news based on keywords in title/description
 */
function categorizeNews(title: string, description: string): string {
    const text = `${title} ${description}`.toLowerCase();

    if (text.includes('bitcoin') || text.includes('btc')) return 'Bitcoin';
    if (text.includes('ethereum') || text.includes('eth ')) return 'Ethereum';
    if (text.includes('solana') || text.includes('sol ')) return 'Solana';
    if (text.includes('defi') || text.includes('swap') || text.includes('liquidity')) return 'DeFi';
    if (text.includes('nft') || text.includes('nfts')) return 'NFT';
    if (text.includes('regulat') || text.includes('sec ') || text.includes('law') || text.includes('ban')) return 'Regulação';
    if (text.includes('layer') || text.includes('l2') || text.includes('rollup')) return 'Layer 2';
    if (text.includes(' ai ') || text.includes('artificial') || text.includes('machine learning')) return 'AI';
    if (text.includes('meme') || text.includes('doge') || text.includes('pepe') || text.includes('shib')) return 'Meme';
    if (text.includes('stablecoin') || text.includes('usdt') || text.includes('usdc')) return 'Stablecoin';
    if (text.includes('exchange') || text.includes('binance') || text.includes('coinbase')) return 'Exchange';
    if (text.includes('hack') || text.includes('exploit') || text.includes('vulnerability')) return 'Segurança';

    return 'Mercado';
}

/**
 * Fetch crypto news from CoinGecko
 */
export async function fetchCryptoNews(): Promise<CryptoNewsItem[]> {
    // Return cache if fresh
    if (newsCache.length > 0 && Date.now() - lastFetchTime < CACHE_DURATION) {
        return newsCache;
    }

    // Try CryptoCompare first (more reliable free tier)
    const result = await fetchFromCryptoCompare() || await fetchFromCoinGecko();
    if (result && result.length > 0) {
        newsCache = result;
        lastFetchTime = Date.now();
    }
    return newsCache;
}

async function fetchFromCryptoCompare(): Promise<CryptoNewsItem[] | null> {
    try {
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular', {
            headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) {
            console.warn(`[CryptoNews] CryptoCompare error: ${response.status}`);
            return null;
        }
        const data = await response.json();
        const articles = data?.Data || [];
        return articles.slice(0, 30).map((article: any, index: number) => ({
            id: article.id?.toString() || `cc-${index}-${Date.now()}`,
            title: article.title || 'Untitled',
            description: article.body?.substring(0, 200) || '',
            url: article.url || article.guid || '#',
            thumb_2x: article.imageurl || '',
            author: article.source || '',
            created_at: article.published_on ? new Date(article.published_on * 1000).toISOString() : new Date().toISOString(),
            source: article.source_info?.name || article.source || 'CryptoNews',
            timeAgo: getTimeAgo(article.published_on ? new Date(article.published_on * 1000).toISOString() : new Date().toISOString()),
            category: categorizeNews(article.title || '', article.body || ''),
        }));
    } catch (error) {
        console.warn('[CryptoNews] CryptoCompare failed:', error);
        return null;
    }
}

async function fetchFromCoinGecko(): Promise<CryptoNewsItem[] | null> {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/news', {
            headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) {
            console.warn(`[CryptoNews] CoinGecko error: ${response.status}`);
            return null;
        }
        const data = await response.json();
        const articles = Array.isArray(data) ? data : data?.data || [];
        return articles.map((article: any, index: number) => ({
            id: article.id || `cg-${index}-${Date.now()}`,
            title: article.title || 'Untitled',
            description: article.description || '',
            url: article.url || '#',
            thumb_2x: article.thumb_2x || article.large_img_url || '',
            author: article.author || '',
            created_at: article.created_at || article.updated_at || new Date().toISOString(),
            source: extractSource(article.author || ''),
            timeAgo: getTimeAgo(article.created_at || article.updated_at || new Date().toISOString()),
            category: categorizeNews(article.title || '', article.description || ''),
        }));
    } catch (error) {
        console.warn('[CryptoNews] CoinGecko failed:', error);
        return null;
    }
}

/**
 * Get unique categories from cached news
 */
export function getNewsCategories(): string[] {
    const categories = new Set(newsCache.map(n => n.category || 'Mercado'));
    return ['Todos', ...Array.from(categories).sort()];
}
