import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extended list of 75+ cryptocurrencies organized by category
const CRYPTO_SYMBOLS = [
  // Majors (5)
  { symbol: 'BTCUSDT', name: 'Bitcoin', ticker: 'BTC', category: 'majors' },
  { symbol: 'ETHUSDT', name: 'Ethereum', ticker: 'ETH', category: 'majors' },
  { symbol: 'BNBUSDT', name: 'BNB', ticker: 'BNB', category: 'majors' },
  { symbol: 'SOLUSDT', name: 'Solana', ticker: 'SOL', category: 'majors' },
  { symbol: 'XRPUSDT', name: 'XRP', ticker: 'XRP', category: 'majors' },
  
  // Layer 1 (15)
  { symbol: 'ADAUSDT', name: 'Cardano', ticker: 'ADA', category: 'layer1' },
  { symbol: 'AVAXUSDT', name: 'Avalanche', ticker: 'AVAX', category: 'layer1' },
  { symbol: 'DOTUSDT', name: 'Polkadot', ticker: 'DOT', category: 'layer1' },
  { symbol: 'NEARUSDT', name: 'Near', ticker: 'NEAR', category: 'layer1' },
  { symbol: 'ATOMUSDT', name: 'Cosmos', ticker: 'ATOM', category: 'layer1' },
  { symbol: 'SUIUSDT', name: 'Sui', ticker: 'SUI', category: 'layer1' },
  { symbol: 'APTUSDT', name: 'Aptos', ticker: 'APT', category: 'layer1' },
  { symbol: 'SEIUSDT', name: 'Sei', ticker: 'SEI', category: 'layer1' },
  { symbol: 'TIAUSDT', name: 'Celestia', ticker: 'TIA', category: 'layer1' },
  { symbol: 'TONUSDT', name: 'Toncoin', ticker: 'TON', category: 'layer1' },
  { symbol: 'HBARUSDT', name: 'Hedera', ticker: 'HBAR', category: 'layer1' },
  { symbol: 'ALGOUSDT', name: 'Algorand', ticker: 'ALGO', category: 'layer1' },
  { symbol: 'EOSUSDT', name: 'EOS', ticker: 'EOS', category: 'layer1' },
  { symbol: 'KAVAUSDT', name: 'Kava', ticker: 'KAVA', category: 'layer1' },
  { symbol: 'CELOUSDT', name: 'Celo', ticker: 'CELO', category: 'layer1' },
  
  // DeFi (12)
  { symbol: 'AAVEUSDT', name: 'Aave', ticker: 'AAVE', category: 'defi' },
  { symbol: 'UNIUSDT', name: 'Uniswap', ticker: 'UNI', category: 'defi' },
  { symbol: 'MKRUSDT', name: 'Maker', ticker: 'MKR', category: 'defi' },
  { symbol: 'CRVUSDT', name: 'Curve', ticker: 'CRV', category: 'defi' },
  { symbol: 'LDOUSDT', name: 'Lido', ticker: 'LDO', category: 'defi' },
  { symbol: 'PENDLEUSDT', name: 'Pendle', ticker: 'PENDLE', category: 'defi' },
  { symbol: 'SNXUSDT', name: 'Synthetix', ticker: 'SNX', category: 'defi' },
  { symbol: 'COMPUSDT', name: 'Compound', ticker: 'COMP', category: 'defi' },
  { symbol: 'DYDXUSDT', name: 'dYdX', ticker: 'DYDX', category: 'defi' },
  { symbol: 'SUSHIUSDT', name: 'Sushi', ticker: 'SUSHI', category: 'defi' },
  { symbol: '1INCHUSDT', name: '1inch', ticker: '1INCH', category: 'defi' },
  { symbol: 'BALUSDT', name: 'Balancer', ticker: 'BAL', category: 'defi' },
  
  // AI & Gaming (12)
  { symbol: 'RENDERUSDT', name: 'Render', ticker: 'RENDER', category: 'ai_gaming' },
  { symbol: 'FETUSDT', name: 'Fetch.ai', ticker: 'FET', category: 'ai_gaming' },
  { symbol: 'TAOUSDT', name: 'Bittensor', ticker: 'TAO', category: 'ai_gaming' },
  { symbol: 'WLDUSDT', name: 'Worldcoin', ticker: 'WLD', category: 'ai_gaming' },
  { symbol: 'IMXUSDT', name: 'Immutable', ticker: 'IMX', category: 'ai_gaming' },
  { symbol: 'AXSUSDT', name: 'Axie', ticker: 'AXS', category: 'ai_gaming' },
  { symbol: 'GALAUSDT', name: 'Gala', ticker: 'GALA', category: 'ai_gaming' },
  { symbol: 'SANDUSDT', name: 'Sandbox', ticker: 'SAND', category: 'ai_gaming' },
  { symbol: 'ENJUSDT', name: 'Enjin', ticker: 'ENJ', category: 'ai_gaming' },
  { symbol: 'MANAUSDT', name: 'Decentraland', ticker: 'MANA', category: 'ai_gaming' },
  { symbol: 'ALICEUSDT', name: 'Alice', ticker: 'ALICE', category: 'ai_gaming' },
  { symbol: 'MAGICUSDT', name: 'Magic', ticker: 'MAGIC', category: 'ai_gaming' },
  
  // Memecoins (10)
  { symbol: 'DOGEUSDT', name: 'Dogecoin', ticker: 'DOGE', category: 'memecoins' },
  { symbol: 'SHIBUSDT', name: 'Shiba Inu', ticker: 'SHIB', category: 'memecoins' },
  { symbol: 'PEPEUSDT', name: 'Pepe', ticker: 'PEPE', category: 'memecoins' },
  { symbol: 'FLOKIUSDT', name: 'Floki', ticker: 'FLOKI', category: 'memecoins' },
  { symbol: 'BONKUSDT', name: 'Bonk', ticker: 'BONK', category: 'memecoins' },
  { symbol: 'WIFUSDT', name: 'dogwifhat', ticker: 'WIF', category: 'memecoins' },
  { symbol: 'MEMEUSDT', name: 'Memecoin', ticker: 'MEME', category: 'memecoins' },
  { symbol: 'TURBOUSDT', name: 'Turbo', ticker: 'TURBO', category: 'memecoins' },
  { symbol: 'BOMEUSDT', name: 'BOME', ticker: 'BOME', category: 'memecoins' },
  { symbol: '1000SATSUSDT', name: '1000SATS', ticker: '1000SATS', category: 'memecoins' },
  
  // Infrastructure (10)
  { symbol: 'LINKUSDT', name: 'Chainlink', ticker: 'LINK', category: 'infra' },
  { symbol: 'INJUSDT', name: 'Injective', ticker: 'INJ', category: 'infra' },
  { symbol: 'PYTHUSDT', name: 'Pyth', ticker: 'PYTH', category: 'infra' },
  { symbol: 'ARBUSDT', name: 'Arbitrum', ticker: 'ARB', category: 'infra' },
  { symbol: 'OPUSDT', name: 'Optimism', ticker: 'OP', category: 'infra' },
  { symbol: 'MATICUSDT', name: 'Polygon', ticker: 'MATIC', category: 'infra' },
  { symbol: 'FTMUSDT', name: 'Fantom', ticker: 'FTM', category: 'infra' },
  { symbol: 'MANTAUSDT', name: 'Manta', ticker: 'MANTA', category: 'infra' },
  { symbol: 'STXUSDT', name: 'Stacks', ticker: 'STX', category: 'infra' },
  { symbol: 'THETAUSDT', name: 'Theta', ticker: 'THETA', category: 'infra' },
  
  // Gems (11)
  { symbol: 'JTOUSDT', name: 'Jito', ticker: 'JTO', category: 'gems' },
  { symbol: 'JUPUSDT', name: 'Jupiter', ticker: 'JUP', category: 'gems' },
  { symbol: 'STRKUSDT', name: 'Starknet', ticker: 'STRK', category: 'gems' },
  { symbol: 'EIGENUSDT', name: 'EigenLayer', ticker: 'EIGEN', category: 'gems' },
  { symbol: 'ENAUSDT', name: 'Ethena', ticker: 'ENA', category: 'gems' },
  { symbol: 'WUSDT', name: 'Wormhole', ticker: 'W', category: 'gems' },
  { symbol: 'ALTUSDT', name: 'AltLayer', ticker: 'ALT', category: 'gems' },
  { symbol: 'BLURUSDT', name: 'Blur', ticker: 'BLUR', category: 'gems' },
  { symbol: 'IDUSDT', name: 'Space ID', ticker: 'ID', category: 'gems' },
  { symbol: 'ARKMUSDT', name: 'Arkham', ticker: 'ARKM', category: 'gems' },
  { symbol: 'ZKUSDT', name: 'ZKsync', ticker: 'ZK', category: 'gems' },
];

interface Kline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
}

// Fetch Binance Klines
async function fetchKlines(symbol: string, interval: string, limit: number = 200): Promise<Kline[]> {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.log(`Skipping ${symbol}: not available on Binance`);
      return [];
    }
    
    const data = await response.json();
    
    return data.map((k: any[]) => ({
      openTime: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
      closeTime: k[6],
    }));
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return [];
  }
}

// Calculate EMA
function calculateEMA(closes: number[], period: number): number[] {
  const multiplier = 2 / (period + 1);
  const ema: number[] = [];
  
  let sum = 0;
  for (let i = 0; i < period && i < closes.length; i++) {
    sum += closes[i];
  }
  ema[period - 1] = sum / period;
  
  for (let i = period; i < closes.length; i++) {
    ema[i] = (closes[i] - ema[i - 1]) * multiplier + ema[i - 1];
  }
  
  return ema;
}

// Calculate RSI
function calculateRSI(closes: number[], period: number = 14): number {
  if (closes.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = closes.length - period; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// Calculate Stochastic
function calculateStochastic(klines: Kline[], period: number = 14): { k: number; d: number } {
  if (klines.length < period) return { k: 50, d: 50 };
  
  const recentKlines = klines.slice(-period);
  const currentClose = klines[klines.length - 1].close;
  const lowestLow = Math.min(...recentKlines.map(k => k.low));
  const highestHigh = Math.max(...recentKlines.map(k => k.high));
  
  if (highestHigh === lowestLow) return { k: 50, d: 50 };
  
  const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
  const d = k;
  
  return { k, d };
}

// Calculate MACD
function calculateMACD(closes: number[]): { line: number; signal: number; histogram: number } {
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  
  const macdLine: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (ema12[i] !== undefined && ema26[i] !== undefined) {
      macdLine[i] = ema12[i] - ema26[i];
    }
  }
  
  const validMacd = macdLine.filter(v => v !== undefined);
  const signalLine = calculateEMA(validMacd, 9);
  
  const lastMacd = macdLine[macdLine.length - 1] || 0;
  const lastSignal = signalLine[signalLine.length - 1] || 0;
  
  return {
    line: lastMacd,
    signal: lastSignal,
    histogram: lastMacd - lastSignal,
  };
}

// Calculate ADX with DI+/DI-
function calculateADX(klines: Kline[], period: number = 14): { adx: number; diPlus: number; diMinus: number } {
  if (klines.length < period + 1) return { adx: 20, diPlus: 25, diMinus: 25 };
  
  const trueRanges: number[] = [];
  const plusDMs: number[] = [];
  const minusDMs: number[] = [];
  
  for (let i = 1; i < klines.length; i++) {
    const current = klines[i];
    const prev = klines[i - 1];
    
    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - prev.close),
      Math.abs(current.low - prev.close)
    );
    trueRanges.push(tr);
    
    const upMove = current.high - prev.high;
    const downMove = prev.low - current.low;
    
    plusDMs.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDMs.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }
  
  const smoothTR = trueRanges.slice(-period).reduce((a, b) => a + b, 0);
  const smoothPlusDM = plusDMs.slice(-period).reduce((a, b) => a + b, 0);
  const smoothMinusDM = minusDMs.slice(-period).reduce((a, b) => a + b, 0);
  
  const diPlus = smoothTR > 0 ? (smoothPlusDM / smoothTR) * 100 : 0;
  const diMinus = smoothTR > 0 ? (smoothMinusDM / smoothTR) * 100 : 0;
  
  const dx = diPlus + diMinus > 0 ? (Math.abs(diPlus - diMinus) / (diPlus + diMinus)) * 100 : 0;
  
  return { adx: dx, diPlus, diMinus };
}

// Calculate ATR
function calculateATR(klines: Kline[], period: number = 14): number {
  if (klines.length < period + 1) return 0;
  
  const trueRanges: number[] = [];
  
  for (let i = 1; i < klines.length; i++) {
    const current = klines[i];
    const prev = klines[i - 1];
    
    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - prev.close),
      Math.abs(current.low - prev.close)
    );
    trueRanges.push(tr);
  }
  
  const recentTRs = trueRanges.slice(-period);
  return recentTRs.reduce((a, b) => a + b, 0) / period;
}

// Calculate Supertrend
function calculateSupertrend(klines: Kline[], period: number = 14, multiplier: number = 2): { value: number; direction: 'bull' | 'bear' } {
  const atr = calculateATR(klines, period);
  const lastKline = klines[klines.length - 1];
  const hl2 = (lastKline.high + lastKline.low) / 2;
  
  const upperBand = hl2 + (multiplier * atr);
  const lowerBand = hl2 - (multiplier * atr);
  
  const direction = lastKline.close > lowerBand ? 'bull' : 'bear';
  const value = direction === 'bull' ? lowerBand : upperBand;
  
  return { value, direction };
}

// Calculate Ichimoku
function calculateIchimoku(klines: Kline[]): {
  tenkan: number;
  kijun: number;
  senkouA: number;
  senkouB: number;
  cloudPosition: 'above' | 'below' | 'inside';
} {
  const donchian = (data: Kline[], period: number): number => {
    const recent = data.slice(-period);
    const highest = Math.max(...recent.map(k => k.high));
    const lowest = Math.min(...recent.map(k => k.low));
    return (highest + lowest) / 2;
  };
  
  const tenkan = donchian(klines, 9);
  const kijun = donchian(klines, 26);
  const senkouA = (tenkan + kijun) / 2;
  const senkouB = donchian(klines, 52);
  
  const currentClose = klines[klines.length - 1].close;
  const cloudTop = Math.max(senkouA, senkouB);
  const cloudBottom = Math.min(senkouA, senkouB);
  
  let cloudPosition: 'above' | 'below' | 'inside' = 'inside';
  if (currentClose > cloudTop) cloudPosition = 'above';
  else if (currentClose < cloudBottom) cloudPosition = 'below';
  
  return { tenkan, kijun, senkouA, senkouB, cloudPosition };
}

// Calculate Fibonacci levels
function calculateFibonacci(klines: Kline[], lookback: number = 100): {
  fib236: number;
  fib382: number;
  fib500: number;
  fib618: number;
  fib786: number;
  fibZone: 'buy_zone' | 'sell_zone' | null;
} {
  const recent = klines.slice(-lookback);
  const high = Math.max(...recent.map(k => k.high));
  const low = Math.min(...recent.map(k => k.low));
  const diff = high - low;
  
  const fib236 = low + diff * 0.236;
  const fib382 = low + diff * 0.382;
  const fib500 = low + diff * 0.500;
  const fib618 = low + diff * 0.618;
  const fib786 = low + diff * 0.786;
  
  const currentClose = klines[klines.length - 1].close;
  let fibZone: 'buy_zone' | 'sell_zone' | null = null;
  
  if (currentClose >= fib618 && currentClose <= fib786) fibZone = 'buy_zone';
  else if (currentClose <= fib382 && currentClose >= fib236) fibZone = 'sell_zone';
  
  return { fib236, fib382, fib500, fib618, fib786, fibZone };
}

// Calculate Support/Resistance
function calculateSR(klines: Kline[], period: number = 20): { support: number; resistance: number } {
  const recent = klines.slice(-period);
  const resistance = Math.max(...recent.map(k => k.high));
  const support = Math.min(...recent.map(k => k.low));
  return { support, resistance };
}

// Detect candlestick patterns
function detectPatterns(klines: Kline[]): string[] {
  const patterns: string[] = [];
  const last = klines[klines.length - 1];
  const prev = klines[klines.length - 2];
  const prev2 = klines[klines.length - 3];
  
  if (!last || !prev || !prev2) return patterns;
  
  const body = Math.abs(last.close - last.open);
  const isGreen = last.close > last.open;
  
  const lowerWick = isGreen ? last.open - last.low : last.close - last.low;
  const upperWick = isGreen ? last.high - last.close : last.high - last.open;
  
  if (lowerWick > body * 2 && upperWick < body) patterns.push('hammer');
  if (upperWick > body * 2 && lowerWick < body) patterns.push('shooting_star');
  
  if (last.close > last.open && prev.close < prev.open &&
      last.close > prev.open && last.open < prev.close) {
    patterns.push('bullish_engulf');
  }
  
  if (last.close < last.open && prev.close > prev.open &&
      last.close < prev.open && last.open > prev.close) {
    patterns.push('bearish_engulf');
  }
  
  return patterns;
}

// Calculate Volume metrics
function calculateVolume(klines: Kline[], period: number = 50): { ratio: number; buyPressure: boolean } {
  const volumes = klines.map(k => k.volume);
  const avgVolume = volumes.slice(-period).reduce((a, b) => a + b, 0) / period;
  const currentVolume = volumes[volumes.length - 1];
  
  const ratio = avgVolume > 0 ? currentVolume / avgVolume : 1;
  
  const recentKlines = klines.slice(-20);
  let buyVol = 0;
  let sellVol = 0;
  recentKlines.forEach(k => {
    if (k.close > k.open) buyVol += k.volume;
    else sellVol += k.volume;
  });
  
  return { ratio, buyPressure: buyVol > sellVol };
}

// Calculate scoring (0-150 points, normalized to 0-100%)
function calculateScores(
  closes: number[],
  klines: Kline[],
  ema21: number,
  ema50: number,
  ema200: number,
  adxData: { adx: number; diPlus: number; diMinus: number },
  supertrend: { direction: 'bull' | 'bear' },
  rsi: number,
  stoch: { k: number; d: number },
  macd: { line: number; signal: number; histogram: number },
  ichimoku: { cloudPosition: string; tenkan: number; kijun: number },
  volume: { ratio: number; buyPressure: boolean },
  sr: { support: number; resistance: number },
  fib: { fibZone: string | null },
  patterns: string[],
  htfTrend: 'bull' | 'bear' | 'neutral',
  mtfTrend: 'bull' | 'bear' | 'neutral'
): { buyScore: number; sellScore: number } {
  let buyScore = 0;
  let sellScore = 0;
  const currentClose = closes[closes.length - 1];
  const minADX = 20;
  
  // Multi-Timeframe (30 points)
  if (htfTrend === 'bull') buyScore += 15;
  if (htfTrend === 'bear') sellScore += 15;
  if (mtfTrend === 'bull') buyScore += 15;
  if (mtfTrend === 'bear') sellScore += 15;
  
  // Trend Following (25 points)
  if (currentClose > ema21 && ema21 > ema50) buyScore += 15;
  if (currentClose < ema21 && ema21 < ema50) sellScore += 15;
  if (currentClose > ema200) buyScore += 10;
  if (currentClose < ema200) sellScore += 10;
  
  // ADX Strength (15 points)
  const strongTrend = adxData.adx > minADX;
  if (adxData.diPlus > adxData.diMinus && strongTrend) buyScore += 15;
  else if (strongTrend && currentClose > ema50) buyScore += 8;
  if (adxData.diMinus > adxData.diPlus && strongTrend) sellScore += 15;
  else if (strongTrend && currentClose < ema50) sellScore += 8;
  
  // Supertrend (10 points)
  if (supertrend.direction === 'bull') buyScore += 10;
  if (supertrend.direction === 'bear') sellScore += 10;
  
  // RSI (15 points)
  if (rsi < 35) buyScore += 15;
  else if (rsi < 50 && rsi > 30) buyScore += 8;
  if (rsi > 65) sellScore += 15;
  else if (rsi > 50 && rsi < 70) sellScore += 8;
  
  // Stochastic (10 points)
  if (stoch.k < 20) buyScore += 10;
  if (stoch.k > 80) sellScore += 10;
  
  // MACD (10 points)
  if (macd.histogram > 0 && macd.line > macd.signal) buyScore += 10;
  else if (macd.line > macd.signal) buyScore += 5;
  if (macd.histogram < 0 && macd.line < macd.signal) sellScore += 10;
  else if (macd.line < macd.signal) sellScore += 5;
  
  // Ichimoku (15 points)
  if (ichimoku.cloudPosition === 'above' && ichimoku.tenkan > ichimoku.kijun) buyScore += 15;
  else if (ichimoku.cloudPosition === 'above') buyScore += 8;
  if (ichimoku.cloudPosition === 'below' && ichimoku.tenkan < ichimoku.kijun) sellScore += 15;
  else if (ichimoku.cloudPosition === 'below') sellScore += 8;
  
  // Volume (10 points)
  if (volume.ratio > 1.5 && volume.buyPressure) buyScore += 10;
  else if (volume.ratio > 1.5 || volume.buyPressure) buyScore += 5;
  if (volume.ratio > 1.5 && !volume.buyPressure) sellScore += 10;
  else if (volume.ratio > 1.5 || !volume.buyPressure) sellScore += 5;
  
  // Structure (10 points)
  const nearSupport = currentClose <= sr.support * 1.02;
  const nearResistance = currentClose >= sr.resistance * 0.98;
  if (nearSupport) buyScore += 10;
  if (nearResistance) sellScore += 10;
  
  // Fibonacci (10 points)
  if (fib.fibZone === 'buy_zone') buyScore += 10;
  if (fib.fibZone === 'sell_zone') sellScore += 10;
  
  // Candlestick Patterns (10 points)
  if (patterns.includes('hammer') || patterns.includes('bullish_engulf')) buyScore += 10;
  if (patterns.includes('shooting_star') || patterns.includes('bearish_engulf')) sellScore += 10;
  
  return {
    buyScore: Math.min(buyScore, 150) / 150 * 100,
    sellScore: Math.min(sellScore, 150) / 150 * 100,
  };
}

// Determine signal
function determineSignal(
  buyScore: number,
  sellScore: number,
  riskReward: number,
  adx: number
): string {
  const minADX = 20;
  const minRR = 2.0;
  
  if (buyScore >= 75 && buyScore > sellScore && riskReward >= minRR && adx > minADX) {
    return 'elite_buy';
  }
  if (buyScore >= 60 && buyScore < 75 && buyScore > sellScore && riskReward >= minRR * 0.8) {
    return 'strong_buy';
  }
  if (buyScore >= 45 && buyScore < 60 && buyScore > sellScore) {
    return 'medium_buy';
  }
  
  if (sellScore >= 75 && sellScore > buyScore && riskReward >= minRR && adx > minADX) {
    return 'elite_sell';
  }
  if (sellScore >= 60 && sellScore < 75 && sellScore > buyScore && riskReward >= minRR * 0.8) {
    return 'strong_sell';
  }
  if (sellScore >= 45 && sellScore < 60 && sellScore > buyScore) {
    return 'medium_sell';
  }
  
  return 'wait';
}

// Determine trend from klines
function determineTrend(klines: Kline[]): 'bull' | 'bear' | 'neutral' {
  if (klines.length < 50) return 'neutral';
  
  const closes = klines.map(k => k.close);
  const ema50 = calculateEMA(closes, 50);
  const ema200 = calculateEMA(closes, Math.min(200, closes.length));
  
  const currentClose = closes[closes.length - 1];
  const lastEma50 = ema50[ema50.length - 1];
  const lastEma200 = ema200[ema200.length - 1];
  
  if (currentClose > lastEma50 && lastEma50 > lastEma200) return 'bull';
  if (currentClose < lastEma50 && lastEma50 < lastEma200) return 'bear';
  return 'neutral';
}

serve(async (req) => {
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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Starting analysis for ${CRYPTO_SYMBOLS.length} tokens...`);

    const results = [];
    let analyzed = 0;
    
    // Process in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < CRYPTO_SYMBOLS.length; i += batchSize) {
      const batch = CRYPTO_SYMBOLS.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (crypto) => {
        try {
          // Fetch klines for multiple timeframes
          const [klines1h, klines4h, klines1d] = await Promise.all([
            fetchKlines(crypto.symbol, '1h', 200),
            fetchKlines(crypto.symbol, '4h', 200),
            fetchKlines(crypto.symbol, '1d', 200),
          ]);

          // Skip if no data available
          if (klines4h.length < 50) {
            console.log(`Skipping ${crypto.ticker}: insufficient data`);
            return null;
          }

          const klines = klines4h; // Primary timeframe
          const closes = klines.map(k => k.close);
          const currentPrice = closes[closes.length - 1];

          // Calculate all indicators
          const ema21 = calculateEMA(closes, 21);
          const ema50 = calculateEMA(closes, 50);
          const ema100 = calculateEMA(closes, 100);
          const ema200 = calculateEMA(closes, Math.min(200, closes.length));

          const adxData = calculateADX(klines);
          const supertrend = calculateSupertrend(klines);
          const rsi = calculateRSI(closes);
          const stoch = calculateStochastic(klines);
          const macd = calculateMACD(closes);
          const ichimoku = calculateIchimoku(klines);
          const atr = calculateATR(klines);
          const fib = calculateFibonacci(klines);
          const sr = calculateSR(klines);
          const patterns = detectPatterns(klines);
          const volume = calculateVolume(klines);

          // Multi-timeframe trends
          const htfTrend = determineTrend(klines1d);
          const mtfTrend = determineTrend(klines4h);

          // Calculate scores
          const { buyScore, sellScore } = calculateScores(
            closes, klines,
            ema21[ema21.length - 1], ema50[ema50.length - 1], ema200[ema200.length - 1],
            adxData, supertrend, rsi, stoch, macd, ichimoku, volume, sr, fib, patterns,
            htfTrend, mtfTrend
          );

          // Risk management
          const stopLoss = currentPrice - (atr * 2);
          const takeProfit = currentPrice + (atr * 4);
          const riskReward = (takeProfit - currentPrice) / (currentPrice - stopLoss);

          // Determine signal
          const signal = determineSignal(buyScore, sellScore, riskReward, adxData.adx);

          // Calculate 24h change
          const price24hAgo = klines1h.length >= 24 ? klines1h[klines1h.length - 24].close : currentPrice;
          const change24h = ((currentPrice - price24hAgo) / price24hAgo) * 100;

          const analysis = {
            ticker: crypto.ticker,
            timeframe: '4h',
            ema_21: ema21[ema21.length - 1],
            ema_50: ema50[ema50.length - 1],
            ema_100: ema100[ema100.length - 1],
            ema_200: ema200[ema200.length - 1],
            adx: adxData.adx,
            di_plus: adxData.diPlus,
            di_minus: adxData.diMinus,
            supertrend_value: supertrend.value,
            supertrend_direction: supertrend.direction,
            rsi,
            stoch_k: stoch.k,
            stoch_d: stoch.d,
            macd_line: macd.line,
            macd_signal: macd.signal,
            macd_histogram: macd.histogram,
            tenkan: ichimoku.tenkan,
            kijun: ichimoku.kijun,
            senkou_a: ichimoku.senkouA,
            senkou_b: ichimoku.senkouB,
            cloud_position: ichimoku.cloudPosition,
            volume_ratio: volume.ratio,
            buy_pressure: volume.buyPressure,
            key_support: sr.support,
            key_resistance: sr.resistance,
            fib_236: fib.fib236,
            fib_382: fib.fib382,
            fib_500: fib.fib500,
            fib_618: fib.fib618,
            fib_786: fib.fib786,
            fib_zone: fib.fibZone,
            buy_score: buyScore,
            sell_score: sellScore,
            signal,
            stop_loss: stopLoss,
            take_profit: takeProfit,
            risk_reward: riskReward,
            atr,
            patterns_detected: patterns,
            htf_trend: htfTrend,
            mtf_trend: mtfTrend,
            current_price: currentPrice,
            change_24h: change24h,
            updated_at: new Date().toISOString(),
          };

          // Upsert to database (use ticker,timeframe as unique constraint)
          const { error } = await supabase
            .from('token_analysis')
            .upsert(analysis, { onConflict: 'ticker,timeframe' });

          if (error) {
            console.error(`Error upserting ${crypto.ticker}:`, error);
            return null;
          }

          analyzed++;
          console.log(`Analyzed ${crypto.ticker}: ${signal} (Buy: ${buyScore.toFixed(1)}%, Sell: ${sellScore.toFixed(1)}%)`);
          
          return analysis;

        } catch (error) {
          console.error(`Error analyzing ${crypto.ticker}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(r => r !== null));
      
      // Small delay between batches to avoid rate limits
      if (i + batchSize < CRYPTO_SYMBOLS.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`Analysis complete: ${analyzed}/${CRYPTO_SYMBOLS.length} tokens analyzed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        analyzed, 
        total: CRYPTO_SYMBOLS.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Swing analysis error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
