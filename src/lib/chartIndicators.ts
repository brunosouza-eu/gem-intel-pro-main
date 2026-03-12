
/**
 * Chart Indicators Utility
 * Calculations for technical indicators on the client-side
 */

export interface CandleData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

/**
 * Calculate Exponential Moving Average (EMA)
 * @param data Array of prices or candles
 * @param period Period of the EMA (e.g., 21, 50, 200)
 * @returns Array of EMA values corresponding to the input data
 */
export const calculateEMA = (data: number[] | CandleData[], period: number): (number | undefined)[] => {
    const prices = isCandleData(data) ? data.map(d => d.close) : (data as number[]);
    const k = 2 / (period + 1);
    const emaArray: (number | undefined)[] = new Array(prices.length).fill(undefined);

    if (prices.length < period) return emaArray;

    // Calculate initial SMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
        sum += prices[i];
    }
    emaArray[period - 1] = sum / period;

    // Calculate EMA for the rest
    for (let i = period; i < prices.length; i++) {
        const prevEma = emaArray[i - 1] as number;
        emaArray[i] = (prices[i] - prevEma) * k + prevEma;
    }

    return emaArray;
};

/**
 * Update the last EMA value with a new price (for real-time updates)
 * @param currentPrice The new closing price
 * @param prevEma The previous candle's EMA value
 * @param period The period of the EMA
 */
export const updateEMA = (currentPrice: number, prevEma: number | undefined, period: number): number | undefined => {
    if (prevEma === undefined) return undefined;
    const k = 2 / (period + 1);
    return (currentPrice - prevEma) * k + prevEma;
};

// Type guard
function isCandleData(data: number[] | CandleData[]): data is CandleData[] {
    return data.length > 0 && typeof data[0] === 'object' && 'close' in data[0];
}
