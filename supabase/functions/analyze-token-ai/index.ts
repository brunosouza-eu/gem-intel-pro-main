import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { RSI, MACD, BollingerBands, EMA, ADX, Stochastic, OBV, ATR, IchimokuCloud } from "https://esm.sh/technicalindicators@3.1.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface IndicatorResult {
    rsi: number;
    macd: { macd: number; signal: number; histogram: number };
    bollinger: { upper: number; middle: number; lower: number };
    ema: { ema9: number; ema21: number; ema50: number; ema200: number };
    adx: number;
    stoch: { k: number; d: number };
    obv: number;
    atr: number;
    ichimoku: any;
    fibonacci: {
        level_0: number;
        level_236: number;
        level_382: number;
        level_50: number;
        level_618: number;
        level_786: number;
        level_100: number;
    };
    volume: { current: number; average: number; ratio: number };
    trend: string;
    price: number;
    support: number[];
    resistance: number[];
}

// ===== TECHNICAL ANALYSIS ENGINE =====
async function analyzeTimeframe(ticker: string, interval: string): Promise<IndicatorResult> {
    const binanceResponse = await fetch(`https://api.binance.com/api/v3/klines?symbol=${ticker}USDT&interval=${interval}&limit=200`);

    if (!binanceResponse.ok) {
        throw new Error(`Failed to fetch Binance data for ${interval}: ${binanceResponse.statusText}`);
    }

    const klines = await binanceResponse.json();

    if (!Array.isArray(klines) || klines.length < 50) {
        throw new Error(`Insufficient data for ${ticker} on ${interval}`);
    }

    const closes = klines.map((k: any) => parseFloat(k[4]));
    const highs = klines.map((k: any) => parseFloat(k[2]));
    const lows = klines.map((k: any) => parseFloat(k[3]));
    const volumes = klines.map((k: any) => parseFloat(k[5]));
    const price = closes[closes.length - 1];

    // Calculate all indicators
    const rsiValues = RSI.calculate({ values: closes, period: 14 });
    const macdValues = MACD.calculate({ values: closes, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, SimpleMAOscillator: false, SimpleMASignal: false });
    const bbValues = BollingerBands.calculate({ values: closes, period: 20, stdDev: 2 });
    const ema9Arr = EMA.calculate({ values: closes, period: 9 });
    const ema21Arr = EMA.calculate({ values: closes, period: 21 });
    const ema50Arr = EMA.calculate({ values: closes, period: 50 });
    const ema200Arr = EMA.calculate({ values: closes, period: 200 });
    const adxValues = ADX.calculate({ high: highs, low: lows, close: closes, period: 14 });
    const stochValues = Stochastic.calculate({ high: highs, low: lows, close: closes, period: 14, signalPeriod: 3 });
    const obvValues = OBV.calculate({ close: closes, volume: volumes });
    const atrValues = ATR.calculate({ high: highs, low: lows, close: closes, period: 14 });
    const ichimokuValues = IchimokuCloud.calculate({ high: highs, low: lows, conversionPeriod: 9, basePeriod: 26, spanPeriod: 52, displacement: 26 });

    const high50 = Math.max(...highs.slice(-50));
    const low50 = Math.min(...lows.slice(-50));
    const diff = high50 - low50;
    const macd = macdValues[macdValues.length - 1];

    const normalizedMacd = {
        macd: macd?.MACD ?? macd?.macd ?? 0,
        signal: macd?.signal ?? 0,
        histogram: macd?.histogram ?? 0,
    };

    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;

    return {
        rsi: rsiValues[rsiValues.length - 1],
        macd: normalizedMacd,
        bollinger: bbValues[bbValues.length - 1],
        ema: {
            ema9: ema9Arr[ema9Arr.length - 1] || 0,
            ema21: ema21Arr[ema21Arr.length - 1] || 0,
            ema50: ema50Arr[ema50Arr.length - 1] || 0,
            ema200: ema200Arr[ema200Arr.length - 1] || 0
        },
        adx: adxValues[adxValues.length - 1]?.adx || 0,
        stoch: stochValues[stochValues.length - 1] || { k: 0, d: 0 },
        obv: obvValues[obvValues.length - 1] || 0,
        atr: atrValues[atrValues.length - 1] || 0,
        ichimoku: ichimokuValues[ichimokuValues.length - 1] || null,
        fibonacci: {
            level_0: low50,
            level_236: low50 + diff * 0.236,
            level_382: low50 + diff * 0.382,
            level_50: low50 + diff * 0.5,
            level_618: low50 + diff * 0.618,
            level_786: low50 + diff * 0.786,
            level_100: high50
        },
        volume: {
            current: volumes[volumes.length - 1],
            average: avgVolume,
            ratio: avgVolume > 0 ? volumes[volumes.length - 1] / avgVolume : 0
        },
        trend: ema50Arr[ema50Arr.length - 1] > ema200Arr[ema200Arr.length - 1] ? 'UP' : 'DOWN',
        price,
        support: [Math.min(...lows.slice(-20)), Math.min(...lows.slice(-50))].sort((a, b) => b - a),
        resistance: [Math.max(...highs.slice(-20)), Math.max(...highs.slice(-50))].sort((a, b) => a - b)
    };
}

// ===== HELPER FUNCTIONS =====
const fmt = (val: number, d = 2) => val?.toFixed(d) ?? 'N/A';

function getRSIStatus(rsi: number): string {
    if (rsi < 30) return "Oversold (zona de compra potencial)";
    if (rsi > 70) return "Overbought (zona de venda potencial)";
    if (rsi > 50) return "Neutro-Bullish";
    return "Neutro-Bearish";
}

function getMACDCross(macd: any): string {
    if (!macd) return "N/A";
    if (macd.macd > macd.signal) return "Bullish (linha acima do sinal)";
    return "Bearish (linha abaixo do sinal)";
}

function getADXStrength(adx: number): string {
    if (adx < 20) return "Fraca (<20)";
    if (adx < 25) return "Moderada (20-25)";
    if (adx < 50) return "Forte (25-50)";
    return "Muito Forte (>50)";
}

function getBBPosition(price: number, bb: any): string {
    if (!bb) return "N/A";
    if (price > bb.upper) return "Acima da banda superior (sobrecompra)";
    if (price < bb.lower) return "Abaixo da banda inferior (sobrevenda)";
    return "Dentro das bandas (normal)";
}

function getStochStatus(stoch: any): string {
    if (!stoch) return "N/A";
    if (stoch.k < 20) return "Oversold";
    if (stoch.k > 80) return "Overbought";
    return "Neutro";
}

function getIchimokuPosition(price: number, ichimoku: any): string {
    if (!ichimoku || !ichimoku.spanA || !ichimoku.spanB) return "N/A";
    const cloudTop = Math.max(ichimoku.spanA, ichimoku.spanB);
    const cloudBottom = Math.min(ichimoku.spanA, ichimoku.spanB);
    if (price > cloudTop) return "Acima da nuvem (bullish)";
    if (price < cloudBottom) return "Abaixo da nuvem (bearish)";
    return "Dentro da nuvem (indefinido)";
}

// ===== NEWS FETCHER (CryptoPanic API — Free) =====
async function fetchNews(ticker: string): Promise<any[]> {
    try {
        // CryptoPanic free API — no auth needed for public posts
        const res = await fetch(`https://cryptopanic.com/api/free/v1/posts/?currencies=${ticker}&kind=news&filter=important&public=true`);
        if (!res.ok) {
            console.log(`CryptoPanic returned ${res.status}, trying fallback...`);
            return await fetchNewsFallback(ticker);
        }
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            return data.results.slice(0, 5).map((n: any) => ({
                title: n.title,
                source: n.source?.title || 'Unknown',
                url: n.url,
                published: n.published_at,
                sentiment: n.votes?.positive > n.votes?.negative ? 'bullish' :
                    n.votes?.negative > n.votes?.positive ? 'bearish' : 'neutral',
            }));
        }
        return await fetchNewsFallback(ticker);
    } catch (error) {
        console.error("CryptoPanic failed:", error);
        return await fetchNewsFallback(ticker);
    }
}

// Fallback: CryptoCompare news API (no key needed for basic)
async function fetchNewsFallback(ticker: string): Promise<any[]> {
    try {
        const res = await fetch(`https://min-api.cryptocompare.com/data/v2/news/?categories=${ticker}&extraParams=GemIntel`);
        if (!res.ok) return [];
        const data = await res.json();
        if (data.Data && data.Data.length > 0) {
            return data.Data.slice(0, 5).map((n: any) => ({
                title: n.title,
                source: n.source,
                url: n.url,
                published: new Date(n.published_on * 1000).toISOString(),
                sentiment: n.sentiment === 'positive' ? 'bullish' :
                    n.sentiment === 'negative' ? 'bearish' : 'neutral',
            }));
        }
        return [];
    } catch {
        return [];
    }
}

// ===== GLOBAL MARKET DATA (CoinGecko — Free) =====
async function fetchGlobalData(): Promise<any> {
    try {
        const res = await fetch("https://api.coingecko.com/api/v3/global");
        if (!res.ok) return null;
        const data = await res.json();
        const g = data.data;
        return {
            total_market_cap_usd: Math.round(g.total_market_cap?.usd || 0),
            total_volume_24h: Math.round(g.total_volume?.usd || 0),
            btc_dominance: parseFloat((g.market_cap_percentage?.btc || 0).toFixed(1)),
            eth_dominance: parseFloat((g.market_cap_percentage?.eth || 0).toFixed(1)),
            market_cap_change_24h: parseFloat((g.market_cap_change_percentage_24h_usd || 0).toFixed(2)),
            active_cryptos: g.active_cryptocurrencies || 0,
        };
    } catch (error) {
        console.error("CoinGecko global failed:", error);
        return null;
    }
}

// ===== BTC & ETH PRICES (for macro context) =====
async function fetchBtcEthPrices(): Promise<{ btc: number; eth: number; btcChange: number; ethChange: number }> {
    try {
        const [btcRes, ethRes] = await Promise.all([
            fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'),
            fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT'),
        ]);
        const btc = await btcRes.json();
        const eth = await ethRes.json();
        return {
            btc: parseFloat(btc.lastPrice),
            eth: parseFloat(eth.lastPrice),
            btcChange: parseFloat(btc.priceChangePercent),
            ethChange: parseFloat(eth.priceChangePercent),
        };
    } catch {
        return { btc: 0, eth: 0, btcChange: 0, ethChange: 0 };
    }
}

// ===== MAIN HANDLER =====
serve(async (req) => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
        // ===== AUTHENTICATION =====
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        const supabaseAuth = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_ANON_KEY')!,
            { global: { headers: { Authorization: authHeader } } }
        );

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token);

        if (userError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // ===== CHECK VIP STATUS =====
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        const { data: profileData } = await supabaseAdmin
            .from('profiles')
            .select('plan, credits')
            .eq('id', user.id)
            .single();

        const isVip = profileData?.plan === 'pro' || profileData?.plan === 'vip';

        // ===== CREDIT DEDUCTION (skip for VIP) =====
        if (!isVip) {
            const { data: deductResult, error: deductError } = await supabaseAuth.rpc('deduct_credits', {
                p_amount: 1,
                p_description: 'Análise IA do Trade Master'
            });

            if (deductError) {
                return new Response(JSON.stringify({ error: 'Erro ao processar créditos', details: deductError.message }), {
                    status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }

            const creditResult = deductResult as any;
            if (!creditResult || !creditResult.success) {
                return new Response(JSON.stringify({
                    error: 'Créditos insuficientes',
                    required: 1,
                    current: creditResult?.current || 0,
                    message: 'Você precisa de 1 crédito para gerar análise'
                }), {
                    status: 402,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }

            console.log(`Credits deducted. New balance: ${creditResult.new_balance}`);
        } else {
            console.log(`VIP user — skipping credit deduction.`);
        }

        // ===== DATA FETCHING (ALL PARALLEL) =====
        const { ticker } = await req.json();
        if (!ticker) throw new Error("Ticker is required");

        console.log(`🔍 Starting Enhanced Analysis for ${ticker}...`);

        const [data1h, data4h, dataDaily, news, globalData, btcEth, fgData] = await Promise.all([
            analyzeTimeframe(ticker, '1h'),
            analyzeTimeframe(ticker, '4h'),
            analyzeTimeframe(ticker, '1d'),
            fetchNews(ticker),
            fetchGlobalData(),
            fetchBtcEthPrices(),
            // Fear & Greed Index
            fetch("https://api.alternative.me/fng/").then(r => r.json()).catch(() => ({ data: [{ value: '50', value_classification: 'Neutral' }] })),
        ]);

        const fgIndex = parseInt(fgData.data?.[0]?.value || '50');
        const fgStatus = fgData.data?.[0]?.value_classification || 'Neutral';

        console.log(`✅ Data fetched: ${news.length} news, F&G: ${fgIndex}, BTC: $${btcEth.btc}`);

        // ===== BUILD ENHANCED PROMPT =====
        const newsSection = news.length > 0
            ? `\n## NOTÍCIAS RECENTES (${news.length} encontradas):\n${news.map((n, i) =>
                `${i + 1}. "${n.title}" — Fonte: ${n.source} — Sentimento: ${n.sentiment}`
            ).join('\n')}\n`
            : '\n## NOTÍCIAS: Sem notícias significativas encontradas nas últimas 48h.\n';

        const macroSection = `
## CONTEXTO MACRO
Fear & Greed Index: ${fgIndex}/100 (${fgStatus})
Bitcoin: $${fmt(btcEth.btc, 2)} (${btcEth.btcChange > 0 ? '+' : ''}${fmt(btcEth.btcChange)}%)
Ethereum: $${fmt(btcEth.eth, 2)} (${btcEth.ethChange > 0 ? '+' : ''}${fmt(btcEth.ethChange)}%)
${globalData ? `Dominância BTC: ${globalData.btc_dominance}%
Market Cap Total: $${(globalData.total_market_cap_usd / 1e12).toFixed(2)}T (${globalData.market_cap_change_24h > 0 ? '+' : ''}${globalData.market_cap_change_24h}% 24h)
Volume Global 24h: $${(globalData.total_volume_24h / 1e9).toFixed(1)}B` : ''}`;

        const prompt = `Você é um ANALISTA TÉCNICO PROFISSIONAL com 40 ANOS DE EXPERIÊNCIA em mercados financeiros.

TRACK RECORD: 85%+ de acerto em análises
METODOLOGIA: 100% data-driven, sem achismo
COMUNICAÇÃO: Técnica mas acessível para traders iniciantes e avançados
TRANSPARÊNCIA: Total sobre riscos, incertezas e limitações
FOCO: Educação e análise objetiva, não promessas

# DADOS PARA ANÁLISE

CRIPTOMOEDA: ${ticker}
DATA/HORA: ${new Date().toISOString()}
PREÇO ATUAL: $${fmt(data4h.price, 6)}
${macroSection}
${newsSection}
## INDICADORES TÉCNICOS COMPLETOS (3 TIMEFRAMES)

### TIMEFRAME 1H (Curto Prazo):
Tendência: ${data1h.trend}
├─ RSI: ${fmt(data1h.rsi)} — ${getRSIStatus(data1h.rsi)}
├─ MACD: ${getMACDCross(data1h.macd)} | Histograma: ${fmt(data1h.macd.histogram, 4)}
├─ ADX: ${fmt(data1h.adx)} — Força: ${getADXStrength(data1h.adx)}
├─ Bollinger: ${getBBPosition(data1h.price, data1h.bollinger)} | Range: $${fmt(data1h.bollinger?.lower, 6)} – $${fmt(data1h.bollinger?.upper, 6)}
├─ Stochastic: %K ${fmt(data1h.stoch.k)} | %D ${fmt(data1h.stoch.d)} — ${getStochStatus(data1h.stoch)}
├─ OBV: ${fmt(data1h.obv, 0)}
├─ ATR: ${fmt(data1h.atr, 6)} (volatilidade)
├─ Ichimoku: ${getIchimokuPosition(data1h.price, data1h.ichimoku)}
├─ EMAs: 9=${fmt(data1h.ema.ema9, 6)} | 21=${fmt(data1h.ema.ema21, 6)} | 50=${fmt(data1h.ema.ema50, 6)} | 200=${fmt(data1h.ema.ema200, 6)}
└─ Volume: ${(data1h.volume.ratio * 100).toFixed(0)}% da média (${data1h.volume.ratio > 1.5 ? 'ALTO' : data1h.volume.ratio < 0.7 ? 'BAIXO' : 'NORMAL'})

Suportes 1H: ${data1h.support.map(s => '$' + s.toFixed(6)).join(', ')}
Resistências 1H: ${data1h.resistance.map(r => '$' + r.toFixed(6)).join(', ')}

Fibonacci 1H (50 períodos):
├─ 100%: $${fmt(data1h.fibonacci.level_100, 6)} | 78.6%: $${fmt(data1h.fibonacci.level_786, 6)}
├─ 61.8%: $${fmt(data1h.fibonacci.level_618, 6)} | 50%: $${fmt(data1h.fibonacci.level_50, 6)}
└─ 38.2%: $${fmt(data1h.fibonacci.level_382, 6)} | 23.6%: $${fmt(data1h.fibonacci.level_236, 6)} | 0%: $${fmt(data1h.fibonacci.level_0, 6)}

### TIMEFRAME 4H (Médio Prazo):
Tendência: ${data4h.trend}
├─ RSI: ${fmt(data4h.rsi)} — ${getRSIStatus(data4h.rsi)}
├─ MACD: ${getMACDCross(data4h.macd)} | Histograma: ${fmt(data4h.macd.histogram, 4)}
├─ ADX: ${fmt(data4h.adx)} — Força: ${getADXStrength(data4h.adx)}
├─ Bollinger: ${getBBPosition(data4h.price, data4h.bollinger)} | Range: $${fmt(data4h.bollinger?.lower, 6)} – $${fmt(data4h.bollinger?.upper, 6)}
├─ Stochastic: %K ${fmt(data4h.stoch.k)} | %D ${fmt(data4h.stoch.d)} — ${getStochStatus(data4h.stoch)}
├─ OBV: ${fmt(data4h.obv, 0)}
├─ ATR: ${fmt(data4h.atr, 6)}
├─ Ichimoku: ${getIchimokuPosition(data4h.price, data4h.ichimoku)}
├─ EMAs: 9=${fmt(data4h.ema.ema9, 6)} | 21=${fmt(data4h.ema.ema21, 6)} | 50=${fmt(data4h.ema.ema50, 6)} | 200=${fmt(data4h.ema.ema200, 6)}
└─ Volume: ${(data4h.volume.ratio * 100).toFixed(0)}% da média

Suportes 4H: ${data4h.support.map(s => '$' + s.toFixed(6)).join(', ')}
Resistências 4H: ${data4h.resistance.map(r => '$' + r.toFixed(6)).join(', ')}

### TIMEFRAME DAILY (Longo Prazo):
Tendência: ${dataDaily.trend}
├─ RSI: ${fmt(dataDaily.rsi)} — ${getRSIStatus(dataDaily.rsi)}
├─ MACD: ${getMACDCross(dataDaily.macd)} | Histograma: ${fmt(dataDaily.macd.histogram, 4)}
├─ ADX: ${fmt(dataDaily.adx)} — Força: ${getADXStrength(dataDaily.adx)}
├─ Bollinger: ${getBBPosition(dataDaily.price, dataDaily.bollinger)}
├─ Stochastic: %K ${fmt(dataDaily.stoch.k)} | %D ${fmt(dataDaily.stoch.d)} — ${getStochStatus(dataDaily.stoch)}
├─ OBV: ${fmt(dataDaily.obv, 0)}
├─ ATR: ${fmt(dataDaily.atr, 6)}
├─ Ichimoku: ${getIchimokuPosition(dataDaily.price, dataDaily.ichimoku)}
├─ EMAs: 9=${fmt(dataDaily.ema.ema9, 6)} | 21=${fmt(dataDaily.ema.ema21, 6)} | 50=${fmt(dataDaily.ema.ema50, 6)} | 200=${fmt(dataDaily.ema.ema200, 6)}
└─ Volume: ${(dataDaily.volume.ratio * 100).toFixed(0)}% da média

Suportes Daily: ${dataDaily.support.map(s => '$' + s.toFixed(6)).join(', ')}
Resistências Daily: ${dataDaily.resistance.map(r => '$' + r.toFixed(6)).join(', ')}

Fibonacci Daily (50 períodos):
├─ 100%: $${fmt(dataDaily.fibonacci.level_100, 6)} | 78.6%: $${fmt(dataDaily.fibonacci.level_786, 6)}
├─ 61.8%: $${fmt(dataDaily.fibonacci.level_618, 6)} | 50%: $${fmt(dataDaily.fibonacci.level_50, 6)}
└─ 38.2%: $${fmt(dataDaily.fibonacci.level_382, 6)} | 23.6%: $${fmt(dataDaily.fibonacci.level_236, 6)} | 0%: $${fmt(dataDaily.fibonacci.level_0, 6)}

---

# TAREFA: GERE ANÁLISE TÉCNICA PROFISSIONAL COMPLETA EM JSON

A análise deve ser EXTENSA e DETALHADA como um relatório profissional de trading desk. Cada campo de texto (situation, indicators_interpretation, description) deve ter MÚLTIPLOS PARÁGRAFOS com 3-5 linhas cada.

{
  "summary": {
    "situation": "RESUMO EXECUTIVO DETALHADO (5-8 linhas): Descreva a situação técnica completa do ${ticker}. Mencione o preço atual, tendência dominante, contexto de Fear & Greed, correlação com BTC, e o cenário mais provável. Explique POR QUE a situação é bullish/bearish/neutra baseado na confluência de indicadores.",
    "recommendation": "RECOMENDAÇÃO OPERACIONAL CLARA: 'LONG agressivo' | 'LONG conservador' | 'SHORT agressivo' | 'SHORT conservador' | 'AGUARDAR — sem setup válido' | 'NÃO OPERAR — risco elevado'. Justifique com 2-3 linhas usando indicadores específicos.",
    "score": número_0_a_100,
    "risk_level": "Alto" | "Médio" | "Baixo"
  },
  "market_context": {
    "fear_greed": { "value": ${fgIndex}, "label": "${fgStatus}" },
    "btc_dominance": "${globalData?.btc_dominance || 'N/A'}%",
    "total_market_cap": "$${globalData ? (globalData.total_market_cap_usd / 1e12).toFixed(2) + 'T' : 'N/A'}",
    "market_cap_change_24h": "${globalData?.market_cap_change_24h || 0}%",
    "btc_price": ${btcEth.btc},
    "btc_change_24h": ${btcEth.btcChange},
    "eth_price": ${btcEth.eth},
    "eth_change_24h": ${btcEth.ethChange},
    "market_sentiment": "GERE 1-2 FRASES sobre o sentimento geral do mercado baseado no F&G, dominância BTC e performance de BTC/ETH"
  },
  "news": [
    PARA CADA notícia fornecida acima, gere:
    {
      "title": "título da notícia",
      "source": "nome da fonte",
      "impact": "HIGH" | "MEDIUM" | "LOW",
      "sentiment": "bullish" | "bearish" | "neutral",
      "summary": "RESUMO de 1-2 linhas com análise do impacto no preço do ${ticker}"
    }
  ],
  "analysis_1h": {
    "trend": "Bullish" | "Bearish" | "Lateral",
    "indicators_interpretation": "ANÁLISE DETALHADA DE TODOS OS INDICADORES 1H (mínimo 5-8 linhas): Explique CADA indicador (RSI, MACD, ADX, Bollinger, Stochastic, OBV, ATR, Ichimoku, EMAs). Identifique CONFLUÊNCIAS e DIVERGÊNCIAS entre indicadores. Mencione se há padrões técnicos visíveis.",
    "patterns": ["Lista de padrões técnicos identificados: death cross, golden cross, double bottom, etc."],
    "conclusion": "CONCLUSÃO 1H (3-4 linhas): Síntese do curto prazo com nível de confiança"
  },
  "analysis_4h": {
    "trend": "...",
    "indicators_interpretation": "MESMA PROFUNDIDADE do 1H — adapte para médio prazo",
    "patterns": [],
    "conclusion": "CONCLUSÃO 4H"
  },
  "analysis_daily": {
    "trend": "...",
    "indicators_interpretation": "MESMA PROFUNDIDADE — adapte para macro",
    "patterns": [],
    "conclusion": "CONCLUSÃO DAILY"
  },
  "multi_timeframe": {
    "alignment": "ANÁLISE DE CORRELAÇÃO DETALHADA (5+ linhas): Os 3 timeframes concordam? Onde divergem? Quais alinhamentos confirmados (ex: Ichimoku bear em 3 TFs)? Quais divergências críticas (ex: MACD bull em 1H vs bear em 4H)?",
    "dominant_timeframe": "1H" | "4H" | "Daily",
    "confluence_setup": "Existe setup multi-timeframe aproveitável? Detalhar confluência com preços específicos."
  },
  "key_levels": {
    "supports": [
      { "price": número, "label": "IMEDIATO" | "MODERADO" | "FORTE" | "CRÍTICO", "description": "Explicação do nível", "distance_pct": número }
    ],
    "resistances": [
      { "price": número, "label": "...", "description": "...", "distance_pct": número }
    ]
  },
  "scenarios": {
    "bullish": {
      "probability": número (soma ~100%),
      "description": "Descrição DETALHADA (3-5 linhas) do cenário bullish com triggers, alvos e timeframe esperado",
      "triggers": ["Gatilho técnico 1 com preço específico", "Gatilho 2", "Gatilho 3"],
      "targets": ["$X (+Y%)", "$X (+Y%)", "$X (+Y%)"],
      "timeframe": "X horas/dias estimados",
      "invalidation": "Perda de $X (explicar por quê)"
    },
    "bearish": {
      "probability": número,
      "description": "Descrição DETALHADA do cenário bearish",
      "triggers": ["Gatilho 1", "Gatilho 2", "Gatilho 3"],
      "targets": ["$X (-Y%)", "$X (-Y%)"],
      "timeframe": "...",
      "invalidation": "Rompimento de $X"
    },
    "neutral": {
      "probability": número,
      "description": "Descrição da consolidação/range esperado com limites"
    }
  },
  "setup": {
    "direction": "LONG" | "SHORT" | "NEUTRO",
    "entry_zone": "$X – $Y (justificar com confluência técnica: suporte + EMA + Fibonacci)",
    "stop_loss": número,
    "take_profit": [número_TP1, número_TP2, número_TP3],
    "risk_reward": "1:X",
    "position_size": "Recomendação de % do portfolio (1-5%)",
    "validation": "Condições obrigatórias para validar o setup (volume, rompimentos, confirmações)"
  },
  "risk_management": {
    "rules": [
      "1. Nunca entre contra a tendência do timeframe Daily",
      "2. Stop Loss obrigatório ANTES de abrir posição",
      "3. Máximo 2-5% do portfolio por trade",
      "4. Se ADX < 20, evite trades direcionais — mercado sem tendência",
      "5. Em Fear & Greed < 20 (extreme fear), reduza tamanho de posição em 50%",
      "6. Nunca mova Stop Loss contra sua posição",
      "7. Se atingir TP1, mova SL para breakeven",
      "8. Volume abaixo de 0.5x da média invalida qualquer setup",
      "9. Não operar nas primeiras 30min após notícia de alto impacto",
      "10. Se BTC cair mais de 5% no dia, feche posições em altcoins"
    ],
    "contingencies": [
      {
        "scenario": "BTC quebra suporte crítico",
        "action": "Fechar todas as posições em altcoins imediatamente"
      },
      {
        "scenario": "Flash crash (queda > 10% em 1h)",
        "action": "Não comprar no pânico — esperar estabilização de 4-8h com volume decrescente"
      }
    ]
  },
  "disclaimers": {
    "risks": ["Risco específico 1 desta análise", "Risco 2", "Risco 3"],
    "uncertainties": ["Fator de incerteza 1", "Fator 2"]
  }
}

REGRAS CRÍTICAS:
1. Responda APENAS JSON válido, sem markdown, sem comentários
2. Score = (% indicadores bullish / total) × 100, arredondado
3. Probabilidades dos cenários devem somar ~100%
4. Base TUDO nos dados fornecidos acima — NUNCA invente dados
5. Seja EXTREMAMENTE detalhado nas interpretações — mínimo 5 linhas cada
6. Cada notícia deve ter summary com análise de impacto
7. key_levels deve ter pelo menos 3 suportes e 3 resistências
8. risk_management SEMPRE inclua as 10 regras e 2+ contingências
9. Use português profissional e acessível
10. Tom: analista profissional confiante mas educado e transparente sobre riscos`;

        // ===== CALL AI =====
        const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
        if (!OPENROUTER_API_KEY) throw new Error("Missing OPENROUTER_API_KEY");

        console.log(`🤖 Calling AI (prompt: ${prompt.length} chars)...`);

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a senior financial analyst with 40 years of experience. You produce DETAILED, EXTENSIVE professional analysis reports. Output ONLY valid JSON, no markdown code blocks. Every text field should be rich and informative. Write in Portuguese."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 4000,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('OpenRouter failed:', errText);
            throw new Error(`Serviço de IA indisponível (${response.status}). Tente novamente.`);
        }

        const aiData = await response.json();
        let rawContent = aiData.choices?.[0]?.message?.content;

        if (!rawContent) {
            throw new Error('A IA não retornou conteúdo. Tente novamente.');
        }

        // Strip markdown code blocks if present
        rawContent = rawContent.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

        let analysis;
        try {
            analysis = JSON.parse(rawContent);
        } catch (parseError) {
            console.error('Failed to parse AI response:', rawContent.substring(0, 500));
            throw new Error('A IA retornou formato inválido. Tente novamente.');
        }

        // Inject raw data the AI couldn't generate
        analysis.market_context = {
            ...analysis.market_context,
            fear_greed: { value: fgIndex, label: fgStatus },
            btc_price: btcEth.btc,
            btc_change_24h: btcEth.btcChange,
            eth_price: btcEth.eth,
            eth_change_24h: btcEth.ethChange,
            btc_dominance: globalData?.btc_dominance ? `${globalData.btc_dominance}%` : 'N/A',
            total_market_cap: globalData ? `$${(globalData.total_market_cap_usd / 1e12).toFixed(2)}T` : 'N/A',
            market_cap_change_24h: globalData?.market_cap_change_24h ? `${globalData.market_cap_change_24h}%` : 'N/A',
        };

        // If AI didn't generate news properly, inject the raw news
        if (!analysis.news || analysis.news.length === 0) {
            analysis.news = news.map(n => ({
                title: n.title,
                source: n.source,
                impact: 'MEDIUM',
                sentiment: n.sentiment,
                summary: n.title,
            }));
        }

        console.log(`✅ Analysis complete for ${ticker}. Score: ${analysis.summary?.score}`);

        // ===== SAVE TO DB =====
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { error: upsertError } = await supabase
            .from("token_analysis")
            .upsert({
                ticker,
                ai_analysis: analysis,
                technical_indicators: data4h,
                last_ai_update: new Date().toISOString(),
                timeframe: "multi"
            }, { onConflict: 'ticker,timeframe' });

        if (upsertError) {
            console.error('DB save failed:', upsertError);
            // Don't throw — still return the analysis to the user
        }

        return new Response(JSON.stringify({ success: true, analysis }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Critical Error in analyze-token-ai:", error);

        return new Response(
            JSON.stringify({
                error: error.message,
                details: "Check Supabase Edge Function logs for more info."
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
        );
    }
});
