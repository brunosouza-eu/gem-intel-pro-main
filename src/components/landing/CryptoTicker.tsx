import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TickerData {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
  icon: string;
}

const DEFAULT_COINS = [
  { symbol: 'BTC', pair: 'BTCUSDT', icon: '₿' },
  { symbol: 'ETH', pair: 'ETHUSDT', icon: '♦' },
  { symbol: 'SOL', pair: 'SOLUSDT', icon: '◎' },
  { symbol: 'BNB', pair: 'BNBUSDT', icon: '🔸' },
  { symbol: 'ADA', pair: 'ADAUSDT', icon: '₳' },
  { symbol: 'XRP', pair: 'XRPUSDT', icon: '✕' },
  { symbol: 'DOGE', pair: 'DOGEUSDT', icon: 'Ð' },
  { symbol: 'LINK', pair: 'LINKUSDT', icon: '🔗' },
  { symbol: 'AVAX', pair: 'AVAXUSDT', icon: '🔺' },
  { symbol: 'DOT', pair: 'DOTUSDT', icon: '⚪' },
];

/**
 * CryptoTicker
 * Mostra um banner infinito rolando com os preços em tempo real usando a API pública da Binance.
 */
const CryptoTicker: React.FC<{ className?: string }> = ({ className }) => {
  const [tickers, setTickers] = useState<TickerData[]>(DEFAULT_COINS.map(c => ({
      symbol: c.symbol,
      price: '...',
      change: '...',
      up: true,
      icon: c.icon
  })));

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Busca os tickers 24h da Binance para obtermos preço e variação% de uma vez
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data = await response.json();

        // Fazemos um mapa para acesso rápido
        const priceMap = new Map(data.map((item: any) => [item.symbol, item]));

        const updatedTickers = DEFAULT_COINS.map(coin => {
          const apiData = priceMap.get(coin.pair);
          
          if (!apiData) return { symbol: coin.symbol, price: 'N/A', change: '0%', up: true, icon: coin.icon };
          
          const priceStr = parseFloat(apiData.lastPrice);
          const changePercent = parseFloat(apiData.priceChangePercent);
          
          // Formata preço dependendo do valor para ficar bonito
          let formattedPrice = '';
          if (priceStr >= 1000) {
              formattedPrice = `$${priceStr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          } else if (priceStr >= 1) {
              formattedPrice = `$${priceStr.toFixed(2)}`;
          } else {
              formattedPrice = `$${priceStr.toFixed(4)}`; // Moedas pequenas como DOGE
          }

          return {
            symbol: coin.symbol,
            price: formattedPrice,
            change: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`,
            up: changePercent >= 0,
            icon: coin.icon
          };
        });

        setTickers(updatedTickers);
      } catch (error) {
        console.error("Failed to fetch live prices", error);
        // Em caso de erro, mantém os dados (ou placeholders)
      }
    };

    // Busca inicial
    fetchPrices();

    // Atualiza a cada 10 segundos
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  // Duplicamos o array para o efeito de scroll infinito usando CSS Puro
  const scrollerItems = [...tickers, ...tickers];

  return (
    <div className={cn(
      "relative w-full overflow-hidden bg-black/40 border-y border-white/5 backdrop-blur-md py-3", 
      className
    )}>
        
        <style dangerouslySetInnerHTML={{__html: `
            @keyframes ticker-scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); } 
            }
            .animate-ticker {
                animation: ticker-scroll 30s linear infinite;
                display: flex;
                width: max-content;
            }
            .animate-ticker:hover {
                animation-play-state: paused;
            }
        `}} />

        {/* Gradientes nas bordas pra dar o fade in/out no scroll */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[hsl(222,47%,6%)] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[hsl(222,47%,6%)] to-transparent z-10 pointer-events-none" />

        <div className="animate-ticker group cursor-default">
            {scrollerItems.map((coin, index) => (
                <div 
                    key={`${coin.symbol}-${index}`} 
                    className="flex items-center gap-3 px-8 border-r border-white/5 last:border-0 hover:bg-white/5 transition-colors rounded-lg py-1 mx-2"
                >
                    <span className="text-white/40 font-bold text-lg">{coin.icon}</span>
                    <span className="font-bold text-white/90 tracking-wide text-sm">{coin.symbol}</span>
                    <span className="text-white/60 font-medium font-mono text-sm">{coin.price}</span>
                    
                    <span className={cn(
                        "flex items-center text-xs font-bold font-mono",
                        coin.up ? "text-emerald-400" : "text-red-400"
                    )}>
                        {coin.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        {coin.change}
                    </span>
                </div>
            ))}
        </div>
    </div>
  );
};

export default CryptoTicker;
