import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, TrendingDown, Zap, Bell, Loader2, Wifi, WifiOff,
  Target, Radar, MessageCircle, ArrowRight, Activity, BarChart3,
  Trophy, AlertTriangle, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRealtimePrices } from '@/lib/realtimeService';
import CryptoLogo from '@/components/swing/CryptoLogo';
import { DashboardTutorial } from '@/components/dashboard/DashboardTutorial';
import { InspiredCard } from '@/components/dashboard/InspiredCard';

// ─── Types ───────────────────────────────────────────────────────
interface Token {
  id: string;
  name: string;
  ticker: string;
  score: number | null;
  status: string;
  narrative: string | null;
  current_price?: number | null;
  change_24h?: number | null;
}

interface Alert {
  id: string;
  created_at: string;
  tokens: { name: string; ticker: string } | null;
}

interface FearGreedData {
  value: number;
  label: string;
  timestamp: string;
}

// ─── Fear & Greed Gauge (SVG) ────────────────────────────────────
const FearGreedGauge: React.FC<{
  value: number; label: string;
  yesterday?: FearGreedData; lastWeek?: FearGreedData; pt: boolean;
}> = ({ value, label, yesterday, lastWeek, pt }) => {
  const clamped = Math.max(0, Math.min(100, value));
  const angle = -90 + (clamped / 100) * 180;

  const getColor = (v: number) => {
    if (v <= 25) return '#ef4444';
    if (v <= 45) return '#f97316';
    if (v <= 55) return '#eab308';
    if (v <= 75) return '#84cc16';
    return '#22c55e';
  };

  const getLabel = (v: number, isPt: boolean) => {
    if (v <= 25) return isPt ? 'Medo Extremo' : 'Extreme Fear';
    if (v <= 45) return isPt ? 'Medo' : 'Fear';
    if (v <= 55) return isPt ? 'Neutro' : 'Neutral';
    if (v <= 75) return isPt ? 'Ganância' : 'Greed';
    return isPt ? 'Ganância Extrema' : 'Extreme Greed';
  };

  return (
    <Card className="glass border-border/50 overflow-hidden">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          {pt ? 'Índice Fear & Greed' : 'Fear & Greed Index'}
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative w-[160px] h-[95px] shrink-0">
            <svg viewBox="0 0 200 110" className="w-full h-full">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="25%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="75%" stopColor="#84cc16" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(217 33% 14%)" strokeWidth="14" strokeLinecap="round" />
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGrad)" strokeWidth="14" strokeLinecap="round" />
              <line
                x1="100" y1="100" x2="100" y2="30"
                stroke="white" strokeWidth="2.5" strokeLinecap="round"
                style={{ transform: `rotate(${angle}deg)`, transformOrigin: '100px 100px', transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
              />
              <circle cx="100" cy="100" r="5" fill="white" />
              <text x="100" y="82" textAnchor="middle" fill={getColor(clamped)} fontSize="28" fontWeight="800" fontFamily="Inter, sans-serif">
                {clamped}
              </text>
            </svg>
            <p className="text-center text-xs font-semibold mt-0.5" style={{ color: getColor(clamped) }}>
              {getLabel(clamped, pt)}
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            {yesterday && (
              <div>
                <p className="text-[11px] text-muted-foreground">{pt ? 'Ontem' : 'Yesterday'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: getColor(yesterday.value) }}>{yesterday.value}</span>
                  <span className="text-[10px] text-muted-foreground">{getLabel(yesterday.value, pt)}</span>
                </div>
              </div>
            )}
            {lastWeek && (
              <div>
                <p className="text-[11px] text-muted-foreground">{pt ? 'Última Semana' : 'Last Week'}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: getColor(lastWeek.value) }}>{lastWeek.value}</span>
                  <span className="text-[10px] text-muted-foreground">{getLabel(lastWeek.value, pt)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── Quick Access Card ───────────────────────────────────────────
const QuickAccessCard: React.FC<{
  icon: React.ReactNode; title: string; subtitle: string;
  gradient: string; onClick: () => void;
}> = ({ icon, title, subtitle, gradient, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'group relative flex flex-col items-start p-4 rounded-xl border border-white/10 transition-all duration-300',
      'hover:scale-[1.03] hover:shadow-xl hover:border-white/20 text-left overflow-hidden',
      gradient,
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="p-2 rounded-lg bg-white/10 mb-3">{icon}</div>
    <span className="font-bold text-sm">{title}</span>
    <span className="text-[11px] text-white/60 mt-0.5">{subtitle}</span>
    <ArrowRight className="absolute bottom-3 right-3 w-4 h-4 text-white/30 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
  </button>
);

// ─── Dashboard ───────────────────────────────────────────────────
const Dashboard = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const pt = language === 'pt';
  const [loading, setLoading] = useState(true);
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [fearGreed, setFearGreed] = useState<{ today: FearGreedData; yesterday?: FearGreedData; lastWeek?: FearGreedData } | null>(null);

  // All tickers for real-time prices (same source as Radar: `tokens` table)
  const tickers = useMemo(() => allTokens.map(t => t.ticker), [allTokens]);
  const { prices, isConnected } = useRealtimePrices(tickers);

  // Top gems (score >= 60)
  const gems = useMemo(() => allTokens.filter(t => (t.score ?? 0) >= 60).slice(0, 5), [allTokens]);

  // ─── Data Fetching ─────────────────────────────────────────────
  const fetchDashboardData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      const [{ data: tokensData }, { data: alertsData }] = await Promise.all([
        // Same query as Radar — `tokens` table, all tokens
        supabase.from('tokens').select('*').order('score', { ascending: false }),
        userId
          ? supabase.from('alerts').select('id, created_at, tokens ( name, ticker )').eq('created_by', userId).order('created_at', { ascending: false }).limit(5)
          : supabase.from('alerts').select('id, created_at, tokens ( name, ticker )').order('created_at', { ascending: false }).limit(5),
      ]);
      if (tokensData) setAllTokens(tokensData as Token[]);
      if (alertsData) setRecentAlerts(alertsData as Alert[]);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const fetchFearGreed = useCallback(async () => {
    try {
      const res = await fetch('https://api.alternative.me/fng/?limit=8');
      const json = await res.json();
      const data = json.data as { value: string; value_classification: string; timestamp: string }[];
      if (data && data.length > 0) {
        const today: FearGreedData = { value: parseInt(data[0].value), label: data[0].value_classification, timestamp: data[0].timestamp };
        const yesterday = data[1] ? { value: parseInt(data[1].value), label: data[1].value_classification, timestamp: data[1].timestamp } : undefined;
        const lastWeek = data[7] ? { value: parseInt(data[7].value), label: data[7].value_classification, timestamp: data[7].timestamp } : undefined;
        setFearGreed({ today, yesterday, lastWeek });
      }
    } catch (e) { console.error('Fear & Greed fetch failed:', e); }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchFearGreed();
    const interval = setInterval(fetchFearGreed, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData, fetchFearGreed]);

  // ─── Derived Stats (using WebSocket for live 24h change) ───────
  const getPrice = useCallback((ticker: string) => {
    const rt = prices.get(ticker.toUpperCase());
    if (rt) return { price: rt.price, change: rt.change24h };
    const t = allTokens.find(x => x.ticker === ticker);
    return { price: t?.current_price || 0, change: t?.change_24h || 0 };
  }, [prices, allTokens]);

  const btcData = useMemo(() => getPrice('BTC'), [getPrice]);

  const stats = useMemo(() => {
    if (allTokens.length === 0) return null;

    // Use real-time WebSocket prices for consistency with other pages
    const withLiveData = allTokens.map(t => {
      const rt = prices.get(t.ticker.toUpperCase());
      return { ...t, liveChange: rt?.change24h ?? t.change_24h ?? 0, livePrice: rt?.price ?? t.current_price ?? 0 };
    });

    const validTokens = withLiveData.filter(t => t.livePrice > 0);
    const bullish = validTokens.filter(t => t.liveChange > 0).length;
    const bearish = validTokens.filter(t => t.liveChange < 0).length;

    const sorted = [...withLiveData].sort((a, b) => b.liveChange - a.liveChange);

    return {
      total: validTokens.length > 0 ? validTokens.length : allTokens.length,
      bullish,
      bearish,
      topGainer: sorted[0],
      topLoser: sorted[sorted.length - 1],
    };
  }, [allTokens, prices]);

  // Top movers for market overview (sorted by absolute change, largest first)
  const topMovers = useMemo(() => {
    const withLiveData = allTokens.map(t => {
      const rt = prices.get(t.ticker.toUpperCase());
      return { ...t, liveChange: rt?.change24h ?? t.change_24h ?? 0, livePrice: rt?.price ?? t.current_price ?? 0 };
    });
    return [...withLiveData]
      .filter(t => t.livePrice > 0)
      .sort((a, b) => Math.abs(b.liveChange) - Math.abs(a.liveChange))
      .slice(0, 12);
  }, [allTokens, prices]);

  // ─── Helpers ───────────────────────────────────────────────────
  const formatPrice = (p: number) => {
    if (p < 0.001) return `$${p.toFixed(6)}`;
    if (p < 1) return `$${p.toFixed(4)}`;
    if (p < 100) return `$${p.toFixed(2)}`;
    return `$${p.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const relativeTime = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return pt ? `${diff}s atrás` : `${diff}s ago`;
    if (diff < 3600) return pt ? `${Math.floor(diff / 60)}min atrás` : `${Math.floor(diff / 60)}min ago`;
    if (diff < 86400) return pt ? `${Math.floor(diff / 3600)}h atrás` : `${Math.floor(diff / 3600)}h ago`;
    return pt ? `${Math.floor(diff / 86400)}d atrás` : `${Math.floor(diff / 86400)}d ago`;
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return pt ? 'Bom dia' : 'Good morning';
    if (h < 18) return pt ? 'Boa tarde' : 'Good afternoon';
    return pt ? 'Boa noite' : 'Good evening';
  };

  const getScoreBarColor = (score: number | null) => {
    if (!score) return 'bg-muted';
    if (score >= 75) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-info';
  };

  const getStatusLabel = (s: string) => {
    const map: Record<string, { pt: string; en: string; color: string }> = {
      observacao: { pt: 'Observação', en: 'Watching', color: 'bg-info/20 text-info' },
      acumulacao: { pt: 'Acumulação', en: 'Accumulation', color: 'bg-purple-500/20 text-purple-400' },
      gatilho: { pt: 'Gatilho', en: 'Trigger', color: 'bg-warning/20 text-warning' },
      andamento: { pt: 'Em Andamento', en: 'Active', color: 'bg-success/20 text-success' },
    };
    const cfg = map[s] || map.observacao;
    return <Badge className={cn('text-[10px] font-semibold', cfg.color)}>{pt ? cfg.pt : cfg.en}</Badge>;
  };

  // ─── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ═══ TUTORIAL ═══ */}
      <DashboardTutorial />

      {/* ═══ 1. HERO HEADER ═══ */}
      <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-gradient-to-br from-violet-600/10 via-background to-cyan-600/10 p-5 sm:p-7">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm">
              {getGreeting()}, <span className="font-semibold text-foreground">Trader</span> 👋
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString(pt ? 'pt-BR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-card/60 backdrop-blur-md rounded-xl px-4 py-3 border border-border/50">
            <CryptoLogo symbol="BTC" size={36} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg">{formatPrice(btcData.price)}</span>
                <span className={cn(
                  'text-xs font-semibold px-1.5 py-0.5 rounded-md',
                  (btcData.change ?? 0) >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive',
                )}>
                  {(btcData.change ?? 0) >= 0 ? '+' : ''}{(btcData.change ?? 0).toFixed(2)}%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">Bitcoin • 24h</p>
            </div>
            {isConnected ? (
              <span className="flex items-center gap-1 text-[10px] text-success ml-2"><Wifi className="w-3 h-3" /> Live</span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-destructive ml-2"><WifiOff className="w-3 h-3" /> Offline</span>
            )}
          </div>
        </div>
      </div>

      {/* ═══ 1.5 INSPIRED WORD ═══ */}
      <InspiredCard className="animate-in fade-in slide-in-from-top-4 duration-1000 delay-300" />

      {/* ═══ 2. FEAR & GREED + QUICK STATS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {fearGreed ? (
          <FearGreedGauge
            value={fearGreed.today.value}
            label={fearGreed.today.label}
            yesterday={fearGreed.yesterday}
            lastWeek={fearGreed.lastWeek}
            pt={pt}
          />
        ) : (
          <Card className="glass border-border/50 flex items-center justify-center min-h-[140px]">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </Card>
        )}

        {stats && (
          <div className="grid grid-cols-2 gap-3">
            <Card className="glass border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><BarChart3 className="w-4 h-4 text-primary" /></div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Tokens</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10"><TrendingUp className="w-4 h-4 text-success" /></div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Bull / Bear</p>
                  <p className="text-xl font-bold">
                    <span className="text-success">{stats.bullish}</span>
                    <span className="text-muted-foreground mx-1">/</span>
                    <span className="text-destructive">{stats.bearish}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            {stats.topGainer && (
              <Card className="glass border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <CryptoLogo symbol={stats.topGainer.ticker} size={28} />
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Trophy className="w-3 h-3 text-success" /> Top Gainer</p>
                    <p className="font-bold text-sm truncate">{stats.topGainer.ticker}</p>
                    <p className="text-[11px] text-success font-semibold">+{stats.topGainer.liveChange.toFixed(2)}%</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {stats.topLoser && (
              <Card className="glass border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <CryptoLogo symbol={stats.topLoser.ticker} size={28} />
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-destructive" /> Top Loser</p>
                    <p className="font-bold text-sm truncate">{stats.topLoser.ticker}</p>
                    <p className="text-[11px] text-destructive font-semibold">{stats.topLoser.liveChange.toFixed(2)}%</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* ═══ 3. MARKET OVERVIEW (wrapped grid — no horizontal overflow) ═══ */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-cyan-400" />
          {pt ? 'Visão do Mercado — Top Movers 24h' : 'Market Overview — Top Movers 24h'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {topMovers.map(token => {
            const isPositive = token.liveChange >= 0;
            return (
              <button
                key={token.ticker}
                onClick={() => navigate(`/swing?token=${token.ticker}`)}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl glass border-border/50 hover:border-primary/30 hover:scale-[1.02] transition-all duration-200"
              >
                <CryptoLogo symbol={token.ticker} size={26} />
                <div className="text-left min-w-0">
                  <span className="font-semibold text-xs block truncate">{token.ticker}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-mono text-[11px] text-muted-foreground truncate">{formatPrice(token.livePrice)}</span>
                  </div>
                  <span className={cn('text-[10px] font-bold', isPositive ? 'text-success' : 'text-destructive')}>
                    {isPositive ? '↑' : '↓'}{Math.abs(token.liveChange).toFixed(1)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ 4. QUICK ACCESS ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickAccessCard
          icon={<Target className="w-5 h-5 text-white" />}
          title="Trade Master"
          subtitle={pt ? 'Análise técnica avançada' : 'Advanced technical analysis'}
          gradient="bg-gradient-to-br from-violet-600/80 to-violet-900/80"
          onClick={() => navigate('/swing')}
        />
        <QuickAccessCard
          icon={<Radar className="w-5 h-5 text-white" />}
          title="Radar"
          subtitle={pt ? 'Scanner de oportunidades' : 'Opportunity scanner'}
          gradient="bg-gradient-to-br from-cyan-600/80 to-cyan-900/80"
          onClick={() => navigate('/radar')}
        />
        <QuickAccessCard
          icon={<Bell className="w-5 h-5 text-white" />}
          title={pt ? 'Alertas' : 'Alerts'}
          subtitle={pt ? 'Notificações de preço' : 'Price notifications'}
          gradient="bg-gradient-to-br from-amber-600/80 to-amber-900/80"
          onClick={() => navigate('/alerts')}
        />
        <QuickAccessCard
          icon={<MessageCircle className="w-5 h-5 text-white" />}
          title="Chat IA"
          subtitle={pt ? 'Assistente de trading' : 'Trading assistant'}
          gradient="bg-gradient-to-br from-emerald-600/80 to-emerald-900/80"
          onClick={() => navigate('/chat')}
        />
      </div>

      {/* ═══ 5. TOP GEMS + ALERTS ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              💎 Top Gems
            </h3>
            {gems.length === 0 ? (
              <p className="text-muted-foreground text-center py-6 text-sm">{pt ? 'Nenhuma gema encontrada' : 'No gems found'}</p>
            ) : (
              <div className="space-y-2">
                {gems.map((gem, i) => {
                  const { price, change } = getPrice(gem.ticker);
                  const isPositive = (change ?? 0) >= 0;
                  return (
                    <button
                      key={gem.id}
                      onClick={() => navigate(`/swing?token=${gem.ticker}`)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors text-left group"
                    >
                      <span className="text-sm font-bold text-muted-foreground/50 w-5 text-center">#{i + 1}</span>
                      <CryptoLogo symbol={gem.ticker} size={28} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{gem.name}</span>
                          <span className="text-[10px] text-muted-foreground">{gem.ticker}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden max-w-[80px]">
                            <div className={cn('h-full rounded-full', getScoreBarColor(gem.score))} style={{ width: `${gem.score || 0}%` }} />
                          </div>
                          {getStatusLabel(gem.status)}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs">{formatPrice(price)}</span>
                        <p className={cn('text-[10px] font-semibold', isPositive ? 'text-success' : 'text-destructive')}>
                          {isPositive ? '+' : ''}{(change ?? 0).toFixed(2)}%
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-400" />
              {pt ? 'Alertas Recentes' : 'Recent Alerts'}
            </h3>
            {recentAlerts.length === 0 ? (
              <p className="text-muted-foreground text-center py-6 text-sm">{pt ? 'Nenhum alerta' : 'No alerts'}</p>
            ) : (
              <div className="space-y-2">
                {recentAlerts.map(alert => (
                  <button
                    key={alert.id}
                    onClick={() => navigate('/alerts')}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors text-left group"
                  >
                    <div className="p-2 rounded-full bg-amber-500/10">
                      {alert.tokens ? <CryptoLogo symbol={alert.tokens.ticker} size={22} /> : <Bell className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm">{alert.tokens?.name || 'Token'}</span>
                      <span className="text-[10px] text-muted-foreground ml-1.5">{alert.tokens?.ticker}</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{relativeTime(alert.created_at)}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
