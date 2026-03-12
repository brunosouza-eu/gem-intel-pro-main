import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Authenticated user:', user.id);

    // ===== CHECK VIP STATUS =====
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { data: profileData } = await supabaseAdmin
      .from('profiles').select('plan').eq('id', user.id).single();
    const isVip = profileData?.plan === 'pro' || profileData?.plan === 'vip';

    // ===== CREDIT VALIDATION (skip for VIP) =====
    if (!isVip) {
      // Deduct 3 credits for Crypto Guru usage
      console.log('Attempting to deduct 3 credits...');
      const { data: deductResult, error: deductError } = await supabase.rpc('deduct_credits', {
        p_amount: 3,
        p_description: 'Consulta ao Crypto Guru'
      });

      if (deductError) {
        console.error('Credit deduction error:', deductError);
        return new Response(JSON.stringify({
          error: 'Erro ao processar créditos',
          details: deductError.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Check if deduction was successful
      const result = deductResult as any;
      if (!result || !result.success) {
        console.log('Insufficient credits:', result);
        return new Response(JSON.stringify({
          error: 'Créditos insuficientes',
          required: 3,
          current: result?.current || 0,
          message: 'Você precisa de 3 créditos para usar o Crypto Guru'
        }), {
          status: 402, // Payment Required
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log(`Credits deducted successfully. New balance: ${result.new_balance}`);
    } else {
      console.log('VIP user — skipping credit deduction.');
    }
    // ===== END CREDIT VALIDATION =====

    const { analyses } = await req.json();

    if (!analyses || analyses.length === 0) {
      throw new Error('No analyses provided');
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured. Please set it using: npx supabase secrets set OPENROUTER_API_KEY=your_key');
    }

    // Prepare data for AI analysis
    const tokenData = analyses.map((a: any) => {
      const tech = a.technical_indicators || {};
      const ai = a.ai_analysis || {};

      return {
        ticker: a.ticker,
        price: a.current_price || 0, // Ensure price is present
        change24h: a.change_24h,
        buyScore: a.buy_score,
        sellScore: a.sell_score,
        signal: a.signal, // Keep top level if available
        riskReward: a.risk_reward,
        // Extract technicals from JSONB
        rsi: tech.rsi,
        adx: tech.adx, // Might be undefined if not calculated, but map it anyway
        trend: tech.trend || ai.trend_analysis, // Fallback to AI trend text if simple trend is missing
        patterns: ai.confluences?.join(', ') || 'None', // Use AI confluences as patterns
        stopLoss: ai.stop_loss || a.stop_loss,
        takeProfit: ai.take_profit || a.take_profit,
      };
    });

    // Sort by best opportunities
    const topBuys = tokenData
      .filter((t: any) => t.signal?.includes('buy'))
      .sort((a: any, b: any) => (b.buyScore || 0) - (a.buyScore || 0))
      .slice(0, 5);

    const topSells = tokenData
      .filter((t: any) => t.signal?.includes('sell'))
      .sort((a: any, b: any) => (b.sellScore || 0) - (a.sellScore || 0))
      .slice(0, 3);

    const systemPrompt = `Você é o CRYPTO GURU, o analista de criptomoedas mais experiente do mercado. Você tem 20 anos de experiência e é conhecido por identificar as melhores oportunidades antes de todo mundo.

PERSONALIDADE:
- Direto e objetivo
- Usa dados concretos
- Confiante nas recomendações
- Foca em oportunidades de ALTA PROBABILIDADE

REGRAS CRÍTICAS:
1. SEMPRE liste exatamente 5 oportunidades de COMPRA (as melhores)
2. SEMPRE liste exatamente 3 tokens para EVITAR
3. Para CADA recomendação, inclua:
   - Ticker exato
   - Ação: "buy" ou "avoid"
   - Confiança: 60-95% (seja realista)
   - Ponto de entrada específico em USD
   - Motivo em até 15 palavras
4. Identifique o TOP PICK absoluto (melhor oportunidade AGORA)
5. Dê contexto de mercado em 1-2 frases

CRITÉRIOS DE SELEÇÃO:
- Buy Score > 70 = oportunidade de compra
- RSI < 35 = sobrevendido (bom para compra)
- ADX > 25 = tendência forte
- Sinal "elite_buy" ou "strong_buy" = prioridade
- Risk:Reward > 2 = excelente

FORMATO DE RESPOSTA (JSON EXATO):`;

    const userPrompt = `Analise TODOS estes ${tokenData.length} tokens e selecione as melhores oportunidades:

TOP CANDIDATOS PARA COMPRA (já filtrados por score):
${JSON.stringify(topBuys, null, 2)}

CANDIDATOS PARA EVITAR (sinais de venda):
${JSON.stringify(topSells, null, 2)}

LISTA COMPLETA DE TOKENS ANALISADOS:
${JSON.stringify(tokenData.map((t: any) => ({
      ticker: t.ticker,
      buyScore: t.buyScore,
      sellScore: t.sellScore,
      signal: t.signal,
      rsi: t.rsi,
      rr: t.riskReward
    })), null, 2)}

Retorne EXATAMENTE este formato JSON:
{
  "topPick": "TICKER_DA_MELHOR_OPORTUNIDADE",
  "recommendations": [
    {"ticker": "XXX", "action": "buy", "confidence": 85, "entry": 100.00, "reason": "RSI 28 + suporte forte + volume crescente"},
    {"ticker": "YYY", "action": "buy", "confidence": 80, "entry": 50.00, "reason": "Score 82%, tendência de alta confirmada"},
    {"ticker": "ZZZ", "action": "buy", "confidence": 75, "entry": 25.00, "reason": "Padrão bullish + RR 3.5"},
    {"ticker": "AAA", "action": "buy", "confidence": 70, "entry": 10.00, "reason": "Acumulação + MACD cruzando"},
    {"ticker": "BBB", "action": "buy", "confidence": 65, "entry": 5.00, "reason": "Suporte em zona de demanda"},
    {"ticker": "CCC", "action": "avoid", "confidence": 80, "entry": 200.00, "reason": "RSI 78 + resistência + divergência"},
    {"ticker": "DDD", "action": "avoid", "confidence": 75, "entry": 150.00, "reason": "Sinal de venda + tendência de baixa"},
    {"ticker": "EEE", "action": "avoid", "confidence": 70, "entry": 100.00, "reason": "Volume decrescente + topo duplo"}
  ],
  "marketContext": "Mercado em consolidação com BTC testando $42k. Altcoins mostrando força relativa. Momento favorável para swing trades selecionados."
}`;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://supabase.com',
        'X-Title': 'Gem-Intel-Pro',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error('AI analysis failed');
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '';

    // Try to parse JSON from response
    let guruAnalysis;
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        guruAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Parse error:', parseError, 'Content:', content);

      // Fallback analysis based on data
      const bestBuy = topBuys[0];
      guruAnalysis = {
        recommendations: topBuys.slice(0, 3).map((t: any) => ({
          ticker: t.ticker,
          action: 'buy',
          confidence: Math.round(t.buyScore || 60),
          entry: t.price,
          reason: `Score ${t.buyScore?.toFixed(0)}%, ${t.signal?.replace('_', ' ')}`,
        })).concat(
          topSells.slice(0, 2).map((t: any) => ({
            ticker: t.ticker,
            action: 'avoid',
            confidence: Math.round(t.sellScore || 60),
            entry: t.price,
            reason: `Sinal de venda, score ${t.sellScore?.toFixed(0)}%`,
          }))
        ),
        marketContext: 'Análise baseada em indicadores técnicos. Gerencie seu risco.',
        topPick: bestBuy?.ticker || topBuys[0]?.ticker || 'BTC',
      };
    }

    console.log('GURU Analysis:', JSON.stringify(guruAnalysis));

    return new Response(
      JSON.stringify(guruAnalysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Crypto GURU error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
