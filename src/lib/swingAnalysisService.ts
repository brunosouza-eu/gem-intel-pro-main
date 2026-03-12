/**
 * Advanced Swing Analysis Service
 * Busca dados históricos da Binance e calcula análise completa
 */

import {
    calculateEMA,
    calculateRSI,
    calculateMACD,
    calculateStochastic,
    calculateADX,
    calculateATR,
    calculateSupertrend,
    calculateIchimoku,
    calculateFibonacci,
    detectPatterns,
    analyzeVolume,
    type OHLCV,
} from './technicalIndicators';

export interface SwingAnalysisResult {
    ticker: string;
    timeframe: string;

    // Trend Indicators
    ema21: number;
    ema50: number;
    ema100: number;
    ema200: number;

    // ADX
    adx: number;
    diPlus: number;
    diMinus: number;

    // Supertrend
    supertrendValue: number;
    supertrendDirection: 'bull' | 'bear';

    // Momentum
    rsi: number;
    stochK: number;
    stochD: number;
    macdLine: number;
    macdSignal: number;
    macdHistogram: number;

    // Ichimoku
    tenkan: number;
    kijun: number;
    senkouA: number;
    senkouB: number;
    cloudPosition: 'above' | 'below' | 'inside';

    // Volume
    volumeRatio: number;
    buyPressure: boolean;

    // Support/Resistance
    keySupport: number;
    keyResistance: number;

    // Fibonacci
    fib236: number;
    fib382: number;
    fib500: number;
    fib618: number;
    fib786: number;
    fibZone: 'buy_zone' | 'sell_zone' | 'neutral';

    // Scores
    buyScore: number;
    sellScore: number;
    signal: 'elite_buy' | 'strong_buy' | 'medium_buy' | 'elite_sell' | 'strong_sell' | 'medium_sell' | 'neutral';

    // Risk Management
    stopLoss: number;
    takeProfit: number;
    riskReward: number;
    atr: number;

    // Patterns
    patternsDetected: string[];

    // Multi-Timeframe
    htfTrend: 'bullish' | 'bearish' | 'neutral';
    mtfTrend: 'bullish' | 'bearish' | 'neutral';

    // Current Price
    currentPrice: number;
    change24h: number;
}

import { supabase } from '@/integrations/supabase/client';

// Ticker mapping for specific tokens
const TICKER_MAP: Record<string, string> = {
    'ASI': 'FET',
    'RNDR': 'RENDER',
    'MATIC': 'POL',
};

/**
 * Busca dados históricos da Binance via Edge Function, com fallback direto à API pública
 */
async function fetchBinanceKlines(
    symbol: string,
    interval: string = '4h',
    limit: number = 200
): Promise<OHLCV[]> {
    const resolvedSymbol = TICKER_MAP[symbol.toUpperCase()] || symbol;

    // Try Edge Function first
    try {
        const { data, error } = await supabase.functions.invoke('fetch-binance-klines', {
            body: { symbol: resolvedSymbol, interval, limit }
        });

        if (!error && data?.candles?.length > 0) {
            return data.candles.map((candle: any) => ({
                timestamp: candle.time,
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
                volume: candle.volume,
            }));
        }

        if (error) {
            console.warn(`Edge Function failed for ${symbol}, trying direct API...`, error.message);
        }
    } catch (e) {
        console.warn(`Edge Function exception for ${symbol}, trying direct API...`);
    }

    // Fallback 1: Direct Binance Public API (Fails in browser due to CORS)
    try {
        const pair = `${resolvedSymbol.toUpperCase()}USDT`;
        const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Binance API returned ${response.status}`);
        }

        const rawData = await response.json();

        if (!Array.isArray(rawData) || rawData.length === 0) {
            throw new Error(`Empty data from Binance`);
        }

        return rawData.map((k: any[]) => ({
            timestamp: k[0],
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
            volume: parseFloat(k[5]),
        }));
    } catch (error) {
        console.warn(`Direct Binance API failed for ${symbol}, trying MEXC...`, error);

        // Fallback 2: MEXC Public API (Supports CORS)
        try {
            const pair = `${resolvedSymbol.toUpperCase()}USDT`;
            const url = `https://api.mexc.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`;
            const response = await fetch(url);

            if (!response.ok) {
                console.warn(`MEXC API returned ${response.status} for ${symbol}`);
                return [];
            }

            const rawData = await response.json();

            if (!Array.isArray(rawData) || rawData.length === 0) {
                console.warn(`No kline data from MEXC API for ${symbol}`);
                return [];
            }

            return rawData.map((k: any[]) => ({
                timestamp: k[0],
                open: parseFloat(k[1]),
                high: parseFloat(k[2]),
                low: parseFloat(k[3]),
                close: parseFloat(k[4]),
                volume: parseFloat(k[5]),
            }));
        } catch (mexcError) {
            console.error(`MEXC API also failed for ${symbol}:`, mexcError);
            return [];
        }
    }
}

/**
 * Calcula scoring de compra (0-150 pontos)
 */
function calculateBuyScore(params: {
    // Multi-Timeframe
    htfBullish: boolean;
    mtfBullish: boolean;

    // Trend
    closeAboveEMA21: boolean;
    ema21AboveEMA50: boolean;
    closeAboveEMA200: boolean;

    // ADX
    trendBullish: boolean;
    strongTrend: boolean;

    // Supertrend
    supertrendBull: boolean;

    // RSI
    rsiOversold: boolean;
    rsiBetween30And50: boolean;

    // Stochastic
    stochCrossUp: boolean;
    stochOversold: boolean;

    // MACD
    macdBullCross: boolean;
    macdBullish: boolean;

    // Ichimoku
    ichimokuBullish: boolean;
    aboveCloud: boolean;

    // Volume
    veryHighVolume: boolean;
    highVolume: boolean;
    buyPressure: boolean;

    // Structure
    nearSupport: boolean;
    structureBreakBull: boolean;

    // Fibonacci
    inFibBuyZone: boolean;

    // Patterns
    bullishPattern: boolean;
}): number {
    let score = 0;

    // Multi-Timeframe (30 pontos)
    if (params.htfBullish) score += 15;
    if (params.mtfBullish) score += 15;

    // Trend Following (25 pontos)
    if (params.closeAboveEMA21 && params.ema21AboveEMA50) score += 15;
    if (params.closeAboveEMA200) score += 10;

    // ADX Strength (15 pontos)
    if (params.trendBullish) score += 15;
    else if (params.strongTrend && params.closeAboveEMA21) score += 8;

    // Supertrend (10 pontos)
    if (params.supertrendBull) score += 10;

    // RSI (15 pontos)
    if (params.rsiOversold) score += 15;
    else if (params.rsiBetween30And50) score += 8;

    // Stochastic (10 pontos)
    if (params.stochCrossUp || params.stochOversold) score += 10;

    // MACD (10 pontos)
    if (params.macdBullCross) score += 10;
    else if (params.macdBullish) score += 5;

    // Ichimoku (15 pontos)
    if (params.ichimokuBullish) score += 15;
    else if (params.aboveCloud) score += 8;

    // Volume (10 pontos)
    if (params.veryHighVolume && params.buyPressure) score += 10;
    else if (params.highVolume && params.buyPressure) score += 5;

    // Structure (10 pontos)
    if (params.nearSupport) score += 10;
    else if (params.structureBreakBull) score += 5;

    // Fibonacci (10 pontos)
    if (params.inFibBuyZone) score += 10;

    // Patterns (10 pontos)
    if (params.bullishPattern) score += 10;

    return Math.min(score, 150);
}

/**
 * Calcula scoring de venda (0-150 pontos) - lógica invertida
 */
function calculateSellScore(params: {
    htfBearish: boolean;
    mtfBearish: boolean;
    closeBelowEMA21: boolean;
    ema21BelowEMA50: boolean;
    closeBelowEMA200: boolean;
    trendBearish: boolean;
    strongTrend: boolean;
    supertrendBear: boolean;
    rsiOverbought: boolean;
    rsiBetween50And70: boolean;
    stochCrossDown: boolean;
    stochOverbought: boolean;
    macdBearCross: boolean;
    macdBearish: boolean;
    ichimokuBearish: boolean;
    belowCloud: boolean;
    veryHighVolume: boolean;
    highVolume: boolean;
    sellPressure: boolean;
    nearResistance: boolean;
    structureBreakBear: boolean;
    inFibSellZone: boolean;
    bearishPattern: boolean;
}): number {
    let score = 0;

    if (params.htfBearish) score += 15;
    if (params.mtfBearish) score += 15;
    if (params.closeBelowEMA21 && params.ema21BelowEMA50) score += 15;
    if (params.closeBelowEMA200) score += 10;
    if (params.trendBearish) score += 15;
    else if (params.strongTrend && params.closeBelowEMA21) score += 8;
    if (params.supertrendBear) score += 10;
    if (params.rsiOverbought) score += 15;
    else if (params.rsiBetween50And70) score += 8;
    if (params.stochCrossDown || params.stochOverbought) score += 10;
    if (params.macdBearCross) score += 10;
    else if (params.macdBearish) score += 5;
    if (params.ichimokuBearish) score += 15;
    else if (params.belowCloud) score += 8;
    if (params.veryHighVolume && params.sellPressure) score += 10;
    else if (params.highVolume && params.sellPressure) score += 5;
    if (params.nearResistance) score += 10;
    else if (params.structureBreakBear) score += 5;
    if (params.inFibSellZone) score += 10;
    if (params.bearishPattern) score += 10;

    return Math.min(score, 150);
}

/**
 * Análise completa de um token
 */
export async function analyzeToken(
    ticker: string,
    timeframe: string = '4h',
    tokenChange24h?: number
): Promise<SwingAnalysisResult> {
    // Buscar dados históricos
    const klines = await fetchBinanceKlines(ticker, timeframe);

    if (!klines || klines.length < 50) {
        console.warn(`Insufficient data for ${ticker}`);
        throw new Error(`Insufficient data for ${ticker}`);
    }

    const closes = klines.map(k => k.close);
    const highs = klines.map(k => k.high);
    const lows = klines.map(k => k.low);
    const opens = klines.map(k => k.open);
    const volumes = klines.map(k => k.volume);

    const currentPrice = closes[closes.length - 1];
    const prevPrice = closes[closes.length - 2];
    // Use real 24h change from token DB if available, fallback to candle diff
    const candleChange = ((currentPrice - prevPrice) / prevPrice) * 100;
    const change24h = typeof tokenChange24h === 'number' && !isNaN(tokenChange24h) ? tokenChange24h : candleChange;

    // Calcular indicadores
    const ema21 = calculateEMA(closes, 21);
    const ema50 = calculateEMA(closes, 50);
    const ema100 = calculateEMA(closes, 100);
    const ema200 = calculateEMA(closes, 200);

    const rsi = calculateRSI(closes, 14);
    const { k: stochK, d: stochD } = calculateStochastic(highs, lows, closes, 14);
    const { macd, signal: macdSignalLine, histogram } = calculateMACD(closes);
    const { adx, plusDI, minusDI } = calculateADX(highs, lows, closes, 14);
    const atr = calculateATR(highs, lows, closes, 14);
    const { supertrend, direction } = calculateSupertrend(highs, lows, closes);
    const { tenkan, kijun, senkouA, senkouB } = calculateIchimoku(highs, lows, closes);
    const fibonacci = calculateFibonacci(highs, lows, 100);
    const patterns = detectPatterns(klines);
    const volumeAnalysis = analyzeVolume(volumes, closes, opens);

    // Valores atuais (último índice)
    const idx = closes.length - 1;

    const currentEMA21 = ema21[idx];
    const currentEMA50 = ema50[idx];
    const currentEMA100 = ema100[idx];
    const currentEMA200 = ema200[idx];
    const currentRSI = rsi[idx];
    const currentStochK = stochK[idx];
    const currentStochD = stochD[idx];
    const currentMACD = macd[idx];
    const currentSignal = macdSignalLine[idx];
    const currentHistogram = histogram[idx];
    const currentADX = adx[idx];
    const currentPlusDI = plusDI[idx];
    const currentMinusDI = minusDI[idx];
    const currentATR = atr[idx];
    const currentSupertrend = supertrend[idx];
    const currentDirection = direction[idx];
    const currentTenkan = tenkan[idx];
    const currentKijun = kijun[idx];
    const currentSenkouA = senkouA[idx];
    const currentSenkouB = senkouB[idx];
    const currentPattern = patterns[idx];
    const currentVolume = volumeAnalysis[idx];

    // Cloud position
    const cloudTop = Math.max(currentSenkouA, currentSenkouB);
    const cloudBottom = Math.min(currentSenkouA, currentSenkouB);
    const cloudPosition: 'above' | 'below' | 'inside' =
        currentPrice > cloudTop ? 'above' :
            currentPrice < cloudBottom ? 'below' : 'inside';

    // Support/Resistance (simplificado)
    const keySupport = Math.min(...lows.slice(-20)) * 0.98;
    const keyResistance = Math.max(...highs.slice(-20)) * 1.02;

    // Fibonacci zone
    const fibZone: 'buy_zone' | 'sell_zone' | 'neutral' =
        currentPrice >= fibonacci.fib618 && currentPrice <= fibonacci.fib786 ? 'buy_zone' :
            currentPrice <= fibonacci.fib382 && currentPrice >= fibonacci.fib236 ? 'sell_zone' : 'neutral';

    // Patterns detected
    const patternsDetected: string[] = [];
    if (currentPattern?.hammer) patternsDetected.push('hammer');
    if (currentPattern?.shootingStar) patternsDetected.push('shooting_star');
    if (currentPattern?.bullishEngulfing) patternsDetected.push('bullish_engulfing');
    if (currentPattern?.bearishEngulfing) patternsDetected.push('bearish_engulfing');
    if (currentPattern?.morningStar) patternsDetected.push('morning_star');
    if (currentPattern?.eveningStar) patternsDetected.push('evening_star');

    // Multi-timeframe (simplificado - usar mesmo timeframe por enquanto)
    const htfTrend: 'bullish' | 'bearish' | 'neutral' =
        currentPrice > currentEMA50 && currentEMA50 > currentEMA200 ? 'bullish' :
            currentPrice < currentEMA50 && currentEMA50 < currentEMA200 ? 'bearish' : 'neutral';

    const mtfTrend: 'bullish' | 'bearish' | 'neutral' =
        currentPrice > currentEMA21 && currentRSI > 50 ? 'bullish' :
            currentPrice < currentEMA21 && currentRSI < 50 ? 'bearish' : 'neutral';

    // Calcular scores
    const buyScore = calculateBuyScore({
        htfBullish: htfTrend === 'bullish',
        mtfBullish: mtfTrend === 'bullish',
        closeAboveEMA21: currentPrice > currentEMA21,
        ema21AboveEMA50: currentEMA21 > currentEMA50,
        closeAboveEMA200: currentPrice > currentEMA200,
        trendBullish: currentPlusDI > currentMinusDI && currentADX > 20,
        strongTrend: currentADX > 20,
        supertrendBull: currentDirection === 1,
        rsiOversold: currentRSI < 35,
        rsiBetween30And50: currentRSI >= 30 && currentRSI < 50,
        stochCrossUp: currentStochK > currentStochD && currentStochK < 50,
        stochOversold: currentStochK < 20,
        macdBullCross: currentMACD > currentSignal && histogram[idx - 1] <= 0,
        macdBullish: currentMACD > currentSignal,
        ichimokuBullish: cloudPosition === 'above' && currentTenkan > currentKijun,
        aboveCloud: cloudPosition === 'above',
        veryHighVolume: currentVolume.veryHighVolume,
        highVolume: currentVolume.highVolume,
        buyPressure: currentVolume.buyPressure,
        nearSupport: currentPrice <= keySupport * 1.02,
        structureBreakBull: currentPrice > Math.max(...highs.slice(-20, -1)),
        inFibBuyZone: fibZone === 'buy_zone',
        bullishPattern: currentPattern?.hammer || currentPattern?.bullishEngulfing || currentPattern?.morningStar || false,
    });

    const sellScore = calculateSellScore({
        htfBearish: htfTrend === 'bearish',
        mtfBearish: mtfTrend === 'bearish',
        closeBelowEMA21: currentPrice < currentEMA21,
        ema21BelowEMA50: currentEMA21 < currentEMA50,
        closeBelowEMA200: currentPrice < currentEMA200,
        trendBearish: currentMinusDI > currentPlusDI && currentADX > 20,
        strongTrend: currentADX > 20,
        supertrendBear: currentDirection === -1,
        rsiOverbought: currentRSI > 65,
        rsiBetween50And70: currentRSI > 50 && currentRSI <= 70,
        stochCrossDown: currentStochK < currentStochD && currentStochK > 50,
        stochOverbought: currentStochK > 80,
        macdBearCross: currentMACD < currentSignal && histogram[idx - 1] >= 0,
        macdBearish: currentMACD < currentSignal,
        ichimokuBearish: cloudPosition === 'below' && currentTenkan < currentKijun,
        belowCloud: cloudPosition === 'below',
        veryHighVolume: currentVolume.veryHighVolume,
        highVolume: currentVolume.highVolume,
        sellPressure: !currentVolume.buyPressure,
        nearResistance: currentPrice >= keyResistance * 0.98,
        structureBreakBear: currentPrice < Math.min(...lows.slice(-20, -1)),
        inFibSellZone: fibZone === 'sell_zone',
        bearishPattern: currentPattern?.shootingStar || currentPattern?.bearishEngulfing || currentPattern?.eveningStar || false,
    });

    // Normalizar scores (0-100)
    const buyStrength = (buyScore / 150) * 100;
    const sellStrength = (sellScore / 150) * 100;

    // Stop Loss e Take Profit
    const stopLossBuy = currentPrice - (currentATR * 2);
    const takeProfitBuy = currentPrice + (currentATR * 3);
    const riskRewardBuy = (takeProfitBuy - currentPrice) / (currentPrice - stopLossBuy);

    const stopLossSell = currentPrice + (currentATR * 2);
    const takeProfitSell = currentPrice - (currentATR * 3);
    const riskRewardSell = (currentPrice - takeProfitSell) / (stopLossSell - currentPrice);

    // Determinar sinal
    let signal: SwingAnalysisResult['signal'] = 'neutral';
    let stopLoss = 0;
    let takeProfit = 0;
    let riskReward = 0;

    if (buyStrength >= 75 && buyStrength > sellStrength && riskRewardBuy >= 2.0 && currentADX > 20) {
        signal = 'elite_buy';
        stopLoss = stopLossBuy;
        takeProfit = takeProfitBuy;
        riskReward = riskRewardBuy;
    } else if (buyStrength >= 60 && buyStrength < 75 && buyStrength > sellStrength && riskRewardBuy >= 1.6) {
        signal = 'strong_buy';
        stopLoss = stopLossBuy;
        takeProfit = takeProfitBuy;
        riskReward = riskRewardBuy;
    } else if (buyStrength >= 45 && buyStrength < 60 && buyStrength > sellStrength) {
        signal = 'medium_buy';
        stopLoss = stopLossBuy;
        takeProfit = takeProfitBuy;
        riskReward = riskRewardBuy;
    } else if (sellStrength >= 75 && sellStrength > buyStrength && riskRewardSell >= 2.0 && currentADX > 20) {
        signal = 'elite_sell';
        stopLoss = stopLossSell;
        takeProfit = takeProfitSell;
        riskReward = riskRewardSell;
    } else if (sellStrength >= 60 && sellStrength < 75 && sellStrength > buyStrength && riskRewardSell >= 1.6) {
        signal = 'strong_sell';
        stopLoss = stopLossSell;
        takeProfit = takeProfitSell;
        riskReward = riskRewardSell;
    } else if (sellStrength >= 45 && sellStrength < 60 && sellStrength > buyStrength) {
        signal = 'medium_sell';
        stopLoss = stopLossSell;
        takeProfit = takeProfitSell;
        riskReward = riskRewardSell;
    }

    // B1/B2 fix: For neutral signals, always provide trade plan from the stronger side
    if (stopLoss === 0 || takeProfit === 0) {
        if (buyStrength >= sellStrength) {
            stopLoss = stopLossBuy;
            takeProfit = takeProfitBuy;
            riskReward = riskRewardBuy;
        } else {
            stopLoss = stopLossSell;
            takeProfit = takeProfitSell;
            riskReward = riskRewardSell;
        }
    }

    return {
        ticker,
        timeframe,
        ema21: currentEMA21,
        ema50: currentEMA50,
        ema100: currentEMA100,
        ema200: currentEMA200,
        adx: currentADX,
        diPlus: currentPlusDI,
        diMinus: currentMinusDI,
        supertrendValue: currentSupertrend,
        supertrendDirection: currentDirection === 1 ? 'bull' : 'bear',
        rsi: currentRSI,
        stochK: currentStochK,
        stochD: currentStochD,
        macdLine: currentMACD,
        macdSignal: currentSignal,
        macdHistogram: currentHistogram,
        tenkan: currentTenkan,
        kijun: currentKijun,
        senkouA: currentSenkouA,
        senkouB: currentSenkouB,
        cloudPosition,
        volumeRatio: currentVolume.volumeRatio,
        buyPressure: currentVolume.buyPressure,
        keySupport,
        keyResistance,
        fib236: fibonacci.fib236,
        fib382: fibonacci.fib382,
        fib500: fibonacci.fib500,
        fib618: fibonacci.fib618,
        fib786: fibonacci.fib786,
        fibZone,
        buyScore: buyStrength,
        sellScore: sellStrength,
        signal,
        stopLoss,
        takeProfit,
        riskReward,
        atr: currentATR,
        patternsDetected,
        htfTrend,
        mtfTrend,
        currentPrice,
        change24h,
    };
}
