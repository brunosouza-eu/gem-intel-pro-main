/**
 * Global Real-Time WebSocket Service
 * OPTIMIZED: Throttled updates — notifies subscribers at most every 500ms
 * instead of on every raw WebSocket message (which fires 10-20x/second).
 */

export interface TickerData {
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
    high24h: number;
    low24h: number;
    timestamp: number;
}

type TickerCallback = (data: Map<string, TickerData>) => void;

class BinanceRealtimeService {
    private wsSpot: WebSocket | null = null;
    private wsFutures: WebSocket | null = null;
    private subscribers: Set<TickerCallback> = new Set();
    private tickerData: Map<string, TickerData> = new Map();
    private isConnected = false;

    // Throttle: only flush subscribers every FLUSH_INTERVAL ms
    private flushTimerId: ReturnType<typeof setTimeout> | null = null;
    private readonly FLUSH_INTERVAL = 500; // ms — half-second updates

    constructor() {
        this.connect();
    }

    private connect() {
        this.connectSpot();
        // We do NOT connect Futures by default — it doubles the data for
        // almost no user-visible benefit. Spot already has all major pairs.
        // Uncomment if futures-specific data is needed:
        // this.connectFutures();
    }

    private connectSpot() {
        if (this.wsSpot?.readyState === WebSocket.OPEN) return;

        try {
            this.wsSpot = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

            this.wsSpot.onopen = () => {
                console.log('🟢 Binance Spot WebSocket connected');
                this.isConnected = true;
            };

            this.wsSpot.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.processTickerUpdate(data);
                } catch (error) {
                    // Silently ignore parse errors
                }
            };

            this.wsSpot.onclose = () => {
                console.log('🔴 Binance Spot WebSocket disconnected');
                this.isConnected = false;
                setTimeout(() => this.connectSpot(), 5000);
            };

            this.wsSpot.onerror = () => {
                this.isConnected = false;
            };
        } catch (error) {
            console.error('Failed to connect Spot WebSocket:', error);
        }
    }

    private connectFutures() {
        if (this.wsFutures?.readyState === WebSocket.OPEN) return;

        try {
            this.wsFutures = new WebSocket('wss://fstream.binance.com/ws/!miniTicker@arr');

            this.wsFutures.onopen = () => {
                console.log('🟢 Binance Futures WebSocket connected');
                this.isConnected = true;
            };

            this.wsFutures.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.processTickerUpdate(data);
                } catch (error) {
                    // Silently ignore
                }
            };

            this.wsFutures.onclose = () => {
                console.log('🔴 Binance Futures WebSocket disconnected');
                setTimeout(() => this.connectFutures(), 5000);
            };

            this.wsFutures.onerror = () => { /* noop */ };
        } catch (error) {
            console.error('Failed to connect Futures WebSocket:', error);
        }
    }

    /**
     * Process incoming ticker array (miniTicker format: e, E, s, c, o, h, l, v, q)
     * Writes into the internal Map but does NOT notify subscribers immediately.
     * Subscribers are notified on the next throttled flush.
     */
    private processTickerUpdate(data: any[]) {
        if (!Array.isArray(data)) return;

        for (const ticker of data) {
            const s: string = ticker.s || ticker.e;
            if (!s || !s.endsWith('USDT')) continue;

            const symbol = s.replace('USDT', '');
            const price = parseFloat(ticker.c);
            const open = parseFloat(ticker.o);
            const change24h = open > 0 ? ((price - open) / open) * 100 : 0;

            this.tickerData.set(symbol, {
                symbol,
                price,
                change24h,
                volume: parseFloat(ticker.v) * price,
                high24h: parseFloat(ticker.h),
                low24h: parseFloat(ticker.l),
                timestamp: Date.now(),
            });
        }

        // Schedule a throttled flush (debounced)
        if (!this.flushTimerId) {
            this.flushTimerId = setTimeout(() => {
                this.flushTimerId = null;
                this.notifySubscribers();
            }, this.FLUSH_INTERVAL);
        }
    }

    private notifySubscribers() {
        // Pass the SAME map reference to reduce GC pressure.
        // Subscribers that need a snapshot should copy themselves.
        for (const callback of this.subscribers) {
            try {
                callback(this.tickerData);
            } catch { /* ignore subscriber errors */ }
        }
    }

    subscribe(callback: TickerCallback): () => void {
        this.subscribers.add(callback);

        // Immediately send current snapshot if we have data
        if (this.tickerData.size > 0) {
            callback(this.tickerData);
        }

        return () => {
            this.subscribers.delete(callback);
        };
    }

    getPrice(symbol: string): TickerData | undefined {
        return this.tickerData.get(symbol.toUpperCase());
    }

    getAllPrices(): Map<string, TickerData> {
        return this.tickerData;
    }

    isWebSocketConnected(): boolean {
        return this.isConnected;
    }

    disconnect() {
        if (this.wsSpot) { this.wsSpot.close(); this.wsSpot = null; }
        if (this.wsFutures) { this.wsFutures.close(); this.wsFutures = null; }
        if (this.flushTimerId) { clearTimeout(this.flushTimerId); this.flushTimerId = null; }
        this.subscribers.clear();
    }
}

// Singleton instance — one connection for the entire app
export const binanceRealtime = new BinanceRealtimeService();

// ─── React hook ──────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback, useRef } from 'react';

const TICKER_MAP: Record<string, string> = {
    'ASI': 'FET',
    'RNDR': 'RENDER',
    'MATIC': 'POL',
};

export function useRealtimePrices(symbols?: string[]) {
    // Store prices in a ref to avoid triggering re-renders on every tick.
    // We only set state when we actually have a meaningful change.
    const pricesRef = useRef<Map<string, TickerData>>(new Map());
    const [prices, setPrices] = useState<Map<string, TickerData>>(new Map());
    const [isConnected, setIsConnected] = useState(false);
    const symbolsKey = symbols?.join(',') ?? '';

    useEffect(() => {
        const handleUpdate = (data: Map<string, TickerData>) => {
            if (symbols && symbols.length > 0) {
                // Only rebuild if a watched symbol changed
                let changed = false;
                for (const symbol of symbols) {
                    const binanceSymbol = TICKER_MAP[symbol.toUpperCase()] || symbol.toUpperCase();
                    const ticker = data.get(binanceSymbol);
                    if (ticker) {
                        const existing = pricesRef.current.get(symbol.toUpperCase());
                        if (!existing || existing.price !== ticker.price) {
                            changed = true;
                            break;
                        }
                    }
                }

                if (!changed) return;

                const filtered = new Map<string, TickerData>();
                for (const symbol of symbols) {
                    const binanceSymbol = TICKER_MAP[symbol.toUpperCase()] || symbol.toUpperCase();
                    const ticker = data.get(binanceSymbol);
                    if (ticker) filtered.set(symbol.toUpperCase(), ticker);
                }
                pricesRef.current = filtered;
                setPrices(filtered);
            } else {
                // No filter — just pass the singleton map.
                // Components that need a snapshot should copy it themselves.
                pricesRef.current = data;
                setPrices(data);
            }

            setIsConnected(binanceRealtime.isWebSocketConnected());
        };

        const unsubscribe = binanceRealtime.subscribe(handleUpdate);
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [symbolsKey]);

    const getPrice = useCallback((symbol: string): TickerData | undefined => {
        return pricesRef.current.get(symbol.toUpperCase());
    }, []);

    return { prices, getPrice, isConnected };
}

export function getPriceChangeClass(currentPrice: number, previousPrice: number): string {
    if (currentPrice > previousPrice) return 'text-success';
    if (currentPrice < previousPrice) return 'text-destructive';
    return '';
}
