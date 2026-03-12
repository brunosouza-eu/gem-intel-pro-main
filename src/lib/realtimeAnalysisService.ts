/**
 * 📊 REAL-TIME ANALYSIS SERVICE (TradingView Parity Edition)
 * Calculates technical indicators and fetches live market data via Binance
 * Consolidated with technicalIndicators.ts for consistent logic
 */

import { supabase } from '@/integrations/supabase/client';
import {
    calculateRSI,
    calculateEMA,
    calculateMACD,
    calculateStochastic,
    calculateADX,
    calculateATR,
    calculateSupertrend,
    calculateIchimoku,
    calculateFibonacci,
    detectPatterns,
    analyzeVolume,
    OHLCV,
    FibonacciLevels,
    VolumeAnalysis
} from './technicalIndicators';

// ===== TYPES =====

export interface CandleData extends OHLCV {
    time: number;
}

export interface TechnicalIndicators {
    rsi: number;
    macd: {
        macd: number;
        signal: number;
        histogram: number;
    };
    bollinger: { // Kept for interface compatibility, though not primary
        upper: number;
        middle: number;
        lower: number;
    };
    ema: {
        ema9: number;
        ema21: number;
        ema50: number;
        ema200: number;
    };
    volume: {
        current: number;
        average: number;
        ratio: number;
    };
    trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    strength: number; // 0-10 based on EMAs
}

export interface MarketAnalysis {
    ticker: string;
    price: number;
    change24h: number;
    indicators: TechnicalIndicators;
    support: number[];
    resistance: number[];
    lastUpdate: number;

    // TradingView Parity Properties
    htf_trend: string;
    mtf_trend: string;
    buy_score: number;
    sell_score: number;
    signal: string;
    adx: number;
    supertrend_value: number;
    supertrend_direction: string;
    fib_zone: string;
    stop_loss: number;
    take_profit: number;
    risk_reward: number;
    atr: number;
}

// ===== HELPER: BOLLINGER (Legacy, kept for UI if needed) =====
// Note: Not part of Swing Master Pro core logic, but displayed in some UI parts?
export function calculateBollinger(prices: number[], period = 20, stdDev = 2) {
    const slice = prices.slice(-period);
    const middle = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - middle, 2), 0) / period;
    const std = Math.sqrt(variance);
    return {
        upper: middle + (std * stdDev),
        middle,
        lower: middle - (std * stdDev),
    };
}

// ===== SCORE CALCULATION (Exact replica of Edge Function logic) =====
function calculateBuyScore(params: any): number {
    let score = 0;
    if (params.htfBullish) score += 15;
    if (params.mtfBullish) score += 15;
    if (params.close > params.ema21 && params.ema21 > params.ema50) score += 15;
    if (params.close > params.ema200) score += 10;
    if (params.trendBullish) score += 15;
    else if (params.strongTrend && params.close > params.ema50) score += 8;
    if (params.supertrendBull) score += 10;
    if (params.rsiOversold) score += 15;
    else if (params.rsi < 50 && params.rsi > 30) score += 8;
    if (params.stochCrossUp || params.stochOversold) score += 10;
    if (params.macdBullCross) score += 10;
    else if (params.macdBullish) score += 5;
    if (params.ichimokuBullish) score += 15;
    else if (params.aboveCloud) score += 8;
    if (params.veryHighVolume && params.buyPressure) score += 10;
    else if (params.highVolume && params.buyPressure) score += 5;
    if (params.nearSupport) score += 10;
    else if (params.structureBreakBull) score += 5;
    if (params.inFibBuyZone) score += 10;
    if (params.bullishPattern) score += 10;
    return Math.min(score, 150);
}

function calculateSellScore(params: any): number {
    let score = 0;
    if (params.htfBearish) score += 15;
    if (params.mtfBearish) score += 15;
    if (params.close < params.ema21 && params.ema21 < params.ema50) score += 15;
    if (params.close < params.ema200) score += 10;
    if (params.trendBearish) score += 15;
    else if (params.strongTrend && params.close < params.ema50) score += 8;
    if (params.supertrendBear) score += 10;
    if (params.rsiOverbought) score += 15;
    else if (params.rsi > 50 && params.rsi < 70) score += 8;
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

// ===== BINANCE API =====

const TICKER_MAP: Record<string, string> = {
    'ASI': 'FET',
    'RNDR': 'RENDER',
    'MATIC': 'POL',
};

async function fetchBinanceCandles(
    symbol: string,
    interval: string = '4h',
    limit: number = 200
): Promise<CandleData[]> {
    try {
        const resolvedSymbol = TICKER_MAP[symbol.toUpperCase()] || symbol;
        const { data, error } = await supabase.functions.invoke('fetch-binance-klines', {
            body: { symbol: resolvedSymbol, interval, limit }
        });

        if (error) {
            console.error(`Binance proxy error for ${symbol}:`, error);
            return [];
        }

        return data?.candles || [];
    } catch (error) {
        console.error(`Error fetching candles for ${symbol}:`, error);
        return [];
    }
}

// ===== MAIN ANALYSIS FUNCTION =====

export async function analyzeToken(ticker: string): Promise<MarketAnalysis | null> {
    try {
        // Fetch Parallel Data: 4h (Main) and 1d (HTF)
        const [klines4h, klines1d] = await Promise.all([
            fetchBinanceCandles(ticker, '4h', 1000),
            fetchBinanceCandles(ticker, '1d', 500)
        ]);

        if (klines4h.length < 50) return null;

        // --- HTF ANALYSIS (Daily) ---
        let htfTrend = 'neutral';
        if (klines1d.length >= 50) {
            const dCloses = klines1d.map(c => c.close);
            const dEma50 = calculateEMA(dCloses, 50);
            const dEma200 = calculateEMA(dCloses, 200);
            const lastIdx = dCloses.length - 1;

            if (dCloses[lastIdx] > dEma50[lastIdx] && dEma50[lastIdx] > dEma200[lastIdx]) {
                htfTrend = 'bullish';
            } else if (dCloses[lastIdx] < dEma50[lastIdx] && dEma50[lastIdx] < dEma200[lastIdx]) {
                htfTrend = 'bearish';
            }
        }

        // --- MAIN ANALYSIS (4h) ---
        const candles = klines4h;
        const closes = candles.map(c => c.close);
        const highs = candles.map(c => c.high);
        const lows = candles.map(c => c.low);
        const opens = candles.map(c => c.open);
        const volumes = candles.map(c => c.volume);

        const idx = closes.length - 1;
        const currentPrice = closes[idx];
        const prevPrice = closes[idx - 1];

        // Use imported functions (which now use RMA)
        const ema9 = calculateEMA(closes, 9);
        const ema21 = calculateEMA(closes, 21);
        const ema50 = calculateEMA(closes, 50);
        const ema200 = calculateEMA(closes, 200);
        const rsi = calculateRSI(closes, 14);
        const { k: stochK, d: stochD } = calculateStochastic(highs, lows, closes, 14);
        const { macd, signal: macdSignal, histogram } = calculateMACD(closes);
        const { adx, plusDI, minusDI } = calculateADX(highs, lows, closes, 14);
        const atr = calculateATR(highs, lows, closes, 14);
        const { supertrend, direction } = calculateSupertrend(highs, lows, closes, 10, 3);
        const { tenkan, kijun, senkouA, senkouB } = calculateIchimoku(highs, lows, closes);
        const fibonacci = calculateFibonacci(highs, lows, 100);
        const volumeAnalysis = analyzeVolume(volumes, closes, opens);
        const bollinger = calculateBollinger(closes);

        // Current Values
        const currentEMA21 = ema21[idx] || currentPrice;
        const currentEMA50 = ema50[idx] || currentPrice;
        const currentEMA200 = ema200[idx] || currentPrice;
        const currentRSI = rsi[idx] || 50;
        const currentStochK = stochK[idx] || 50;
        const currentStochD = stochD[idx] || 50;
        const currentMACD = macd[idx] || 0;
        const currentSignal = macdSignal[idx] || 0;
        const currentHistogram = histogram[idx] || 0;
        const currentADX = adx[idx] || 0;
        const currentPlusDI = plusDI[idx] || 0;
        const currentMinusDI = minusDI[idx] || 0;
        const currentATR = atr[idx] || 0;
        const currentSupertrend = supertrend[idx] || 0;
        const currentDirection = direction[idx] || 1;
        const currentTenkan = tenkan[idx] || 0;
        const currentKijun = kijun[idx] || 0;
        const currentSenkouA = senkouA[idx] || 0;
        const currentSenkouB = senkouB[idx] || 0;
        const currentVolume = volumeAnalysis[idx] || { volumeRatio: 1, buyPressure: true, highVolume: false, veryHighVolume: false };

        const cloudTop = Math.max(currentSenkouA, currentSenkouB);
        const cloudBottom = Math.min(currentSenkouA, currentSenkouB);
        const cloudPosition = currentPrice > cloudTop ? 'above' : currentPrice < cloudBottom ? 'below' : 'inside';

        const keySupport = Math.min(...lows.slice(-20)) * 0.98; // Keeping buffer
        const keyResistance = Math.max(...highs.slice(-20)) * 1.02;

        const fibZone = currentPrice >= fibonacci.fib618 && currentPrice <= fibonacci.fib786 ? 'buy' :
            currentPrice <= fibonacci.fib382 && currentPrice >= fibonacci.fib236 ? 'sell' : 'neutral';

        const mtfTrend = (currentPrice > currentEMA21 && currentRSI > 50) ? 'bullish' :
            (currentPrice < currentEMA21 && currentRSI < 50) ? 'bearish' : 'neutral';

        // Scoring
        const scoringParams = {
            htfBullish: htfTrend === 'bullish',
            htfBearish: htfTrend === 'bearish',
            mtfBullish: mtfTrend === 'bullish',
            mtfBearish: mtfTrend === 'bearish',
            close: currentPrice,
            ema21: currentEMA21,
            ema50: currentEMA50,
            ema200: currentEMA200,
            trendBullish: currentPlusDI > currentMinusDI && currentADX > 20,
            trendBearish: currentMinusDI > currentPlusDI && currentADX > 20,
            strongTrend: currentADX > 20,
            supertrendBull: currentDirection === 1,
            supertrendBear: currentDirection === -1,
            rsi: currentRSI,
            rsiOversold: currentRSI < 35,
            rsiOverbought: currentRSI > 65,
            stochCrossUp: currentStochK > currentStochD && currentStochK < 50,
            stochCrossDown: currentStochK < currentStochD && currentStochK > 50,
            stochOversold: currentStochK < 20,
            stochOverbought: currentStochK > 80,
            macdBullCross: currentMACD > currentSignal && (histogram[idx - 1] || 0) < 0,
            macdBearCross: currentMACD < currentSignal && (histogram[idx - 1] || 0) > 0,
            macdBullish: currentMACD > currentSignal && currentHistogram > 0,
            macdBearish: currentMACD < currentSignal && currentHistogram < 0,
            ichimokuBullish: cloudPosition === 'above' && currentTenkan > currentKijun,
            ichimokuBearish: cloudPosition === 'below' && currentTenkan < currentKijun,
            aboveCloud: cloudPosition === 'above',
            belowCloud: cloudPosition === 'below',
            veryHighVolume: currentVolume.veryHighVolume,
            highVolume: currentVolume.highVolume,
            buyPressure: currentVolume.buyPressure,
            sellPressure: !currentVolume.buyPressure,
            nearSupport: currentPrice <= keySupport * 1.02,
            nearResistance: currentPrice >= keyResistance * 0.98,
            structureBreakBull: currentPrice > Math.max(...highs.slice(-20, -1)),
            structureBreakBear: currentPrice < Math.min(...lows.slice(-20, -1)),
            inFibBuyZone: fibZone === 'buy',
            inFibSellZone: fibZone === 'sell',
            bullishPattern: false,
            bearishPattern: false
        };

        const buyScore = calculateBuyScore(scoringParams);
        const sellScore = calculateSellScore(scoringParams);

        const buyStrength = (buyScore / 150) * 100;
        const sellStrength = (sellScore / 150) * 100;

        const stopLossBuy = currentPrice - (currentATR * 2);
        const takeProfitBuy = currentPrice + (currentATR * 3);
        const riskRewardBuy = (takeProfitBuy - currentPrice) / (currentPrice - stopLossBuy);

        let signal = 'neutral';
        if (buyStrength >= 75 && buyStrength > sellStrength && riskRewardBuy >= 2.0 && currentADX > 20) signal = 'elite_buy';
        else if (buyStrength >= 60 && buyStrength > sellStrength && riskRewardBuy >= 1.6) signal = 'strong_buy';
        else if (buyStrength >= 45 && buyStrength > sellStrength) signal = 'medium_buy';
        else if (sellStrength >= 75 && sellStrength > buyStrength && currentADX > 20) signal = 'elite_sell';
        else if (sellStrength >= 60 && sellStrength > buyStrength) signal = 'strong_sell';
        else if (sellStrength >= 45 && sellStrength > buyStrength) signal = 'medium_sell';

        // Trend EMA strength Score (0-10) - kept for legacy UI prop
        let legacyStrength = 5;
        if (ema9[idx] > ema21[idx]) legacyStrength += 1.25;
        if (ema21[idx] > ema50[idx]) legacyStrength += 1.25;
        if (ema50[idx] > ema200[idx]) legacyStrength += 1.25;
        if (currentRSI > 50) legacyStrength += 1.25;

        const change24h = ((currentPrice - prevPrice) / prevPrice) * 100;

        return {
            ticker,
            price: currentPrice,
            change24h,
            indicators: {
                rsi: currentRSI,
                macd: { macd: currentMACD, signal: currentSignal, histogram: currentHistogram },
                bollinger: bollinger,
                ema: { ema9: ema9[idx], ema21: currentEMA21, ema50: currentEMA50, ema200: currentEMA200 },
                volume: { current: currentVolume.volumeRatio, average: 1, ratio: currentVolume.volumeRatio }, // Simplified
                trend: htfTrend === 'bullish' ? 'BULLISH' : htfTrend === 'bearish' ? 'BEARISH' : 'NEUTRAL',
                strength: legacyStrength
            },
            support: [Math.min(...lows.slice(-20))],
            resistance: [Math.max(...highs.slice(-20))],
            lastUpdate: Date.now(),

            // Parity Fields
            htf_trend: htfTrend,
            mtf_trend: mtfTrend,
            buy_score: buyStrength,
            sell_score: sellStrength,
            signal,
            adx: currentADX,
            supertrend_value: currentSupertrend,
            supertrend_direction: currentDirection === 1 ? 'up' : 'down',
            fib_zone: fibZone,
            stop_loss: stopLossBuy,
            take_profit: takeProfitBuy,
            risk_reward: riskRewardBuy,
            atr: currentATR
        };

    } catch (error) {
        console.error(`Error analyzing ${ticker}:`, error);
        return null;
    }
}

// ===== EXPORT =====
export default {
    analyzeToken,
    fetchBinanceCandles,
    calculateRSI,
    calculateEMA,
    calculateMACD,
    calculateBollinger,
};
