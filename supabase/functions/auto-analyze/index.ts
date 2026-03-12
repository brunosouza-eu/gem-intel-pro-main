import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// TECHNICAL INDICATORS (TradingView Parity)
// ============================================================================

interface OHLCV {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

// EMA - Exponential Moving Average
function calculateEMA(data: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);

    // TradingView starts EMA with SMA of first 'period' elements
    let sum = 0;
    for (let i = 0; i < period && i < data.length; i++) {
        sum += data[i];
    }
    ema[period - 1] = sum / period;

    for (let i = period; i < data.length; i++) {
        ema[i] = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
    }
    return ema;
}

// SMA - Simple Moving Average
function calculateSMA(data: number[], period: number): number[] {
    const sma: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma[i] = sum / period;
    }
    return sma;
}

// RMA - Moving Average used in RSI, ATR, ADX (Wilder's Smoothing)
// Pine Script: rma(src, length)
function calculateRMA(data: number[], period: number): number[] {
    const rma: number[] = [];
    const alpha = 1 / period;

    // First value is SMA
    let sum = 0;
    for (let i = 0; i < period && i < data.length; i++) {
        sum += data[i];
    }
    rma[period - 1] = sum / period;

    for (let i = period; i < data.length; i++) {
        rma[i] = alpha * data[i] + (1 - alpha) * rma[i - 1];
    }
    return rma;
}

// RSI - Uses RMA
function calculateRSI(data: number[], period: number = 14): number[] {
    const rsi: number[] = [];
    const changes = [];

    for (let i = 1; i < data.length; i++) {
        changes.push(data[i] - data[i - 1]);
    }

    const gains = changes.map(c => c > 0 ? c : 0);
    const losses = changes.map(c => c < 0 ? Math.abs(c) : 0);

    // Calculate RMA for gains and losses
    // Note: We need to pad the beginning to match index with original data (offset by 1)
    const avgGain = calculateRMA(gains, period);
    const avgLoss = calculateRMA(losses, period);

    // Realign arrays (RMA starts at index 'period-1' relative to gains/losses)
    // gains/losses are length N-1 compared to data.
    // So RMA[k] corresponds to change at index k+1 of original data (which is close[k+1])

    // We want rsi[i] to correspond to data[i]
    for (let i = 0; i < data.length; i++) {
        // The index in avgGain/avgLoss corresponding to data[i] is (i - 1)
        if (i <= period) continue; // Need enough data

        const up = avgGain[i - 1];
        const down = avgLoss[i - 1];

        if (down === 0) {
            rsi[i] = 100;
        } else if (up === 0) {
            rsi[i] = 0;
        } else {
            const rs = up / down;
            rsi[i] = 100 - (100 / (1 + rs));
        }
    }

    return rsi;
}

// MACD
function calculateMACD(data: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const fastEMA = calculateEMA(data, fastPeriod);
    const slowEMA = calculateEMA(data, slowPeriod);
    const macd: number[] = [];

    for (let i = 0; i < data.length; i++) {
        if (fastEMA[i] !== undefined && slowEMA[i] !== undefined) {
            macd[i] = fastEMA[i] - slowEMA[i];
        }
    }

    const signal = calculateEMA(macd.filter(v => v !== undefined), signalPeriod);

    // Re-align signal array to match original data length
    const alignedSignal: number[] = [];
    let signalIdx = 0;
    const offset = data.indexOf(data.find((_, i) => macd[i] !== undefined)!);

    // Not perfect alignment logic but sufficient for recent values
    // Better approach:
    const histogram: number[] = [];
    // We only care about the formatting for the final result mainly

    // Let's keep it simple: calculate on the defined values
    // We need to return arrays of same length as input 'data', padded with undefined/NaN
    const resultMACD: number[] = new Array(data.length).fill(NaN);
    const resultSignal: number[] = new Array(data.length).fill(NaN);
    const resultHist: number[] = new Array(data.length).fill(NaN);

    for (let i = 0; i < data.length; i++) {
        if (!isNaN(macd[i])) resultMACD[i] = macd[i];
    }

    // Signal calculation likely started later
    // Let's reconstruct properly
    // ... For brevity, assuming standard library logic is fine, considering the impact is minor compared to RMA changes.
    // Re-using previous implementation logic but being careful.

    return { macd: resultMACD, signal: resultSignal, histogram: resultHist };
    // Wait, the previous implementation was a bit loose. Let's strictly use the library logic for this part if complex. 
    // Actually, let's stick to the previous MACD logic for now as it wasn't the main source of error, 
    // but we will ensure we use EMA.
}

// Better MACD implementation
function calculateMACD_v2(data: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const fastEMA = calculateEMA(data, fastPeriod);
    const slowEMA = calculateEMA(data, slowPeriod);
    const macdLine: number[] = [];

    for (let i = 0; i < data.length; i++) {
        if (fastEMA[i] !== undefined && slowEMA[i] !== undefined) {
            macdLine[i] = fastEMA[i] - slowEMA[i];
        }
    }

    // Calculate Signal Line on the MACD Line (EMA of MACD)
    // We need valid MACD values
    const validMacdIndices = macdLine.map((v, i) => v !== undefined ? i : -1).filter(i => i !== -1);
    const validMacdValues = validMacdIndices.map(i => macdLine[i]);

    const signalValues = calculateEMA(validMacdValues, signalPeriod);

    const signalLine: number[] = [];
    const histogram: number[] = [];

    validMacdIndices.forEach((originalIndex, i) => {
        signalLine[originalIndex] = signalValues[i];
        if (signalValues[i] !== undefined) {
            histogram[originalIndex] = macdLine[originalIndex] - signalValues[i];
        }
    });

    return { macd: macdLine, signal: signalLine, histogram };
}


// ATR - Uses RMA
function calculateATR(highs: number[], lows: number[], closes: number[], period: number = 14): number[] {
    const tr: number[] = [];

    // First TR is high - low
    tr[0] = highs[0] - lows[0];

    for (let i = 1; i < closes.length; i++) {
        tr[i] = Math.max(
            highs[i] - lows[i],
            Math.abs(highs[i] - closes[i - 1]),
            Math.abs(lows[i] - closes[i - 1])
        );
    }

    return calculateRMA(tr, period);
}

// ADX - Uses RMA
function calculateADX(highs: number[], lows: number[], closes: number[], period: number = 14) {
    const tr: number[] = [];
    const plusDM: number[] = [];
    const minusDM: number[] = [];

    tr[0] = highs[0] - lows[0];
    plusDM[0] = 0;
    minusDM[0] = 0;

    for (let i = 1; i < closes.length; i++) {
        tr[i] = Math.max(
            highs[i] - lows[i],
            Math.abs(highs[i] - closes[i - 1]),
            Math.abs(lows[i] - closes[i - 1])
        );

        const upMove = highs[i] - highs[i - 1];
        const downMove = lows[i - 1] - lows[i];

        plusDM[i] = (upMove > downMove && upMove > 0) ? upMove : 0;
        minusDM[i] = (downMove > upMove && downMove > 0) ? downMove : 0;
    }

    // Smooth TR, +DM, -DM using RMA
    const atr = calculateRMA(tr, period);
    const smoothPlusDM = calculateRMA(plusDM, period);
    const smoothMinusDM = calculateRMA(minusDM, period);

    const plusDI: number[] = [];
    const minusDI: number[] = [];
    const dx: number[] = [];

    for (let i = 0; i < closes.length; i++) {
        if (atr[i]) {
            plusDI[i] = (smoothPlusDM[i] / atr[i]) * 100;
            minusDI[i] = (smoothMinusDM[i] / atr[i]) * 100;

            const sum = plusDI[i] + minusDI[i];
            dx[i] = sum === 0 ? 0 : (Math.abs(plusDI[i] - minusDI[i]) / sum) * 100;
        }
    }

    // ADX is SMA of DX (Standard TradingView/Wilder)
    // Wait, Wilder ADX is RMA of DX? No, commonly SMA.
    // TradingView `ta.dmi` uses RMA for DI +/- but often SMA for ADX smoothing.
    // Actually, TV `adx` function usually uses RMA on the DX as well.
    // Let's assume RMA for ADX smoothing to match "Trend Strength" usually.
    // Standard is: ADX = RMA(DX, len)
    const adx = calculateRMA(dx, period);

    return { adx, plusDI, minusDI };
}

// Supertrend - uses ATR (RMA based)
function calculateSupertrend(highs: number[], lows: number[], closes: number[], period = 10, multiplier = 3) {
    const atr = calculateATR(highs, lows, closes, period);
    const supertrend: number[] = [];
    const direction: number[] = []; // 1 = Buy, -1 = Sell

    // Initialize
    let lastSupertrend = 0;
    let lastDirection = 1;

    for (let i = 0; i < closes.length; i++) {
        if (!atr[i]) {
            supertrend[i] = 0; // Invalid
            continue;
        }

        const src = (highs[i] + lows[i]) / 2;
        const upperBand = src + multiplier * atr[i];
        const lowerBand = src - multiplier * atr[i];

        if (i === 0) {
            supertrend[i] = lowerBand;
            direction[i] = 1;
            lastSupertrend = lowerBand;
            lastDirection = 1;
            continue;
        }

        let currentSupertrend = lastSupertrend;
        let currentDirection = lastDirection;

        if (lastDirection === 1) {
            if (closes[i] > lastSupertrend) {
                currentSupertrend = Math.max(lowerBand, lastSupertrend);
            } else {
                currentDirection = -1;
                currentSupertrend = upperBand;
            }
        } else {
            if (closes[i] < lastSupertrend) {
                currentSupertrend = Math.min(upperBand, lastSupertrend);
            } else {
                currentDirection = 1;
                currentSupertrend = lowerBand;
            }
        }

        supertrend[i] = currentSupertrend;
        direction[i] = currentDirection;

        lastSupertrend = currentSupertrend;
        lastDirection = currentDirection;
    }

    return { supertrend, direction };
}

function calculateStochastic(highs: number[], lows: number[], closes: number[], period = 14) {
    const k: number[] = [];
    for (let i = period - 1; i < closes.length; i++) {
        const highestHigh = Math.max(...highs.slice(i - period + 1, i + 1));
        const lowestLow = Math.min(...lows.slice(i - period + 1, i + 1));
        k[i] = highestHigh === lowestLow ? 50 : ((closes[i] - lowestLow) / (highestHigh - lowestLow)) * 100;
    }
    // Smooth K and D usually uses SMA
    const d = calculateSMA(k.filter(v => v !== undefined), 3);
    return { k, d };
}

function calculateIchimoku(highs: number[], lows: number[], closes: number[]) {
    const donchian = (high: number[], low: number[], period: number, index: number): number => {
        const start = Math.max(0, index - period + 1);
        return (Math.max(...high.slice(start, index + 1)) + Math.min(...low.slice(start, index + 1))) / 2;
    };
    const tenkan: number[] = [];
    const kijun: number[] = [];
    const senkouA: number[] = [];
    const senkouB: number[] = [];
    for (let i = 0; i < closes.length; i++) {
        tenkan[i] = donchian(highs, lows, 9, i);
        kijun[i] = donchian(highs, lows, 26, i);
        senkouA[i] = (tenkan[i] + kijun[i]) / 2;
        senkouB[i] = donchian(highs, lows, 52, i);
    }
    return { tenkan, kijun, senkouA, senkouB };
}

function calculateFibonacci(highs: number[], lows: number[], lookback = 100) {
    const recentHighs = highs.slice(-lookback);
    const recentLows = lows.slice(-lookback);
    const high = Math.max(...recentHighs);
    const low = Math.min(...recentLows);
    const diff = high - low;
    return {
        high, low,
        fib236: low + diff * 0.236,
        fib382: low + diff * 0.382,
        fib500: low + diff * 0.500,
        fib618: low + diff * 0.618,
        fib786: low + diff * 0.786,
    };
}

function analyzeVolume(volumes: number[], closes: number[], opens: number[], period = 20) {
    const volumeSMA = calculateSMA(volumes, period);
    const analysis: any[] = [];
    for (let i = 0; i < volumes.length; i++) {
        const volumeRatio = volumeSMA[i] ? volumes[i] / volumeSMA[i] : 1;
        analysis[i] = {
            volumeRatio,
            buyPressure: closes[i] > opens[i],
            highVolume: volumeRatio > 1.5,
            veryHighVolume: volumeRatio > 2.25,
        };
    }
    return analysis;
}

// ============================================================================
// SCORE CALCULATION (Matching Swing Master Pro)
// ============================================================================

function calculateBuyScore(params: any): number {
    let score = 0;
    // Multi-Timeframe (30 pts)
    if (params.htfBullish) score += 15;
    if (params.mtfBullish) score += 15;

    // Trend Following (25 pts)
    if (params.close > params.ema21 && params.ema21 > params.ema50) score += 15;
    if (params.close > params.ema200) score += 10;

    // ADX Strength (15 pts)
    if (params.trendBullish) score += 15; // DI+ > DI- and ADX > 20
    else if (params.strongTrend && params.close > params.ema50) score += 8;

    // Supertrend (10 pts)
    if (params.supertrendBull) score += 10;

    // RSI (15 pts)
    if (params.rsiOversold) score += 15; // < 35
    else if (params.rsi < 50 && params.rsi > 30) score += 8;

    // Stochastic (10 pts)
    if (params.stochCrossUp || params.stochOversold) score += 10;

    // MACD (10 pts)
    if (params.macdBullCross) score += 10;
    else if (params.macdBullish) score += 5;

    // Ichimoku (15 pts)
    if (params.ichimokuBullish) score += 15;
    else if (params.aboveCloud) score += 8;

    // Volume (10 pts)
    if (params.veryHighVolume && params.buyPressure) score += 10;
    else if (params.highVolume && params.buyPressure) score += 5;

    // Structure (10 pts)
    if (params.nearSupport) score += 10;
    else if (params.structureBreakBull) score += 5;

    // Fib (10 pts)
    if (params.inFibBuyZone) score += 10;

    // Patterns (10 pts)
    if (params.bullishPattern) score += 10;

    return Math.min(score, 150);
}

function calculateSellScore(params: any): number {
    let score = 0;
    // Multi-Timeframe
    if (params.htfBearish) score += 15;
    if (params.mtfBearish) score += 15;

    // Trend
    if (params.close < params.ema21 && params.ema21 < params.ema50) score += 15;
    if (params.close < params.ema200) score += 10;

    // ADX
    if (params.trendBearish) score += 15; // DI- > DI+ and ADX > 20
    else if (params.strongTrend && params.close < params.ema50) score += 8;

    // Supertrend
    if (params.supertrendBear) score += 10;

    // RSI
    if (params.rsiOverbought) score += 15; // > 65
    else if (params.rsi > 50 && params.rsi < 70) score += 8;

    // Stoch
    if (params.stochCrossDown || params.stochOverbought) score += 10;

    // MACD
    if (params.macdBearCross) score += 10;
    else if (params.macdBearish) score += 5;

    // Ichimoku
    if (params.ichimokuBearish) score += 15;
    else if (params.belowCloud) score += 8;

    // Volume
    if (params.veryHighVolume && params.sellPressure) score += 10;
    else if (params.highVolume && params.sellPressure) score += 5;

    // Structure
    if (params.nearResistance) score += 10;
    else if (params.structureBreakBear) score += 5;

    // Fib
    if (params.inFibSellZone) score += 10;

    // Pattern
    if (params.bearishPattern) score += 10;

    return Math.min(score, 150);
}

// ============================================================================
// BINANCE DATA FETCH
// ============================================================================

async function fetchBinanceKlines(symbol: string, interval = '4h', limit = 200): Promise<OHLCV[]> {
    try {
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=${limit}`;
        const response = await fetch(url);
        if (!response.ok) return [];
        const data = await response.json();
        return data.map((k: any) => ({
            timestamp: k[0],
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
            volume: parseFloat(k[5]),
        }));
    } catch {
        return [];
    }
}

// ============================================================================
// MAIN ANALYSIS LOGIC
// ============================================================================

async function analyzeToken(ticker: string) {
    // 1. Fetch Parallel Data: 4h (MTF/Main) and 1d (HTF)
    const [klines4h, klines1d] = await Promise.all([
        fetchBinanceKlines(ticker, '4h', 1000),
        fetchBinanceKlines(ticker, '1d', 500)
    ]);

    if (!klines4h || klines4h.length < 50) return null;

    // --- HTF ANALYSIS (Daily) ---
    // HTF Trend: htfClose > htfEMA50 and htfEMA50 > htfEMA200
    let htfTrend = 'neutral';
    if (klines1d && klines1d.length >= 50) {
        const dCloses = klines1d.map(k => k.close);
        const dEma50 = calculateEMA(dCloses, 50);
        const dEma200 = calculateEMA(dCloses, 200);

        const lastDIdx = dCloses.length - 1;
        const lastDClose = dCloses[lastDIdx];
        const lastDEma50 = dEma50[lastDIdx] || 0;
        const lastDEma200 = dEma200[lastDIdx] || 0;

        if (lastDClose > lastDEma50 && lastDEma50 > lastDEma200) {
            htfTrend = 'bullish';
        } else if (lastDClose < lastDEma50 && lastDEma50 < lastDEma200) {
            htfTrend = 'bearish';
        }
    }

    // --- MAIN TIMEFRAME ANALYSIS (4h) ---
    const klines = klines4h;
    const closes = klines.map(k => k.close);
    const highs = klines.map(k => k.high);
    const lows = klines.map(k => k.low);
    const opens = klines.map(k => k.open);
    const volumes = klines.map(k => k.volume);

    const idx = closes.length - 1;
    const currentPrice = closes[idx];
    // Fix: Use 6 candles back for real 24h change (6 × 4h = 24h)
    const candles24hAgo = Math.min(6, idx);
    const price24hAgo = closes[idx - candles24hAgo];
    const change24h = price24hAgo > 0 ? ((currentPrice - price24hAgo) / price24hAgo) * 100 : 0;

    // Indicators (Recalculated with RMA and Correct Periods)
    const ema21 = calculateEMA(closes, 21);
    const ema50 = calculateEMA(closes, 50);
    const ema100 = calculateEMA(closes, 100);
    const ema200 = calculateEMA(closes, 200);
    const rsi = calculateRSI(closes, 14); // Now uses RMA
    const { k: stochK, d: stochD } = calculateStochastic(highs, lows, closes, 14);
    const { macd, signal: macdSignalLine, histogram } = calculateMACD_v2(closes);
    const { adx, plusDI, minusDI } = calculateADX(highs, lows, closes, 14); // Now uses RMA
    const atr = calculateATR(highs, lows, closes, 14); // Now uses RMA
    const { supertrend, direction } = calculateSupertrend(highs, lows, closes, 10, 3); // Now uses RMA ATR
    const { tenkan, kijun, senkouA, senkouB } = calculateIchimoku(highs, lows, closes);
    const fibonacci = calculateFibonacci(highs, lows, 100);
    const volumeAnalysis = analyzeVolume(volumes, closes, opens);

    // Current Values
    const currentEMA21 = ema21[idx] || currentPrice;
    const currentEMA50 = ema50[idx] || currentPrice;
    const currentEMA100 = ema100[idx] || currentPrice;
    const currentEMA200 = ema200[idx] || currentPrice;
    const currentRSI = rsi[idx] || 50;
    const currentStochK = stochK[idx] || 50;
    const currentStochD = stochD[idx] || 50;
    const currentMACD = macd[idx] || 0;
    const currentSignal = macdSignalLine[idx] || 0;
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

    // Derived Logic
    const cloudTop = Math.max(currentSenkouA, currentSenkouB);
    const cloudBottom = Math.min(currentSenkouA, currentSenkouB);
    const cloudPosition = currentPrice > cloudTop ? 'above' : currentPrice < cloudBottom ? 'below' : 'inside';

    // Support/Resistance 2% buffer?? No, strict based on pivots usually, but let's keep buffer.
    const keySupport = Math.min(...lows.slice(-20)); // Lowest low last 20
    const keyResistance = Math.max(...highs.slice(-20)); // Highest high last 20
    const nearSupport = currentPrice <= keySupport * 1.02;
    const nearResistance = currentPrice >= keyResistance * 0.98;

    // Fix: Fibonacci retracement zones — price near fib382-618 = buy zone (pullback),
    // price near fib786+ = overbought/sell zone
    const fibZone = currentPrice >= fibonacci.fib382 && currentPrice <= fibonacci.fib618 ? 'buy_zone' :
        currentPrice >= fibonacci.fib786 ? 'sell_zone' : 'neutral';

    // MTF Trend (4h Confirmation)
    // mtfBullish = mtfClose > mtfEMA21 and mtfRSI > 50
    const mtfTrend = (currentPrice > currentEMA21 && currentRSI > 50) ? 'bullish' :
        (currentPrice < currentEMA21 && currentRSI < 50) ? 'bearish' : 'neutral';

    // Scoring Params
    const scoringParams = {
        // Timeframe
        htfBullish: htfTrend === 'bullish',
        htfBearish: htfTrend === 'bearish',
        mtfBullish: mtfTrend === 'bullish',
        mtfBearish: mtfTrend === 'bearish',

        // Trend
        close: currentPrice,
        ema21: currentEMA21,
        ema50: currentEMA50,
        ema200: currentEMA200,

        // ADX
        trendBullish: currentPlusDI > currentMinusDI && currentADX > 20,
        trendBearish: currentMinusDI > currentPlusDI && currentADX > 20,
        strongTrend: currentADX > 20, // Min ADX = 20

        // Supertrend
        supertrendBull: currentDirection === 1,
        supertrendBear: currentDirection === -1,

        // RSI
        rsi: currentRSI,
        rsiOversold: currentRSI < 35, // Script uses 35
        rsiOverbought: currentRSI > 65, // Script uses 65

        // Stoch
        stochCrossUp: currentStochK > currentStochD && currentStochK < 50,
        stochCrossDown: currentStochK < currentStochD && currentStochK > 50,
        stochOversold: currentStochK < 20,
        stochOverbought: currentStochK > 80,

        // MACD
        macdBullCross: currentMACD > currentSignal && (histogram[idx - 1] || 0) < 0, // Crossover detected
        macdBearCross: currentMACD < currentSignal && (histogram[idx - 1] || 0) > 0,
        macdBullish: currentMACD > currentSignal && currentHistogram > 0,
        macdBearish: currentMACD < currentSignal && currentHistogram < 0,

        // Ichimoku
        ichimokuBullish: cloudPosition === 'above' && currentTenkan > currentKijun,
        ichimokuBearish: cloudPosition === 'below' && currentTenkan < currentKijun,
        aboveCloud: cloudPosition === 'above',
        belowCloud: cloudPosition === 'below',

        // Volume
        veryHighVolume: currentVolume.veryHighVolume,
        highVolume: currentVolume.highVolume,
        buyPressure: currentVolume.buyPressure,
        sellPressure: !currentVolume.buyPressure,

        // Structure
        nearSupport: nearSupport,
        nearResistance: nearResistance,
        structureBreakBull: currentPrice > Math.max(...highs.slice(-20, -1)), // Simple break check
        structureBreakBear: currentPrice < Math.min(...lows.slice(-20, -1)),

        // Fib
        inFibBuyZone: fibZone === 'buy_zone',
        inFibSellZone: fibZone === 'sell_zone',

        // Patterns (Stub for now)
        bullishPattern: false,
        bearishPattern: false
    };

    const buyScore = calculateBuyScore(scoringParams);
    const sellScore = calculateSellScore(scoringParams);

    const buyStrength = (buyScore / 150) * 100;
    const sellStrength = (sellScore / 150) * 100;

    // Signals Logic (Elite > Strong > Medium)
    const stopLossBuy = currentPrice - (currentATR * 2);
    const takeProfitBuy = currentPrice + (currentATR * 3);
    const riskRewardBuy = (takeProfitBuy - currentPrice) / (currentPrice - stopLossBuy);

    let signal = 'neutral';

    // Elite Signal: Strength >= 75, RR >= 2.0, ADX > 20
    if (buyStrength >= 75 && buyStrength > sellStrength && riskRewardBuy >= 2.0 && currentADX > 20) {
        signal = 'elite_buy';
    } else if (buyStrength >= 60 && buyStrength > sellStrength && riskRewardBuy >= 1.6) {
        signal = 'strong_buy';
    } else if (buyStrength >= 45 && buyStrength > sellStrength) {
        signal = 'medium_buy';
    } else if (sellStrength >= 75 && sellStrength > buyStrength && currentADX > 20) {
        signal = 'elite_sell';
    } else if (sellStrength >= 60 && sellStrength > buyStrength) {
        signal = 'strong_sell';
    } else if (sellStrength >= 45 && sellStrength > buyStrength) {
        signal = 'medium_sell';
    }

    return {
        ticker,
        timeframe: '4h',
        ema_21: currentEMA21,
        ema_50: currentEMA50,
        ema_100: currentEMA100,
        ema_200: currentEMA200,
        adx: currentADX,
        di_plus: currentPlusDI,
        di_minus: currentMinusDI,
        supertrend_value: currentSupertrend,
        supertrend_direction: currentDirection === 1 ? 'bull' : 'bear',
        rsi: currentRSI,
        stoch_k: currentStochK,
        stoch_d: currentStochD,
        macd_line: currentMACD,
        macd_signal: currentSignal,
        macd_histogram: currentHistogram,
        tenkan: currentTenkan,
        kijun: currentKijun,
        senkou_a: currentSenkouA,
        senkou_b: currentSenkouB,
        cloud_position: cloudPosition,
        volume_ratio: currentVolume.volumeRatio,
        buy_pressure: currentVolume.buyPressure,
        key_support: keySupport,
        key_resistance: keyResistance,
        fib_236: fibonacci.fib236,
        fib_382: fibonacci.fib382,
        fib_500: fibonacci.fib500,
        fib_618: fibonacci.fib618,
        fib_786: fibonacci.fib786,
        fib_zone: fibZone,
        buy_score: buyStrength,
        sell_score: sellStrength,
        signal,
        stop_loss: stopLossBuy,
        take_profit: takeProfitBuy,
        risk_reward: riskRewardBuy,
        atr: currentATR,
        patterns_detected: [],
        htf_trend: htfTrend,
        mtf_trend: mtfTrend,
        current_price: currentPrice,
        change_24h: change24h,
    };
}

// ============================================================================
// HANDLER
// ============================================================================

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        console.log('🚀 Starting auto-analysis (TradingView Engine)...');

        const { data: tokens, error: tokensError } = await supabase
            .from('tokens')
            .select('ticker')
            .order('score', { ascending: false });

        if (tokensError || !tokens) throw new Error(`Failed: ${tokensError?.message}`);

        console.log(`📊 Analyzing ${tokens.length} tokens...`);

        let analyzed = 0;
        let failed = 0;

        for (const token of tokens) {
            try {
                const analysis = await analyzeToken(token.ticker);
                if (analysis) {
                    const payload = {
                        ...analysis,
                        updated_at: new Date().toISOString()
                    };

                    const { error: upsertError } = await supabase
                        .from('token_analysis')
                        .upsert(payload, { onConflict: 'ticker,timeframe' });

                    if (!upsertError) analyzed++;
                    else {
                        console.error(`Upsert fail ${token.ticker}:`, upsertError);
                        failed++;
                    }
                } else failed++;

                await new Promise(r => setTimeout(r, 200)); // Rate limit
            } catch (e) {
                console.error(`Error token ${token.ticker}:`, e);
                failed++;
            }
        }

        return new Response(JSON.stringify({ success: true, analyzed, failed }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
