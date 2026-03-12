/**
 * Technical Indicators Library (TradingView Parity Edition)
 * Implementação completa de indicadores técnicos para análise de swing trade
 * Baseado no indicador SWING TRADE MASTER PRO do TradingView
 * Updated: Uses RMA (Wilder's Smoothing) for RSI, ATR, ADX
 */

export interface OHLCV {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

// ============================================================================
// EMA - Exponential Moving Average
// ============================================================================
export function calculateEMA(data: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);

    // TradingView Initialization: SMA of first 'period'
    let sum = 0;
    for (let i = 0; i < period && i < data.length; i++) {
        sum += data[i];
    }
    ema[period - 1] = sum / period;

    // Calculate EMA for rest
    for (let i = period; i < data.length; i++) {
        ema[i] = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
    }

    return ema;
}

// ============================================================================
// SMA - Simple Moving Average
// ============================================================================
export function calculateSMA(data: number[], period: number): number[] {
    const sma: number[] = [];

    for (let i = period - 1; i < data.length; i++) {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma[i] = sum / period;
    }

    return sma;
}

// ============================================================================
// RMA - Wilder's Smoothing (Running Moving Average)
// Used in RSI, ATR, ADX
// ============================================================================
export function calculateRMA(data: number[], period: number): number[] {
    const rma: number[] = new Array(data.length).fill(undefined);
    const alpha = 1 / period;

    let firstValidIndex = -1;
    for (let i = 0; i < data.length; i++) {
        if (typeof data[i] === 'number' && !isNaN(data[i])) {
            firstValidIndex = i;
            break;
        }
    }

    // If we don't have enough valid data, return empty array equivalent
    if (firstValidIndex === -1 || firstValidIndex + period > data.length) {
        return new Array(data.length).fill(0);
    }

    // First value is SMA of the first 'period' valid items
    let sum = 0;
    for (let i = firstValidIndex; i < firstValidIndex + period; i++) {
        sum += data[i];
    }

    rma[firstValidIndex + period - 1] = sum / period;

    // Remaining values use RMA formula
    for (let i = firstValidIndex + period; i < data.length; i++) {
        let prev = rma[i - 1];
        if (typeof prev !== 'number' || isNaN(prev)) prev = 0;

        const val = typeof data[i] === 'number' && !isNaN(data[i]) ? data[i] : prev;
        rma[i] = alpha * val + (1 - alpha) * prev;
    }

    return rma;
}

// ============================================================================
// RSI - Relative Strength Index (Uses RMA)
// ============================================================================
export function calculateRSI(data: number[], period: number = 14): number[] {
    const rsi: number[] = [];
    const changes: number[] = [];

    for (let i = 1; i < data.length; i++) {
        changes.push(data[i] - data[i - 1]);
    }

    const gains = changes.map(c => c > 0 ? c : 0);
    const losses = changes.map(c => c < 0 ? Math.abs(c) : 0);

    const avgGain = calculateRMA(gains, period);
    const avgLoss = calculateRMA(losses, period);

    // Align RSI with original data
    for (let i = 0; i < data.length; i++) {
        if (i <= period) continue;

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

// ============================================================================
// MACD - Moving Average Convergence Divergence
// ============================================================================
export interface MACDResult {
    macd: number[];
    signal: number[];
    histogram: number[];
}

export function calculateMACD(
    data: number[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
): MACDResult {
    const fastEMA = calculateEMA(data, fastPeriod);
    const slowEMA = calculateEMA(data, slowPeriod);

    const macd: number[] = [];
    for (let i = 0; i < data.length; i++) {
        if (fastEMA[i] !== undefined && slowEMA[i] !== undefined) {
            macd[i] = fastEMA[i] - slowEMA[i];
        }
    }

    // Signal Line is EMA of MACD
    // Filter undefined to calculate EMA correctly, then map back? 
    // Simplified approach for consistency with server:
    // We calculate EMA only on valid macd values
    const validMacdIndices = macd.map((v, i) => v !== undefined ? i : -1).filter(i => i !== -1);
    const validMacdValues = validMacdIndices.map(i => macd[i]);

    const signalValues = calculateEMA(validMacdValues, signalPeriod);

    const signal: number[] = [];
    const histogram: number[] = [];

    validMacdIndices.forEach((originalIndex, i) => {
        signal[originalIndex] = signalValues[i];
        if (signalValues[i] !== undefined) {
            histogram[originalIndex] = macd[originalIndex] - signalValues[i];
        }
    });

    return { macd, signal, histogram };
}

// ============================================================================
// Stochastic Oscillator
// ============================================================================
export interface StochasticResult {
    k: number[];
    d: number[];
}

export function calculateStochastic(
    highs: number[],
    lows: number[],
    closes: number[],
    period: number = 14,
    smoothK: number = 3,
    smoothD: number = 3 // Not used in standard calculation usually, but standard stoch is K% and D% (SMA of K)
): StochasticResult {
    const k: number[] = [];

    for (let i = period - 1; i < closes.length; i++) {
        const highestHigh = Math.max(...highs.slice(i - period + 1, i + 1));
        const lowestLow = Math.min(...lows.slice(i - period + 1, i + 1));

        if (highestHigh === lowestLow) {
            k[i] = 50;
        } else {
            k[i] = ((closes[i] - lowestLow) / (highestHigh - lowestLow)) * 100;
        }
    }

    const d = calculateSMA(k.filter(v => v !== undefined), 3);

    return { k, d };
}

// ============================================================================
// ADX - Average Directional Index (Uses RMA)
// ============================================================================
export interface ADXResult {
    adx: number[];
    plusDI: number[];
    minusDI: number[];
}

export function calculateADX(
    highs: number[],
    lows: number[],
    closes: number[],
    period: number = 14
): ADXResult {
    const tr: number[] = new Array(closes.length).fill(0);
    const plusDM: number[] = new Array(closes.length).fill(0);
    const minusDM: number[] = new Array(closes.length).fill(0);

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

        plusDM[i] = upMove > downMove && upMove > 0 ? upMove : 0;
        minusDM[i] = downMove > upMove && downMove > 0 ? downMove : 0;
    }

    const atr = calculateRMA(tr, period);
    const smoothPlusDM = calculateRMA(plusDM, period);
    const smoothMinusDM = calculateRMA(minusDM, period);

    const plusDI: number[] = new Array(closes.length).fill(undefined);
    const minusDI: number[] = new Array(closes.length).fill(undefined);
    const dx: number[] = new Array(closes.length).fill(undefined);
    const adx: number[] = new Array(closes.length).fill(undefined);

    for (let i = 0; i < closes.length; i++) {
        if (atr[i] !== undefined && atr[i] > 0 &&
            smoothPlusDM[i] !== undefined &&
            smoothMinusDM[i] !== undefined) {

            plusDI[i] = (smoothPlusDM[i] / atr[i]) * 100;
            minusDI[i] = (smoothMinusDM[i] / atr[i]) * 100;

            const diSum = plusDI[i] + minusDI[i];
            dx[i] = diSum === 0 ? 0 : (Math.abs(plusDI[i] - minusDI[i]) / diSum) * 100;
        }
    }

    const rx = calculateRMA(dx, period);

    // Fill ADX: propagate last valid value forward instead of leaving 0
    let lastValidADX = 0;
    for (let i = 0; i < closes.length; i++) {
        if (rx[i] !== undefined && !isNaN(rx[i]) && rx[i] > 0) {
            lastValidADX = rx[i];
        }
        adx[i] = rx[i] !== undefined && !isNaN(rx[i]) ? rx[i] : lastValidADX;

        // Also ensure plusDI / minusDI are not undefined at the end
        if (plusDI[i] === undefined || isNaN(plusDI[i])) plusDI[i] = 0;
        if (minusDI[i] === undefined || isNaN(minusDI[i])) minusDI[i] = 0;
    }

    return { adx, plusDI, minusDI };
}

// ============================================================================
// ATR - Average True Range (Uses RMA)
// ============================================================================
export function calculateATR(
    highs: number[],
    lows: number[],
    closes: number[],
    period: number = 14
): number[] {
    const tr: number[] = [];

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

// ============================================================================
// Supertrend
// ============================================================================
export interface SupertrendResult {
    supertrend: number[];
    direction: number[]; // 1 = bullish, -1 = bearish
}

export function calculateSupertrend(
    highs: number[],
    lows: number[],
    closes: number[],
    period: number = 10,
    multiplier: number = 3
): SupertrendResult {
    const atr = calculateATR(highs, lows, closes, period);
    const supertrend: number[] = [];
    const direction: number[] = [];

    let lastSupertrend = 0;
    let lastDirection = 1;

    for (let i = 0; i < closes.length; i++) {
        if (!atr[i]) {
            supertrend[i] = 0;
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

// ============================================================================
// Ichimoku Cloud
// ============================================================================
export interface IchimokuResult {
    tenkan: number[];
    kijun: number[];
    senkouA: number[];
    senkouB: number[];
    chikou: number[];
}

export function calculateIchimoku(
    highs: number[],
    lows: number[],
    closes: number[],
    tenkanPeriod: number = 9,
    kijunPeriod: number = 26,
    senkouBPeriod: number = 52
): IchimokuResult {
    const donchian = (high: number[], low: number[], period: number, index: number): number => {
        const start = Math.max(0, index - period + 1);
        const highSlice = high.slice(start, index + 1);
        const lowSlice = low.slice(start, index + 1);
        return (Math.max(...highSlice) + Math.min(...lowSlice)) / 2;
    };

    const tenkan: number[] = [];
    const kijun: number[] = [];
    const senkouA: number[] = [];
    const senkouB: number[] = [];
    const chikou: number[] = [];

    for (let i = 0; i < closes.length; i++) {
        tenkan[i] = donchian(highs, lows, tenkanPeriod, i);
        kijun[i] = donchian(highs, lows, kijunPeriod, i);
        senkouA[i] = (tenkan[i] + kijun[i]) / 2;
        senkouB[i] = donchian(highs, lows, senkouBPeriod, i);
        chikou[i] = closes[i];
    }

    return { tenkan, kijun, senkouA, senkouB, chikou };
}

// ============================================================================
// Fibonacci Retracement
// ============================================================================
export interface FibonacciLevels {
    high: number;
    low: number;
    fib236: number;
    fib382: number;
    fib500: number;
    fib618: number;
    fib786: number;
}

export function calculateFibonacci(
    highs: number[],
    lows: number[],
    lookback: number = 100
): FibonacciLevels {
    const recentHighs = highs.slice(-lookback);
    const recentLows = lows.slice(-lookback);

    const high = Math.max(...recentHighs);
    const low = Math.min(...recentLows);
    const diff = high - low;

    return {
        high,
        low,
        fib236: low + diff * 0.236,
        fib382: low + diff * 0.382,
        fib500: low + diff * 0.500,
        fib618: low + diff * 0.618,
        fib786: low + diff * 0.786,
    };
}

// ============================================================================
// Pattern Recognition
// ============================================================================
export interface CandlePattern {
    hammer: boolean;
    shootingStar: boolean;
    bullishEngulfing: boolean;
    bearishEngulfing: boolean;
    morningStar: boolean;
    eveningStar: boolean;
}

export function detectPatterns(ohlcv: OHLCV[]): CandlePattern[] {
    const patterns: CandlePattern[] = [];

    for (let i = 2; i < ohlcv.length; i++) {
        const current = ohlcv[i];
        const prev = ohlcv[i - 1];
        const prev2 = ohlcv[i - 2];

        const body = Math.abs(current.close - current.open);
        const upperWick = current.high - Math.max(current.open, current.close);
        const lowerWick = Math.min(current.open, current.close) - current.low;

        patterns[i] = {
            // Hammer: small body, long lower wick
            hammer: lowerWick > body * 2 && upperWick < body && current.close > current.open,

            // Shooting Star: small body, long upper wick
            shootingStar: upperWick > body * 2 && lowerWick < body && current.close < current.open,

            // Bullish Engulfing
            bullishEngulfing:
                current.close > current.open &&
                prev.close < prev.open &&
                current.close > prev.open &&
                current.open < prev.close,

            // Bearish Engulfing
            bearishEngulfing:
                current.close < current.open &&
                prev.close > prev.open &&
                current.close < prev.open &&
                current.open > prev.close,

            // Morning Star (3-candle bullish reversal)
            morningStar:
                prev2.close < prev2.open &&
                Math.abs(prev.close - prev.open) < body * 0.3 &&
                current.close > current.open &&
                current.close > (prev2.open + prev2.close) / 2,

            // Evening Star (3-candle bearish reversal)
            eveningStar:
                prev2.close > prev2.open &&
                Math.abs(prev.close - prev.open) < body * 0.3 &&
                current.close < current.open &&
                current.close < (prev2.open + prev2.close) / 2,
        };
    }

    return patterns;
}

// ============================================================================
// Volume Analysis
// ============================================================================
export interface VolumeAnalysis {
    volumeRatio: number;
    buyPressure: boolean;
    highVolume: boolean;
    veryHighVolume: boolean;
}

export function analyzeVolume(
    volumes: number[],
    closes: number[],
    opens: number[],
    period: number = 20,
    multiplier: number = 1.5
): VolumeAnalysis[] {
    const analysis: VolumeAnalysis[] = [];
    const volumeSMA = calculateSMA(volumes, period);

    for (let i = 0; i < volumes.length; i++) {
        const volumeRatio = volumeSMA[i] ? volumes[i] / volumeSMA[i] : 1;

        analysis[i] = {
            volumeRatio,
            buyPressure: closes[i] > opens[i],
            highVolume: volumeRatio > multiplier,
            veryHighVolume: volumeRatio > multiplier * 1.5,
        };
    }

    return analysis;
}
