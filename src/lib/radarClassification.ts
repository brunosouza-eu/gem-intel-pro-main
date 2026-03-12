/**
 * Radar Classification Service v2
 * Recalibrated scoring with proper thresholds
 * Base score 30 — tokens must EARN their way up
 */

import { supabase } from '@/integrations/supabase/client';

export type RadarStatus = 'observacao' | 'acumulacao' | 'gatilho' | 'andamento';

export interface RadarClassification {
    status: RadarStatus;
    score: number;
    reasons: string[];
    technicalSignals: {
        bullish: number;
        bearish: number;
        neutral: number;
    };
}

/**
 * Classifies a token based on technical indicators
 * Score range: 0-100, base = 30
 */
export function classifyToken(analysis: any): RadarClassification {
    const reasons: string[] = [];
    let bullishSignals = 0;
    let bearishSignals = 0;
    let neutralSignals = 0;
    let score = 30; // Low base — must prove bullish

    // ===== 1. TREND (EMAs) =====
    const price = analysis.current_price || analysis.price || 0;
    const ema21 = analysis.ema_21 || analysis.ema?.ema21 || 0;
    const ema50 = analysis.ema_50 || analysis.ema?.ema50 || 0;
    const ema200 = analysis.ema_200 || analysis.ema?.ema200 || 0;

    if (price > 0 && ema21 > 0 && ema50 > 0 && ema200 > 0) {
        if (price > ema21 && ema21 > ema50 && ema50 > ema200) {
            score += 8;
            bullishSignals += 3;
            reasons.push('✅ EMAs alinhadas (bullish)');
        } else if (price > ema21 && ema21 > ema50) {
            score += 5;
            bullishSignals += 2;
            reasons.push('📈 Tendência curto/médio prazo bullish');
        } else if (price > ema200) {
            score += 3;
            bullishSignals += 1;
            reasons.push('📊 Acima da EMA200');
        } else if (price < ema21 && ema21 < ema50 && ema50 < ema200) {
            score -= 10;
            bearishSignals += 3;
            reasons.push('📉 EMAs alinhadas bearish');
        } else if (price < ema21 && ema21 < ema50) {
            score -= 6;
            bearishSignals += 2;
            reasons.push('📉 Abaixo das EMAs curtas');
        } else if (price < ema200) {
            score -= 3;
            bearishSignals += 1;
            reasons.push('⚠️ Abaixo da EMA200');
        }
    }

    // ===== 2. RSI =====
    const rsi = analysis.rsi || 50;

    if (rsi < 30) {
        score += 7;
        bullishSignals += 2;
        reasons.push(`🔥 RSI sobrevendido (${rsi.toFixed?.(1) || rsi})`);
    } else if (rsi > 70) {
        score -= 6;
        bearishSignals += 2;
        reasons.push(`⚠️ RSI sobrecomprado (${rsi.toFixed?.(1) || rsi})`);
    } else if (rsi >= 50 && rsi <= 60) {
        score += 2;
        bullishSignals += 1;
        reasons.push(`📈 RSI saudável (${rsi.toFixed?.(1) || rsi})`);
    } else if (rsi >= 40 && rsi < 50) {
        neutralSignals += 1;
    } else if (rsi > 60 && rsi <= 70) {
        score += 3;
        bullishSignals += 1;
        reasons.push(`📈 RSI forte (${rsi.toFixed?.(1) || rsi})`);
    } else if (rsi >= 30 && rsi < 40) {
        score -= 2;
        bearishSignals += 1;
        reasons.push(`📉 RSI fraco (${rsi.toFixed?.(1) || rsi})`);
    }

    // ===== 3. MACD =====
    const macdLine = analysis.macd_line || analysis.macd?.macd || 0;
    const macdSignal = analysis.macd_signal || analysis.macd?.signal || 0;
    const macdHistogram = analysis.macd_histogram || analysis.macd?.histogram || 0;

    if (macdHistogram !== 0) {
        if (macdHistogram > 0 && macdLine > macdSignal) {
            score += 6;
            bullishSignals += 2;
            reasons.push('📈 MACD bullish');
        } else if (macdHistogram < 0 && macdLine < macdSignal) {
            score -= 5;
            bearishSignals += 2;
            reasons.push('📉 MACD bearish');
        } else if (macdHistogram > 0) {
            score += 3;
            bullishSignals += 1;
            reasons.push('⚡ MACD ganhando força');
        }
    }

    // ===== 4. SUPERTREND =====
    const supertrend = analysis.supertrend_direction || analysis.supertrend?.direction;

    if (supertrend === 'up' || supertrend === 'bull') {
        score += 5;
        bullishSignals += 1;
        reasons.push('🟢 Supertrend bullish');
    } else if (supertrend === 'down' || supertrend === 'bear') {
        score -= 5;
        bearishSignals += 1;
        reasons.push('🔴 Supertrend bearish');
    }

    // ===== 5. ADX =====
    const adx = analysis.adx || analysis.adx?.adx || 0;
    const diPlus = analysis.di_plus || analysis.adx?.diPlus || 0;
    const diMinus = analysis.di_minus || analysis.adx?.diMinus || 0;

    if (adx > 25) {
        if (diPlus > diMinus) {
            score += 6;
            bullishSignals += 2;
            reasons.push(`💪 Tendência forte bullish (ADX: ${typeof adx === 'number' ? adx.toFixed(1) : adx})`);
        } else {
            score -= 4;
            bearishSignals += 1;
            reasons.push(`💪 Tendência forte bearish (ADX: ${typeof adx === 'number' ? adx.toFixed(1) : adx})`);
        }
    } else if (adx < 20) {
        neutralSignals += 1;
    }

    // ===== 6. ICHIMOKU =====
    const cloudPosition = analysis.cloud_position;

    if (cloudPosition === 'above') {
        score += 5;
        bullishSignals += 1;
        reasons.push('☁️ Acima da nuvem Ichimoku');
    } else if (cloudPosition === 'below') {
        score -= 5;
        bearishSignals += 1;
        reasons.push('☁️ Abaixo da nuvem Ichimoku');
    }

    // ===== 7. VOLUME =====
    const volumeRatio = analysis.volume_ratio || analysis.volume?.ratio || 1;

    if (volumeRatio > 2.5) {
        score += 5;
        bullishSignals += 1;
        reasons.push(`📊 Volume explosivo (${typeof volumeRatio === 'number' ? volumeRatio.toFixed(1) : volumeRatio}x)`);
    } else if (volumeRatio > 1.5) {
        score += 3;
        bullishSignals += 1;
        reasons.push(`📊 Volume acima da média (${typeof volumeRatio === 'number' ? volumeRatio.toFixed(1) : volumeRatio}x)`);
    } else if (volumeRatio < 0.5) {
        score -= 2;
        bearishSignals += 1;
        reasons.push('📊 Volume muito baixo');
    }

    // ===== 8. FIBONACCI =====
    const fibZone = analysis.fib_zone;

    if (fibZone === 'buy_zone' || fibZone === 'buy') {
        score += 5;
        bullishSignals += 1;
        reasons.push('🎯 Zona de compra Fibonacci');
    } else if (fibZone === 'sell_zone' || fibZone === 'sell') {
        score -= 4;
        bearishSignals += 1;
        reasons.push('🎯 Zona de venda Fibonacci');
    }

    // ===== 9. SUPPORT/RESISTANCE =====
    const keySupport = analysis.key_support || 0;
    const keyResistance = analysis.key_resistance || 0;

    if (keySupport && price > 0) {
        const distToSupport = ((price - keySupport) / keySupport) * 100;
        if (distToSupport < 3 && distToSupport > 0) {
            score += 5;
            bullishSignals += 1;
            reasons.push(`🛡️ Próximo ao suporte`);
        }
    }

    if (keyResistance && price > 0) {
        const distToResist = ((keyResistance - price) / price) * 100;
        if (distToResist < 2 && distToResist > 0) {
            score -= 2;
            neutralSignals += 1;
            reasons.push(`🚧 Próximo à resistência`);
        }
    }

    // ===== 10. RISK/REWARD =====
    const riskReward = analysis.risk_reward || 0;

    if (riskReward >= 3) {
        score += 5;
        bullishSignals += 1;
        reasons.push(`⚖️ Excelente R:R (1:${typeof riskReward === 'number' ? riskReward.toFixed(1) : riskReward})`);
    } else if (riskReward >= 2) {
        score += 3;
        bullishSignals += 1;
    }

    // ===== FINAL CALCULATION =====
    score = Math.min(100, Math.max(0, Math.round(score)));

    const netSignal = bullishSignals - bearishSignals;

    // Status determination — strict thresholds
    let status: RadarStatus;

    if (score >= 75 && netSignal >= 6) {
        status = 'andamento';
    } else if (score >= 60 && netSignal >= 3) {
        status = 'gatilho';
    } else if (score >= 40 && netSignal >= 1) {
        status = 'acumulacao';
    } else {
        status = 'observacao';
    }

    return {
        status,
        score,
        reasons: reasons.slice(0, 6),
        technicalSignals: {
            bullish: bullishSignals,
            bearish: bearishSignals,
            neutral: neutralSignals,
        },
    };
}

/**
 * Updates token status based on technical analysis
 */
export async function updateTokenWithTechnicalAnalysis(ticker: string): Promise<void> {
    try {
        const { data: analysis, error: analysisError } = await supabase
            .from('token_analysis')
            .select('*')
            .eq('ticker', ticker)
            .order('analyzed_at', { ascending: false })
            .limit(1)
            .single();

        if (analysisError || !analysis) {
            console.log(`No analysis found for ${ticker}`);
            return;
        }

        const classification = classifyToken(analysis);

        const { error: updateError } = await supabase
            .from('tokens')
            .update({
                score: classification.score,
                status: classification.status,
                updated_at: new Date().toISOString(),
            })
            .eq('ticker', ticker);

        if (updateError) {
            console.error(`Error updating ${ticker}:`, updateError);
        }
    } catch (error) {
        console.error(`Error in updateTokenWithTechnicalAnalysis for ${ticker}:`, error);
    }
}

/**
 * Updates ALL tokens with technical analysis
 */
export async function updateAllTokensWithTechnicalAnalysis(): Promise<number> {
    try {
        const { data: analyses, error } = await supabase
            .from('token_analysis')
            .select('*')
            .order('analyzed_at', { ascending: false });

        if (error || !analyses) {
            console.error('Error fetching analyses:', error);
            return 0;
        }

        const latestByTicker = new Map<string, any>();
        for (const analysis of analyses) {
            if (!latestByTicker.has(analysis.ticker)) {
                latestByTicker.set(analysis.ticker, analysis);
            }
        }

        let updated = 0;

        for (const [ticker, analysis] of latestByTicker) {
            const classification = classifyToken(analysis);

            const { error: updateError } = await supabase
                .from('tokens')
                .update({
                    score: classification.score,
                    status: classification.status,
                    updated_at: new Date().toISOString(),
                })
                .eq('ticker', ticker);

            if (!updateError) {
                updated++;
            }
        }

        console.log(`Updated ${updated} tokens with technical analysis`);
        return updated;
    } catch (error) {
        console.error('Error in updateAllTokensWithTechnicalAnalysis:', error);
        return 0;
    }
}

/**
 * Gets classification details for display
 */
export function getStatusDetails(status: RadarStatus): {
    label: string;
    labelEn: string;
    description: string;
    descriptionEn: string;
    color: string;
    icon: string;
} {
    const details = {
        observacao: {
            label: 'Observação',
            labelEn: 'Watching',
            description: 'Sem sinais claros. Aguardando confirmação técnica.',
            descriptionEn: 'No clear signals. Waiting for technical confirmation.',
            color: 'text-info',
            icon: '👀',
        },
        acumulacao: {
            label: 'Acumulação',
            labelEn: 'Accumulation',
            description: 'Indicadores começando a alinhar. Zona de interesse.',
            descriptionEn: 'Indicators aligning. Zone of interest.',
            color: 'text-gem-acumulacao',
            icon: '📈',
        },
        gatilho: {
            label: 'Gatilho',
            labelEn: 'Trigger Ready',
            description: 'Setup formado! Múltiplos indicadores confirmam.',
            descriptionEn: 'Setup formed! Multiple indicators confirm.',
            color: 'text-warning',
            icon: '🎯',
        },
        andamento: {
            label: 'Em Andamento',
            labelEn: 'In Progress',
            description: 'Movimento ativo com forte confluência.',
            descriptionEn: 'Active movement with strong confluence.',
            color: 'text-success',
            icon: '🚀',
        },
    };

    return details[status];
}
