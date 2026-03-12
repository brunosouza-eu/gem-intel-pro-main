import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { binanceRealtime, TickerData } from '@/lib/realtimeService';

interface AlertData {
  id: string;
  token_id: string;
  entry_zone: string | null;
  stop: string | null;
  targets: string | null;
  risk_reward: string | null;
  created_at: string;
  created_by: string | null;
  ticker?: string;
}

interface ParsedLevels {
  entryMin: number | null;
  entryMax: number | null;
  stop: number | null;
  targets: number[];
}

interface AlertPreference {
  token_id: string;
  notify_entry: boolean;
  notify_stop: boolean;
  notify_target: boolean;
  notify_signals: boolean;
}

interface TriggeredLevels {
  entryTriggered: boolean;
  stopTriggered: boolean;
  targetsTriggered: boolean[];
}

export const useAlertNotifications = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [preferences, setPreferences] = useState<Map<string, AlertPreference>>(new Map());
  const triggeredRef = useRef<Map<string, TriggeredLevels>>(new Map());
  const lastPricesRef = useRef<Map<string, number>>(new Map());
  const isInitializedRef = useRef(false);
  const lastCheckRef = useRef(0);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Preload audio
    audioRef.current = new Audio('/sounds/alert.mp3');
    audioRef.current.volume = 0.7;
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
  }, []);

  // Send native browser notification
  const sendNativeNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'crypto-alert-' + Date.now(),
        requireInteraction: true,
      });
    }
  }, []);

  // Text-to-speech notification
  const speakNotification = useCallback((message: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = language === 'pt' ? 'pt-BR' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  // Parse price levels from alert data
  const parseLevels = useCallback((alert: AlertData): ParsedLevels => {
    const result: ParsedLevels = {
      entryMin: null,
      entryMax: null,
      stop: null,
      targets: []
    };

    // Parse entry zone (e.g., "$75.00 - $78.50")
    if (alert.entry_zone) {
      const entryMatch = alert.entry_zone.match(/\$?([\d.]+)\s*-\s*\$?([\d.]+)/);
      if (entryMatch) {
        result.entryMin = parseFloat(entryMatch[1]);
        result.entryMax = parseFloat(entryMatch[2]);
      } else {
        const singleMatch = alert.entry_zone.match(/\$?([\d.]+)/);
        if (singleMatch) {
          result.entryMin = parseFloat(singleMatch[1]) * 0.99;
          result.entryMax = parseFloat(singleMatch[1]) * 1.01;
        }
      }
    }

    // Parse stop (e.g., "$71.20")
    if (alert.stop) {
      const stopMatch = alert.stop.match(/\$?([\d.]+)/);
      if (stopMatch) {
        result.stop = parseFloat(stopMatch[1]);
      }
    }

    // Parse targets
    if (alert.targets) {
      try {
        const parsed = JSON.parse(alert.targets);
        if (Array.isArray(parsed)) {
          result.targets = parsed.map((t: string) => {
            const match = t.match(/\$?([\d.]+)/);
            return match ? parseFloat(match[1]) : 0;
          }).filter(v => v > 0);
        }
      } catch {
        const matches = alert.targets.match(/\$?([\d.]+)/g);
        if (matches) {
          result.targets = matches.map(m => parseFloat(m.replace('$', ''))).filter(v => v > 0);
        }
      }
    }

    return result;
  }, []);

  // Initialize triggered state for an alert
  const initTriggeredState = useCallback((alertId: string, levels: ParsedLevels): TriggeredLevels => {
    const existing = triggeredRef.current.get(alertId);
    if (existing) return existing;

    const state: TriggeredLevels = {
      entryTriggered: false,
      stopTriggered: false,
      targetsTriggered: levels.targets.map(() => false)
    };
    triggeredRef.current.set(alertId, state);
    return state;
  }, []);

  // Fetch user's alerts and preferences - only once
  useEffect(() => {
    if (isInitializedRef.current) return;

    let cancelled = false;

    const fetchUserAlerts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;

        setUserId(user.id);
        isInitializedRef.current = true;

        // Fetch alerts with token info
        const { data: alertsData, error: alertsError } = await supabase
          .from('alerts')
          .select('*, tokens(ticker)')
          .eq('created_by', user.id);

        if (alertsError || cancelled) return;

        if (alertsData) {
          const formattedAlerts = alertsData.map((a: any) => ({
            ...a,
            ticker: a.tokens?.ticker
          }));
          setAlerts(formattedAlerts);
        }

        // Fetch preferences
        const { data: prefs, error: prefsError } = await supabase
          .from('alert_preferences')
          .select('*')
          .eq('user_id', user.id);

        if (prefsError || cancelled) return;

        if (prefs) {
          const prefsMap = new Map<string, AlertPreference>();
          prefs.forEach((p: AlertPreference) => prefsMap.set(p.token_id, p));
          setPreferences(prefsMap);
        }
      } catch (error) {
        // Silently ignore errors to prevent app crash
        console.warn('[AlertNotifications] Error fetching data:', error);
      }
    };

    // Delay initial fetch to let other components load first
    const timer = setTimeout(fetchUserAlerts, 2000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Main price monitoring effect - throttled to avoid performance issues
  useEffect(() => {
    if (!userId || alerts.length === 0) return;

    const handlePriceUpdate = (pricesMap: Map<string, TickerData>) => {
      // Throttle checks to once every 5 seconds
      const now = Date.now();
      if (now - lastCheckRef.current < 5000) return;
      lastCheckRef.current = now;

      for (const alert of alerts) {
        if (!alert.ticker) continue;

        const tickerData = pricesMap.get(alert.ticker.toUpperCase());
        if (!tickerData) continue;

        const currentPrice = tickerData.price;
        const lastPrice = lastPricesRef.current.get(alert.id) || currentPrice;
        lastPricesRef.current.set(alert.id, currentPrice);

        const levels = parseLevels(alert);
        const triggered = initTriggeredState(alert.id, levels);
        const pref = preferences.get(alert.token_id);

        // Check Entry Zone
        if (!triggered.entryTriggered && levels.entryMin && levels.entryMax) {
          const notifyEntry = pref?.notify_entry ?? true;
          if (notifyEntry && currentPrice >= levels.entryMin && currentPrice <= levels.entryMax) {
            triggered.entryTriggered = true;
            triggeredRef.current.set(alert.id, triggered);

            playNotificationSound();
            sendNativeNotification(
              `🎯 ${alert.ticker} na Zona de Entrada!`,
              `Preço: $${currentPrice.toFixed(2)}`
            );
            speakNotification(`${alert.ticker} entrou na zona de compra`);
            toast({
              title: `🎯 ${alert.ticker} NA ZONA DE ENTRADA!`,
              description: `Preço atual: $${currentPrice.toFixed(2)}`,
              className: 'bg-green-600 text-white border-none',
              duration: 15000
            });
          }
        }

        // Check Stop Loss
        if (!triggered.stopTriggered && levels.stop) {
          const notifyStop = pref?.notify_stop ?? true;
          if (notifyStop && currentPrice <= levels.stop) {
            triggered.stopTriggered = true;
            triggeredRef.current.set(alert.id, triggered);

            playNotificationSound();
            sendNativeNotification(
              `⛔ ${alert.ticker} ATINGIU STOP!`,
              `Preço: $${currentPrice.toFixed(2)}`
            );
            speakNotification(`ATENÇÃO! ${alert.ticker} atingiu o stop loss`);
            toast({
              title: `⛔ ${alert.ticker} STOP LOSS!`,
              description: `Preço: $${currentPrice.toFixed(2)}`,
              className: 'bg-red-600 text-white border-none',
              duration: 20000
            });
          }
        }

        // Check Targets
        if (levels.targets.length > 0) {
          const notifyTarget = pref?.notify_target ?? true;

          levels.targets.forEach((target, index) => {
            if (!triggered.targetsTriggered[index] && notifyTarget) {
              if (lastPrice < target && currentPrice >= target) {
                triggered.targetsTriggered[index] = true;
                triggeredRef.current.set(alert.id, triggered);

                const targetNum = index + 1;
                playNotificationSound();
                sendNativeNotification(
                  `🎯 ${alert.ticker} T${targetNum} ATINGIDO!`,
                  `Preço: $${currentPrice.toFixed(2)}`
                );
                speakNotification(`${alert.ticker} atingiu o alvo ${targetNum}`);
                toast({
                  title: `🎯 ${alert.ticker} ALVO ${targetNum}!`,
                  description: `Preço: $${currentPrice.toFixed(2)}`,
                  className: 'bg-primary text-white border-none',
                  duration: 15000
                });
              }
            }
          });
        }
      }
    };

    const unsubscribe = binanceRealtime.subscribe(handlePriceUpdate);
    return () => unsubscribe();
  }, [userId, alerts, preferences, parseLevels, initTriggeredState, playNotificationSound, sendNativeNotification, speakNotification, toast]);

  return { alerts };
};