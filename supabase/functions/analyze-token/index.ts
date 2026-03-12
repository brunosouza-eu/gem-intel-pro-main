import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Verify authentication
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
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log('Authenticated user:', user.id);

    const { token_id } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: tokenData, error } = await supabase.from("tokens").select("*").eq("id", token_id).single();
    if (error || !tokenData) throw new Error("Token not found");

    const prompt = `Analise detalhadamente o token ${tokenData.name} (${tokenData.ticker}):
- Score de Assimetria: ${tokenData.score}
- Status: ${tokenData.status}
- Narrativa: ${tokenData.narrative || 'Não definida'}
- Market Cap: $${tokenData.market_cap?.toLocaleString() || 'N/A'}
- Volume 24h: $${tokenData.volume_24h?.toLocaleString() || 'N/A'}
- FDV: $${tokenData.fdv?.toLocaleString() || 'N/A'}
- Estrutura: ${tokenData.structure || 'N/A'}
- Unlocks: ${tokenData.unlocks || 'N/A'}

Forneça uma análise completa incluindo: pontos fortes, riscos, cenários de alta/baixa e considerações finais. Seja objetivo e educativo.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://gem-intel.app",
        "X-Title": "Gem Intel Pro"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }],
        stream: true,
      }),
    });

    if (!response.ok) throw new Error("AI error");
    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("analyze-token error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
