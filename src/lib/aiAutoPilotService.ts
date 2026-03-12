/**
 * 🤖 AI AUTOPILOT SERVICE
 * Orchestrates real-time analysis with AI integration
 */

import { supabase } from '@/integrations/supabase/client';
import { analyzeToken, type MarketAnalysis } from './realtimeAnalysisService';

export interface AIAnalysis {
    summary: string;
    trend_analysis: string;
    momentum: string;
    setup_type: 'BREAKOUT' | 'PULLBACK' | 'REVERSAL' | 'CONSOLIDATION' | 'AGUARDAR';
    entry_price: number;
    stop_loss: number;
    take_profit: number;
    risk_reward: number;
    confluences: string[];
    warnings: string[];
    strategy: string;
    time_horizon: string;
    confidence: number;
}

export interface EnhancedAnalysis extends MarketAnalysis {
    aiAnalysis?: AIAnalysis;
}

/**
 * Request AI analysis for a token
 */
export async function requestAIAnalysis(
    ticker: string,
    marketAnalysis: MarketAnalysis
): Promise<AIAnalysis | null> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            console.error('No session found for AI analysis');
            return null;
        }

        const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-token-ai`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticker,
                    indicators: marketAnalysis.indicators,
                    price: marketAnalysis.price,
                    support: marketAnalysis.support,
                    resistance: marketAnalysis.resistance,
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`AI analysis failed for ${ticker}:`, errorText);
            return null;
        }

        const result = await response.json();
        return result.analysis;
    } catch (error) {
        console.error(`Error requesting AI analysis for ${ticker}:`, error);
        return null;
    }
}

/**
 * Analyze token with AI enhancement
 */
export async function analyzeTokenWithAI(ticker: string): Promise<EnhancedAnalysis | null> {
    try {
        console.log(`[AutoPilot] Analyzing ${ticker} with AI...`);

        // Step 1: Get technical analysis
        const marketAnalysis = await analyzeToken(ticker);
        if (!marketAnalysis) {
            console.error(`[AutoPilot] Failed to get market analysis for ${ticker}`);
            return null;
        }

        // Step 2: Request AI analysis
        const aiAnalysis = await requestAIAnalysis(ticker, marketAnalysis);

        const enhanced: EnhancedAnalysis = {
            ...marketAnalysis,
            aiAnalysis: aiAnalysis || undefined,
        };

        console.log(`[AutoPilot] ✅ ${ticker} analyzed successfully`);
        return enhanced;
    } catch (error) {
        console.error(`[AutoPilot] Error analyzing ${ticker}:`, error);
        return null;
    }
}

/**
 * Batch analyze tokens with AI
 */
export async function batchAnalyzeWithAI(
    tickers: string[],
    onProgress?: (ticker: string, index: number, total: number) => void
): Promise<Map<string, EnhancedAnalysis>> {
    const results = new Map<string, EnhancedAnalysis>();

    console.log(`[AutoPilot] Starting batch analysis for ${tickers.length} tokens...`);

    // Process tokens one by one to avoid rate limits
    for (let i = 0; i < tickers.length; i++) {
        const ticker = tickers[i];

        if (onProgress) {
            onProgress(ticker, i + 1, tickers.length);
        }

        const analysis = await analyzeTokenWithAI(ticker);
        if (analysis) {
            results.set(ticker, analysis);
        }

        // Rate limiting: wait 2 seconds between AI calls
        if (i < tickers.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log(`[AutoPilot] ✅ Batch analysis complete: ${results.size}/${tickers.length} successful`);
    return results;
}

/**
 * Update database with analysis results
 */
export async function saveAnalysisToDatabase(
    ticker: string,
    analysis: EnhancedAnalysis
): Promise<boolean> {
    try {
        const updateData: any = {
            current_price: analysis.price,
            change_24h: analysis.change24h,
            technical_indicators: analysis.indicators,
            support_levels: analysis.support,
            resistance_levels: analysis.resistance,
            last_update: new Date().toISOString(),
        };

        if (analysis.aiAnalysis) {
            updateData.ai_analysis = analysis.aiAnalysis;
            updateData.last_ai_update = new Date().toISOString();

            // Update swing analysis fields based on AI
            updateData.buy_score = Math.round(analysis.aiAnalysis.confidence * 100);
            updateData.entry_price = analysis.aiAnalysis.entry_price;
            updateData.stop_loss = analysis.aiAnalysis.stop_loss;
            updateData.take_profit = analysis.aiAnalysis.take_profit;
            updateData.risk_reward_ratio = analysis.aiAnalysis.risk_reward;
        }

        const { error } = await supabase
            .from('token_analysis')
            .update(updateData)
            .eq('ticker', ticker);

        if (error) {
            console.error(`Error saving analysis for ${ticker}:`, error);
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Error in saveAnalysisToDatabase for ${ticker}:`, error);
        return false;
    }
}

/**
 * AutoPilot: Continuously analyze and update tokens
 */
export class AutoPilot {
    private isRunning = false;
    private intervalId: number | null = null;
    private tickers: string[] = [];
    private updateInterval = 5 * 60 * 1000; // 5 minutes

    constructor(tickers: string[], updateIntervalMs?: number) {
        this.tickers = tickers;
        if (updateIntervalMs) {
            this.updateInterval = updateIntervalMs;
        }
    }

    async start() {
        if (this.isRunning) {
            console.log('[AutoPilot] Already running');
            return;
        }

        console.log(`[AutoPilot] 🚀 Starting with ${this.tickers.length} tokens`);
        this.isRunning = true;

        // Run immediately
        await this.runAnalysisCycle();

        // Then run on interval
        this.intervalId = window.setInterval(() => {
            this.runAnalysisCycle();
        }, this.updateInterval);
    }

    stop() {
        if (!this.isRunning) return;

        console.log('[AutoPilot] ⏸️ Stopping');
        this.isRunning = false;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private async runAnalysisCycle() {
        if (!this.isRunning) return;

        console.log('[AutoPilot] 🔄 Starting analysis cycle...');

        try {
            const analyses = await batchAnalyzeWithAI(
                this.tickers,
                (ticker, index, total) => {
                    console.log(`[AutoPilot] Progress: ${index}/${total} - ${ticker}`);
                }
            );

            // Save all analyses to database
            let savedCount = 0;
            for (const [ticker, analysis] of analyses) {
                const saved = await saveAnalysisToDatabase(ticker, analysis);
                if (saved) savedCount++;
            }

            console.log(`[AutoPilot] ✅ Cycle complete: ${savedCount}/${analyses.size} saved`);
        } catch (error) {
            console.error('[AutoPilot] Error in analysis cycle:', error);
        }
    }

    updateTickers(newTickers: string[]) {
        this.tickers = newTickers;
        console.log(`[AutoPilot] Updated ticker list: ${newTickers.length} tokens`);
    }

    isActive() {
        return this.isRunning;
    }
}

export default {
    analyzeTokenWithAI,
    batchAnalyzeWithAI,
    requestAIAnalysis,
    saveAnalysisToDatabase,
    AutoPilot,
};
