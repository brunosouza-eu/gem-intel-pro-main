/**
 * Technical Analysis Library
 * Proper implementations of RSI, MACD, EMA, Bollinger Bands, ADX, etc.
 */

// ===== EMA (Exponential Moving Average) =====
export const calculateEMA = (prices: number[], period: number): number => {
    if (prices.length < period) return 0;
    const k = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period; // SMA seed
    for (let i = period; i < prices.length; i++) {
        ema = prices[i] * k + ema * (1 - k);
    }
    return ema;
};

// Full EMA array for MACD calculation
export const calculateEMAArray = (prices: number[], period: number): number[] => {
    if (prices.length < period) return [];
    const k = 2 / (period + 1);
    const result: number[] = [];
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    result.push(ema);
    for (let i = period; i < prices.length; i++) {
        ema = prices[i] * k + ema * (1 - k);
        result.push(ema);
    }
    return result;
};

// ===== SMA (Simple Moving Average) =====
export const calculateSMA = (prices: number[], period: number): number => {
    if (prices.length < period) return 0;
    const slice = prices.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
};

// ===== RSI (Relative Strength Index) - Wilder's Smoothing =====
export const calculateRSI = (prices: number[], period: number = 14): number => {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const diff = prices[i] - prices[i - 1];
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Wilder's smoothing (RMA)
    for (let i = period + 1; i < prices.length; i++) {
        const diff = prices[i] - prices[i - 1];
        if (diff >= 0) {
            avgGain = (avgGain * (period - 1) + diff) / period;
            avgLoss = (avgLoss * (period - 1)) / period;
        } else {
            avgGain = (avgGain * (period - 1)) / period;
            avgLoss = (avgLoss * (period - 1) + Math.abs(diff)) / period;
        }
    }

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
};

// ===== MACD (Moving Average Convergence Divergence) =====
export const calculateMACD = (prices: number[]) => {
    if (prices.length < 26) return { macd: 0, signal: 0, histogram: 0 };

    const ema12 = calculateEMAArray(prices, 12);
    const ema26 = calculateEMAArray(prices, 26);

    // Align arrays - ema26 starts later
    const offset = 26 - 12; // = 14
    const macdLine: number[] = [];
    for (let i = 0; i < ema26.length; i++) {
        macdLine.push(ema12[i + offset] - ema26[i]);
    }

    if (macdLine.length < 9) return { macd: macdLine[macdLine.length - 1] || 0, signal: 0, histogram: 0 };

    // Signal line = 9-period EMA of MACD line
    const signalArray = calculateEMAArray(macdLine, 9);
    const signal = signalArray[signalArray.length - 1] || 0;
    const macd = macdLine[macdLine.length - 1] || 0;

    return {
        macd,
        signal,
        histogram: macd - signal,
    };
};

// ===== Bollinger Bands =====
export const calculateBollingerBands = (prices: number[], period: number = 20, stdDev: number = 2) => {
    if (prices.length < period) return { upper: 0, middle: 0, lower: 0 };
    const sma = calculateSMA(prices, period);
    const slice = prices.slice(-period);
    const variance = slice.reduce((a, b) => a + Math.pow(b - sma, 2), 0) / period;
    const std = Math.sqrt(variance);
    return {
        upper: sma + std * stdDev,
        middle: sma,
        lower: sma - std * stdDev,
    };
};

// ===== ADX (Average Directional Index) - Simplified =====
export const calculateADX = (highs: number[], lows: number[], closes: number[], period: number = 14) => {
    if (highs.length < period + 1) return { adx: 0, diPlus: 0, diMinus: 0 };

    const trueRanges: number[] = [];
    const plusDM: number[] = [];
    const minusDM: number[] = [];

    for (let i = 1; i < highs.length; i++) {
        const highDiff = highs[i] - highs[i - 1];
        const lowDiff = lows[i - 1] - lows[i];

        plusDM.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0);
        minusDM.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0);

        const tr = Math.max(
            highs[i] - lows[i],
            Math.abs(highs[i] - closes[i - 1]),
            Math.abs(lows[i] - closes[i - 1])
        );
        trueRanges.push(tr);
    }

    // Wilder's smoothing for ATR, +DM, -DM
    let atr = trueRanges.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let smoothPlusDM = plusDM.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let smoothMinusDM = minusDM.slice(0, period).reduce((a, b) => a + b, 0) / period;

    const dxValues: number[] = [];

    for (let i = period; i < trueRanges.length; i++) {
        atr = (atr * (period - 1) + trueRanges[i]) / period;
        smoothPlusDM = (smoothPlusDM * (period - 1) + plusDM[i]) / period;
        smoothMinusDM = (smoothMinusDM * (period - 1) + minusDM[i]) / period;

        const diPlus = atr > 0 ? (smoothPlusDM / atr) * 100 : 0;
        const diMinus = atr > 0 ? (smoothMinusDM / atr) * 100 : 0;
        const diSum = diPlus + diMinus;
        const dx = diSum > 0 ? (Math.abs(diPlus - diMinus) / diSum) * 100 : 0;
        dxValues.push(dx);
    }

    if (dxValues.length < period) return { adx: 0, diPlus: 0, diMinus: 0 };

    // ADX = Wilder's smoothing of DX
    let adx = dxValues.slice(0, period).reduce((a, b) => a + b, 0) / period;
    for (let i = period; i < dxValues.length; i++) {
        adx = (adx * (period - 1) + dxValues[i]) / period;
    }

    // Get latest DI values
    const lastATR = atr;
    const diPlus = lastATR > 0 ? (smoothPlusDM / lastATR) * 100 : 0;
    const diMinus = lastATR > 0 ? (smoothMinusDM / lastATR) * 100 : 0;

    return { adx, diPlus, diMinus };
};

// ===== Volume Analysis =====
export const calculateVolumeAnalysis = (volumes: number[], period: number = 20) => {
    if (volumes.length < period) return { current: volumes[volumes.length - 1] || 0, average: 0, ratio: 1 };
    const current = volumes[volumes.length - 1];
    const avg = volumes.slice(-period - 1, -1).reduce((a, b) => a + b, 0) / period;
    return {
        current,
        average: avg,
        ratio: avg > 0 ? current / avg : 1,
    };
};

// ===== Support & Resistance =====
export const calculateSupportResistance = (lows: number[], highs: number[]) => {
    const lookback = Math.min(50, lows.length);
    const recentLows = lows.slice(-lookback);
    const recentHighs = highs.slice(-lookback);
    const min = Math.min(...recentLows);
    const max = Math.max(...recentHighs);
    return {
        support: [min],
        resistance: [max],
    };
};

// ===== Supertrend (Simplified) =====
export const calculateSupertrend = (highs: number[], lows: number[], closes: number[], period: number = 10, multiplier: number = 3) => {
    if (closes.length < period + 1) return { direction: 'neutral' as const, value: 0 };

    // Calculate ATR
    const trueRanges: number[] = [];
    for (let i = 1; i < closes.length; i++) {
        const tr = Math.max(
            highs[i] - lows[i],
            Math.abs(highs[i] - closes[i - 1]),
            Math.abs(lows[i] - closes[i - 1])
        );
        trueRanges.push(tr);
    }

    // Wilder's ATR
    let atr = trueRanges.slice(0, period).reduce((a, b) => a + b, 0) / period;
    for (let i = period; i < trueRanges.length; i++) {
        atr = (atr * (period - 1) + trueRanges[i]) / period;
    }

    const lastClose = closes[closes.length - 1];
    const lastHL2 = (highs[highs.length - 1] + lows[lows.length - 1]) / 2;

    const upperBand = lastHL2 + multiplier * atr;
    const lowerBand = lastHL2 - multiplier * atr;

    return {
        direction: lastClose > lowerBand ? 'up' as const : 'down' as const,
        value: lastClose > lowerBand ? lowerBand : upperBand,
    };
};
