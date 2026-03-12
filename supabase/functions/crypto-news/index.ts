import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const ticker = body?.ticker;

    if (!ticker) {
      return new Response(JSON.stringify({ error: "Ticker is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Attempt to use API KEY if available, otherwise just use URL
    const API_KEY = Deno.env.get("CRYPTOPANIC_API_KEY");
    let apiUrl = `https://cryptopanic.com/api/v1/posts/?currencies=${ticker}&kind=news&public=true`;

    // In case there is no API key available, we will try the /free endpoint
    if (API_KEY) {
      apiUrl += `&auth_token=${API_KEY}`;
    } else {
      apiUrl = `https://cryptopanic.com/api/free/v1/posts/?currencies=${ticker}&kind=news&public=true`;
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`CryptoPanic API Error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("News fetch error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
