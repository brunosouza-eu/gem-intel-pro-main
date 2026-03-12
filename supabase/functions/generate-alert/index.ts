import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== GENERATE-ALERT FUNCTION START ===");

    // Step 1: Check auth header
    const authHeader = req.headers.get('Authorization');
    console.log("Auth header present:", !!authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
      console.log("ERROR: No valid auth header");
      return new Response(JSON.stringify({ error: 'Unauthorized - no auth header' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Step 2: Create auth client and verify user
    console.log("Creating Supabase auth client...");
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token);

    if (userError || !user) {
      console.log("ERROR: Auth failed:", userError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized - ' + (userError?.message || 'no user') }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log("User authenticated:", user.id);

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
      // Deduct 5 credits for Alert Generation
      console.log("Attempting to deduct 5 credits...");
      const { data: deductResult, error: deductError } = await supabaseAuth.rpc('deduct_credits', {
        p_amount: 5,
        p_description: 'Geração de Alerta Estruturado'
      });

      if (deductError) {
        console.error("Credit deduction error:", deductError);
        return new Response(JSON.stringify({
          error: 'Erro ao processar créditos',
          details: deductError.message
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Check if deduction was successful
      const result = deductResult as any;
      if (!result || !result.success) {
        console.log("Insufficient credits:", result);
        return new Response(JSON.stringify({
          error: 'Créditos insuficientes',
          required: 5,
          current: result?.current || 0,
          message: 'Você precisa de 5 créditos para gerar um alerta'
        }), {
          status: 402, // Payment Required
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      console.log(`Credits deducted successfully. New balance: ${result.new_balance}`);
    } else {
      console.log('VIP user — skipping credit deduction.');
    }
    // ===== END CREDIT VALIDATION =====

    // Step 3: Parse request body
    console.log("Parsing request body...");
    const body = await req.json();
    const { token_id } = body;
    console.log("Token ID:", token_id);

    if (!token_id) {
      return new Response(JSON.stringify({ error: 'token_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Step 4: Check API key
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    console.log("OPENROUTER_API_KEY present:", !!OPENROUTER_API_KEY);

    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENROUTER_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Step 5: Create service client and fetch token
    console.log("Creating Supabase service client...");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("Fetching token data...");
    const { data: tokenData, error: tokenError } = await supabase
      .from("tokens")
      .select("*")
      .eq("id", token_id)
      .single();

    if (tokenError || !tokenData) {
      console.log("ERROR: Token not found:", tokenError?.message);
      return new Response(JSON.stringify({ error: 'Token not found: ' + (tokenError?.message || 'no data') }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log("Token found:", tokenData.ticker);

    // Step 6: Fetch real-time price from Binance
    console.log("Fetching real-time price from Binance...");
    let currentPrice = 0;
    let priceInfo = "";
    try {
      const binanceRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${tokenData.ticker}USDT`);
      if (binanceRes.ok) {
        const bd = await binanceRes.json();
        currentPrice = parseFloat(bd.lastPrice);
        const high24h = parseFloat(bd.highPrice);
        const low24h = parseFloat(bd.lowPrice);
        const change = parseFloat(bd.priceChangePercent);

        // Determine appropriate decimal places based on price magnitude
        const decimals = currentPrice >= 1000 ? 2 : currentPrice >= 1 ? 4 : currentPrice >= 0.01 ? 6 : 8;

        priceInfo = `
=== REAL-TIME BINANCE DATA (MANDATORY - USE THESE EXACT VALUES) ===
CURRENT PRICE: $${currentPrice.toFixed(decimals)}
24h HIGH:      $${high24h.toFixed(decimals)}
24h LOW:       $${low24h.toFixed(decimals)}
24h CHANGE:    ${change.toFixed(2)}%
24h VOLUME:    ${parseFloat(bd.volume).toLocaleString()} ${tokenData.ticker}
=== END REAL-TIME DATA ===`;

        console.log("Binance price fetched:", currentPrice);
      }
    } catch (priceErr) {
      console.log("Warning: Could not fetch Binance price:", priceErr);
    }

    // Fallback: use database price if Binance failed
    if (currentPrice === 0 && tokenData.current_price) {
      currentPrice = tokenData.current_price;
      priceInfo = `\n=== DATABASE PRICE (Binance unavailable) ===\nCURRENT PRICE: $${currentPrice}\n=== END ===`;
    }

    if (currentPrice === 0) {
      return new Response(JSON.stringify({ error: `Could not get current price for ${tokenData.ticker}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Step 7: Call OpenRouter API with real data and strong anti-hallucination prompt
    const prompt = `Analyze ${tokenData.name} (${tokenData.ticker}) and generate a structured swing trade alert.

${priceInfo}

⚠️ MANDATORY PRICE RULES (VIOLATION = INVALID RESPONSE):
- The current price is $${currentPrice}. ALL your prices MUST be near this value.
- ENTRY ZONE: Must be between $${(currentPrice * 0.95).toPrecision(6)} and $${(currentPrice * 1.02).toPrecision(6)} (within -5% to +2% of current price $${currentPrice}).
- STOP LOSS: Must be between $${(currentPrice * 0.88).toPrecision(6)} and $${(currentPrice * 0.97).toPrecision(6)} (3-12% below current price).
- TARGETS: Must be between $${(currentPrice * 1.03).toPrecision(6)} and $${(currentPrice * 1.30).toPrecision(6)} (3-30% above current price).
- DO NOT generate prices that are far from $${currentPrice}. If you output entry = $41,800 when price is $67,000, that is COMPLETELY WRONG.

Return ONLY a valid JSON object:
{
  "entry_zone": "$XX,XXX - $XX,XXX",
  "stop": "$XX,XXX",
  "targets": ["$XX,XXX", "$XX,XXX", "$XX,XXX"],
  "risk_reward": "1:X.X",
  "invalidation": "condição em português",
  "volatility_note": "nota em português"
}`;

    console.log("Calling OpenRouter API...");
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://gem-intel.app",
        "X-Title": "Gem Intel Pro"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          {
            role: "system",
            content: `You are a professional crypto trading analyst. The CURRENT PRICE of ${tokenData.ticker} is exactly $${currentPrice}. ALL prices in your response MUST be within 15% of $${currentPrice}. Never invent prices. Return only valid JSON.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      }),
    });

    console.log("OpenRouter response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("OpenRouter error:", errorText);
      return new Response(JSON.stringify({ error: `OpenRouter error: ${response.status} - ${errorText.slice(0, 200)}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const aiData = await response.json();
    console.log("OpenRouter response received");

    // Step 8: Extract JSON from response
    const content = aiData.choices?.[0]?.message?.content || '';
    console.log("Content length:", content.length);

    // Try to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log("No JSON found in content:", content.slice(0, 200));
      return new Response(JSON.stringify({ error: 'No JSON in AI response' }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    let alertData;
    try {
      alertData = JSON.parse(jsonMatch[0]);
      console.log("Parsed alert data:", JSON.stringify(alertData).slice(0, 200));
    } catch (parseError) {
      console.log("JSON parse error:", parseError);
      return new Response(JSON.stringify({ error: 'Failed to parse AI JSON' }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Step 9: SERVER-SIDE VALIDATION — reject hallucinated prices
    console.log("Validating AI prices against current price...");
    const extractFirstNumber = (str: string | undefined): number | null => {
      if (!str) return null;
      const match = str.replace(/,/g, '').match(/[\d.]+/);
      return match ? parseFloat(match[0]) : null;
    };

    const entryPrice = extractFirstNumber(alertData.entry_zone);
    if (entryPrice !== null) {
      const deviation = Math.abs(entryPrice - currentPrice) / currentPrice;
      console.log(`Entry price: $${entryPrice}, Current: $${currentPrice}, Deviation: ${(deviation * 100).toFixed(1)}%`);

      if (deviation > 0.15) {
        console.log(`REJECTED: Entry zone $${entryPrice} is ${(deviation * 100).toFixed(1)}% away from current price $${currentPrice}. Hallucinated!`);

        // Auto-correct instead of failing: generate safe defaults
        const decimals = currentPrice >= 1000 ? 0 : currentPrice >= 1 ? 2 : currentPrice >= 0.01 ? 4 : 6;
        const entryLow = currentPrice * 0.97;
        const entryHigh = currentPrice * 0.99;
        const stop = currentPrice * 0.93;
        const t1 = currentPrice * 1.05;
        const t2 = currentPrice * 1.10;
        const t3 = currentPrice * 1.15;

        alertData.entry_zone = `$${entryLow.toFixed(decimals)} - $${entryHigh.toFixed(decimals)}`;
        alertData.stop = `$${stop.toFixed(decimals)}`;
        alertData.targets = [`$${t1.toFixed(decimals)}`, `$${t2.toFixed(decimals)}`, `$${t3.toFixed(decimals)}`];
        alertData.risk_reward = '1:2.5';
        alertData.invalidation = alertData.invalidation || `Fechamento diário abaixo de $${stop.toFixed(decimals)}`;
        alertData.volatility_note = alertData.volatility_note || 'Valores corrigidos automaticamente com base no preço real de mercado';

        console.log("Auto-corrected alert with safe defaults based on real price.");
      }
    }

    // Step 10: Insert into database
    console.log("Inserting alert into database...");
    const alertTitle = `${tokenData.ticker} Alert - ${new Date().toLocaleDateString()}`;

    const { error: insertError } = await supabase.from("alerts").insert({
      token_id,
      created_by: user.id,
      title: alertTitle,
      entry_zone: alertData.entry_zone || 'N/A',
      stop: alertData.stop || 'N/A',
      targets: JSON.stringify(alertData.targets || []),
      risk_reward: alertData.risk_reward || 'N/A',
      invalidation: alertData.invalidation || null,
      volatility_note: alertData.volatility_note || null
    });

    if (insertError) {
      console.log("Database insert error:", insertError);
      return new Response(JSON.stringify({ error: 'Database error: ' + insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log("=== GENERATE-ALERT SUCCESS ===");
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error("UNCAUGHT ERROR:", e);
    return new Response(JSON.stringify({
      error: e instanceof Error ? e.message : "Unknown error",
      stack: e instanceof Error ? e.stack : undefined
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});