import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface BinanceTicker {
    symbol: string;
    price: string;
    priceChangePercent: string;
    volume: string;
    quoteVolume: string;
}

interface TokenData {
    ticker: string;
    name: string;
    current_price: number;
    change_24h: number;
    volume_24h: number;
    score: number;
    status: string;
}

export const useBinanceRealtime = () => {
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);
    const { toast } = useToast();
    const { language } = useLanguage();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

    // Lista de símbolos principais para monitorar
    const SYMBOLS = [
        'btcusdt', 'ethusdt', 'bnbusdt', 'solusdt', 'xrpusdt',
        'adausdt', 'avaxusdt', 'dotusdt', 'maticusdt', 'linkusdt',
        'uniusdt', 'atomusdt', 'nearusdt', 'aptusdt', 'suiusdt',
        'arbusdt', 'opusdt', 'injusdt', 'tiausdt', 'seiusdt',
        'dogeusdt', 'shibusdt', 'pepeusdt', 'wifusdt', 'bonkusdt',
        'renderusdt', 'fetusdt', 'taousdt', 'wldusdt', 'imxusdt',
        'aaveusdt', 'mkrusdt', 'crvusdt', 'ldousdt', 'pendleusdt',
    ];

    // Calcular score baseado em métricas
    const calculateScore = (priceChange: number, volume: number): number => {
        let score = 50;

        // Ajuste por mudança de preço
        if (priceChange > 10) score += 25;
        else if (priceChange > 5) score += 20;
        else if (priceChange > 2) score += 15;
        else if (priceChange > 0) score += 10;
        else if (priceChange > -2) score += 5;
        else if (priceChange > -5) score -= 5;
        else if (priceChange > -10) score -= 15;
        else score -= 25;

        // Ajuste por volume
        if (volume > 1000000000) score += 25;
        else if (volume > 500000000) score += 20;
        else if (volume > 100000000) score += 15;
        else if (volume > 50000000) score += 10;
        else if (volume > 10000000) score += 5;

        return Math.max(0, Math.min(100, Math.round(score)));
    };

    // Determinar status baseado no score
    const determineStatus = (score: number, priceChange: number): string => {
        if (score >= 80 && priceChange > 5) return 'andamento';
        if (score >= 70 && priceChange > 2) return 'gatilho';
        if (score >= 60) return 'acumulacao';
        return 'observacao';
    };

    // Conectar ao WebSocket da Binance
    const connectWebSocket = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        const streams = SYMBOLS.map(s => `${s}@ticker`).join('/');
        const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

        console.log('Connecting to Binance WebSocket...');
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('✅ Connected to Binance WebSocket');
            setConnected(true);
            toast({
                title: language === 'pt' ? 'Conectado!' : 'Connected!',
                description: language === 'pt'
                    ? 'Dados em tempo real ativados'
                    : 'Real-time data enabled',
            });
        };

        ws.onmessage = async (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.data) {
                    const ticker = message.data;
                    const symbol = ticker.s.replace('USDT', '');

                    const price = parseFloat(ticker.c);
                    const priceChange = parseFloat(ticker.P);
                    const volume = parseFloat(ticker.q);

                    const score = calculateScore(priceChange, volume);
                    const status = determineStatus(score, priceChange);

                    // Atualizar no Supabase
                    const { error } = await supabase
                        .from('tokens')
                        .update({
                            current_price: price,
                            change_24h: priceChange,
                            volume_24h: volume,
                            score: score,
                            status: status,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('ticker', symbol);

                    if (error && error.code !== 'PGRST116') { // Ignore "no rows updated"
                        console.error(`Error updating ${symbol}:`, error);
                    }
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnected(false);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setConnected(false);

            // Reconnect after 5 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
                console.log('Reconnecting...');
                connectWebSocket();
            }, 5000);
        };

        wsRef.current = ws;
    }, [language, toast]);

    // Fetch inicial de dados da API REST da Binance
    const fetchBinanceData = useCallback(async () => {
        setLoading(true);
        try {
            const symbols = SYMBOLS.map(s => `"${s.toUpperCase()}"`).join(',');
            const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbols}]`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch from Binance');
            }

            const tickers: BinanceTicker[] = await response.json();

            // Processar e atualizar cada token
            for (const ticker of tickers) {
                const symbol = ticker.symbol.replace('USDT', '');
                const price = parseFloat(ticker.price);
                const priceChange = parseFloat(ticker.priceChangePercent);
                const volume = parseFloat(ticker.quoteVolume);

                const score = calculateScore(priceChange, volume);
                const status = determineStatus(score, priceChange);

                // Atualizar no Supabase
                await supabase
                    .from('tokens')
                    .update({
                        current_price: price,
                        change_24h: priceChange,
                        volume_24h: volume,
                        score: score,
                        status: status,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('ticker', symbol);
            }

            toast({
                title: language === 'pt' ? 'Dados atualizados!' : 'Data updated!',
                description: language === 'pt'
                    ? `${tickers.length} tokens sincronizados`
                    : `${tickers.length} tokens synced`,
            });

            return { success: true, count: tickers.length };
        } catch (error) {
            console.error('Error fetching Binance data:', error);
            toast({
                variant: 'destructive',
                title: language === 'pt' ? 'Erro' : 'Error',
                description: language === 'pt'
                    ? 'Falha ao buscar dados da Binance'
                    : 'Failed to fetch Binance data',
            });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [language, toast]);

    // Iniciar conexão WebSocket ao montar
    useEffect(() => {
        connectWebSocket();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connectWebSocket]);

    return {
        fetchBinanceData,
        loading,
        connected,
        connectWebSocket,
    };
};
