import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useCreditGuard } from '@/hooks/useCreditGuard';
import { useRealtimePrices } from '@/lib/realtimeService';
import { useAuth } from '@/contexts/AuthContext';

export type AlertType = 'price_above' | 'price_below' | 'pct_change_up' | 'pct_change_down' | 'volume_spike';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

export interface CryptoAlert {
    id: string;
    ticker: string;
    type: AlertType;
    targetValue: number;
    isActive: boolean;
    createdAt: number;
    note?: string;
    triggeredAt?: number;
    priority: AlertPriority;
    recurring: boolean;
    basePrice?: number; // for % change alerts
}

export interface AlertHistoryItem {
    id: string;
    alertId: string;
    ticker: string;
    type: AlertType;
    targetValue: number;
    triggeredPrice: number;
    triggeredAt: number;
    note?: string;
    priority: AlertPriority;
    success: boolean; // true = target hit, false = stop hit
}

export interface AlertStats {
    activeCount: number;
    triggeredToday: number;
    successRate: number;
    totalCreated: number;
}

interface AlertContextType {
    alerts: CryptoAlert[];
    history: AlertHistoryItem[];
    stats: AlertStats;
    addAlert: (alert: Omit<CryptoAlert, 'id' | 'isActive' | 'createdAt'>) => Promise<boolean>;
    removeAlert: (id: string) => void;
    toggleAlert: (id: string) => void;
    clearHistory: () => void;
    playAlertSound: (priority: AlertPriority) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlerts = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlerts must be used within an AlertProvider');
    }
    return context;
};

const getAlertsKey = (userId: string) => `gem_intel_alerts_v2_${userId}`;
const getHistoryKey = (userId: string) => `gem_intel_alert_history_${userId}`;
const getStatsKey = (userId: string) => `gem_intel_alert_stats_total_${userId}`;

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id || 'anonymous';

    const [alerts, setAlerts] = useState<CryptoAlert[]>([]);
    const [history, setHistory] = useState<AlertHistoryItem[]>([]);
    const [totalCreated, setTotalCreated] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data when user changes
    useEffect(() => {
        try {
            const savedAlerts = localStorage.getItem(getAlertsKey(userId));
            if (savedAlerts) {
                setAlerts(JSON.parse(savedAlerts));
            } else if (userId === 'anonymous') {
                const old = localStorage.getItem('gem_intel_alerts_v2');
                if (old) setAlerts(JSON.parse(old));
                else setAlerts([]);
            } else {
                setAlerts([]);
            }

            const savedHistory = localStorage.getItem(getHistoryKey(userId));
            setHistory(savedHistory ? JSON.parse(savedHistory) : []);

            const savedStats = localStorage.getItem(getStatsKey(userId));
            setTotalCreated(savedStats ? parseInt(savedStats, 10) : 0);
        } catch {
            setAlerts([]);
            setHistory([]);
            setTotalCreated(0);
        }
        setIsLoaded(true);
    }, [userId]);

    const { toast } = useToast();
    const { checkAndUse, guardModals } = useCreditGuard();
    const { prices } = useRealtimePrices();
    const processedAlerts = useRef<Set<string>>(new Set());
    const basePricesRef = useRef<Map<string, number>>(new Map());

    // Alert sound using Web Audio API
    const playAlertSound = useCallback((priority: AlertPriority) => {
        try {
            const ctx = new AudioContext();
            const gains: number[] = [];
            const freqs: number[] = [];
            const durations: number[] = [];

            switch (priority) {
                case 'critical':
                    freqs.push(880, 1100, 880, 1100);
                    durations.push(0.15, 0.15, 0.15, 0.3);
                    gains.push(0.4, 0.5, 0.4, 0.5);
                    break;
                case 'high':
                    freqs.push(660, 880, 660);
                    durations.push(0.2, 0.2, 0.3);
                    gains.push(0.35, 0.4, 0.35);
                    break;
                case 'medium':
                    freqs.push(523, 660);
                    durations.push(0.2, 0.3);
                    gains.push(0.3, 0.3);
                    break;
                default: // low
                    freqs.push(440);
                    durations.push(0.3);
                    gains.push(0.2);
            }

            let time = ctx.currentTime;
            freqs.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(gains[i], time);
                gain.gain.exponentialRampToValueAtTime(0.001, time + durations[i]);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(time);
                osc.stop(time + durations[i]);
                time += durations[i] + 0.05;
            });

            setTimeout(() => ctx.close(), 3000);
        } catch (e) {
            console.warn('[AlertSound] Could not play:', e);
        }
    }, []);

    // Persist alerts
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem(getAlertsKey(userId), JSON.stringify(alerts));
    }, [alerts, isLoaded, userId]);

    // Persist history
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem(getHistoryKey(userId), JSON.stringify(history));
    }, [history, isLoaded, userId]);

    // Persist total created
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem(getStatsKey(userId), String(totalCreated));
    }, [totalCreated, isLoaded, userId]);

    // Calculate stats
    const stats = useMemo<AlertStats>(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const triggeredToday = history.filter(h => h.triggeredAt >= todayStart).length;
        const successCount = history.filter(h => h.success).length;
        const successRate = history.length > 0 ? Math.round((successCount / history.length) * 100) : 0;

        return {
            activeCount: alerts.filter(a => a.isActive).length,
            triggeredToday,
            successRate,
            totalCreated,
        };
    }, [alerts, history, totalCreated]);

    // Store base prices for % change alerts
    useEffect(() => {
        alerts.forEach(alert => {
            if ((alert.type === 'pct_change_up' || alert.type === 'pct_change_down') && !basePricesRef.current.has(alert.id)) {
                const tickerData = prices.get(alert.ticker.toUpperCase());
                if (tickerData?.price && !alert.basePrice) {
                    basePricesRef.current.set(alert.id, tickerData.price);
                } else if (alert.basePrice) {
                    basePricesRef.current.set(alert.id, alert.basePrice);
                }
            }
        });
    }, [alerts, prices]);

    // Monitor Prices — react to price updates directly, no polling interval
    useEffect(() => {
        if (alerts.length === 0 || prices.size === 0) return;

        alerts.forEach(alert => {
            if (!alert.isActive || processedAlerts.current.has(alert.id)) return;

            const tickerData = prices.get(alert.ticker.toUpperCase());
            if (!tickerData?.price) return;
            const currentPrice = tickerData.price;

            let triggered = false;

            switch (alert.type) {
                case 'price_above':
                    triggered = currentPrice >= alert.targetValue;
                    break;
                case 'price_below':
                    triggered = currentPrice <= alert.targetValue;
                    break;
                case 'pct_change_up': {
                    const base = alert.basePrice || basePricesRef.current.get(alert.id);
                    if (base) {
                        const change = ((currentPrice - base) / base) * 100;
                        triggered = change >= alert.targetValue;
                    }
                    break;
                }
                case 'pct_change_down': {
                    const base = alert.basePrice || basePricesRef.current.get(alert.id);
                    if (base) {
                        const change = ((base - currentPrice) / base) * 100;
                        triggered = change >= alert.targetValue;
                    }
                    break;
                }
                case 'volume_spike':
                    break;
            }

            if (triggered) {
                triggerAlert(alert, currentPrice);
            }
        });
    }, [alerts, prices]);

    const triggerAlert = (alert: CryptoAlert, currentPrice: number) => {
        processedAlerts.current.add(alert.id);

        // Play sound for ALL priorities
        playAlertSound(alert.priority);
        const historyItem: AlertHistoryItem = {
            id: crypto.randomUUID(),
            alertId: alert.id,
            ticker: alert.ticker,
            type: alert.type,
            targetValue: alert.targetValue,
            triggeredPrice: currentPrice,
            triggeredAt: Date.now(),
            note: alert.note,
            priority: alert.priority,
            success: true,
        };
        setHistory(prev => [historyItem, ...prev].slice(0, 100)); // Keep last 100

        // Browser Notification
        if (Notification.permission === 'granted') {
            const priorityEmoji = alert.priority === 'critical' ? '🚨' : alert.priority === 'high' ? '⚠️' : '🔔';
            new Notification(`${priorityEmoji} ${alert.ticker} Alerta Disparado!`, {
                body: `Preço: $${currentPrice.toFixed(4)} | Alvo: $${alert.targetValue}`,
                icon: '/favicon.ico',
                requireInteraction: alert.priority === 'critical' || alert.priority === 'high',
            });
        }

        // TTS for high/critical
        if (alert.priority === 'high' || alert.priority === 'critical') {
            const speech = new SpeechSynthesisUtterance(`Alerta ${alert.priority === 'critical' ? 'crítico' : 'importante'}! ${alert.ticker} atingiu o alvo de ${currentPrice} dólares`);
            speech.rate = 1.0;
            speech.pitch = 1.0;
            speech.lang = 'pt-BR';
            window.speechSynthesis.speak(speech);
        }

        // Toast
        const priorityColors: Record<AlertPriority, string> = {
            low: 'bg-blue-600 text-white border-none',
            medium: 'bg-primary text-white border-none',
            high: 'bg-orange-600 text-white border-none',
            critical: 'bg-red-600 text-white border-none',
        };

        toast({
            title: `🎯 ALERTA: ${alert.ticker}`,
            description: `Alvo atingido em $${currentPrice.toFixed(4)}!`,
            className: priorityColors[alert.priority],
            duration: alert.priority === 'critical' ? 20000 : 10000,
        });

        // Handle recurring vs one-shot
        if (alert.recurring) {
            // Reset after a delay for recurring alerts
            setTimeout(() => {
                processedAlerts.current.delete(alert.id);
            }, 60000); // 1 minute cooldown
        } else {
            setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, isActive: false, triggeredAt: Date.now() } : a));
        }
    };

    const addAlert = useCallback(async (newAlertData: Omit<CryptoAlert, 'id' | 'isActive' | 'createdAt'>) => {
        if (Notification.permission === 'default') {
            await Notification.requestPermission();
        }

        const canSpend = await checkAndUse('create_alert');
        if (!canSpend) return false;

        const tickerData = prices.get(newAlertData.ticker.toUpperCase());
        const currentPrice = tickerData?.price;
        const newAlert: CryptoAlert = {
            ...newAlertData,
            id: crypto.randomUUID(),
            isActive: true,
            createdAt: Date.now(),
            basePrice: currentPrice || undefined,
        };

        setAlerts(prev => [...prev, newAlert]);
        setTotalCreated(prev => prev + 1);

        toast({
            title: "Alerta Criado! 🔔",
            description: `Monitorando ${newAlert.ticker} | Prioridade: ${newAlert.priority.toUpperCase()} (-1 Crédito)`,
        });

        return true;
    }, [checkAndUse, prices, toast]);

    const removeAlert = useCallback((id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
        processedAlerts.current.delete(id);
    }, []);

    const toggleAlert = useCallback((id: string) => {
        setAlerts(prev => prev.map(a => {
            if (a.id === id) {
                if (!a.isActive) processedAlerts.current.delete(id);
                return { ...a, isActive: !a.isActive };
            }
            return a;
        }));
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    return (
        <AlertContext.Provider value={{
            alerts, history, stats, addAlert, removeAlert, toggleAlert, clearHistory, playAlertSound
        }}>
            {children}
            {guardModals}
        </AlertContext.Provider>
    );
};
