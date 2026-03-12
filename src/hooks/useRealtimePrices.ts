/**
 * 🔥 useRealtimePrices — Binance WebSocket Real-Time Price Engine
 * Rock-solid single connection with proper cleanup.
 * Uses connection ID to prevent old socket onclose from triggering reconnects.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface RealtimePrice {
    price: number;
    prevPrice: number;
    direction: 'up' | 'down' | 'neutral';
    lastUpdate: number;
}

export type RealtimePricesMap = Record<string, RealtimePrice>;

interface UseRealtimePricesReturn {
    prices: RealtimePricesMap;
    connected: boolean;
}

let globalConnectionId = 0;

export const useRealtimePrices = (tickers: string[]): UseRealtimePricesReturn => {
    const [prices, setPrices] = useState<RealtimePricesMap>({});
    const [connected, setConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const pricesRef = useRef<RealtimePricesMap>({});
    const batchRef = useRef<Record<string, number>>({});
    // Each connection gets a unique ID — old sockets check if they're still current
    const activeConnectionIdRef = useRef(0);
    const mountedRef = useRef(true);
    // Stable ticker key to avoid unnecessary reconnections
    const lastTickerKeyRef = useRef('');

    // Batch price updates to avoid excessive re-renders (flush every 600ms)
    useEffect(() => {
        const interval = setInterval(() => {
            const batch = batchRef.current;
            if (Object.keys(batch).length === 0) return;

            const updates = { ...batch };
            batchRef.current = {};

            setPrices(prev => {
                const next = { ...prev };
                for (const [ticker, newPrice] of Object.entries(updates)) {
                    const existing = next[ticker];
                    const prevPrice = existing?.price ?? newPrice;
                    const direction: 'up' | 'down' | 'neutral' =
                        newPrice > prevPrice ? 'up' :
                            newPrice < prevPrice ? 'down' : 'neutral';
                    next[ticker] = {
                        price: newPrice,
                        prevPrice,
                        direction,
                        lastUpdate: Date.now(),
                    };
                }
                pricesRef.current = next;
                return next;
            });
        }, 600);
        return () => clearInterval(interval);
    }, []);

    // Core connect function — each call gets a unique connectionId
    const connect = useCallback((tickersList: string[]) => {
        // Clear any pending reconnect
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = undefined;
        }

        // Generate new connection ID — any old socket's handlers will see they're stale
        const myConnectionId = ++globalConnectionId;
        activeConnectionIdRef.current = myConnectionId;

        // Close existing socket (its onclose will see it's no longer the active connection)
        if (wsRef.current) {
            try { wsRef.current.close(); } catch { }
            wsRef.current = null;
        }

        if (tickersList.length === 0 || !mountedRef.current) {
            setConnected(false);
            return;
        }

        // Build streams
        const streams = tickersList
            .map(t => `${t.toLowerCase()}usdt@miniTicker`)
            .join('/');

        const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

        try {
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                // Only process if this is still the active connection
                if (activeConnectionIdRef.current !== myConnectionId) return;
                if (!mountedRef.current) { ws.close(); return; }
                console.log(`✅ Realtime prices connected (${tickersList.length} tickers)`);
                setConnected(true);
            };

            ws.onmessage = (event) => {
                // Only process if this is still the active connection
                if (activeConnectionIdRef.current !== myConnectionId) return;
                try {
                    const msg = JSON.parse(event.data);
                    if (msg.data && msg.data.s && msg.data.c) {
                        const ticker = msg.data.s.replace('USDT', '');
                        const price = parseFloat(msg.data.c);
                        if (!isNaN(price) && price > 0) {
                            batchRef.current[ticker] = price;
                        }
                    }
                } catch { }
            };

            ws.onerror = () => {
                // Only process if this is still the active connection
                if (activeConnectionIdRef.current !== myConnectionId) return;
                console.warn('⚠️ Realtime prices WebSocket error');
            };

            ws.onclose = () => {
                // KEY FIX: Only reconnect if THIS socket is still the active one.
                // If a new connection was created, this is an OLD socket and we ignore it.
                if (activeConnectionIdRef.current !== myConnectionId) {
                    return; // Old socket — ignore completely
                }

                if (!mountedRef.current) return;

                console.log('🔌 Realtime prices disconnected, reconnecting in 5s...');
                setConnected(false);
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (mountedRef.current && activeConnectionIdRef.current === myConnectionId) {
                        connect(tickersList);
                    }
                }, 5000);
            };

            wsRef.current = ws;
        } catch (err) {
            console.error('Failed to create WebSocket:', err);
            if (mountedRef.current && activeConnectionIdRef.current === myConnectionId) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    connect(tickersList);
                }, 5000);
            }
        }
    }, []);

    // Connect/reconnect only when tickers actually change (by sorted value)
    useEffect(() => {
        const sorted = [...tickers].sort();
        const newKey = sorted.join(',');

        // Skip if tickers haven't actually changed
        if (newKey === lastTickerKeyRef.current) {
            return;
        }
        lastTickerKeyRef.current = newKey;

        // Debounce for 1.5s to let everything settle on mount
        const timeout = setTimeout(() => {
            if (mountedRef.current) {
                connect(sorted);
            }
        }, 1500);

        return () => {
            clearTimeout(timeout);
        };
    }, [tickers.join(','), connect]);

    // Cleanup on unmount
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            // Invalidate any active connection
            activeConnectionIdRef.current = ++globalConnectionId;
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []);

    return { prices, connected };
};
