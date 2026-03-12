import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Eye, TrendingUp, TrendingDown, Target, Rocket, Wifi, WifiOff,
  Search, Zap, ArrowUpDown, SlidersHorizontal, ChevronUp, ChevronDown, X,
  BarChart3, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExchangeFloatingBar } from '@/components/ExchangeReferral';
import CryptoLogo from '@/components/swing/CryptoLogo';
import { useRealtimePrices } from '@/lib/realtimeService';
import { RadarTutorial } from '@/components/radar/RadarTutorial';
import { useFavorites } from '@/hooks/useFavorites';

interface Token {
  id: string;
  name: string;
  ticker: string;
  score: number | null;
  status: string;
  narrative: string | null;
  current_price?: number | null;
  change_24h?: number | null;
  volume_24h?: number | null;
  updated_at?: string | null;
}

type TokenStatus = 'all' | 'observacao' | 'acumulacao' | 'gatilho' | 'andamento';
type SortBy = 'score' | 'change' | 'name';
type SortDir = 'asc' | 'desc';

const STATUS_CONFIG = {
  all: {
    labelKey: 'all',
    icon: SlidersHorizontal,
    color: 'text-foreground',
    bg: 'bg-muted/30',
    activeBg: 'bg-primary/20 border-primary/50 text-primary',
  },
  observacao: {
    labelKey: 'watching',
    icon: Eye,
    color: 'text-info',
    bg: 'bg-info/5',
    activeBg: 'bg-info/20 border-info/50 text-info',
  },
  acumulacao: {
    labelKey: 'accumulation',
    icon: TrendingUp,
    color: 'text-purple-400',
    bg: 'bg-purple-500/5',
    activeBg: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
  },
  gatilho: {
    labelKey: 'trigger',
    icon: Target,
    color: 'text-warning',
    bg: 'bg-warning/5',
    activeBg: 'bg-warning/20 border-warning/50 text-warning',
  },
  andamento: {
    labelKey: 'active',
    icon: Rocket,
    color: 'text-success',
    bg: 'bg-success/5',
    activeBg: 'bg-success/20 border-success/50 text-success',
  },
};

const RadarPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<TokenStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const { favorites, toggleFavorite, isFavorite, favoritesCount } = useFavorites();

  const tokenTickers = useMemo(() => tokens.map(t => t.ticker), [tokens]);
  const { prices, isConnected } = useRealtimePrices(tokenTickers);

  const fetchTokens = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .order('score', { ascending: false });

      if (error) throw error;
      if (data) setTokens(data as Token[]);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const debouncedFetch = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchTokens();
    }, 2000); // Wait 2 seconds of inactivity before fetching
  }, [fetchTokens]);

  useEffect(() => {
    fetchTokens();

    console.log('Setting up realtime subscription for tokens table...');
    const channel = supabase
      .channel('tokens-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tokens'
        },
        (payload) => {
          console.log('Realtime update received:', payload.eventType);
          debouncedFetch();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    const refreshInterval = setInterval(fetchTokens, 30000);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      supabase.removeChannel(channel);
      clearInterval(refreshInterval);
    };
  }, [fetchTokens, debouncedFetch]);

  // --- Helpers ---
  const getTokenPrice = useCallback((ticker: string) => {
    const realtimeData = prices.get(ticker.toUpperCase());
    if (realtimeData) return { price: realtimeData.price, change: realtimeData.change24h };
    const token = tokens.find(t => t.ticker === ticker);
    return { price: token?.current_price || null, change: token?.change_24h || null };
  }, [prices, tokens]);

  const formatPrice = (price: number | null) => {
    if (!price) return '-';
    if (price < 0.0001) return `$${price.toFixed(8)}`;
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const getScoreColor = (score: number | null) => {
    if (!score || score === 0) return 'text-muted-foreground';
    if (score >= 75) return 'text-success';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-purple-400';
    return 'text-info';
  };

  const getScoreBarColor = (score: number | null) => {
    if (!score || score === 0) return 'bg-muted';
    if (score >= 75) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    if (score >= 40) return 'bg-purple-500';
    return 'bg-info';
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.observacao;
    const label = t(config.labelKey as any);
    return (
      <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full', config.bg, config.color)}>
        {label as React.ReactNode}
      </span>
    );
  };

  const getTrendIndicator = (change: number | null) => {
    if (!change) return { icon: '→', color: 'text-muted-foreground' };
    if (change > 2) return { icon: '↗', color: 'text-success' };
    if (change >= 0) return { icon: '→', color: 'text-warning' };
    return { icon: '↘', color: 'text-destructive' };
  };

  // --- Filtered & Sorted ---
  const filteredTokens = useMemo(() => {
    let result = tokens
      .filter(t => t.current_price !== null && t.current_price !== undefined && t.current_price > 0)
      .filter(t => t.change_24h !== null && t.change_24h !== undefined);

    // Status filter
    if (activeFilter !== 'all') {
      result = result.filter(t => t.status === activeFilter);
    }

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.ticker.toLowerCase().includes(term) ||
        t.name.toLowerCase().includes(term)
      );
    }

    // Favorites
    if (showOnlyFavorites) {
      result = result.filter(t => isFavorite(t.ticker));
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'score') {
        cmp = (a.score || 0) - (b.score || 0);
      } else if (sortBy === 'change') {
        const changeA = prices.get(a.ticker.toUpperCase())?.change24h ?? a.change_24h ?? 0;
        const changeB = prices.get(b.ticker.toUpperCase())?.change24h ?? b.change_24h ?? 0;
        cmp = changeA - changeB;
      } else if (sortBy === 'name') {
        cmp = a.name.localeCompare(b.name);
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [tokens, activeFilter, searchTerm, showOnlyFavorites, sortBy, sortDir, prices, isFavorite]);

  // --- Status counts ---
  const statusCounts = useMemo(() => {
    const validTokens = tokens.filter(t =>
      t.current_price !== null && t.current_price !== undefined && t.current_price > 0 &&
      t.change_24h !== null && t.change_24h !== undefined
    );
    return {
      all: validTokens.length,
      observacao: validTokens.filter(t => t.status === 'observacao').length,
      acumulacao: validTokens.filter(t => t.status === 'acumulacao').length,
      gatilho: validTokens.filter(t => t.status === 'gatilho').length,
      andamento: validTokens.filter(t => t.status === 'andamento').length,
    };
  }, [tokens]);

  // --- Market Summary Stats ---
  const marketStats = useMemo(() => {
    const validTokens = tokens.filter(t =>
      t.current_price !== null && t.current_price !== undefined && t.current_price > 0 &&
      t.change_24h !== null && t.change_24h !== undefined
    );
    const trendingUp = validTokens.filter(t => (t.change_24h || 0) > 0).length;
    const trendingDown = validTokens.filter(t => (t.change_24h || 0) < 0).length;
    const totalVolume = validTokens.reduce((sum, t) => sum + (t.volume_24h || 0), 0);
    const avgChange = validTokens.length > 0
      ? validTokens.reduce((sum, t) => sum + (t.change_24h || 0), 0) / validTokens.length
      : 0;

    return { total: validTokens.length, trendingUp, trendingDown, totalVolume, avgChange };
  }, [tokens]);

  const toggleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  // --- Loading ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground text-sm animate-pulse">
            {t('loadingRadar')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <RadarTutorial />

      {/* ===== MARKET SUMMARY ===== */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  {t('marketSummary')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('realtimeOverview')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {t('total')}
                </p>
                <p className="text-xl font-bold">{marketStats.total}</p>
              </div>

              <div className="text-center">
                <p className="text-xs text-success flex items-center gap-1 justify-center">
                  <TrendingUp className="w-3 h-3" />
                  {t('up')}
                </p>
                <p className="text-lg font-bold text-success">
                  {marketStats.trendingUp} ({marketStats.total > 0 ? ((marketStats.trendingUp / marketStats.total) * 100).toFixed(0) : 0}%)
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-destructive flex items-center gap-1 justify-center">
                  <TrendingDown className="w-3 h-3" />
                  {t('down')}
                </p>
                <p className="text-lg font-bold text-destructive">
                  {marketStats.trendingDown} ({marketStats.total > 0 ? ((marketStats.trendingDown / marketStats.total) * 100).toFixed(0) : 0}%)
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {t('vol24h')}
                </p>
                <p className="text-lg font-bold font-mono">
                  ${marketStats.totalVolume > 1e9
                    ? `${(marketStats.totalVolume / 1e9).toFixed(2)}B`
                    : `${(marketStats.totalVolume / 1e6).toFixed(0)}M`}
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {t('avg24h')}
                </p>
                <p className={cn(
                  "text-lg font-bold",
                  marketStats.avgChange >= 0 ? 'text-success' : 'text-destructive'
                )}>
                  {marketStats.avgChange >= 0 ? '+' : ''}{marketStats.avgChange.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== HEADER ===== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <span className="text-gradient">Radar</span>
          </h1>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>{statusCounts.all} tokens</span>
            <span>•</span>
            {isConnected ? (
              <span className="flex items-center gap-1 text-success">
                <Wifi className="w-3 h-3" />
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-destructive">
                <WifiOff className="w-3 h-3" />
                Offline
              </span>
            )}
          </div>
        </div>

        {/* Search + Favorites */}
        <div className="flex items-center gap-2">
          <Button
            variant={showOnlyFavorites ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={cn(
              'gap-1 h-9 text-xs',
              showOnlyFavorites && 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-500'
            )}
          >
            <Zap className={cn('w-3.5 h-3.5', showOnlyFavorites && 'fill-current')} />
            {favoritesCount > 0 && <span>{favoritesCount}</span>}
          </Button>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('searchToken') as string}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 w-[180px] sm:w-[220px] text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== STATUS TABS ===== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {(Object.keys(STATUS_CONFIG) as TokenStatus[]).map((status) => {
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;
          const count = statusCounts[status as keyof typeof statusCounts] || 0;
          const isActive = activeFilter === status;
          return (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-transparent transition-all whitespace-nowrap',
                isActive ? config.activeBg : 'hover:bg-muted/50 text-muted-foreground'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t(config.labelKey as any) as React.ReactNode}</span>
              <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] text-[10px] px-1.5">
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* ===== SORT BAR ===== */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
        {(['score', 'change', 'name'] as SortBy[]).map(field => {
          const isActive = sortBy === field;
          return (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors flex items-center gap-1',
                isActive ? 'bg-primary/15 text-primary font-semibold' : 'hover:bg-muted/50'
              )}
            >
              {t(field) as React.ReactNode}
              {isActive && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
            </button>
          );
        })}
        <span className="ml-auto text-muted-foreground/60">
          {filteredTokens.length} {t('results')}
        </span>
      </div>

      {/* ===== TOKEN GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredTokens.map((token) => {
          const { price, change } = getTokenPrice(token.ticker);
          const isPositive = (change ?? 0) >= 0;
          const trendIndicator = getTrendIndicator(change);

          return (
            <Card
              key={token.id}
              className="group glass hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-3.5 space-y-3">
                {/* Row 1: Logo + Name + Score */}
                <div className="flex items-center gap-3">
                  <CryptoLogo symbol={token.ticker} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm truncate">{token.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{token.ticker}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-mono font-medium">{formatPrice(price)}</span>
                      <span className={cn(
                        'text-xs font-semibold flex items-center gap-0.5',
                        isPositive ? 'text-success' : 'text-destructive'
                      )}>
                        <span className={trendIndicator.color}>{trendIndicator.icon}</span>
                        {isPositive ? '+' : ''}{change?.toFixed(2) ?? '0.00'}%
                      </span>
                    </div>
                  </div>

                  {/* Score + Favorite */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        className={cn(
                          'p-0.5 rounded-full transition-all hover:scale-110',
                          isFavorite(token.ticker)
                            ? 'text-yellow-400'
                            : 'text-muted-foreground/30 hover:text-yellow-400'
                        )}
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(token.ticker); }}
                      >
                        <Zap className={cn('w-3.5 h-3.5', isFavorite(token.ticker) && 'fill-current')} />
                      </button>
                      <span className={cn('text-xl font-bold tabular-nums', getScoreColor(token.score))}>
                        {token.score || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Score Bar + Status */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', getScoreBarColor(token.score))}
                      style={{ width: `${Math.min(100, token.score || 0)}%` }}
                    />
                  </div>
                  {getStatusBadge(token.status)}
                </div>

                {/* Row 3: Narrative (if exists) */}
                {token.narrative && (
                  <div className="relative group/narrative">
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {token.narrative}
                    </p>
                    {token.narrative.length > 80 && (
                      <div className="absolute hidden group-hover/narrative:block z-10 bottom-full left-0 right-0 mb-2 p-2 bg-popover border border-border rounded-lg shadow-lg text-xs">
                        {token.narrative}
                      </div>
                    )}
                  </div>
                )}

                {/* Row 4: Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs gap-1 bg-green-500 hover:bg-green-600 text-white font-medium border-0"
                    onClick={() => navigate(`/swing?token=${token.ticker}`)}
                  >
                    <Target className="w-3 h-3" />
                    Trade Master
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 h-8 text-xs gap-1 bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold border-0"
                    onClick={() => navigate(`/gems/${token.id}`)}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Análise
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTokens.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {searchTerm
              ? `${t('noResultsFor')} "${searchTerm}"`
              : t('noTokensInCategory')
            }
          </p>
        </div>
      )}

      <ExchangeFloatingBar />
    </div>
  );
};

export default RadarPage;
