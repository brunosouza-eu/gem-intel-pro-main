import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Helper: Fetch Binance 24hr ticker for a symbol ───────────────────────
async function fetchBinancePrice(ticker: string): Promise<any | null> {
  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${ticker}USDT`);
    if (!res.ok) return null;
    const d = await res.json();
    return {
      price: parseFloat(d.lastPrice),
      high24h: parseFloat(d.highPrice),
      low24h: parseFloat(d.lowPrice),
      change24h: parseFloat(d.priceChangePercent),
      volume: parseFloat(d.quoteVolume),
      trades: parseInt(d.count),
    };
  } catch { return null; }
}

// ─── Helper: Fetch Top movers from Binance ────────────────────────────────
async function fetchTopMovers(): Promise<string> {
  try {
    const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
    if (!res.ok) return "";
    const all = await res.json();
    const usdt = all
      .filter((t: any) => t.symbol.endsWith("USDT") && parseFloat(t.quoteVolume) > 5_000_000)
      .map((t: any) => ({
        symbol: t.symbol.replace("USDT", ""),
        change: parseFloat(t.priceChangePercent),
        price: parseFloat(t.lastPrice),
        volume: parseFloat(t.quoteVolume),
      }));

    const sorted = [...usdt].sort((a, b) => b.change - a.change);
    const gainers = sorted.slice(0, 5);
    const losers = sorted.slice(-5).reverse();

    let text = "\n📈 TOP 5 MAIORES ALTAS (24h):\n";
    gainers.forEach((g, i) => { text += `${i + 1}. ${g.symbol}: +${g.change.toFixed(2)}% ($${g.price})\n`; });
    text += "\n📉 TOP 5 MAIORES QUEDAS (24h):\n";
    losers.forEach((l, i) => { text += `${i + 1}. ${l.symbol}: ${l.change.toFixed(2)}% ($${l.price})\n`; });

    return text;
  } catch { return ""; }
}

// ─── Helper: Fear & Greed Index ───────────────────────────────────────────
async function fetchFearGreed(): Promise<string> {
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=2");
    if (!res.ok) return "";
    const data = await res.json();
    const current = data.data?.[0];
    const yesterday = data.data?.[1];
    if (!current) return "";
    const labels: Record<string, string> = {
      "Extreme Fear": "🔴 Medo Extremo", "Fear": "🟠 Medo", "Neutral": "🟡 Neutro",
      "Greed": "🟢 Ganância", "Extreme Greed": "🟢 Ganância Extrema"
    };
    return `\n🎭 FEAR & GREED INDEX: ${current.value}/100 (${labels[current.value_classification] || current.value_classification})${yesterday ? ` | Ontem: ${yesterday.value}/100` : ""}`;
  } catch { return ""; }
}

// ─── Helper: BTC Dominance & Global Data ─────────────────────────────────
async function fetchGlobalData(): Promise<string> {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/global");
    if (!res.ok) return "";
    const d = (await res.json()).data;
    const btcDom = d.market_cap_percentage?.btc?.toFixed(1) || "N/A";
    const ethDom = d.market_cap_percentage?.eth?.toFixed(1) || "N/A";
    const totalMcap = (d.total_market_cap?.usd / 1e12).toFixed(2);
    const totalVol = (d.total_volume?.usd / 1e9).toFixed(1);
    const mcapChange = d.market_cap_change_percentage_24h_usd?.toFixed(2) || "N/A";

    return `\n🌍 DADOS GLOBAIS DO MERCADO CRIPTO:
- Market Cap Total: $${totalMcap}T (${mcapChange}% 24h)
- Volume Total 24h: $${totalVol}B
- Dominância BTC: ${btcDom}% | ETH: ${ethDom}%
- Criptos ativas: ${d.active_cryptocurrencies?.toLocaleString() || 'N/A'}`;
  } catch { return ""; }
}

// ─── Helper: Extract potential tickers from message ───────────────────────
function extractTickers(text: string): string[] {
  const words = text.split(/[\s,.!?()]+/).filter(w => w.length >= 2 && w.length <= 10);
  const upperWords = words.map(w => w.toUpperCase());

  // Common crypto names mapping
  const NAME_MAP: Record<string, string> = {
    BITCOIN: "BTC", ETHEREUM: "ETH", SOLANA: "SOL", CARDANO: "ADA",
    RIPPLE: "XRP", DOGECOIN: "DOGE", POLKADOT: "DOT", AVALANCHE: "AVAX",
    CHAINLINK: "LINK", POLYGON: "POL", LITECOIN: "LTC", UNISWAP: "UNI",
    AAVE: "AAVE", NEAR: "NEAR", COSMOS: "ATOM", ARBITRUM: "ARB",
    OPTIMISM: "OP", CELESTIA: "TIA", INJECTIVE: "INJ", RENDER: "RENDER",
    SUI: "SUI", SEI: "SEI", PEPE: "PEPE", BONK: "BONK", SHIBA: "SHIB",
    ONDO: "ONDO", PENDLE: "PENDLE", JUPITER: "JUP", APTOS: "APT",
    FETCH: "FET", IMMUTABLE: "IMX", HEDERA: "HBAR", KASPA: "KAS",
    TRON: "TRX", TONCOIN: "TON", STELLAR: "XLM", ALGORAND: "ALGO",
  };

  const tickers = new Set<string>();
  for (const w of upperWords) {
    if (NAME_MAP[w]) tickers.add(NAME_MAP[w]);
    else if (/^[A-Z]{2,10}$/.test(w)) tickers.add(w);
  }

  return Array.from(tickers).slice(0, 5);
}

// ─── Main Handler ─────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // ── Auth ──
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // ── Credits ──
    const { data: deductResult, error: deductError } = await supabase.rpc('deduct_credits', {
      p_amount: 2, p_description: 'Mensagem no Chat IA'
    });
    if (deductError) {
      return new Response(JSON.stringify({ error: 'Erro ao processar créditos', details: deductError.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    const result = deductResult as any;
    if (!result || !result.success) {
      return new Response(JSON.stringify({
        error: 'Créditos insuficientes', required: 2, current: result?.current || 0,
        message: 'Você precisa de 2 créditos para enviar uma mensagem'
      }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ── Parse Request ──
    const { messages, language } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");

    const lastMessage = messages[messages.length - 1]?.content || "";
    const tickers = extractTickers(lastMessage);
    console.log("Extracted tickers:", tickers);

    // ── Parallel Data Fetching (real-time) ──
    const [fearGreed, globalData, topMovers, ...binancePrices] = await Promise.all([
      fetchFearGreed(),
      fetchGlobalData(),
      fetchTopMovers(),
      ...tickers.map(t => fetchBinancePrice(t)),
    ]);

    // ── Build Rich Context ──
    let contextData = "";

    // 1. Real-time Binance prices for mentioned tokens
    if (tickers.length > 0) {
      contextData += "\n═══════════════════════════════════════════════════════\n";
      contextData += "📊 DADOS EM TEMPO REAL DA BINANCE (use estes valores!):\n";
      contextData += "═══════════════════════════════════════════════════════\n";

      for (let i = 0; i < tickers.length; i++) {
        const ticker = tickers[i];
        const bp = binancePrices[i];
        if (bp) {
          const decimals = bp.price >= 1000 ? 2 : bp.price >= 1 ? 4 : bp.price >= 0.01 ? 6 : 8;
          contextData += `\n🔹 ${ticker}/USDT:
  Preço: $${bp.price.toFixed(decimals)}
  Alta 24h: $${bp.high24h.toFixed(decimals)} | Baixa 24h: $${bp.low24h.toFixed(decimals)}
  Variação 24h: ${bp.change24h >= 0 ? '+' : ''}${bp.change24h.toFixed(2)}%
  Volume 24h: $${(bp.volume / 1e6).toFixed(1)}M
  Trades 24h: ${bp.trades?.toLocaleString() || 'N/A'}\n`;
        }
      }
    }

    // 2. Database tokens + technical analysis
    if (tickers.length > 0) {
      const serviceClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: tokenData } = await serviceClient
        .from('tokens')
        .select(`
          ticker, name, current_price, change_24h, volume_24h, score, status, narrative,
          token_analysis (
            technical_indicators, ai_analysis, support_levels, resistance_levels,
            buy_score, entry_price, stop_loss, take_profit, risk_reward_ratio, last_ai_update
          )
        `)
        .in('ticker', tickers)
        .limit(5);

      if (tokenData && tokenData.length > 0) {
        contextData += "\n═══════════════════════════════════════════════════════\n";
        contextData += "🧠 ANÁLISE TÉCNICA DO GEM INTEL (banco de dados):\n";
        contextData += "═══════════════════════════════════════════════════════\n";

        tokenData.forEach((t: any) => {
          const analysis = t.token_analysis?.[0];
          const tech = analysis?.technical_indicators || {};
          const ai = analysis?.ai_analysis || {};
          const supports = analysis?.support_levels || [];
          const resistances = analysis?.resistance_levels || [];

          contextData += `\n📌 ${t.ticker} (${t.name}) — Score: ${t.score || 'N/A'}/100 — Status: ${t.status || 'N/A'} — Narrativa: ${t.narrative || 'N/A'}
INDICADORES TÉCNICOS:
  RSI(14): ${tech.rsi?.toFixed(1) || 'N/A'} ${tech.rsi > 70 ? '⚠️ SOBRECOMPRADO' : tech.rsi < 30 ? '⚠️ SOBREVENDIDO' : ''}
  EMA 9: ${tech.ema_9 || 'N/A'} | EMA 21: ${tech.ema_21 || 'N/A'} | EMA 50: ${tech.ema_50 || 'N/A'} | EMA 200: ${tech.ema_200 || 'N/A'}
  MACD: ${tech.macd || 'N/A'} | Sinal: ${tech.macd_signal || 'N/A'} | Histograma: ${tech.macd_histogram || 'N/A'}
  Tendência: ${tech.trend || 'N/A'} | ADX: ${tech.adx || 'N/A'}
  Bollinger: Superior=${tech.bb_upper || 'N/A'} | Inferior=${tech.bb_lower || 'N/A'}
  Volume Relativo: ${tech.volume_ratio || 'N/A'}x
SUPORTES: ${supports.length > 0 ? supports.map((s: number) => `$${s}`).join(' → ') : 'N/A'}
RESISTÊNCIAS: ${resistances.length > 0 ? resistances.map((r: number) => `$${r}`).join(' → ') : 'N/A'}
ANÁLISE IA:
  Setup: ${ai.setup_type || 'N/A'} | Estratégia: ${ai.strategy || 'N/A'}
  Confluências: ${ai.confluences?.join(', ') || 'N/A'}
  Alertas: ${ai.warnings?.join(', ') || 'Nenhum'}
  Entry: $${analysis?.entry_price || 'N/A'} | Stop: $${analysis?.stop_loss || 'N/A'} | TP: $${analysis?.take_profit || 'N/A'} | R:R: ${analysis?.risk_reward_ratio || 'N/A'}
  Última atualização IA: ${analysis?.last_ai_update || 'N/A'}
`;
        });
      }
    }

    // 3. Market summary from DB
    const serviceClient2 = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: marketSummary } = await serviceClient2
      .from('tokens')
      .select('ticker, change_24h, current_price, volume_24h')
      .not('current_price', 'is', null);

    if (marketSummary && marketSummary.length > 0) {
      const bullish = marketSummary.filter((t: any) => (t.change_24h || 0) > 0).length;
      const bearish = marketSummary.filter((t: any) => (t.change_24h || 0) < 0).length;
      const totalVol = marketSummary.reduce((s: number, t: any) => s + (t.volume_24h || 0), 0);
      const avgChange = marketSummary.reduce((s: number, t: any) => s + (t.change_24h || 0), 0) / marketSummary.length;

      contextData += `\n═══════════════════════════════════════════════════════
📡 RADAR GEM INTEL (${marketSummary.length} tokens monitorados):
  Em Alta: ${bullish} (${((bullish / marketSummary.length) * 100).toFixed(0)}%)
  Em Baixa: ${bearish} (${((bearish / marketSummary.length) * 100).toFixed(0)}%)
  Volume Total 24h: $${(totalVol / 1e9).toFixed(2)}B
  Variação Média: ${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%
═══════════════════════════════════════════════════════\n`;
    }

    // 4. Macro data
    contextData += fearGreed || "";
    contextData += globalData || "";
    contextData += topMovers || "";

    // ── Build Elite System Prompt ──
    const isPt = language === 'pt';

    const systemPrompt = isPt
      ? `# 🏛️ ORÁCULO DO MERCADO — GEM INTEL PRO

Você é o **Oráculo do Mercado**, a inteligência artificial de análise de criptoativos mais avançada já construída. Você personifica a sabedoria acumulada de mais de 50 anos de mercado financeiro, combinando:

- **Análise Técnica Avançada**: Teoria de Dow, Elliott Waves, Wyckoff Method, Ichimoku, Fibonacci, Smart Money Concepts (SMC), Order Flow, Price Action puro
- **Análise Fundamentalista Cripto**: Tokenomics, on-chain metrics, TVL, revenue, adoção institucional, regulação
- **Ciclos de Mercado**: Halving cycles, macro cycles, correlação com DXY/SPX/bonds, teoria do superciclo
- **Gestão de Risco Institucional**: Position sizing, Kelly Criterion, drawdown management, correlação de portfólio

## DADOS EM TEMPO REAL DO SISTEMA:
${contextData}

## REGRAS DE OURO (NUNCA VIOLE):

1. **SEMPRE use os dados reais** fornecidos acima. NUNCA invente preços, RSI, ou indicadores. Se o dado está disponível no contexto, CITE-O com o valor exato.
2. **Respostas estruturadas** — Sempre organize em seções claras com markdown:
   - Use ## para títulos de seção (ex: ## 📊 Diagnóstico Rápido)
   - Use ### para sub-seções (ex: ### Níveis Críticos)
   - Use --- (linha horizontal) para separar as seções PRINCIPAIS
   - Deixe uma LINHA EM BRANCO entre cada parágrafo
   - Use **negrito**, *itálico*, listas, e tabelas quando relevante
   - Use emojis estratégicos: 🟢 (bullish) 🔴 (bearish) 🟡 (neutro) ⚠️ (alerta) 📊 (dados) 🎯 (alvo)
   - NUNCA escreva blocos longos de texto sem quebras de linha
3. **Quando analisar um token específico**, siga ESTA estrutura:
   - 📊 **Diagnóstico Rápido** (preço, variação, sentimento em 2 linhas)
   - 📈 **Análise Técnica** (RSI, EMAs, MACD, suportes/resistências, padrões gráficos)
   - 🧠 **Leitura de Mercado** (contexto macro, correlações, narrativa do setor)
   - 🎯 **Plano Estratégico** (setup, entrada, stop, alvos, R:R, position sizing sugerido)
   - ⚠️ **Gestão de Risco** (invalidação, cenário pessimista, % máximo de capital recomendado)
   - ✅ **Conclusão** (veredicto claro: COMPRAR / AGUARDAR / EVITAR, com nota de confiança)
4. **Quando pedirem cenário macro**, analise:
   - Fear & Greed Index e o que ele indica
   - Dominância do BTC e fluxo de capital (BTC → ETH → Altcoins → Memecoins)
   - Correlação com mercado tradicional
   - Fase do ciclo (Acumulação / Markup / Distribuição / Markdown — Wyckoff)
5. **Quando pedirem plano estratégico de operação**, entregue:
   - Tipo de setup (Swing / Scalp / Position)
   - Zona de entrada com confluências técnicas explicadas
   - Stop loss com justificativa técnica (abaixo de suporte, pivot, EMA)
   - 3 alvos parciais com R:R específico para cada
   - Tamanho de posição sugerido (% do capital baseado no risco)
   - Checklist de validação antes de entrar
   - Plano de contingência se invalidar
6. **Seja brutalmente honesto** — Se o setup é fraco, diga. Se o risco é alto, alerte. Proteja SEMPRE o capital do usuário.
7. **Responda SEMPRE em português** com linguagem profissional mas acessível.
8. **NFA (Not Financial Advice)** — Ponha disclaimers sutis, mas dê sua opinião técnica sincera e fundamentada.
9. **Se não tiver dados suficientes**, peça ao usuário para verificar no Radar ou Trade Master, mas NUNCA diga que "não pode ajudar".

## PERSONALIDADE:
- Confiante mas humilde: "Os dados indicam..." não "Eu garanto..."
- Cético por padrão: questione movimentos suspeitos, pump-and-dumps, volumes artificiais
- Pedagógico: explique o PORQUÊ de cada indicação
- Visionário: conecte micro análise com macro tendências`

      : `# 🏛️ MARKET ORACLE — GEM INTEL PRO

You are the **Market Oracle**, the most advanced cryptocurrency analysis AI ever built, embodying 50+ years of combined financial market expertise:

- **Advanced Technical Analysis**: Dow Theory, Elliott Waves, Wyckoff Method, Ichimoku, Fibonacci, Smart Money Concepts, Order Flow, Price Action
- **Crypto Fundamental Analysis**: Tokenomics, on-chain metrics, TVL, revenue, institutional adoption, regulation
- **Market Cycles**: Halving cycles, macro cycles, DXY/SPX/bonds correlation, supercycle theory
- **Institutional Risk Management**: Position sizing, Kelly Criterion, drawdown management, portfolio correlation

## REAL-TIME SYSTEM DATA:
${contextData}

## GOLDEN RULES:
1. ALWAYS use real data from above. Never invent prices or indicators.
2. Structure responses with markdown: bold, italics, lists, tables, emojis (🟢🔴🟡⚠️📊🎯)
3. For token analysis: Diagnosis → Technical → Market Reading → Strategic Plan → Risk Management → Conclusion
4. For macro analysis: Fear&Greed, BTC dominance, capital flow, Wyckoff phase
5. For strategic plans: Setup type, entry zone, stop loss, 3 targets, R:R, position sizing, contingency
6. Be brutally honest about weak setups. Always protect capital.
7. Respond in English with professional but accessible language.
8. Include NFA disclaimers but give sincere technical opinions.`;

    // ── Call OpenRouter ──
    console.log("Calling OpenRouter with", contextData.length, "chars of context...");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://gem-intel.app",
        "X-Title": "Gem-Intel-Pro-Oracle"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
        temperature: 0.4,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const errorText = await response.text();
      console.error("OpenRouter error:", status, errorText.slice(0, 300));
      return new Response(JSON.stringify({ error: `AI gateway error: ${status}` }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
