import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Auth client to verify user
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: authData, error: authError } = await authClient.auth.getClaims(token);
    if (authError || !authData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { ticker } = await req.json();

    if (!ticker) {
      return new Response(JSON.stringify({ error: 'Ticker is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role to bypass RLS for fetching analysis data
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Fetching analysis for ticker: ${ticker}`);

    // Fetch the token analysis from database (use maybeSingle to handle multiple timeframes)
    const { data: analysis, error: fetchError } = await supabase
      .from('token_analysis')
      .select('*')
      .eq('ticker', ticker)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log(`Fetch result - data: ${!!analysis}, error: ${fetchError?.message || 'none'}`);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(JSON.stringify({ error: 'Database error', details: fetchError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!analysis) {
      console.log(`No analysis found for ticker: ${ticker}`);
      return new Response(JSON.stringify({ error: 'Token analysis not found', ticker }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare comprehensive analysis data
    const analysisData = {
      ticker: analysis.ticker,
      timeframe: analysis.timeframe,
      price: analysis.current_price,
      change24h: analysis.change_24h,
      // EMAs
      ema21: analysis.ema_21,
      ema50: analysis.ema_50,
      ema100: analysis.ema_100,
      ema200: analysis.ema_200,
      // Momentum
      rsi: analysis.rsi,
      macd: {
        line: analysis.macd_line,
        signal: analysis.macd_signal,
        histogram: analysis.macd_histogram,
      },
      // Trend
      adx: analysis.adx,
      diPlus: analysis.di_plus,
      diMinus: analysis.di_minus,
      supertrend: {
        direction: analysis.supertrend_direction,
        value: analysis.supertrend_value,
      },
      htfTrend: analysis.htf_trend,
      // Ichimoku
      tenkan: analysis.tenkan,
      kijun: analysis.kijun,
      senkouA: analysis.senkou_a,
      senkouB: analysis.senkou_b,
      cloudPosition: analysis.cloud_position,
      // Fibonacci
      fibZone: analysis.fib_zone,
      fibLevels: {
        fib236: analysis.fib_236,
        fib382: analysis.fib_382,
        fib500: analysis.fib_500,
        fib618: analysis.fib_618,
        fib786: analysis.fib_786,
      },
      // Levels
      support: analysis.key_support,
      resistance: analysis.key_resistance,
      stopLoss: analysis.stop_loss,
      takeProfit: analysis.take_profit,
      riskReward: analysis.risk_reward,
      atr: analysis.atr,
      // Volume
      volumeRatio: analysis.volume_ratio,
      buyPressure: analysis.buy_pressure,
      // Signals
      buyScore: analysis.buy_score,
      sellScore: analysis.sell_score,
      signal: analysis.signal,
      patterns: analysis.patterns_detected,
      updatedAt: analysis.updated_at,
    };

    const currentDate = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const systemPrompt = `Você é um analista técnico PROFISSIONAL de criptomoedas com 20+ anos de experiência nos mercados financeiros.

Você irá gerar uma **ANÁLISE TÉCNICA COMPLETA E PROFISSIONAL** no estilo de um relatório institucional.

## FORMATAÇÃO OBRIGATÓRIA:

### REGRAS DE FORMATAÇÃO CRÍTICAS:
1. Use **texto em negrito** para todos os valores numéricos importantes (preços, porcentagens, níveis)
2. Deixe uma LINHA EM BRANCO entre cada seção/parágrafo
3. Use \`código\` para destacar tickers e indicadores técnicos
4. Use --- para criar separadores visuais entre grandes seções
5. Use > para citações/alertas importantes
6. Em listas, destaque o termo principal em **negrito**

## ESTRUTURA OBRIGATÓRIA:

# 🚀 ANÁLISE TÉCNICA COMPLETA: {TICKER}/USDT

**📅 Data:** {DATA}

---

## 📊 PANORAMA GERAL DO MERCADO

- **Par:** {TICKER}/USDT
- **Preço Atual:** **$X.XX**
- **Variação 24h:** **+X.XX%** ou **-X.XX%**
- Contexto macro do mercado

---

## 🔍 ANÁLISE MULTI-TIMEFRAME

### ⏱️ 1 Hora (Movimento Imediato)
Descrição detalhada...

### ⏱️ 4 Horas (Curto Prazo)
Descrição detalhada...

### 📅 Diário (Tendência Primária)
Descrição detalhada...

### 📆 Semanal (Perspectiva Macro)
Descrição detalhada...

---

## 📈 INDICADORES TÉCNICOS DETALHADOS

### 📉 Médias Móveis (EMAs)
- **EMA 21:** $X.XX - Interpretação
- **EMA 50:** $X.XX - Interpretação
- **EMA 100:** $X.XX - Interpretação
- **EMA 200:** $X.XX - Interpretação

### 📊 Momentum
- **RSI:** **XX** - Zona de sobrecompra/sobrevenda
- **MACD:** Linha: X.XX | Sinal: X.XX | Histograma: X.XX

### 📈 Força da Tendência
- **ADX:** **XX** - Força da tendência
- **DI+:** XX | **DI-:** XX
- **Supertrend:** Direção e valor

### ☁️ Ichimoku Cloud
- Posição na nuvem e interpretação

### 📊 Volume
- **Volume Ratio:** X.XX
- Pressão compradora/vendedora

---

## 🎯 NÍVEIS TÉCNICOS CRÍTICOS

### 🔴 Resistências
- **R1:** $X.XX (mais próxima)
- **R2:** $X.XX
- **R3:** $X.XX (forte)

### 🟢 Suportes
- **S1:** $X.XX (mais próximo)
- **S2:** $X.XX
- **S3:** $X.XX (forte)

### 🔮 Fibonacci
- **23.6%:** $X.XX
- **38.2%:** $X.XX
- **50.0%:** $X.XX
- **61.8%:** $X.XX (golden)
- **78.6%:** $X.XX

---

## 💡 CENÁRIOS E ESTRATÉGIAS

### 🟢 Cenário BULLISH (XX% probabilidade)

> **Condições de ativação:** Descrição

- **Entrada:** $X.XX - $X.XX
- **Stop Loss:** $X.XX (**-X%**)
- **Alvos:**
  - TP1: $X.XX (**+X%**)
  - TP2: $X.XX (**+X%**)
  - TP3: $X.XX (**+X%**)

### 🔴 Cenário BEARISH (XX% probabilidade)

> **Condições de ativação:** Descrição

- **Entrada Short:** $X.XX - $X.XX
- **Stop Loss:** $X.XX (**-X%**)
- **Alvos:**
  - TP1: $X.XX (**+X%**)
  - TP2: $X.XX (**+X%**)

### ⚪ Cenário NEUTRO (XX% probabilidade)
- Range trading entre $X.XX e $X.XX

---

## ⚠️ GESTÃO DE RISCO

> **IMPORTANTE:** Nunca arrisque mais de 1-2% do capital por operação

- **Stop Loss Sugerido:** $X.XX
- **Take Profits Escalonados:**
  - TP1 (33%): $X.XX
  - TP2 (33%): $X.XX
  - TP3 (34%): $X.XX
- **Risk:Reward:** **1:X**
- **Tamanho de Posição Sugerido:** X% do portfólio

---

## 🎬 CONCLUSÃO E RECOMENDAÇÃO

### 📋 Resumo Executivo
Resumo em 2-3 frases.

### ✅ Ação Recomendada
**COMPRAR** / **VENDER** / **AGUARDAR**

### 📊 Nível de Confiança
**XX/100** ⭐⭐⭐⭐⭐

### 👁️ Próximos Níveis a Monitorar
- Romper $X.XX confirma alta
- Perder $X.XX confirma baixa

---

*Esta análise é educacional. Faça sua própria pesquisa antes de investir.*

## REGRAS FINAIS:
1. Use MUITOS emojis para deixar visual e atrativo
2. Seja ESPECÍFICO com valores numéricos e porcentagens
3. Inclua probabilidades realistas baseadas nos dados
4. Dê pontos de entrada EXATOS
5. Mencione padrões gráficos se identificados
6. Compare com contexto do Bitcoin/mercado geral
7. Inclua alertas de risco quando necessário
8. A análise deve ter pelo menos 2000 palavras
9. Seja profissional mas acessível
10. SEMPRE deixe linhas em branco entre seções para melhor legibilidade

Data/Hora atual: ${currentDate}`;

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generating complete analysis for ${ticker}...`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://gem-intel.app',
        'X-Title': 'Gem Intel Pro'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Gere uma análise técnica completa e profissional para este token baseado nos seguintes dados dos indicadores:\n\n${JSON.stringify(analysisData, null, 2)}`
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await response.json();
    const analysisText = result.choices?.[0]?.message?.content || 'Unable to generate analysis';

    console.log(`Complete analysis generated for ${ticker}`);

    return new Response(JSON.stringify({
      analysis: analysisText,
      ticker,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-token-complete:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
