import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SwingAnalysis } from '@/hooks/useSwingAnalysis';
import CryptoLogo from './CryptoLogo';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Search, Zap, Bell, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { AlertModal } from '@/components/alerts/AlertModal';

interface TokenTableProps {
  analyses: SwingAnalysis[];
  selectedTicker: string;
  onSelectToken: (ticker: string) => void;
}

const TokenTable: React.FC<TokenTableProps> = ({
  analyses,
  selectedTicker,
  onSelectToken,
}) => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const { toggleFavorite, isFavorite, favoritesCount } = useFavorites();
  const [alertToken, setAlertToken] = useState<{ ticker: string, price: number } | null>(null);

  // Track previous prices for flash animation
  const prevPricesRef = useRef<Map<string, number>>(new Map());
  const [flashTokens, setFlashTokens] = useState<Map<string, 'up' | 'down'>>(new Map());

  useEffect(() => {
    const newFlashes = new Map<string, 'up' | 'down'>();
    for (const a of analyses) {
      const prev = prevPricesRef.current.get(a.ticker);
      if (prev !== undefined && a.current_price !== undefined) {
        if (a.current_price > prev) newFlashes.set(a.ticker, 'up');
        else if (a.current_price < prev) newFlashes.set(a.ticker, 'down');
      }
      if (a.current_price !== undefined) {
        prevPricesRef.current.set(a.ticker, a.current_price);
      }
    }
    if (newFlashes.size > 0) {
      setFlashTokens(newFlashes);
      const timer = setTimeout(() => setFlashTokens(new Map()), 800);
      return () => clearTimeout(timer);
    }
  }, [analyses]);

  const getSignalBadge = (signal: string | null) => {
    const signalMap: Record<string, { text: string; className: string }> = {
      elite_buy: { text: 'ELITE', className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 animate-pulse' },
      strong_buy: { text: 'BUY', className: 'bg-success/20 text-success border-success/50' },
      medium_buy: { text: 'buy', className: 'bg-green-600/20 text-green-500 border-green-500/50' },
      elite_sell: { text: 'SELL', className: 'bg-pink-500/20 text-pink-400 border-pink-500/50 animate-pulse' },
      strong_sell: { text: 'SELL', className: 'bg-destructive/20 text-destructive border-destructive/50' },
      medium_sell: { text: 'sell', className: 'bg-red-600/20 text-red-500 border-red-500/50' },
      wait: { text: 'WAIT', className: 'bg-muted text-muted-foreground border-muted-foreground/50' },
    };
    return signalMap[signal || 'wait'] || signalMap.wait;
  };

  const filteredAnalyses = useMemo(() => {
    let filtered = analyses;

    // Filter by search
    if (search) {
      filtered = filtered.filter(a =>
        a.ticker.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by favorites
    if (showOnlyFavorites) {
      filtered = filtered.filter(a => isFavorite(a.ticker));
    }

    // Sort by score
    return [...filtered].sort((a, b) => {
      return Math.max(b.buy_score || 0, b.sell_score || 0) - Math.max(a.buy_score || 0, a.sell_score || 0);
    });
  }, [analyses, search, showOnlyFavorites, isFavorite]);

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return '—';
    if (price < 0.001) return `$${price.toFixed(8)}`;
    if (price < 1) return `$${price.toFixed(6)}`;
    if (price < 100) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header with Search and Favorites Filter */}
      <div className="p-2 sm:p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant={showOnlyFavorites ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={cn(
              "h-8 gap-1 transition-all shrink-0",
              showOnlyFavorites && "bg-yellow-500 hover:bg-yellow-600 text-black"
            )}
          >
            <Zap className={cn("w-3.5 h-3.5", showOnlyFavorites && "fill-current")} />
            {favoritesCount > 0 && (
              <span className="text-xs font-semibold">{favoritesCount}</span>
            )}
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder={`${t('search')}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Card Grid */}
      <div className="p-2 sm:p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2 max-h-[240px] sm:max-h-[300px] overflow-y-auto">
        {filteredAnalyses.map((analysis) => {
          const badge = getSignalBadge(analysis.signal);
          const isSelected = selectedTicker === analysis.ticker;
          const change = analysis.change_24h || 0;
          const rr = analysis.risk_reward || 0;
          const flash = flashTokens.get(analysis.ticker);

          return (
            <div
              role="button"
              key={analysis.id}
              onClick={() => onSelectToken(analysis.ticker)}
              className={cn(
                "p-2 rounded-lg border text-left transition-all cursor-pointer relative group",
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:shadow-md",
                flash === 'up' && "ring-1 ring-success/50",
                flash === 'down' && "ring-1 ring-destructive/50"
              )}
            >
              {/* Top Row: Logo + Ticker + Actions */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <button
                  className={cn(
                    "p-0.5 rounded transition-all hover:scale-110",
                    isFavorite(analysis.ticker)
                      ? "text-yellow-400"
                      : "text-muted-foreground/30 hover:text-yellow-400"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(analysis.ticker);
                  }}
                >
                  <Zap className={cn(
                    "w-3 h-3",
                    isFavorite(analysis.ticker) && "fill-current"
                  )} />
                </button>
                <CryptoLogo symbol={analysis.ticker} size={22} />
                <span className="font-bold text-xs">{analysis.ticker}</span>
                <button
                  className="p-0.5 rounded transition-all hover:scale-110 text-muted-foreground/30 hover:text-primary ml-auto opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAlertToken({ ticker: analysis.ticker, price: analysis.current_price });
                  }}
                >
                  <Bell className="w-3 h-3" />
                </button>
              </div>

              {/* Price with flash */}
              <div className={cn(
                "text-xs font-mono mb-1 transition-colors",
                flash === 'up' ? 'text-success' :
                  flash === 'down' ? 'text-destructive' :
                    'text-foreground/80'
              )}>
                {formatPrice(analysis.current_price)}
              </div>

              {/* Bottom Row: Change + R:R + Signal */}
              <div className="flex items-center justify-between gap-1">
                <span className={cn(
                  "text-[10px] font-medium",
                  change >= 0 ? "text-success" : "text-destructive"
                )}>
                  {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                </span>

                {/* R:R badge */}
                {rr > 0 && (
                  <span className={cn(
                    "text-[9px] font-mono",
                    rr >= 3 ? 'text-cyan-400' : rr >= 2 ? 'text-success' : 'text-muted-foreground'
                  )}>
                    {rr.toFixed(1)}:1
                  </span>
                )}

                <span className={cn(
                  "px-1 py-0.5 rounded text-[8px] font-bold border",
                  badge.className
                )}>
                  {badge.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Token Count */}
      <div className="p-1.5 border-t border-border text-center">
        <span className="text-[10px] text-muted-foreground">
          {filteredAnalyses.length} tokens
        </span>
      </div>

      {alertToken && (
        <AlertModal
          isOpen={!!alertToken}
          onClose={() => setAlertToken(null)}
          ticker={alertToken.ticker}
          currentPrice={alertToken.price}
        />
      )}
    </div>
  );
};

export default TokenTable;
