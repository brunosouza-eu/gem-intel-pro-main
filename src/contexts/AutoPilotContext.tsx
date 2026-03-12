/**
 * 🤖 AI AUTOPILOT CONTEXT
 * Manages real-time AI analysis across the application
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { AutoPilot, type EnhancedAnalysis } from '@/lib/aiAutoPilotService';
import { useAuth } from './AuthContext';

interface AIAutoPilotState {
    isActive: boolean;
    lastUpdate: Date | null;
    analysisCount: number;
    currentTicker: string | null;
    progress: { current: number; total: number } | null;
    startAutoPilot: (tickers: string[]) => void;
    stopAutoPilot: () => void;
    analyzeToken: (ticker: string) => Promise<EnhancedAnalysis | null>;
}

const defaultState: AIAutoPilotState = {
    isActive: false,
    lastUpdate: null,
    analysisCount: 0,
    currentTicker: null,
    progress: null,
    startAutoPilot: () => { },
    stopAutoPilot: () => { },
    analyzeToken: async () => null,
};

const AIAutoPilotContext = createContext<AIAutoPilotState>(defaultState);

export const useAIAutoPilot = () => useContext(AIAutoPilotContext);

interface AIAutoPilotProviderProps {
    children: ReactNode;
}

export const AIAutoPilotProvider: React.FC<AIAutoPilotProviderProps> = ({ children }) => {
    const { session } = useAuth();
    const [autoPilot, setAutoPilot] = useState<AutoPilot | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [analysisCount, setAnalysisCount] = useState(0);
    const [currentTicker, setCurrentTicker] = useState<string | null>(null);
    const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

    const startAutoPilot = useCallback((tickers: string[]) => {
        if (!session) {
            console.error('[AutoPilot Context] No session, cannot start');
            return;
        }

        console.log('[AutoPilot Context] Starting with', tickers.length, 'tokens');

        // Stop existing instance
        if (autoPilot) {
            autoPilot.stop();
        }

        // Create new instance
        const pilot = new AutoPilot(tickers, 5 * 60 * 1000); // 5 minutes
        pilot.start();

        setAutoPilot(pilot);
        setIsActive(true);
        setLastUpdate(new Date());
    }, [session, autoPilot]);

    const stopAutoPilot = useCallback(() => {
        if (autoPilot) {
            console.log('[AutoPilot Context] Stopping');
            autoPilot.stop();
            setIsActive(false);
        }
    }, [autoPilot]);

    const analyzeToken = useCallback(async (ticker: string): Promise<EnhancedAnalysis | null> => {
        if (!session) return null;

        setCurrentTicker(ticker);
        const { analyzeTokenWithAI } = await import('@/lib/aiAutoPilotService');
        const result = await analyzeTokenWithAI(ticker);
        setCurrentTicker(null);

        if (result) {
            setAnalysisCount(prev => prev + 1);
            setLastUpdate(new Date());
        }

        return result;
    }, [session]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (autoPilot) {
                autoPilot.stop();
            }
        };
    }, [autoPilot]);

    const value: AIAutoPilotState = {
        isActive,
        lastUpdate,
        analysisCount,
        currentTicker,
        progress,
        startAutoPilot,
        stopAutoPilot,
        analyzeToken,
    };

    return (
        <AIAutoPilotContext.Provider value={value}>
            {children}
        </AIAutoPilotContext.Provider>
    );
};

export default AIAutoPilotProvider;
