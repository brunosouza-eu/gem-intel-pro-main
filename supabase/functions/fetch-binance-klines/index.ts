const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { symbol, interval = "4h", limit = 100 } = await req.json();

        if (!symbol) {
            return new Response(
                JSON.stringify({ error: "Symbol is required" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Helper to fetch candles
        const fetchCandles = async (baseUrl: string, isFutures: boolean = false) => {
            const url = `${baseUrl}?symbol=${symbol}USDT&interval=${interval}&limit=${limit}`;
            // Use user-agent to avoid blocks
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            if (!res.ok) {
                const text = await res.text();
                console.error(`Fetch failed for ${url}: ${res.status} ${text}`);
                throw new Error(`Status ${res.status}: ${text}`);
            }
            return await res.json();
        };

        let data;
        let usedSource = 'spot';

        try {
            // Try Spot API first
            data = await fetchCandles('https://api.binance.com/api/v3/klines');
        } catch (spotError) {
            console.log(`Spot API failed for ${symbol}, trying Futures... Error: ${spotError.message}`);
            try {
                // Try Futures API
                data = await fetchCandles('https://fapi.binance.com/fapi/v1/klines', true);
                usedSource = 'futures';
            } catch (futuresError) {
                console.error(`Futures API also failed for ${symbol}. Error: ${futuresError.message}`);
                throw new Error(`Token ${symbol} not found on Binance Spot or Futures`);
            }
        }

        // Transform to our format
        const candles = data.map((candle: any) => ({
            time: candle[0],
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5]),
        }));

        return new Response(
            JSON.stringify({ success: true, candles, symbol, source: usedSource }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("fetch-binance-klines error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
