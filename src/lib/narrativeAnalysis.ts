/**
 * Professional Narrative Analysis Generator
 * Transforma dados técnicos em análise narrativa como um analista profissional
 */

export interface AnalysisData {
    ticker: string;
    timeframe: string;
    currentPrice: number;
    change24h: number;

    // Indicadores
    ema21?: number;
    ema50?: number;
    ema100?: number;
    ema200?: number;
    rsi?: number;
    adx?: number;
    diPlus?: number;
    diMinus?: number;
    macdLine?: number;
    macdSignal?: number;
    macdHistogram?: number;
    stochK?: number;
    stochD?: number;
    atr?: number;

    // Ichimoku
    tenkan?: number;
    kijun?: number;
    senkouA?: number;
    senkouB?: number;
    cloudPosition?: string;

    // Supertrend
    supertrendDirection?: string;
    supertrendValue?: number;

    // Volume
    volumeRatio?: number;
    buyPressure?: boolean;

    // Níveis
    keySupport?: number;
    keyResistance?: number;
    fib236?: number;
    fib382?: number;
    fib500?: number;
    fib618?: number;
    fib786?: number;
    fibZone?: string;

    // Scores
    buyScore?: number;
    sellScore?: number;
    signal?: string;

    // Risk
    stopLoss?: number;
    takeProfit?: number;
    riskReward?: number;

    // Tendências
    htfTrend?: string;
    mtfTrend?: string;
    patternsDetected?: string[];
}

function formatPrice(price: number | undefined): string {
    if (!price) return 'N/A';
    if (price < 0.001) return `$${price.toFixed(8)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

function getEmaStructure(data: AnalysisData): string {
    const { currentPrice, ema21, ema50, ema100, ema200 } = data;

    if (!ema21 || !ema50 || !ema200) return '';

    const aboveAll = currentPrice > ema21 && currentPrice > ema50 && currentPrice > ema200;
    const belowAll = currentPrice < ema21 && currentPrice < ema50 && currentPrice < ema200;
    const perfectBull = ema21 > ema50 && ema50 > (ema100 || ema50) && (ema100 || ema50) > ema200;
    const perfectBear = ema21 < ema50 && ema50 < (ema100 || ema50) && (ema100 || ema50) < ema200;

    if (aboveAll && perfectBull) {
        return `📈 **ESTRUTURA BULLISH PERFEITA**: Preço acima de TODAS as médias móveis com alinhamento perfeito (EMA21 > EMA50 > EMA100 > EMA200). Isso é o que chamamos de "esteira rolante" - preço surfando as EMAs como suporte dinâmico.`;
    }
    if (belowAll && perfectBear) {
        return `📉 **ESTRUTURA BEARISH DOMINANTE**: Preço abaixo de todas as médias, com alinhamento vendedor (EMA21 < EMA50 < EMA200). As médias agora funcionam como resistência dinâmica. NÃO compre contra essa estrutura.`;
    }
    if (currentPrice > ema21 && currentPrice < ema200) {
        return `⚠️ **ZONA DE TRANSIÇÃO**: Preço acima da EMA21 (${formatPrice(ema21)}) mas ainda abaixo da EMA200 (${formatPrice(ema200)}). Possível reversão em andamento, mas NÃO confirmada. Smart money observando.`;
    }
    if (currentPrice < ema21 && currentPrice > ema200) {
        return `🔄 **PULLBACK EM TENDÊNCIA DE ALTA**: Correção saudável. Preço perdeu a EMA21 mas mantém EMA200 como suporte macro. Zona de interesse para compradores institucionais.`;
    }

    return `📊 **MÉDIAS MÓVEIS**: EMA21 em ${formatPrice(ema21)}, EMA50 em ${formatPrice(ema50)}, EMA200 em ${formatPrice(ema200)}. Estrutura mista requer atenção aos níveis-chave.`;
}

function getRsiAnalysis(rsi: number | undefined): string {
    if (!rsi) return '';

    if (rsi >= 80) {
        return `🔥 **RSI EXTREMO (${rsi.toFixed(1)})**: Sobrecomprado em nível crítico. O varejo está comprando no TOPO. Historicamente, RSI acima de 80 precede correções de 5-15%. Smart money já está distribuindo para vocês.`;
    }
    if (rsi >= 70) {
        return `⚡ **RSI AQUECIDO (${rsi.toFixed(1)})**: Zona de sobrecompra. NÃO é sinal automático de venda, mas de CAUTELA. Não inicie posições longas aqui - espere pullback para melhores entradas.`;
    }
    if (rsi <= 20) {
        return `💎 **RSI CAPITULAÇÃO (${rsi.toFixed(1)})**: Sobrevenda extrema. Varejo desesperado vendendo no fundo. Esse é o momento que os tubarões começam a acumular silenciosamente.`;
    }
    if (rsi <= 30) {
        return `🎯 **RSI OPORTUNIDADE (${rsi.toFixed(1)})**: Zona de sobrevenda. Historicamente, RSI abaixo de 30 oferece entradas assimétricas. Monitor para confirmação de reversão.`;
    }
    if (rsi >= 50 && rsi <= 60) {
        return `✅ **RSI NEUTRO-BULL (${rsi.toFixed(1)})**: Momentum saudável sem exaustão. Força controlada. Boa zona para continuação de tendência de alta.`;
    }

    return `📊 **RSI ${rsi.toFixed(1)}**: Em zona neutra. Sem extremos para explorar no momento.`;
}

function getAdxAnalysis(adx: number | undefined, diPlus: number | undefined, diMinus: number | undefined): string {
    if (!adx) return '';

    const trend = diPlus && diMinus ? (diPlus > diMinus ? 'COMPRADORA' : 'VENDEDORA') : 'INDEFINIDA';

    if (adx >= 40) {
        return `🚀 **TENDÊNCIA EXPLOSIVA (ADX ${adx.toFixed(1)})**: Força ${trend} excepcional. Não tente prever reversão - SURFE o movimento. ADX acima de 40 = tendência institucional.`;
    }
    if (adx >= 25) {
        return `📈 **TENDÊNCIA VÁLIDA (ADX ${adx.toFixed(1)})**: Força ${trend} confirmada. Movimentos direcionais são operáveis. DI+ ${diPlus?.toFixed(1) || '-'} vs DI- ${diMinus?.toFixed(1) || '-'}.`;
    }
    if (adx < 20) {
        return `⏸️ **MERCADO LATERAL (ADX ${adx.toFixed(1)})**: Sem tendência definida. PERIGO para trend followers. Opere dentro do range ou ESPERE breakout com volume.`;
    }

    return `📊 **ADX ${adx.toFixed(1)}**: Tendência em desenvolvimento. Awaite confirmação acima de 25.`;
}

function getMacdAnalysis(macdLine: number | undefined, macdSignal: number | undefined, macdHistogram: number | undefined): string {
    if (!macdLine || !macdSignal) return '';

    const bullCross = macdLine > macdSignal && (macdHistogram || 0) > 0;
    const bearCross = macdLine < macdSignal && (macdHistogram || 0) < 0;
    const divergence = macdHistogram ? Math.abs(macdHistogram) : 0;

    if (bullCross && divergence > 0) {
        return `🟢 **MACD BULLISH**: Cruzamento comprador ativo. Linha MACD (${macdLine.toFixed(4)}) ACIMA do sinal (${macdSignal.toFixed(4)}). Histograma positivo crescendo = momentum acelerando.`;
    }
    if (bearCross) {
        return `🔴 **MACD BEARISH**: Cruzamento vendedor. Linha MACD abaixo do sinal. Momentum de queda - NÃO compre até reversão do histograma.`;
    }

    return `📊 **MACD**: Linha em ${macdLine.toFixed(4)}, Sinal em ${macdSignal.toFixed(4)}. Histograma: ${macdHistogram?.toFixed(4) || '0'}.`;
}

function getSupertrendAnalysis(direction: string | undefined, value: number | undefined, currentPrice: number): string {
    if (!direction || !value) return '';

    const isBull = direction.toLowerCase().includes('up') || direction.toLowerCase().includes('bull');
    const distance = ((currentPrice - value) / value * 100).toFixed(2);

    if (isBull) {
        return `🟢 **SUPERTREND BULLISH** em ${formatPrice(value)}: Preço ${distance}% acima da linha. Enquanto mantiver acima desse nível = tendência intacta. QUALQUER fechamento abaixo = SAIR.`;
    }
    return `🔴 **SUPERTREND BEARISH** em ${formatPrice(value)}: Resistência ativa. Preço precisa ROMPER e SEGURAR acima para virar bull. Até lá, vendedores no controle.`;
}

function getIchimokuAnalysis(data: AnalysisData): string {
    const { cloudPosition, tenkan, kijun, senkouA, senkouB, currentPrice } = data;

    if (!cloudPosition || !tenkan || !kijun) return '';

    if (cloudPosition === 'above') {
        return `☁️ **ICHIMOKU BULLISH**: Preço ACIMA da nuvem. Tenkan (${formatPrice(tenkan)}) e Kijun (${formatPrice(kijun)}) como suportes. Cloud = zona de compra em pullbacks.`;
    }
    if (cloudPosition === 'below') {
        return `☁️ **ICHIMOKU BEARISH**: Preço ABAIXO da nuvem. Nuvem funciona como resistência pesada. Romper a nuvem é pré-requisito para qualquer longa.`;
    }
    return `☁️ **ICHIMOKU NEUTRO**: Preço DENTRO da nuvem. Zona de indefinição - evite operar até sair da cloud.`;
}

function getVolumeAnalysis(volumeRatio: number | undefined, buyPressure: boolean | undefined): string {
    if (!volumeRatio) return '';

    const pressureText = buyPressure ? 'COMPRADORA' : 'VENDEDORA';

    if (volumeRatio >= 2) {
        return `🔊 **VOLUME EXPLOSIVO (${volumeRatio.toFixed(1)}x média)**: Pressão ${pressureText}. Movimentação institucional detectada. Volume não mente - SIGA o volume.`;
    }
    if (volumeRatio >= 1.5) {
        return `📢 **VOLUME ACIMA DA MÉDIA (${volumeRatio.toFixed(1)}x)**: Interesse ${pressureText} crescente. Movimento tem sustentação.`;
    }
    if (volumeRatio < 0.5) {
        return `🔇 **VOLUME MORTO (${volumeRatio.toFixed(1)}x)**: Mercado sem interesse. Breakouts com volume baixo FALHAM. Espere confirmação.`;
    }

    return `📊 **VOLUME**: ${volumeRatio.toFixed(1)}x da média. Pressão ${pressureText}.`;
}

function getScoreAnalysis(buyScore: number | undefined, sellScore: number | undefined, signal: string | undefined): string {
    if (!buyScore && !sellScore) return '';

    const buy = buyScore || 0;
    const sell = sellScore || 0;

    let verdict = '';
    if (signal?.includes('elite')) {
        verdict = signal.includes('buy')
            ? '🏆 **SINAL ELITE DE COMPRA**: Múltiplos indicadores alinhados. Setup institucional. Risco/Retorno excepcional.'
            : '⛔ **SINAL ELITE DE VENDA**: Fuga institucional detectada. Saída imediata ou short oportunity.';
    } else if (signal?.includes('strong')) {
        verdict = signal.includes('buy')
            ? '💪 **SINAL FORTE DE COMPRA**: 7+ indicadores bullish. Setup de alta probabilidade.'
            : '📉 **SINAL FORTE DE VENDA**: Estrutura bearish confirmada. Proteja capital.';
    } else if (buy > sell) {
        verdict = `📗 **VIÉS COMPRADOR**: Score ${buy}/150 sugere oportunidade, mas sem confirmação elite.`;
    } else if (sell > buy) {
        verdict = `📕 **VIÉS VENDEDOR**: Score venda ${sell}/150. Cautela máxima.`;
    } else {
        verdict = `⚪ **NEUTRO**: Scores equilibrados. Melhor não operar.`;
    }

    return `${verdict}\n\n**Score Compra**: ${buy}/150 | **Score Venda**: ${sell}/150`;
}

function getRiskManagement(data: AnalysisData): string {
    const { stopLoss, takeProfit, riskReward, atr, currentPrice } = data;

    if (!stopLoss || !takeProfit) return '';

    const riskPercent = ((currentPrice - stopLoss) / currentPrice * 100).toFixed(2);
    const rewardPercent = ((takeProfit - currentPrice) / currentPrice * 100).toFixed(2);

    return `## 🎯 PLANO DE OPERAÇÃO

**Entrada**: ${formatPrice(currentPrice)}
**Stop Loss**: ${formatPrice(stopLoss)} (-${riskPercent}%)
**Take Profit**: ${formatPrice(takeProfit)} (+${rewardPercent}%)
**Risk:Reward**: 1:${riskReward?.toFixed(2) || '-'}
**ATR (Volatilidade)**: ${formatPrice(atr)}

### Regras de Gestão:
- ⚠️ **NUNCA** arrisque mais de 2% do capital por trade
- 📏 Stop obrigatório - SEMPRE
- 🎯 Parcial em 50% do alvo, trail stop no restante`;
}

function getScenarios(data: AnalysisData): string {
    const { currentPrice, keyResistance, keySupport, ema21, ema200, signal, htfTrend } = data;

    const isBullish = signal?.includes('buy') || htfTrend?.includes('bull');

    let bullScenario = '';
    let bearScenario = '';

    if (keyResistance) {
        bullScenario = `### 🟢 CENÁRIO A (BULLISH)
Se romper ${formatPrice(keyResistance)} com volume:
- Alvo 1: +5% do rompimento
- Alvo 2: Próxima resistência
- Confirmação: Fechamento acima + retest bem sucedido`;
    }

    if (keySupport) {
        bearScenario = `### 🔴 CENÁRIO B (BEARISH/TRAP)
Se perder ${formatPrice(keySupport)}:
- Suporte perdido = Stop obrigatório
- Próximo suporte crítico: ${formatPrice(ema200)}
- NÃO segure posição contra tendência`;
    }

    const forbidden = `### ⛔ ZONA PROIBIDA
- NÃO opere no meio do range
- NÃO compre resistência / NÃO venda suporte
- NÃO entre sem confirmação de volume`;

    return `## 📋 CENÁRIOS\n\n${bullScenario}\n\n${bearScenario}\n\n${forbidden}`;
}

function getPatterns(patterns: string[] | undefined): string {
    if (!patterns || patterns.length === 0) return '';

    return `## 🔍 PADRÕES DETECTADOS

${patterns.map(p => `- **${p}**`).join('\n')}

*Padrões confirmados são confluências adicionais, não devem ser usados isoladamente.*`;
}

export function generateNarrativeAnalysis(data: AnalysisData): string {
    const { ticker, timeframe, currentPrice, change24h, htfTrend, mtfTrend } = data;

    const changeEmoji = change24h >= 0 ? '🟢' : '🔴';
    const changeText = change24h >= 0 ? `+${change24h.toFixed(2)}%` : `${change24h.toFixed(2)}%`;

    const htfEmoji = htfTrend?.includes('bull') ? '🐂' : htfTrend?.includes('bear') ? '🐻' : '⚖️';
    const mtfEmoji = mtfTrend?.includes('bull') ? '🐂' : mtfTrend?.includes('bear') ? '🐻' : '⚖️';

    return `# 📊 ANÁLISE TÉCNICA PROFISSIONAL - ${ticker}/USDT

> **"O gráfico não mente. Ele mostra exatamente onde o dinheiro está se posicionando."**

---

## 📌 VISÃO GERAL

**Preço Atual**: ${formatPrice(currentPrice)} ${changeEmoji} ${changeText} (24h)
**Timeframe**: ${timeframe}
**Tendência HTF (Longo Prazo)**: ${htfEmoji} ${htfTrend || 'Analisando...'}
**Tendência MTF (Médio Prazo)**: ${mtfEmoji} ${mtfTrend || 'Analisando...'}

---

${getScoreAnalysis(data.buyScore, data.sellScore, data.signal)}

---

## 📈 ESTRUTURA DE MERCADO

${getEmaStructure(data)}

${getSupertrendAnalysis(data.supertrendDirection, data.supertrendValue, currentPrice)}

${getIchimokuAnalysis(data)}

---

## ⚡ MOMENTUM E FORÇA

${getRsiAnalysis(data.rsi)}

${getAdxAnalysis(data.adx, data.diPlus, data.diMinus)}

${getMacdAnalysis(data.macdLine, data.macdSignal, data.macdHistogram)}

${getVolumeAnalysis(data.volumeRatio, data.buyPressure)}

---

${getRiskManagement(data)}

---

${getScenarios(data)}

---

${getPatterns(data.patternsDetected)}

---

## 🧠 O QUE O TRADER PROFISSIONAL FAZ AGORA

1. **Define risco ANTES de entrar** - Sabe exatamente onde sai se der errado
2. **Espera confluência** - Não age por FOMO, espera setup completo
3. **Segue o plano** - Executa cerebral, não emocional
4. **Protege capital** - É melhor perder uma oportunidade que perder dinheiro

---

*Análise gerada em ${new Date().toLocaleString('pt-BR')}*
*Timeframe: ${timeframe} | Dados: Binance*

> ⚠️ **AVISO**: Esta análise é educacional. Não é recomendação de investimento. Faça sua própria pesquisa.
`;
}
