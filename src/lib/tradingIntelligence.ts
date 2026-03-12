/**
 * Professional Trading Intelligence Engine
 * Sistema avançado de análise com detecção de setups e contexto de mercado
 */

import { SwingAnalysis } from '@/hooks/useSwingAnalysis';

// Tipos de Setup Detectáveis
export type SetupType =
    | 'PULLBACK_EMA21'      // Pullback para EMA21 em tendência de alta
    | 'PULLBACK_EMA50'      // Pullback para EMA50 em tendência de alta
    | 'BREAKOUT_RESISTANCE' // Rompimento de resistência com volume
    | 'RSI_OVERSOLD'        // RSI em sobrevenda em tendência de alta
    | 'RSI_DIVERGENCE'      // Divergência bullish no RSI
    | 'GOLDEN_CROSS'        // Cruzamento de ouro (EMA50 > EMA200)
    | 'ICHIMOKU_BREAKOUT'   // Preço rompe acima da nuvem
    | 'SUPERTREND_FLIP'     // Supertrend muda para bullish
    | 'MACD_CROSSOVER'      // Cruzamento bullish do MACD
    | 'VOLUME_SPIKE'        // Spike de volume 2x+ com movimento bullish
    | 'DEMAND_ZONE'         // Preço em zona de demanda (suporte forte)
    | 'FIBONACCI_ZONE'      // Preço em zona de Fibonacci (38.2-61.8%)
    | 'NONE';               // Sem setup claro

// Níveis de Sinal
export type SignalLevel = 'ELITE' | 'FORTE' | 'MODERADO' | 'AGUARDAR' | 'PERIGO';

// Direção do Trade
export type TradeDirection = 'LONG' | 'SHORT' | 'NEUTRAL';

// Trading Mode (used to adapt trade plans and classification)
export type TradingMode = 'sniper' | 'daytrade' | 'swing';

// Hot Zone categories
export type HotZone = 'NA_ZONA' | 'PROXIMO' | 'FORMANDO' | 'DISTANTE';

// Resultado da Análise Inteligente
export interface SmartSignal {
    ticker: string;
    direction: TradeDirection;
    level: SignalLevel;
    setupType: SetupType;
    setupName: string;
    setupDescription: string;

    // Confluências detectadas
    confluences: string[];
    confluenceCount: number;

    // Trade Plan
    entry: number;
    stopLoss: number;
    takeProfit: number;
    riskReward: number;
    riskPercent: number;
    rewardPercent: number;

    // Hot Zone System
    hotZone: HotZone;
    currentPrice: number;
    distanceToEntry: number;      // Percentage distance (negative = below entry, positive = above)
    distanceToEntryAbs: number;   // Absolute distance in $
    isInZone: boolean;            // True if price is in ideal entry range
    urgencyText: string;          // "AGIR AGORA!" | "Aguardar recuo" | etc

    // Contexto
    btcContext: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    relativeStrength: 'STRONGER' | 'WEAKER' | 'NEUTRAL';

    // Scores
    confidenceScore: number;
    technicalScore: number;

    // Detalhes
    reasons: string[];
    warnings: string[];

    // Multi-TP
    tp1: number;             // Partial TP (50% position) at 1.5:1 R:R
    tp2: number;             // Full TP at 2.5:1 R:R
    tp1Pct: number;
    tp2Pct: number;

    // Freshness
    isStale: boolean;         // True if analysis is > 1h old
    dataAge: number;          // Age in minutes

    // Timestamp
    timestamp: Date;
}

// Contexto do BTC (atualizado separadamente)
let btcContext: { trend: string; price: number; change24h: number } | null = null;

/**
 * Atualiza o contexto do BTC para análise de correlação
 */
export function updateBtcContext(
    trend: string,
    price: number,
    change24h: number
): void {
    btcContext = { trend, price, change24h };
}

/**
 * Retorna o contexto atual do BTC
 */
export function getBtcMarketContext(): 'BULLISH' | 'BEARISH' | 'NEUTRAL' {
    if (!btcContext) return 'NEUTRAL';

    if (btcContext.change24h > 2 || btcContext.trend === 'bullish') {
        return 'BULLISH';
    }
    if (btcContext.change24h < -2 || btcContext.trend === 'bearish') {
        return 'BEARISH';
    }
    return 'NEUTRAL';
}

/**
 * Detecta setups baseado nos indicadores técnicos
 */
function detectSetups(analysis: SwingAnalysis): { type: SetupType; name: string; description: string }[] {
    const setups: { type: SetupType; name: string; description: string }[] = [];
    const price = analysis.current_price || 0;
    const ema21 = analysis.ema_21 || 0;
    const ema50 = analysis.ema_50 || 0;
    const ema200 = analysis.ema_200 || 0;
    const rsi = analysis.rsi || 50;
    const supertrend = analysis.supertrend_direction;
    const macdHistogram = analysis.macd_histogram || 0;
    const volumeRatio = analysis.volume_ratio || 1;
    const cloudPosition = analysis.cloud_position;
    const buyScore = analysis.buy_score || 0;
    const change24h = analysis.change_24h || 0;

    // 1. PULLBACK para EMA21 em tendência de alta (STRICT)
    if (
        price > ema200 && // Tendência macro bullish
        price <= ema21 * 1.03 && // Próximo da EMA21 (3% tolerância — mais rígido)
        price >= ema21 * 0.97 &&
        rsi < 55 && rsi > 25 // RSI não saturado
    ) {
        setups.push({
            type: 'PULLBACK_EMA21',
            name: '🎯 Pullback EMA21',
            description: 'Preço próximo da EMA21 em tendência de alta. Zona de entrada.',
        });
    }

    // 2. PULLBACK para EMA50 (STRICT)
    if (
        price > ema200 &&
        price <= ema50 * 1.03 &&
        price >= ema50 * 0.97 &&
        rsi < 50
    ) {
        setups.push({
            type: 'PULLBACK_EMA50',
            name: '💎 Pullback EMA50',
            description: 'Pullback para EMA50. Setup de alta probabilidade.',
        });
    }

    // 3. RSI Oversold (STRICT: ≤30)
    if (
        rsi <= 30 &&
        price > ema200 * 0.95
    ) {
        setups.push({
            type: 'RSI_OVERSOLD',
            name: '🔥 RSI Sobrevenda',
            description: `RSI em ${rsi.toFixed(0)} - sobrevenda. Possível reversão.`,
        });
    }

    // 4. Supertrend Bull (STRICT: buyScore ≥55)
    if (
        supertrend === 'bull' &&
        buyScore >= 55
    ) {
        setups.push({
            type: 'SUPERTREND_FLIP',
            name: '🚀 Supertrend Bull',
            description: 'Supertrend bullish ativo. Tendência de alta confirmada.',
        });
    }

    // 5. MACD Crossover Bullish (relaxed)
    if (
        macdHistogram > 0 &&
        analysis.macd_line !== null &&
        analysis.macd_signal !== null &&
        analysis.macd_line > analysis.macd_signal
    ) {
        setups.push({
            type: 'MACD_CROSSOVER',
            name: '⚡ MACD Bullish',
            description: 'MACD em cruzamento bullish. Momentum positivo.',
        });
    }

    // 6. Ichimoku Breakout (relaxed buyScore)
    if (
        cloudPosition === 'above' &&
        price > ema21 * 0.98
    ) {
        setups.push({
            type: 'ICHIMOKU_BREAKOUT',
            name: '☁️ Acima da Nuvem',
            description: 'Preço acima da nuvem Ichimoku. Tendência bullish.',
        });
    }

    // 7. Volume Spike Bullish (STRICT: ≥2x)
    if (
        volumeRatio >= 2.0 &&
        change24h > 0
    ) {
        setups.push({
            type: 'VOLUME_SPIKE',
            name: '📊 Volume Alto',
            description: `Volume ${volumeRatio.toFixed(1)}x acima da média.`,
        });
    }

    // 8. Fibonacci Zone (STRICT: buyScore ≥45)
    if (
        (analysis.fib_zone === 'buy_zone' || analysis.fib_zone === 'buy') &&
        buyScore >= 45
    ) {
        setups.push({
            type: 'FIBONACCI_ZONE',
            name: '📐 Zona Fibonacci',
            description: 'Preço na zona de retração Fibonacci. Zona de compra.',
        });
    }

    // 9. Demand Zone (relaxed)
    if (
        analysis.key_support &&
        price <= (analysis.key_support * 1.05) &&
        price >= (analysis.key_support * 0.95) &&
        rsi < 50
    ) {
        setups.push({
            type: 'DEMAND_ZONE',
            name: '🛡️ Zona de Demanda',
            description: `Testando suporte em $${analysis.key_support?.toFixed(2)}.`,
        });
    }

    // 10. NEW: Strong Trend Up - Price above all major EMAs
    if (
        price > ema21 &&
        price > ema50 &&
        price > ema200 &&
        ema21 > ema50 &&
        buyScore >= 50
    ) {
        setups.push({
            type: 'GOLDEN_CROSS',
            name: '🌟 Tendência Forte',
            description: 'Preço acima de todas as EMAs. Tendência de alta sólida.',
        });
    }

    // 11. NEW: Breakout with momentum
    if (
        change24h > 5 &&
        volumeRatio >= 1.3 &&
        buyScore >= 45
    ) {
        setups.push({
            type: 'BREAKOUT_RESISTANCE',
            name: '💥 Breakout',
            description: `Movimento de +${change24h.toFixed(1)}% com volume. Momentum forte.`,
        });
    }

    // ===== BEARISH SETUPS (for SHORT signals) =====

    // 12. RSI Overbought
    if (
        rsi >= 70 &&
        price < ema200 * 1.05
    ) {
        setups.push({
            type: 'RSI_OVERSOLD' as SetupType, // reuse type
            name: '🔻 RSI Sobrecompra',
            description: `RSI em ${rsi.toFixed(0)} - sobrecompra. Possível reversão para baixa.`,
        });
    }

    // 13. Supertrend Bear
    if (
        supertrend === 'bear' &&
        (analysis.sell_score || 0) >= 55
    ) {
        setups.push({
            type: 'SUPERTREND_FLIP' as SetupType,
            name: '📉 Supertrend Bear',
            description: 'Supertrend bearish ativo. Tendência de baixa confirmada.',
        });
    }

    // 14. MACD Crossover Bearish
    if (
        macdHistogram < 0 &&
        analysis.macd_line !== null &&
        analysis.macd_signal !== null &&
        analysis.macd_line < analysis.macd_signal
    ) {
        setups.push({
            type: 'MACD_CROSSOVER' as SetupType,
            name: '📉 MACD Bearish',
            description: 'MACD em cruzamento bearish. Momentum negativo.',
        });
    }

    // 15. Below Ichimoku Cloud
    if (
        cloudPosition === 'below' &&
        price < ema21 * 1.02
    ) {
        setups.push({
            type: 'ICHIMOKU_BREAKOUT' as SetupType,
            name: '☁️ Abaixo da Nuvem',
            description: 'Preço abaixo da nuvem Ichimoku. Tendência bearish.',
        });
    }

    // 16. Strong Downtrend
    if (
        price < ema21 &&
        price < ema50 &&
        price < ema200 &&
        ema21 < ema50 &&
        (analysis.sell_score || 0) >= 50
    ) {
        setups.push({
            type: 'GOLDEN_CROSS' as SetupType,
            name: '📉 Tendência de Baixa',
            description: 'Preço abaixo de todas as EMAs. Tendência de baixa forte.',
        });
    }

    return setups;
}

/**
 * Conta confluências técnicas
 */
function countConfluences(analysis: SwingAnalysis): { count: number; weightedScore: number; details: string[] } {
    const confluences: { text: string; weight: number }[] = [];
    const price = analysis.current_price || 0;
    const buyScore = analysis.buy_score || 0;
    const sellScore = analysis.sell_score || 0;
    const isBearishBias = sellScore > buyScore;

    // ===== BULLISH CONFLUENCES =====
    if (!isBearishBias) {
        if (analysis.htf_trend === 'bullish') confluences.push({ text: 'Tendência HTF bullish', weight: 2 });
        if (analysis.mtf_trend === 'bullish') confluences.push({ text: 'Tendência MTF bullish', weight: 2 });
        if (price > (analysis.ema_21 || 0)) confluences.push({ text: 'Preço > EMA21', weight: 1 });
        if ((analysis.ema_21 || 0) > (analysis.ema_50 || 0)) confluences.push({ text: 'EMA21 > EMA50', weight: 1.5 });
        if (price > (analysis.ema_200 || 0)) confluences.push({ text: 'Preço > EMA200', weight: 1.5 });
        if ((analysis.rsi || 0) > 40 && (analysis.rsi || 0) < 70) confluences.push({ text: 'RSI em zona saudável', weight: 1 });
        if ((analysis.rsi || 0) < 30) confluences.push({ text: 'RSI em sobrevenda', weight: 2 });
        if ((analysis.macd_histogram || 0) > 0) confluences.push({ text: 'MACD histograma positivo', weight: 1 });
        if ((analysis.macd_line || 0) > (analysis.macd_signal || 0)) confluences.push({ text: 'MACD linha > sinal', weight: 1.5 });
        if (analysis.supertrend_direction === 'bull') confluences.push({ text: 'Supertrend bullish', weight: 2 });
        if (analysis.cloud_position === 'above') confluences.push({ text: 'Acima da nuvem Ichimoku', weight: 2 });
        if ((analysis.di_plus || 0) > (analysis.di_minus || 0)) confluences.push({ text: 'DI+ > DI-', weight: 1.5 });
        if (analysis.buy_pressure) confluences.push({ text: 'Pressão compradora', weight: 1 });
        if ((analysis.stoch_k || 0) > (analysis.stoch_d || 0) && (analysis.stoch_k || 0) < 80) {
            confluences.push({ text: 'Estocástico bullish', weight: 1 });
        }
    } else {
        // ===== BEARISH CONFLUENCES =====
        if (analysis.htf_trend === 'bearish') confluences.push({ text: 'Tendência HTF bearish', weight: 2 });
        if (analysis.mtf_trend === 'bearish') confluences.push({ text: 'Tendência MTF bearish', weight: 2 });
        if (price < (analysis.ema_21 || Infinity)) confluences.push({ text: 'Preço < EMA21', weight: 1 });
        if ((analysis.ema_21 || 0) < (analysis.ema_50 || 0)) confluences.push({ text: 'EMA21 < EMA50', weight: 1.5 });
        if (price < (analysis.ema_200 || Infinity)) confluences.push({ text: 'Preço < EMA200', weight: 1.5 });
        if ((analysis.rsi || 0) > 30 && (analysis.rsi || 0) < 60) confluences.push({ text: 'RSI em zona saudável', weight: 1 });
        if ((analysis.rsi || 0) > 70) confluences.push({ text: 'RSI em sobrecompra', weight: 2 });
        if ((analysis.macd_histogram || 0) < 0) confluences.push({ text: 'MACD histograma negativo', weight: 1 });
        if ((analysis.macd_line || 0) < (analysis.macd_signal || 0)) confluences.push({ text: 'MACD linha < sinal', weight: 1.5 });
        if (analysis.supertrend_direction === 'bear') confluences.push({ text: 'Supertrend bearish', weight: 2 });
        if (analysis.cloud_position === 'below') confluences.push({ text: 'Abaixo da nuvem Ichimoku', weight: 2 });
        if ((analysis.di_minus || 0) > (analysis.di_plus || 0)) confluences.push({ text: 'DI- > DI+', weight: 1.5 });
        if (!analysis.buy_pressure) confluences.push({ text: 'Pressão vendedora', weight: 1 });
        if ((analysis.stoch_k || 0) < (analysis.stoch_d || 0) && (analysis.stoch_k || 0) > 20) {
            confluences.push({ text: 'Estocástico bearish', weight: 1 });
        }
    }

    // UNIVERSAL confluences
    if ((analysis.adx || 0) > 25) confluences.push({ text: 'ADX > 25 (tendência forte)', weight: 1.5 });
    if ((analysis.volume_ratio || 0) > 1.5) confluences.push({ text: 'Volume acima da média', weight: 1.5 });

    const weightedScore = confluences.reduce((sum, c) => sum + c.weight, 0);
    return { count: confluences.length, weightedScore, details: confluences.map(c => c.text) };
}

/**
 * Mode-specific ATR/TP configuration
 */
function getModeConfig(mode: TradingMode) {
    switch (mode) {
        case 'sniper':
            return { slMultiplier: 1.0, tpMultiplier: 3.0, tp1Multiplier: 1.5, minSlPct: 0.015, idealEntryTolerance: 0.01 };
        case 'daytrade':
            return { slMultiplier: 1.5, tpMultiplier: 2.0, tp1Multiplier: 1.2, minSlPct: 0.02, idealEntryTolerance: 0.03 };
        case 'swing':
        default:
            return { slMultiplier: 2.5, tpMultiplier: 1.5, tp1Multiplier: 1.0, minSlPct: 0.03, idealEntryTolerance: 0.05 };
    }
}

/**
 * Calcula o plano de trade baseado em ATR — ADAPTADO AO MODO
 */
function calculateTradePlan(analysis: SwingAnalysis, mode: TradingMode = 'sniper'): {
    entry: number;
    idealEntry: number;
    stopLoss: number;
    takeProfit: number;
    riskReward: number;
    riskPercent: number;
    rewardPercent: number;
    tp1: number;
    tp2: number;
    tp1Pct: number;
    tp2Pct: number;
} {
    const price = analysis.current_price || 0;
    const atr = analysis.atr || price * 0.03;
    const ema21 = analysis.ema_21 || price;
    const ema50 = analysis.ema_50 || price;
    const support = analysis.key_support || 0;
    const resistance = analysis.key_resistance || price * 1.05;
    const mc = getModeConfig(mode);

    const buyScore = analysis.buy_score || 0;
    const sellScore = analysis.sell_score || 0;
    const isLongBias = buyScore >= sellScore;

    let idealEntry: number;
    let stopLoss: number;
    let takeProfit: number;
    let tp1: number;
    let tp2: number;

    if (isLongBias) {
        const candidates = [ema21, support].filter(p => p > 0 && p < price);
        idealEntry = candidates.length > 0 ? Math.max(...candidates) : price * (1 - mc.idealEntryTolerance);

        stopLoss = Math.max(price - (atr * mc.slMultiplier), support * 0.99);
        if ((price - stopLoss) / price < mc.minSlPct) stopLoss = price * (1 - mc.minSlPct);

        const risk = price - stopLoss;
        takeProfit = price + (risk * mc.tpMultiplier);
        if (resistance > price && resistance < takeProfit) takeProfit = resistance;

        tp1 = price + (risk * mc.tp1Multiplier);
        tp2 = takeProfit;
    } else {
        const candidates = [ema21, resistance].filter(p => p > price);
        idealEntry = candidates.length > 0 ? Math.min(...candidates) : price * (1 + mc.idealEntryTolerance);

        stopLoss = Math.min(price + (atr * mc.slMultiplier), resistance * 1.01);
        if ((stopLoss - price) / price < mc.minSlPct) stopLoss = price * (1 + mc.minSlPct);

        const risk = stopLoss - price;
        takeProfit = price - (risk * mc.tpMultiplier);
        if (support > 0 && support > takeProfit) takeProfit = support;

        tp1 = price - (risk * mc.tp1Multiplier);
        tp2 = takeProfit;
    }

    const riskPercent = Math.abs((price - stopLoss) / price) * 100;
    const rewardPercent = Math.abs((takeProfit - price) / price) * 100;
    const riskReward = riskPercent > 0 ? rewardPercent / riskPercent : 0;
    const tp1Pct = Math.abs((tp1 - price) / price) * 100;
    const tp2Pct = Math.abs((tp2 - price) / price) * 100;

    return {
        entry: price,
        idealEntry,
        stopLoss,
        takeProfit,
        riskReward,
        riskPercent,
        rewardPercent,
        tp1,
        tp2,
        tp1Pct,
        tp2Pct,
    };
}

/**
 * Mode-specific thresholds for signal classification
 */
function getSignalThresholds(mode: TradingMode) {
    switch (mode) {
        case 'sniper':
            return {
                elite: { confl: 6, rr: 2.5 },
                forte: { confl: 4, rr: 2.0 },
                moderado: { confl: 2, rr: 1.5 },
            };
        case 'daytrade':
            return {
                elite: { confl: 5, rr: 2.5 },
                forte: { confl: 3, rr: 1.5 },
                moderado: { confl: 2, rr: 1.0 },
            };
        case 'swing':
        default:
            return {
                elite: { confl: 5, rr: 1.8 },
                forte: { confl: 3, rr: 1.2 },
                moderado: { confl: 2, rr: 0.8 },
            };
    }
}

/**
 * Determina o nível do sinal — ADAPTADO AO MODO
 */
function determineSignalLevel(
    confluenceCount: number,
    riskReward: number,
    btcContext: string,
    mode: TradingMode = 'sniper'
): SignalLevel {
    if (btcContext === 'BEARISH' && confluenceCount < 3) {
        return 'PERIGO';
    }

    const t = getSignalThresholds(mode);

    if (confluenceCount >= t.elite.confl && riskReward >= t.elite.rr) return 'ELITE';
    if (confluenceCount >= t.forte.confl && riskReward >= t.forte.rr) return 'FORTE';
    if (confluenceCount >= t.moderado.confl && riskReward >= t.moderado.rr) return 'MODERADO';

    return 'AGUARDAR';
}

/**
 * Gera warnings baseado na análise
 */
function generateWarnings(analysis: SwingAnalysis, btcContext: string): string[] {
    const warnings: string[] = [];

    if (btcContext === 'BEARISH') {
        warnings.push('⚠️ BTC em tendência de baixa - cuidado com longs');
    }

    if ((analysis.rsi || 0) > 70) {
        warnings.push('⚠️ RSI sobrecomprado - possível correção');
    }

    if ((analysis.adx || 0) < 20) {
        warnings.push('⚠️ ADX baixo - sem tendência clara');
    }

    if ((analysis.volume_ratio || 0) < 0.5) {
        warnings.push('⚠️ Volume muito baixo - breakout pode falhar');
    }

    if (analysis.supertrend_direction === 'bear') {
        warnings.push('⚠️ Supertrend bearish - contra a tendência');
    }

    if (analysis.cloud_position === 'below') {
        warnings.push('⚠️ Abaixo da nuvem Ichimoku');
    }

    return warnings;
}

/**
 * Analisa um token e retorna um SmartSignal — ADAPTADO AO MODO
 */
export function analyzeForSmartSignal(analysis: SwingAnalysis, mode: TradingMode = 'sniper'): SmartSignal {
    const mktContext = getBtcMarketContext();

    // Detectar setups
    const setups = detectSetups(analysis);
    const primarySetup = setups[0] || { type: 'NONE' as SetupType, name: 'Sem Setup', description: 'Aguardando setup válido' };

    // Contar confluências (weighted)
    const { count: confluenceCount, weightedScore, details: confluences } = countConfluences(analysis);

    // Calcular plano de trade — ADAPTADO AO MODO
    const tradePlan = calculateTradePlan(analysis, mode);

    // Determinar nível do sinal — ADAPTADO AO MODO
    const level = determineSignalLevel(confluenceCount, tradePlan.riskReward, mktContext, mode);

    // Token morto (volume morto, sem variação)
    const isDeadToken = (analysis.volume_ratio || 0) < 0.1 || (analysis.atr || 0) <= 0.000001;

    // Determinar direção (require meaningful gap between buy/sell scores)
    let direction: TradeDirection = 'NEUTRAL';
    if (!isDeadToken) {
        const buyScore = analysis.buy_score || 0;
        const sellScore = analysis.sell_score || 0;

        if (buyScore > sellScore + 3) {
            direction = 'LONG';
        } else if (sellScore > buyScore + 3) {
            direction = 'SHORT';
        }
    }

    // BTC filter: If BTC is BEARISH, only block LONGs with very low confluence
    if (direction === 'LONG' && mktContext === 'BEARISH') {
        // Only block if confluence is very low — let decent setups through
        if (confluenceCount < 2) {
            direction = 'NEUTRAL';
        }
    }

    // Gerar reasons baseado nos setups
    const reasons: string[] = setups.map(s => s.description);
    if (reasons.length === 0) {
        reasons.push('Sem confluência técnica suficiente no momento.');
    }

    // Gerar warnings
    const warnings = generateWarnings(analysis, mktContext);

    // Calcular scores (IMPROVED: weighted formula)
    const technicalScore = Math.round(((analysis.buy_score || 0) / 150) * 100);
    // Max weighted score possible is ~16 (realistic max for good signals)
    const maxWeightedScore = 16;
    const confidenceScore = Math.min(100, Math.round((weightedScore / maxWeightedScore) * 100));

    // Força relativa vs BTC
    const btcChange = btcContext?.change24h || 0;
    const tokenChange = analysis.change_24h || 0;
    let relativeStrength: 'STRONGER' | 'WEAKER' | 'NEUTRAL' = 'NEUTRAL';
    if (tokenChange > btcChange + 2) relativeStrength = 'STRONGER';
    if (tokenChange < btcChange - 2) relativeStrength = 'WEAKER';

    // ===== HOT ZONE CALCULATION =====
    const currentPrice = analysis.current_price || 0;
    const idealEntry = tradePlan.idealEntry;

    const distanceToEntryAbs = currentPrice - idealEntry;
    const distanceToEntry = idealEntry > 0 ? ((currentPrice - idealEntry) / idealEntry) * 100 : 0;

    // Determine Hot Zone based on distance
    let hotZone: HotZone;
    let urgencyText: string;
    const absDistance = Math.abs(distanceToEntry);

    if (absDistance <= 1.5) {
        hotZone = 'NA_ZONA';
        urgencyText = '🔴 AGIR AGORA!';
    } else if (absDistance <= 5) {
        hotZone = 'PROXIMO';
        if (distanceToEntry > 0) {
            urgencyText = `⚡ Aguardar recuo de ${absDistance.toFixed(1)}%`;
        } else {
            urgencyText = `⚡ Subindo - entrada em ${absDistance.toFixed(1)}%`;
        }
    } else if (absDistance <= 10) {
        hotZone = 'FORMANDO';
        urgencyText = `⏳ Setup formando (${absDistance.toFixed(1)}% de distância)`;
    } else {
        hotZone = 'DISTANTE';
        urgencyText = `📊 Monitorar (${absDistance.toFixed(1)}% de distância)`;
    }

    const isInZone = hotZone === 'NA_ZONA';

    // ===== FRESHNESS CHECK =====
    const updatedAt = analysis.updated_at ? new Date(analysis.updated_at) : new Date();
    const dataAge = Math.round((Date.now() - updatedAt.getTime()) / (1000 * 60)); // minutes
    const isStale = dataAge > 180; // > 3 hours = stale (analysis data doesn't update every minute)

    return {
        ticker: analysis.ticker,
        direction,
        level,
        setupType: primarySetup.type,
        setupName: primarySetup.name,
        setupDescription: primarySetup.description,
        confluences,
        confluenceCount,
        ...tradePlan,
        // Hot Zone fields
        hotZone,
        currentPrice,
        distanceToEntry,
        distanceToEntryAbs,
        isInZone,
        urgencyText,
        // Context
        btcContext: mktContext,
        relativeStrength,
        confidenceScore,
        technicalScore,
        reasons,
        warnings,
        // Multi-TP
        tp1: tradePlan.tp1,
        tp2: tradePlan.tp2,
        tp1Pct: tradePlan.tp1Pct,
        tp2Pct: tradePlan.tp2Pct,
        // Freshness
        isStale,
        dataAge,
        timestamp: new Date(),
    };
}

/**
 * Analisa todos os tokens e retorna os melhores sinais ordenados
 * @deprecated Use analyzeBatchForMode for mode-aware analysis
 */
export function analyzeBatch(analyses: SwingAnalysis[]): SmartSignal[] {
    return analyzeBatchForMode(analyses, 'sniper');
}

/**
 * Analisa todos os tokens COM MODO — trade plans e classificação adaptados
 */
export function analyzeBatchForMode(analyses: SwingAnalysis[], mode: TradingMode = 'sniper'): SmartSignal[] {
    // Atualizar contexto do BTC primeiro
    const btcAnalysis = analyses.find(a => a.ticker === 'BTC');
    if (btcAnalysis) {
        updateBtcContext(
            btcAnalysis.htf_trend || 'neutral',
            btcAnalysis.current_price || 0,
            btcAnalysis.change_24h || 0
        );
    }

    // Deduplicate: keep only the latest analysis per ticker
    const dedupMap = new Map<string, SwingAnalysis>();
    for (const a of analyses) {
        const existing = dedupMap.get(a.ticker);
        if (!existing) {
            dedupMap.set(a.ticker, a);
        } else {
            const existingTime = new Date((existing as any).analyzed_at || (existing as any).updated_at || 0).getTime();
            const currentTime = new Date((a as any).analyzed_at || (a as any).updated_at || 0).getTime();
            if (currentTime > existingTime) {
                dedupMap.set(a.ticker, a);
            }
        }
    }
    const uniqueAnalyses = Array.from(dedupMap.values());

    // Gerar sinais para todos — COM MODO
    const signals = uniqueAnalyses
        .filter(a => (a.current_price || 0) > 0 && (a.ema_200 || 0) > 0)
        .map(a => analyzeForSmartSignal(a, mode));

    // Ordenar por qualidade
    const levelOrder = { 'ELITE': 5, 'FORTE': 4, 'MODERADO': 3, 'AGUARDAR': 2, 'PERIGO': 1 };

    // Mode-specific secondary sort
    const setupPriority = getSetupPriority(mode);

    return signals.sort((a, b) => {
        const levelDiff = levelOrder[b.level] - levelOrder[a.level];
        if (levelDiff !== 0) return levelDiff;

        // Secondary: prioritize mode-preferred setups
        const aPriority = setupPriority[a.setupType] || 0;
        const bPriority = setupPriority[b.setupType] || 0;
        if (bPriority !== aPriority) return bPriority - aPriority;

        return b.riskReward - a.riskReward;
    });
}

/**
 * Mode-specific setup prioritization
 */
function getSetupPriority(mode: TradingMode): Record<string, number> {
    switch (mode) {
        case 'sniper': // Precision: pullbacks, demand zones, fibonacci
            return {
                'RSI_OVERSOLD': 5, 'DEMAND_ZONE': 5, 'FIBONACCI_ZONE': 4,
                'PULLBACK_EMA21': 4, 'PULLBACK_EMA50': 3,
                'MACD_CROSSOVER': 2, 'SUPERTREND_FLIP': 2,
                'VOLUME_SPIKE': 1, 'BREAKOUT_RESISTANCE': 1,
                'GOLDEN_CROSS': 1, 'ICHIMOKU_BREAKOUT': 1,
            };
        case 'daytrade': // Momentum: MACD, breakouts, volume
            return {
                'MACD_CROSSOVER': 5, 'BREAKOUT_RESISTANCE': 5, 'VOLUME_SPIKE': 4,
                'SUPERTREND_FLIP': 4,
                'PULLBACK_EMA21': 3, 'RSI_OVERSOLD': 3,
                'FIBONACCI_ZONE': 2, 'DEMAND_ZONE': 2,
                'GOLDEN_CROSS': 1, 'ICHIMOKU_BREAKOUT': 1,
            };
        case 'swing': // Trend: macro EMAs, Ichimoku, golden cross
        default:
            return {
                'GOLDEN_CROSS': 5, 'ICHIMOKU_BREAKOUT': 5,
                'SUPERTREND_FLIP': 4, 'PULLBACK_EMA50': 4,
                'MACD_CROSSOVER': 3, 'DEMAND_ZONE': 3,
                'BREAKOUT_RESISTANCE': 2, 'RSI_OVERSOLD': 2,
                'FIBONACCI_ZONE': 2, 'VOLUME_SPIKE': 1,
            };
    }
}

/**
 * Filtra apenas sinais operáveis (R:R >= 2:1)
 */
export function getActionableSignals(signals: SmartSignal[]): SmartSignal[] {
    return signals.filter(s =>
        s.level !== 'AGUARDAR' &&
        s.level !== 'PERIGO' &&
        s.riskReward >= 2
    );
}

/**
 * Filtra sinais por Hot Zone
 */
export function getSignalsByHotZone(signals: SmartSignal[], zone: HotZone): SmartSignal[] {
    return signals.filter(s => s.hotZone === zone);
}

/**
 * Retorna estatísticas de Hot Zones
 */
export function getHotZoneStats(signals: SmartSignal[]): {
    naZona: number;
    proximo: number;
    formando: number;
    distante: number;
    total: number;
} {
    return {
        naZona: signals.filter(s => s.hotZone === 'NA_ZONA').length,
        proximo: signals.filter(s => s.hotZone === 'PROXIMO').length,
        formando: signals.filter(s => s.hotZone === 'FORMANDO').length,
        distante: signals.filter(s => s.hotZone === 'DISTANTE').length,
        total: signals.length,
    };
}

/**
 * Ordena sinais priorizando Hot Zones mais urgentes
 */
export function sortByUrgency(signals: SmartSignal[]): SmartSignal[] {
    const zoneOrder = { 'NA_ZONA': 4, 'PROXIMO': 3, 'FORMANDO': 2, 'DISTANTE': 1 };
    const levelOrder = { 'ELITE': 5, 'FORTE': 4, 'MODERADO': 3, 'AGUARDAR': 2, 'PERIGO': 1 };

    return [...signals].sort((a, b) => {
        // First by zone urgency
        const zoneDiff = zoneOrder[b.hotZone] - zoneOrder[a.hotZone];
        if (zoneDiff !== 0) return zoneDiff;

        // Then by signal level
        const levelDiff = levelOrder[b.level] - levelOrder[a.level];
        if (levelDiff !== 0) return levelDiff;

        // Then by R:R
        return b.riskReward - a.riskReward;
    });
}

/**
 * Formata o sinal para exibição
 */
export function formatSignalDisplay(signal: SmartSignal): {
    color: string;
    bgColor: string;
    icon: string;
    text: string;
} {
    switch (signal.level) {
        case 'ELITE':
            return {
                color: 'text-success',
                bgColor: 'bg-success/20',
                icon: '💎',
                text: 'ELITE',
            };
        case 'FORTE':
            return {
                color: 'text-primary',
                bgColor: 'bg-primary/20',
                icon: '🔥',
                text: 'FORTE',
            };
        case 'MODERADO':
            return {
                color: 'text-info',
                bgColor: 'bg-info/20',
                icon: '⚡',
                text: 'MODERADO',
            };
        case 'PERIGO':
            return {
                color: 'text-destructive',
                bgColor: 'bg-destructive/20',
                icon: '⚠️',
                text: 'PERIGO',
            };
        default:
            return {
                color: 'text-warning',
                bgColor: 'bg-warning/20',
                icon: '⏳',
                text: 'AGUARDAR',
            };
    }
}
