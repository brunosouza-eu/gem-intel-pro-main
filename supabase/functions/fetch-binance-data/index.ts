import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Lista expandida de 75+ criptomoedas organizadas por categoria
const CRYPTO_SYMBOLS = [
  // Majors (5)
  { symbol: 'BTCUSDT', name: 'Bitcoin', ticker: 'BTC', category: 'majors', cgId: 'bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum', ticker: 'ETH', category: 'majors', cgId: 'ethereum' },
  { symbol: 'BNBUSDT', name: 'BNB', ticker: 'BNB', category: 'majors', cgId: 'binancecoin' },
  { symbol: 'SOLUSDT', name: 'Solana', ticker: 'SOL', category: 'majors', cgId: 'solana' },
  { symbol: 'XRPUSDT', name: 'XRP', ticker: 'XRP', category: 'majors', cgId: 'ripple' },
  
  // Layer 1 (15)
  { symbol: 'ADAUSDT', name: 'Cardano', ticker: 'ADA', category: 'layer1', cgId: 'cardano' },
  { symbol: 'AVAXUSDT', name: 'Avalanche', ticker: 'AVAX', category: 'layer1', cgId: 'avalanche-2' },
  { symbol: 'DOTUSDT', name: 'Polkadot', ticker: 'DOT', category: 'layer1', cgId: 'polkadot' },
  { symbol: 'NEARUSDT', name: 'NEAR Protocol', ticker: 'NEAR', category: 'layer1', cgId: 'near' },
  { symbol: 'ATOMUSDT', name: 'Cosmos', ticker: 'ATOM', category: 'layer1', cgId: 'cosmos' },
  { symbol: 'SUIUSDT', name: 'Sui', ticker: 'SUI', category: 'layer1', cgId: 'sui' },
  { symbol: 'APTUSDT', name: 'Aptos', ticker: 'APT', category: 'layer1', cgId: 'aptos' },
  { symbol: 'SEIUSDT', name: 'Sei', ticker: 'SEI', category: 'layer1', cgId: 'sei-network' },
  { symbol: 'TIAUSDT', name: 'Celestia', ticker: 'TIA', category: 'layer1', cgId: 'celestia' },
  { symbol: 'TONUSDT', name: 'Toncoin', ticker: 'TON', category: 'layer1', cgId: 'the-open-network' },
  { symbol: 'HBARUSDT', name: 'Hedera', ticker: 'HBAR', category: 'layer1', cgId: 'hedera-hashgraph' },
  { symbol: 'ALGOUSDT', name: 'Algorand', ticker: 'ALGO', category: 'layer1', cgId: 'algorand' },
  { symbol: 'EOSUSDT', name: 'EOS', ticker: 'EOS', category: 'layer1', cgId: 'eos' },
  { symbol: 'KAVAUSDT', name: 'Kava', ticker: 'KAVA', category: 'layer1', cgId: 'kava' },
  { symbol: 'CELOUSDT', name: 'Celo', ticker: 'CELO', category: 'layer1', cgId: 'celo' },
  
  // DeFi (12)
  { symbol: 'AAVEUSDT', name: 'Aave', ticker: 'AAVE', category: 'defi', cgId: 'aave' },
  { symbol: 'UNIUSDT', name: 'Uniswap', ticker: 'UNI', category: 'defi', cgId: 'uniswap' },
  { symbol: 'MKRUSDT', name: 'Maker', ticker: 'MKR', category: 'defi', cgId: 'maker' },
  { symbol: 'CRVUSDT', name: 'Curve', ticker: 'CRV', category: 'defi', cgId: 'curve-dao-token' },
  { symbol: 'LDOUSDT', name: 'Lido', ticker: 'LDO', category: 'defi', cgId: 'lido-dao' },
  { symbol: 'PENDLEUSDT', name: 'Pendle', ticker: 'PENDLE', category: 'defi', cgId: 'pendle' },
  { symbol: 'SNXUSDT', name: 'Synthetix', ticker: 'SNX', category: 'defi', cgId: 'havven' },
  { symbol: 'COMPUSDT', name: 'Compound', ticker: 'COMP', category: 'defi', cgId: 'compound-governance-token' },
  { symbol: 'DYDXUSDT', name: 'dYdX', ticker: 'DYDX', category: 'defi', cgId: 'dydx' },
  { symbol: 'SUSHIUSDT', name: 'Sushi', ticker: 'SUSHI', category: 'defi', cgId: 'sushi' },
  { symbol: '1INCHUSDT', name: '1inch', ticker: '1INCH', category: 'defi', cgId: '1inch' },
  { symbol: 'BALUSDT', name: 'Balancer', ticker: 'BAL', category: 'defi', cgId: 'balancer' },
  
  // AI & Gaming (12)
  { symbol: 'RENDERUSDT', name: 'Render', ticker: 'RENDER', category: 'ai_gaming', cgId: 'render-token' },
  { symbol: 'FETUSDT', name: 'Fetch.ai', ticker: 'FET', category: 'ai_gaming', cgId: 'fetch-ai' },
  { symbol: 'TAOUSDT', name: 'Bittensor', ticker: 'TAO', category: 'ai_gaming', cgId: 'bittensor' },
  { symbol: 'WLDUSDT', name: 'Worldcoin', ticker: 'WLD', category: 'ai_gaming', cgId: 'worldcoin-wld' },
  { symbol: 'IMXUSDT', name: 'Immutable', ticker: 'IMX', category: 'ai_gaming', cgId: 'immutable-x' },
  { symbol: 'AXSUSDT', name: 'Axie Infinity', ticker: 'AXS', category: 'ai_gaming', cgId: 'axie-infinity' },
  { symbol: 'GALAUSDT', name: 'Gala', ticker: 'GALA', category: 'ai_gaming', cgId: 'gala' },
  { symbol: 'SANDUSDT', name: 'The Sandbox', ticker: 'SAND', category: 'ai_gaming', cgId: 'the-sandbox' },
  { symbol: 'ENJUSDT', name: 'Enjin', ticker: 'ENJ', category: 'ai_gaming', cgId: 'enjincoin' },
  { symbol: 'MANAUSDT', name: 'Decentraland', ticker: 'MANA', category: 'ai_gaming', cgId: 'decentraland' },
  { symbol: 'ALICEUSDT', name: 'Alice', ticker: 'ALICE', category: 'ai_gaming', cgId: 'my-neighbor-alice' },
  { symbol: 'MAGICUSDT', name: 'Magic', ticker: 'MAGIC', category: 'ai_gaming', cgId: 'magic' },
  
  // Memecoins (10)
  { symbol: 'DOGEUSDT', name: 'Dogecoin', ticker: 'DOGE', category: 'memecoins', cgId: 'dogecoin' },
  { symbol: 'SHIBUSDT', name: 'Shiba Inu', ticker: 'SHIB', category: 'memecoins', cgId: 'shiba-inu' },
  { symbol: 'PEPEUSDT', name: 'Pepe', ticker: 'PEPE', category: 'memecoins', cgId: 'pepe' },
  { symbol: 'FLOKIUSDT', name: 'Floki', ticker: 'FLOKI', category: 'memecoins', cgId: 'floki' },
  { symbol: 'BONKUSDT', name: 'Bonk', ticker: 'BONK', category: 'memecoins', cgId: 'bonk' },
  { symbol: 'WIFUSDT', name: 'dogwifhat', ticker: 'WIF', category: 'memecoins', cgId: 'dogwifcoin' },
  { symbol: 'MEMEUSDT', name: 'Memecoin', ticker: 'MEME', category: 'memecoins', cgId: 'memecoin-2' },
  { symbol: 'TURBOUSDT', name: 'Turbo', ticker: 'TURBO', category: 'memecoins', cgId: 'turbo' },
  { symbol: 'BOMEUSDT', name: 'BOME', ticker: 'BOME', category: 'memecoins', cgId: 'book-of-meme' },
  { symbol: '1000SATSUSDT', name: '1000SATS', ticker: '1000SATS', category: 'memecoins', cgId: '1000sats-ordinals' },
  
  // Infra (10)
  { symbol: 'LINKUSDT', name: 'Chainlink', ticker: 'LINK', category: 'infra', cgId: 'chainlink' },
  { symbol: 'INJUSDT', name: 'Injective', ticker: 'INJ', category: 'infra', cgId: 'injective-protocol' },
  { symbol: 'PYTHUSDT', name: 'Pyth', ticker: 'PYTH', category: 'infra', cgId: 'pyth-network' },
  { symbol: 'ARBUSDT', name: 'Arbitrum', ticker: 'ARB', category: 'infra', cgId: 'arbitrum' },
  { symbol: 'OPUSDT', name: 'Optimism', ticker: 'OP', category: 'infra', cgId: 'optimism' },
  { symbol: 'MATICUSDT', name: 'Polygon', ticker: 'MATIC', category: 'infra', cgId: 'matic-network' },
  { symbol: 'FTMUSDT', name: 'Fantom', ticker: 'FTM', category: 'infra', cgId: 'fantom' },
  { symbol: 'MANTAUSDT', name: 'Manta', ticker: 'MANTA', category: 'infra', cgId: 'manta-network' },
  { symbol: 'STXUSDT', name: 'Stacks', ticker: 'STX', category: 'infra', cgId: 'blockstack' },
  { symbol: 'THETAUSDT', name: 'Theta', ticker: 'THETA', category: 'infra', cgId: 'theta-token' },
  
  // Gems (11)
  { symbol: 'JTOUSDT', name: 'Jito', ticker: 'JTO', category: 'gems', cgId: 'jito-governance-token' },
  { symbol: 'JUPUSDT', name: 'Jupiter', ticker: 'JUP', category: 'gems', cgId: 'jupiter-exchange-solana' },
  { symbol: 'STRKUSDT', name: 'Starknet', ticker: 'STRK', category: 'gems', cgId: 'starknet' },
  { symbol: 'EIGENUSDT', name: 'EigenLayer', ticker: 'EIGEN', category: 'gems', cgId: 'eigenlayer' },
  { symbol: 'ENAUSDT', name: 'Ethena', ticker: 'ENA', category: 'gems', cgId: 'ethena' },
  { symbol: 'WUSDT', name: 'Wormhole', ticker: 'W', category: 'gems', cgId: 'wormhole' },
  { symbol: 'ALTUSDT', name: 'AltLayer', ticker: 'ALT', category: 'gems', cgId: 'altlayer' },
  { symbol: 'BLURUSDT', name: 'Blur', ticker: 'BLUR', category: 'gems', cgId: 'blur' },
  { symbol: 'IDUSDT', name: 'Space ID', ticker: 'ID', category: 'gems', cgId: 'space-id' },
  { symbol: 'ARKMUSDT', name: 'Arkham', ticker: 'ARKM', category: 'gems', cgId: 'arkham' },
  { symbol: 'ZKUSDT', name: 'ZKsync', ticker: 'ZK', category: 'gems', cgId: 'zksync' },
];

interface BinanceTickerResponse {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
}

interface CoinGeckoData {
  market_cap: number | null;
  fully_diluted_valuation: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
}

// Fetch market data from CoinGecko (Market Cap, FDV, Supply)
async function fetchCoinGeckoData(ids: string[]): Promise<Map<string, CoinGeckoData>> {
  const map = new Map<string, CoinGeckoData>();
  
  try {
    // CoinGecko free API has rate limits, fetch in batches
    const batchSize = 50;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const idsParam = batch.join(',');
      
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&sparkline=false`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        data.forEach((coin: any) => {
          map.set(coin.symbol.toUpperCase(), {
            market_cap: coin.market_cap,
            fully_diluted_valuation: coin.fully_diluted_valuation,
            circulating_supply: coin.circulating_supply,
            total_supply: coin.total_supply,
          });
        });
      } else {
        console.log(`CoinGecko API rate limited or error: ${response.status}`);
      }
      
      // Delay between batches to avoid rate limiting
      if (i + batchSize < ids.length) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
  }
  
  return map;
}

// Função para calcular score baseado em métricas
function calculateScore(data: BinanceTickerResponse): number {
  const priceChangePercent = parseFloat(data.priceChangePercent);
  const volume = parseFloat(data.quoteVolume);
  
  // Score base
  let score = 50;
  
  // Ajuste por performance de preço (máx +/- 25 pontos)
  if (priceChangePercent > 10) score += 25;
  else if (priceChangePercent > 5) score += 20;
  else if (priceChangePercent > 2) score += 15;
  else if (priceChangePercent > 0) score += 10;
  else if (priceChangePercent > -2) score += 5;
  else if (priceChangePercent > -5) score -= 5;
  else if (priceChangePercent > -10) score -= 15;
  else score -= 25;
  
  // Ajuste por volume (máx +25 pontos)
  if (volume > 1000000000) score += 25; // > $1B
  else if (volume > 500000000) score += 20;
  else if (volume > 100000000) score += 15;
  else if (volume > 50000000) score += 10;
  else if (volume > 10000000) score += 5;
  
  // Limitar entre 0 e 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Função para determinar status baseado no score e momentum
function determineStatus(score: number, priceChangePercent: number): string {
  if (score >= 80 && priceChangePercent > 5) return 'andamento';
  if (score >= 70 && priceChangePercent > 2) return 'gatilho';
  if (score >= 60) return 'acumulacao';
  return 'observacao';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication - require authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    console.log('Authenticated user:', user.id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Fetching data for ${CRYPTO_SYMBOLS.length} tokens...`);

    // Fetch CoinGecko data for Market Cap, FDV, Supply
    const coinGeckoIds = CRYPTO_SYMBOLS.map(c => c.cgId);
    console.log('Fetching CoinGecko market data...');
    const coinGeckoData = await fetchCoinGeckoData(coinGeckoIds);
    console.log(`Got CoinGecko data for ${coinGeckoData.size} tokens`);

    // Buscar dados da Binance API em batches para evitar timeout
    const allTokensData: BinanceTickerResponse[] = [];
    const batchSize = 20;
    
    for (let i = 0; i < CRYPTO_SYMBOLS.length; i += batchSize) {
      const batch = CRYPTO_SYMBOLS.slice(i, i + batchSize);
      const symbols = batch.map(c => c.symbol);
      const binanceUrl = `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(symbols)}`;
      
      try {
        const binanceResponse = await fetch(binanceUrl);
        
        if (binanceResponse.ok) {
          const batchData = await binanceResponse.json();
          allTokensData.push(...batchData);
        } else {
          console.error(`Binance API error for batch ${i}:`, binanceResponse.status);
        }
      } catch (batchError) {
        console.error(`Error fetching batch ${i}:`, batchError);
      }
    }
    
    console.log(`Received ${allTokensData.length} tickers from Binance`);

    // Processar e inserir/atualizar tokens
    const tokensToUpsert = allTokensData.map((ticker) => {
      const cryptoInfo = CRYPTO_SYMBOLS.find(c => c.symbol === ticker.symbol);
      if (!cryptoInfo) return null;

      const score = calculateScore(ticker);
      const priceChangePercent = parseFloat(ticker.priceChangePercent);
      const status = determineStatus(score, priceChangePercent);
      
      // Get CoinGecko data
      const cgData = coinGeckoData.get(cryptoInfo.ticker);

      return {
        name: cryptoInfo.name,
        ticker: cryptoInfo.ticker,
        score,
        status,
        current_price: parseFloat(ticker.lastPrice),
        market_cap: cgData?.market_cap || null,
        fdv: cgData?.fully_diluted_valuation || null,
        supply: cgData?.circulating_supply || null,
        volume_24h: parseFloat(ticker.quoteVolume),
        change_24h: priceChangePercent,
        narrative: `${cryptoInfo.category.toUpperCase()} | ${priceChangePercent >= 0 ? '📈' : '📉'} ${priceChangePercent.toFixed(2)}% | Vol: $${(parseFloat(ticker.quoteVolume) / 1000000).toFixed(1)}M`,
        updated_at: new Date().toISOString(),
      };
    }).filter(Boolean);

    console.log(`Processing ${tokensToUpsert.length} tokens...`);

    // Upsert tokens (inserir ou atualizar)
    for (const token of tokensToUpsert) {
      if (!token) continue;
      
      // Verificar se o token já existe
      const { data: existingToken } = await supabase
        .from('tokens')
        .select('id')
        .eq('ticker', token.ticker)
        .single();

      if (existingToken) {
        // Atualizar token existente
        const { error: updateError } = await supabase
          .from('tokens')
          .update({
            score: token.score,
            status: token.status,
            current_price: token.current_price,
            market_cap: token.market_cap,
            fdv: token.fdv,
            supply: token.supply,
            volume_24h: token.volume_24h,
            change_24h: token.change_24h,
            narrative: token.narrative,
            updated_at: token.updated_at,
          })
          .eq('id', existingToken.id);

        if (updateError) {
          console.error(`Error updating ${token.ticker}:`, updateError);
        }
      } else {
        // Inserir novo token
        const { error: insertError } = await supabase
          .from('tokens')
          .insert(token);

        if (insertError) {
          console.error(`Error inserting ${token.ticker}:`, insertError);
        }
      }
    }

    // Atualizar macro_view com dados do BTC
    const btcData = allTokensData.find(t => t.symbol === 'BTCUSDT');
    if (btcData) {
      const btcChange = parseFloat(btcData.priceChangePercent);
      
      const { data: existingMacro } = await supabase
        .from('macro_view')
        .select('id')
        .limit(1)
        .single();

      const macroData = {
        btc_trend: btcChange > 2 ? 'up' : btcChange < -2 ? 'down' : 'neutral',
        dominance: null,
        liquidity: parseFloat(btcData.quoteVolume) > 2000000000 ? 'Alta' : 'Média',
        updated_at: new Date().toISOString(),
      };

      if (existingMacro) {
        await supabase.from('macro_view').update(macroData).eq('id', existingMacro.id);
      } else {
        await supabase.from('macro_view').insert({
          ...macroData,
          cycle: 'Expansão',
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${tokensToUpsert.length} tokens with market data`,
        tokens: tokensToUpsert.map(t => t?.ticker),
        categories: {
          majors: 5,
          layer1: 15,
          defi: 12,
          ai_gaming: 12,
          memecoins: 10,
          infra: 10,
          gems: 11,
        },
        total: CRYPTO_SYMBOLS.length,
        coinGeckoDataCount: coinGeckoData.size,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
