
import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateEMA, updateEMA, CandleData } from '@/lib/chartIndicators';

interface ChartDataHook {
    candleData: CandleData[];
    volumeData: { time: number; value: number; color: string }[];
    ema21Data: { time: number; value: number }[];
    ema50Data: { time: number; value: number }[];
    ema200Data: { time: number; value: number }[];
    currentPrice: number | null;
    isLoading: boolean;
    error: string | null;
    lastCandle: CandleData | null;
    prevEma21: number | undefined;
    prevEma50: number | undefined;
    prevEma200: number | undefined;
}

export const useChartData = (symbol: string, interval: string = '4h'): ChartDataHook => {
    const [candleData, setCandleData] = useState<CandleData[]>([]);
    const [lastCandle, setLastCandle] = useState<CandleData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    // Derived data
    const [ema21Data, setEma21Data] = useState<{ time: number; value: number }[]>([]);
    const [ema50Data, setEma50Data] = useState<{ time: number; value: number }[]>([]);
    const [ema200Data, setEma200Data] = useState<{ time: number; value: number }[]>([]);

    // Fetch historical data
    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}USDT&interval=${interval}&limit=1000`
            );

            if (!response.ok) throw new Error('Failed to fetch history');

            const data = await response.json();

            // Parse Binance data: [time, open, high, low, close, volume, ...]
            const parsedData: CandleData[] = data.map((d: any) => ({
                time: d[0] / 1000, // Lightweight charts uses seconds
                open: parseFloat(d[1]),
                high: parseFloat(d[2]),
                low: parseFloat(d[3]),
                close: parseFloat(d[4]),
                volume: parseFloat(d[5]),
            }));

            // Calculate initial EMAs
            const ema21 = calculateEMA(parsedData, 21);
            const ema50 = calculateEMA(parsedData, 50);
            const ema200 = calculateEMA(parsedData, 200);

            // Create EMA series data (filter undefined)
            const mapEma = (arr: (number | undefined)[]) =>
                parsedData.map((d, i) => ({ time: d.time, value: arr[i] }))
                    .filter((d): d is { time: number; value: number } => d.value !== undefined);

            setEma21Data(mapEma(ema21));
            setEma50Data(mapEma(ema50));
            setEma200Data(mapEma(ema200));

            setCandleData(parsedData);
            setLastCandle(parsedData[parsedData.length - 1]);
            setIsLoading(false);

        } catch (err) {
            console.error('Error fetching history:', err);
            setError(err instanceof Error ? err.message : 'Failed to load chart data');
            setIsLoading(false);
        }
    }, [symbol, interval]);

    // Connect to WebSocket
    useEffect(() => {
        fetchHistory();

        // Close existing connection
        if (wsRef.current) wsRef.current.close();

        const wsParams = `${symbol.toLowerCase()}usdt@kline_${interval}`;
        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${wsParams}`);

        ws.onopen = () => {
            console.log(`[Chart] Connected to ${wsParams}`);
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.e === 'kline') {
                const k = message.k;
                const newCandle: CandleData = {
                    time: k.t / 1000,
                    open: parseFloat(k.o),
                    high: parseFloat(k.h),
                    low: parseFloat(k.l),
                    close: parseFloat(k.c),
                    volume: parseFloat(k.v),
                };

                setLastCandle(newCandle);

                // NOTE: We rely on the component to merge this 'lastCandle' into the series
                // because updating the full 'candleData' array on every tick causes heavy re-renders.
            }
        };

        ws.onerror = (err) => console.error('[Chart] WS Error:', err);

        wsRef.current = ws;

        return () => {
            if (ws.readyState === WebSocket.OPEN) ws.close();
        };
    }, [symbol, interval, fetchHistory]);

    const volumeData = candleData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? '#22c55e' : '#ef4444', // Green if bullish, Red if bearish
    }));

    // Get previous EMA values (for real-time calculation)
    // We need the value BEFORE the current ticking candle.
    // If the last candle in 'candleData' is the open one, we need index length-2?
    // Binance API returns the open candle as the last one.
    // So 'ema21Data[length-2]' is the last CLOSED EMA.

    const getPrevEma = (data: { time: number; value: number }[]) => {
        if (data.length < 2) return undefined;
        return data[data.length - 2].value;
    };

    return {
        candleData,
        volumeData,
        ema21Data,
        ema50Data,
        ema200Data,
        currentPrice: lastCandle?.close ?? null,
        isLoading,
        error,
        lastCandle,
        prevEma21: getPrevEma(ema21Data),
        prevEma50: getPrevEma(ema50Data),
        prevEma200: getPrevEma(ema200Data),
    };
};
