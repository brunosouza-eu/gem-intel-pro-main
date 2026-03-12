/**
 * AUTO-PILOT SYSTEM
 * Complete automation - syncs, analyzes, and classifies tokens automatically
 * NO manual intervention required!
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { analyzeToken } from '@/lib/swingAnalysisService';
import { classifyToken } from '@/lib/radarClassification';
import { CURATED_TOKENS } from '@/lib/curatedTokens';

// ===== CONFIGURATION =====
const CONFIG = {
    // Sync interval (5 minutes)
    SYNC_INTERVAL_MS: 5 * 60 * 1000,
    // Analysis interval (7 minutes) 
    ANALYSIS_INTERVAL_MS: 7 * 60 * 1000,
    // Min volume for tokens ($1M)
    MIN_VOLUME: 1000000,
    // Max tokens to sync
    MAX_TOKENS: 200,
    // Tokens to analyze per cycle (to avoid rate limits)
    ANALYSIS_BATCH_SIZE: 50,
    // Delay between API calls (ms)
    API_DELAY: 250,
};

// ===== TYPES =====
interface BinanceTicker {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    lastPrice: string;
    volume: string;
    quoteVolume: string;
}

interface AutoPilotStatus {
    isRunning: boolean;
    lastSync: Date | null;
    lastAnalysis: Date | null;
    tokenCount: number;
    analyzedCount: number;
    currentAction: string;
}

// ===== EXCLUDED TOKENS =====
const EXCLUDED_TOKENS = new Set([
    'USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'USDP', 'USDD', 'FDUSD',
    'EUR', 'GBP', 'AUD', 'BRL', 'TRY', 'RUB', 'UAH', 'NGN',
    'LUNC', 'LUNA', 'UST', 'USTC', 'BTTC'
]);

// ===== NARRATIVES =====
const TOP_NARRATIVES: Record<string, string> = {
    'BTC': 'Store of Value', 'ETH': 'Smart Contracts', 'SOL': 'High Performance L1',
    'AVAX': 'High Performance L1', 'NEAR': 'High Performance L1', 'SUI': 'High Performance L1',
    'SEI': 'High Performance L1', 'APT': 'High Performance L1', 'MATIC': 'Layer 2',
    'ARB': 'Layer 2', 'OP': 'Layer 2', 'STRK': 'Layer 2', 'LINK': 'Oracle',
    'PYTH': 'Oracle', 'FET': 'AI', 'RNDR': 'AI/GPU', 'TAO': 'AI', 'WLD': 'AI',
    'ARKM': 'AI', 'INJ': 'DeFi', 'MKR': 'DeFi', 'AAVE': 'DeFi', 'UNI': 'DeFi',
    'PENDLE': 'DeFi', 'GMX': 'DeFi', 'DYDX': 'DeFi', 'LDO': 'Liquid Staking',
    'ATOM': 'Cosmos', 'TIA': 'Cosmos/Modular', 'DOT': 'Interoperability',
    'STX': 'Bitcoin L2', 'ORDI': 'Bitcoin Ordinals', 'GRT': 'Infrastructure',
    'FIL': 'Storage', 'AR': 'Storage', 'IMX': 'Gaming', 'GALA': 'Gaming',
    'KAS': 'PoW', 'CFX': 'China', 'VET': 'Supply Chain', 'MANA': 'Metaverse',
};

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

// ===== CONTEXT =====
const AutoPilotContext = createContext<AutoPilotStatus>({
    isRunning: false,
    lastSync: null,
    lastAnalysis: null,
    tokenCount: 0,
    analyzedCount: 0,
    currentAction: 'Initializing...',
});

export const useAutoPilot = () => useContext(AutoPilotContext);

// ===== HELPER FUNCTIONS =====

async function fetchBinanceTickers(): Promise<Map<string, BinanceTicker>> {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data: BinanceTicker[] = await response.json();

        const tickerMap = new Map<string, BinanceTicker>();
        for (const ticker of data) {
            if (ticker.symbol.endsWith('USDT')) {
                const baseAsset = ticker.symbol.replace('USDT', '');
                if (!EXCLUDED_TOKENS.has(baseAsset) && CURATED_TOKENS.has(baseAsset)) {
                    tickerMap.set(baseAsset, ticker);
                }
            }
        }
        return tickerMap;
    } catch (error) {
        console.error('[AutoPilot] Error fetching tickers:', error);
        return new Map();
    }
}

function calculateScore(volume: number, change: number, hasNarrative: boolean): number {
    let score = 50;
    if (volume > 100000000) score += 10;
    else if (volume > 50000000) score += 7;
    else if (volume > 10000000) score += 5;
    if (change > 0 && change < 10) score += 5;
    if (change < 0 && change > -5) score += 3;
    if (change > 20 || change < -20) score -= 5;
    if (hasNarrative) score += 10;
    return Math.min(100, Math.max(0, score));
}

function determineStatus(score: number, volume: number, change: number): 'observacao' | 'acumulacao' | 'gatilho' | 'andamento' {
    if (score >= 80 || (volume > 100000000 && change > 5)) return 'andamento';
    if (score >= 70 || (volume > 50000000 && change > 0)) return 'gatilho';
    if (score >= 55 || volume > 10000000) return 'acumulacao';
    return 'observacao';
}

// ===== SYNC FUNCTION =====
async function syncTokensFromBinance(setStatus: (action: string) => void): Promise<number> {
    setStatus('Buscando dados da Binance...');
    const tickers = await fetchBinanceTickers();

    if (tickers.size === 0) {
        console.error('[AutoPilot] No tickers fetched');
        return 0;
    }

    // Sort by volume
    const sortedTickers = [...tickers.entries()]
        .map(([symbol, ticker]) => ({
            symbol,
            ticker,
            volume: parseFloat(ticker.quoteVolume),
        }))
        .filter(t => t.volume >= CONFIG.MIN_VOLUME)
        .sort((a, b) => b.volume - a.volume)
        .slice(0, CONFIG.MAX_TOKENS);

    setStatus(`Limpando tokens antigos...`);

    // Delete ALL existing tokens first to remove any junk/non-curated tokens
    const { error: deleteError } = await supabase
        .from('tokens')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
        console.error('[AutoPilot] Error deleting old tokens:', deleteError);
    }

    setStatus(`Sincronizando ${sortedTickers.length} tokens...`);

    const tokensToUpsert = [];

    for (const { symbol, ticker, volume } of sortedTickers) {
        const price = parseFloat(ticker.lastPrice);
        const change = parseFloat(ticker.priceChangePercent);
        const hasNarrative = !!TOP_NARRATIVES[symbol];
        const score = calculateScore(volume, change, hasNarrative);
        const status = determineStatus(score, volume, change);

        tokensToUpsert.push({
            ticker: symbol,
            name: TOKEN_NAMES[symbol] || symbol,
            current_price: price,
            change_24h: change,
            volume_24h: volume,
            score: score,
            status: status,
            narrative: TOP_NARRATIVES[symbol] || null,
            updated_at: new Date().toISOString(),
        });
    }

    if (tokensToUpsert.length > 0) {
        const { error } = await supabase
            .from('tokens')
            .upsert(tokensToUpsert, { onConflict: 'ticker' });

        if (error) {
            console.error('[AutoPilot] Error syncing tokens:', error);
            return 0;
        }
    }

    console.log(`[AutoPilot] Synced ${tokensToUpsert.length} tokens`);
    return tokensToUpsert.length;
}

// ===== ANALYSIS FUNCTION =====
async function runAutomaticAnalysis(setStatus: (action: string) => void): Promise<number> {
    setStatus('Buscando tokens para análise...');

    // Get tokens that need analysis — prioritize tokens with oldest analysis first
    const { data: tokens, error } = await supabase
        .from('tokens')
        .select('ticker, change_24h')
        .order('updated_at', { ascending: true })
        .limit(CONFIG.ANALYSIS_BATCH_SIZE);

    if (error || !tokens) {
        console.error('[AutoPilot] Error fetching tokens for analysis:', error);
        return 0;
    }

    let analyzed = 0;

    for (const token of tokens) {
        setStatus(`Analisando ${token.ticker}... (${analyzed + 1}/${tokens.length})`);

        try {
            const analysis = await analyzeToken(token.ticker, '4h', token.change_24h);

            // Save to token_analysis using upsert to avoid conflicts
            const { error: insertError } = await supabase
                .from('token_analysis')
                .upsert({
                    ticker: analysis.ticker,
                    timeframe: analysis.timeframe,
                    ema_21: analysis.ema21,
                    ema_50: analysis.ema50,
                    ema_100: analysis.ema100,
                    ema_200: analysis.ema200,
                    adx: analysis.adx,
                    di_plus: analysis.diPlus,
                    di_minus: analysis.diMinus,
                    supertrend_value: analysis.supertrendValue,
                    supertrend_direction: analysis.supertrendDirection,
                    rsi: analysis.rsi,
                    stoch_k: analysis.stochK,
                    stoch_d: analysis.stochD,
                    macd_line: analysis.macdLine,
                    macd_signal: analysis.macdSignal,
                    macd_histogram: analysis.macdHistogram,
                    tenkan: analysis.tenkan,
                    kijun: analysis.kijun,
                    senkou_a: analysis.senkouA,
                    senkou_b: analysis.senkouB,
                    cloud_position: analysis.cloudPosition,
                    volume_ratio: analysis.volumeRatio,
                    buy_pressure: analysis.buyPressure,
                    key_support: analysis.keySupport,
                    key_resistance: analysis.keyResistance,
                    fib_236: analysis.fib236,
                    fib_382: analysis.fib382,
                    fib_500: analysis.fib500,
                    fib_618: analysis.fib618,
                    fib_786: analysis.fib786,
                    fib_zone: analysis.fibZone,
                    buy_score: analysis.buyScore,
                    sell_score: analysis.sellScore,
                    signal: analysis.signal,
                    stop_loss: analysis.stopLoss,
                    take_profit: analysis.takeProfit,
                    risk_reward: analysis.riskReward,
                    atr: analysis.atr,
                    patterns_detected: analysis.patternsDetected,
                    htf_trend: analysis.htfTrend,
                    mtf_trend: analysis.mtfTrend,
                    current_price: analysis.currentPrice,
                    change_24h: analysis.change24h,
                    // analyzed_at removido pois a coluna não existe no banco (usa updated_at via trigger)
                }, { onConflict: 'ticker,timeframe' });

            if (insertError) {
                console.error(`[AutoPilot] ❌ DB upsert FAILED for ${token.ticker}: ${insertError.message} (code: ${insertError.code})`);
            }

            if (!insertError) {
                // Update token with technical classification
                const classification = classifyToken(analysis);

                await supabase
                    .from('tokens')
                    .update({
                        score: classification.score,
                        status: classification.status,
                        current_price: analysis.currentPrice,
                        change_24h: analysis.change24h,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('ticker', token.ticker);

                analyzed++;

                // 🤖 AI TRIGGER: Se o token for promissor (Score >= 70), paga uma análise da IA
                // Verifica apenas se a última atualização foi há mais de 4 horas para economizar
                const shouldAnalyzeAI = (analysis.buyScore >= 70 || analysis.sellScore >= 70);

                if (shouldAnalyzeAI) {
                    try {
                        // Check last update time first to avoid spamming
                        const { data: currentAnalysis } = await supabase
                            .from('token_analysis')
                            .select('last_ai_update')
                            .eq('ticker', token.ticker)
                            .maybeSingle();

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const lastUpdate = (currentAnalysis as any)?.last_ai_update ? new Date((currentAnalysis as any).last_ai_update) : null;
                        const hoursSinceLastUpdate = lastUpdate ? (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60) : 999;

                        if (hoursSinceLastUpdate > 4) {
                            // VERIFY CREDITS/VIP BEFORE AUTO-ANALYZING
                            const { data: { user } } = await supabase.auth.getUser();
                            if (user) {
                                const { data: profile } = await supabase
                                    .from('profiles')
                                    .select('*')
                                    .eq('id', user.id)
                                    .single();

                                const isVip = (profile?.plan as any) === 'pro' || (profile?.plan as any) === 'vip';
                                const hasCredits = ((profile as any)?.credits || 0) > 0;

                                if (isVip || hasCredits) {
                                    console.log(`[AutoPilot] 🤖 Triggering AI Analysis for ${token.ticker} (Score: ${Math.max(analysis.buyScore, analysis.sellScore).toFixed(0)})`);
                                    setStatus(`🤖 AI Analisando ${token.ticker}...`);

                                    await supabase.functions.invoke('analyze-token-ai', {
                                        body: {
                                            ticker: token.ticker,
                                            price: analysis.currentPrice,
                                            indicators: {
                                                rsi: analysis.rsi,
                                                macd: {
                                                    macd: analysis.macdLine,
                                                    signal: analysis.macdSignal,
                                                    histogram: analysis.macdHistogram
                                                },
                                                bollinger: {
                                                    upper: analysis.currentPrice * 1.05, // Aproximado se não tiver calculado
                                                    middle: analysis.ema21,
                                                    lower: analysis.currentPrice * 0.95 // Aproximado
                                                },
                                                ema: {
                                                    ema9: analysis.currentPrice, // Não temos EMA9 calculada no serviço, usar preço atual como proxy ou adicionar depois
                                                    ema21: analysis.ema21,
                                                    ema50: analysis.ema50,
                                                    ema200: analysis.ema200
                                                },
                                                volume: {
                                                    current: analysis.volumeRatio, // Usando ratio como proxy de volume relativo
                                                    average: 1,
                                                    ratio: analysis.volumeRatio
                                                },
                                                trend: analysis.supertrendDirection === 'bull' ? 'BULLISH' : 'BEARISH',
                                                strength: analysis.adx
                                            },
                                            support: [analysis.keySupport, analysis.fib618, analysis.fib786].filter(n => n),
                                            resistance: [analysis.keyResistance, analysis.fib236, analysis.fib382].filter(n => n)
                                        }
                                    });
                                }
                            }
                        }
                    } catch (aiError) {
                        console.error(`[AutoPilot] AI Trigger Error for ${token.ticker}:`, aiError);
                    }
                }
            }

            // Delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, CONFIG.API_DELAY));
        } catch (error) {
            console.error(`[AutoPilot] Error analyzing ${token.ticker}:`, error);
        }
    }

    console.log(`[AutoPilot] Analyzed ${analyzed} tokens`);
    return analyzed;
}

// ===== PROVIDER COMPONENT =====
export const AutoPilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<AutoPilotStatus>({
        isRunning: true,
        lastSync: null,
        lastAnalysis: null,
        tokenCount: 0,
        analyzedCount: 0,
        currentAction: 'Initializing...',
    });

    const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const setCurrentAction = useCallback((action: string) => {
        setStatus(prev => ({ ...prev, currentAction: action }));
    }, []);

    // Bot trigger cycle
    const runBotsCycle = useCallback(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // Verificando se o usuário é admin
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            const p = profile as any;
            if (p?.role === 'admin') {
                console.log('[AutoPilot] Triggering community bots...');
                await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/community-bots`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ action: 'generate_activity' }),
                }).catch(() => { });
            }
        } catch (error) {
            console.error('[AutoPilot] Bot cycle error:', error);
        }
    }, []);

    // Main sync cycle
    const runSyncCycle = useCallback(async () => {
        console.log('[AutoPilot] Starting sync cycle...');
        const count = await syncTokensFromBinance(setCurrentAction);
        setStatus(prev => ({
            ...prev,
            lastSync: new Date(),
            tokenCount: count,
        }));
        setCurrentAction('Sync completo! ' + count + ' tokens atualizados');
    }, [setCurrentAction]);

    // Main analysis cycle
    const runAnalysisCycle = useCallback(async () => {
        console.log('[AutoPilot] Starting analysis cycle...');
        const count = await runAutomaticAnalysis(setCurrentAction);
        setStatus(prev => ({
            ...prev,
            lastAnalysis: new Date(),
            analyzedCount: count,
        }));
        setCurrentAction('Análise completa! ' + count + ' tokens analisados');
    }, [setCurrentAction]);

    // Initialize on mount
    useEffect(() => {
        console.log('[AutoPilot] System starting...');

        // Run initial sync
        runSyncCycle().then(() => {
            // Run initial analysis after sync
            setTimeout(() => {
                runAnalysisCycle();
            }, 3000);

            // Run initial bot trigger
            setTimeout(() => {
                runBotsCycle();
            }, 10000);
        });

        // Set up recurring sync
        syncIntervalRef.current = setInterval(() => {
            runSyncCycle();
        }, CONFIG.SYNC_INTERVAL_MS);

        // Set up recurring analysis (offset by 2 minutes from sync)
        analysisIntervalRef.current = setInterval(() => {
            runAnalysisCycle();
        }, CONFIG.ANALYSIS_INTERVAL_MS);

        // Set up recurring bots trigger (every 25 minutes)
        const botsInterval = setInterval(() => {
            runBotsCycle();
        }, 25 * 60 * 1000);

        return () => {
            if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
            if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
            clearInterval(botsInterval);
        };
    }, [runSyncCycle, runAnalysisCycle, runBotsCycle]);

    return (
        <AutoPilotContext.Provider value={status}>
            {children}
        </AutoPilotContext.Provider>
    );
};

export default AutoPilotProvider;
