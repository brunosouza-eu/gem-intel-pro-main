import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { GemHunterTutorial } from '@/components/gemhunter/GemHunterTutorial';
import { BetaLockedGate } from '@/components/guards/BetaLockedGate';
import { mockGems, type GemToken, type GemStatus, type RiskLevel } from '@/data/mockGems';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CryptoLogo from '@/components/swing/CryptoLogo';
import { cn } from '@/lib/utils';
import {
    Rocket,
    TrendingUp,
    TrendingDown,
    Search,
    ExternalLink,
    ShieldAlert,
    Flame,
    Zap,
    Bot,
    ArrowUpDown,
    Gem,
    Eye,
    Sparkles,
    Copy,
    Check,
    Target,
    BarChart3,
} from 'lucide-react';
import { ExchangeFloatingBar } from '@/components/ExchangeReferral';

type SortKey = 'score' | 'change24h' | 'volume24h' | 'marketCap';

const GemHunterPage = () => {
    const { language } = useLanguage();
    const { isAdmin } = useAuth();
    const pt = language === 'pt';
    const [activeNetwork, setActiveNetwork] = useState<'ALL' | 'SOL' | 'BASE' | 'ETH'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortKey>('score');
    const [sortDesc, setSortDesc] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // ─── Filtering & Sorting (must be before any early return — hooks rules) ──
    const filteredGems = useMemo(() => {
        let gems = mockGems.filter(gem => {
            const matchesNetwork = activeNetwork === 'ALL' || gem.network === activeNetwork;
            const matchesSearch =
                gem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                gem.ticker.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesNetwork && matchesSearch;
        });

        gems.sort((a, b) => {
            const diff = (a[sortBy] as number) - (b[sortBy] as number);
            return sortDesc ? -diff : diff;
        });

        return gems;
    }, [activeNetwork, searchTerm, sortBy, sortDesc]);

    // ─── Beta Lock: admin-only during beta ───────────────────────────
    if (!isAdmin) {
        return (
            <BetaLockedGate
                toolName="Gem Hunter"
                toolDescription={{
                    pt: 'Descubra tokens recém-lançados e gemas escondidas antes que explodam no mercado.',
                    en: 'Discover newly launched tokens and hidden gems before they explode in the market.',
                }}
                features={[
                    { icon: Flame, label: { pt: 'Gemas em Alta', en: 'Trending Gems' } },
                    { icon: Target, label: { pt: 'Score de Potencial', en: 'Potential Score' } },
                    { icon: Bot, label: { pt: 'Bots de Snipe', en: 'Snipe Bots' } },
                    { icon: ShieldAlert, label: { pt: 'Análise de Risco', en: 'Risk Analysis' } },
                    { icon: BarChart3, label: { pt: 'Dados On-Chain', en: 'On-Chain Data' } },
                    { icon: Zap, label: { pt: 'Links Rápidos', en: 'Quick Links' } },
                ]}
            />
        );
    }

    // ─── Helpers ─────────────────────────────────────────────────────
    const getNetworkColor = (network: string) => {
        switch (network) {
            case 'SOL': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'BASE': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'ETH': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getButtonColor = (type: string) => {
        switch (type) {
            case 'bot': return 'bg-blue-500 hover:bg-blue-600 text-white border-none shadow-lg shadow-blue-500/20';
            case 'cex': return 'bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg shadow-emerald-500/20';
            case 'dex': return 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700';
            default: return 'bg-primary hover:bg-primary/90 text-primary-foreground';
        }
    };

    const getStatusBadge = (status: GemStatus) => {
        switch (status) {
            case 'trending': return { label: pt ? '📈 Trending' : '📈 Trending', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
            case 'hot': return { label: '🔥 Hot', class: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
            case 'new_launch': return { label: pt ? '⚡ Lançamento' : '⚡ New Launch', class: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
            case 'hidden_gem': return { label: pt ? '💎 Gema' : '💎 Hidden Gem', class: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
        }
    };

    const getRiskBadge = (risk: RiskLevel) => {
        switch (risk) {
            case 'medium': return { label: pt ? 'Risco Médio' : 'Medium Risk', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
            case 'high': return { label: pt ? 'Risco Alto' : 'High Risk', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
            case 'very_high': return { label: pt ? 'Risco Muito Alto' : 'Very High Risk', class: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
            case 'extreme': return { label: pt ? 'Risco Extremo' : 'Extreme Risk', class: 'bg-red-500/10 text-red-400 border-red-500/20' };
        }
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const sortOptions: { key: SortKey; label: string }[] = [
        { key: 'score', label: 'Score' },
        { key: 'change24h', label: '24h %' },
        { key: 'volume24h', label: pt ? 'Volume' : 'Volume' },
        { key: 'marketCap', label: 'Mkt Cap' },
    ];

    return (
        <div className="space-y-6 animate-fade-in relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">

            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10" />

            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black flex items-center gap-3">
                    <span className="p-2 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-xl border border-amber-500/30">
                        <Flame className="w-6 h-6 text-amber-500" />
                    </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                        Gem Hunter
                    </span>
                    <Badge className="ml-1 bg-amber-500/15 text-amber-400 border-amber-500/30 gap-1 text-[10px] px-2 py-0.5">
                        <Sparkles className="w-3 h-3" />
                        BETA
                    </Badge>
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                        {pt ? 'Alto Risco' : 'High Risk'}
                    </Badge>
                </h1>
                <p className="text-muted-foreground text-sm max-w-2xl">
                    {pt
                        ? 'Monitore tokens recém-lançados na rede (on-chain) ou prestes a explodir nas corretoras menores. Compre antes de listarem na Binance.'
                        : 'Track newly launched on-chain tokens or those about to explode on smaller exchanges. Buy before they list on Binance.'}
                </p>
            </div>

            <GemHunterTutorial />

            {/* Filters Bar */}
            <div className="flex flex-col gap-4 bg-card/50 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {/* Network Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-hide">
                        {(['ALL', 'SOL', 'BASE', 'ETH'] as const).map(network => (
                            <button
                                key={network}
                                onClick={() => setActiveNetwork(network)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                                    activeNetwork === network
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                )}
                            >
                                {network === 'ALL' ? (pt ? 'Todas as Redes' : 'All Networks') : network}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={pt ? "Buscar Gema..." : "Search Gem..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-background/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">{pt ? 'Ordenar:' : 'Sort:'}</span>
                    {sortOptions.map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => {
                                if (sortBy === opt.key) setSortDesc(!sortDesc);
                                else { setSortBy(opt.key); setSortDesc(true); }
                            }}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap flex items-center gap-1",
                                sortBy === opt.key
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                            )}
                        >
                            {opt.label}
                            {sortBy === opt.key && (
                                <span className="text-[8px]">{sortDesc ? '▼' : '▲'}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gem Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredGems.map(gem => {
                    const statusBadge = getStatusBadge(gem.status);
                    const riskBadge = getRiskBadge(gem.riskLevel);

                    return (
                        <Card key={gem.id} className="group bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 overflow-hidden">
                            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <CardContent className="p-5">

                                {/* Token Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex gap-3">
                                        <div className="relative">
                                            <CryptoLogo symbol={gem.ticker} size={48} className="rounded-full shadow-lg" />
                                            <div className={cn("absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md text-[8px] font-black border", getNetworkColor(gem.network))}>
                                                {gem.network}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{gem.name}</h3>
                                            <p className="text-sm text-muted-foreground font-mono font-medium">${gem.ticker}</p>
                                        </div>
                                    </div>

                                    {/* Score */}
                                    <div className="flex flex-col items-end gap-1.5">
                                        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                            <Flame className="w-3.5 h-3.5" />
                                            <span className="font-black text-sm">{gem.score}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status + Risk row */}
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <Badge variant="outline" className={cn("text-[9px] px-2 py-0.5", statusBadge.class)}>
                                        {statusBadge.label}
                                    </Badge>
                                    <Badge variant="outline" className={cn("text-[9px] px-2 py-0.5", riskBadge.class)}>
                                        {riskBadge.label}
                                    </Badge>
                                </div>

                                {/* Description */}
                                {gem.description && (
                                    <p className="text-[11px] text-muted-foreground/80 mb-4 leading-relaxed line-clamp-2">
                                        {pt ? gem.description.pt : gem.description.en}
                                    </p>
                                )}

                                {/* Price & Primary Metrics */}
                                <div className="grid grid-cols-2 gap-4 mb-4 p-3 rounded-xl bg-muted/30 border border-border/30">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                                            {pt ? 'Preço Atual' : 'Current Price'}
                                        </p>
                                        <p className="font-mono font-bold text-lg">${gem.price < 0.001 ? gem.price.toFixed(7) : gem.price < 0.01 ? gem.price.toFixed(5) : gem.price < 1 ? gem.price.toFixed(4) : gem.price.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                                            24h Change
                                        </p>
                                        <div className="flex items-center gap-1">
                                            {gem.change24h >= 0
                                                ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                                                : <TrendingDown className="w-4 h-4 text-red-400" />
                                            }
                                            <span className={cn("font-bold text-lg", gem.change24h >= 0 ? "text-emerald-400" : "text-red-400")}>
                                                {gem.change24h >= 0 ? '+' : ''}{gem.change24h}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Secondary Metrics */}
                                <div className="grid grid-cols-3 gap-2 mb-5">
                                    <div className="text-center">
                                        <p className="text-[9px] text-muted-foreground font-medium mb-0.5">Market Cap</p>
                                        <p className="text-xs font-bold text-foreground">${gem.marketCap >= 1000 ? `${(gem.marketCap / 1000).toFixed(1)}B` : `${gem.marketCap}M`}</p>
                                    </div>
                                    <div className="text-center border-x border-border/50">
                                        <p className="text-[9px] text-muted-foreground font-medium mb-0.5">Vol (24h)</p>
                                        <p className="text-xs font-bold text-foreground">${gem.volume24h}M</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] text-muted-foreground font-medium mb-0.5">Holders</p>
                                        <p className="text-xs font-bold text-foreground">{gem.holders >= 1000000 ? `${(gem.holders / 1000000).toFixed(1)}M` : `${(gem.holders / 1000).toFixed(0)}k`}</p>
                                    </div>
                                </div>

                                {/* Contract (if any) */}
                                {gem.contractAddress && (
                                    <div className="mb-5 flex items-center justify-between p-2 rounded-lg bg-background border border-border/50">
                                        <span className="text-[10px] text-muted-foreground">Contract:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-muted-foreground/80 truncate max-w-[120px]">
                                                {gem.contractAddress}
                                            </span>
                                            <button
                                                onClick={() => handleCopy(gem.contractAddress!, gem.id)}
                                                className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5"
                                            >
                                                {copiedId === gem.id ? (
                                                    <><Check className="w-3 h-3" /> {pt ? 'Copiado!' : 'Copied!'}</>
                                                ) : (
                                                    <><Copy className="w-3 h-3" /> {pt ? 'Copiar' : 'Copy'}</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Affiliate "Where to buy" Links */}
                                <div>
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <Zap className="w-3 h-3 text-amber-400" />
                                        {pt ? 'Onde Comprar (Rápido)' : 'Where to Buy (Fast)'}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {gem.buyLinks.map((link, idx) => (
                                            <Button
                                                key={idx}
                                                variant="outline"
                                                size="sm"
                                                className={cn(
                                                    "h-9 text-[11px] font-bold w-full justify-between px-3 relative overflow-hidden group/btn",
                                                    getButtonColor(link.type),
                                                    idx === 0 && gem.buyLinks.length % 2 !== 0 ? "col-span-2" : ""
                                                )}
                                                onClick={() => window.open(link.url, '_blank')}
                                            >
                                                {link.type === 'bot' && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                                )}

                                                <span className="flex items-center gap-1.5 relative z-10">
                                                    {link.type === 'bot' && <Bot className="w-3.5 h-3.5" />}
                                                    {link.type === 'cex' && <TrendingUp className="w-3.5 h-3.5" />}
                                                    {link.type === 'dex' && <ExternalLink className="w-3.5 h-3.5" />}
                                                    {link.label}
                                                </span>
                                                {link.isAffiliate && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse relative z-10" title="Link Parceiro" />
                                                )}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredGems.length === 0 && (
                <div className="text-center py-20 px-4 border border-dashed border-border rounded-2xl bg-card/20">
                    <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-2">
                        {pt ? 'Nenhuma gema encontrada' : 'No gems found'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        {pt ? 'Tente ajustar os filtros ou buscar por outro nome.' : 'Try adjusting the filters or searching for another name.'}
                    </p>
                </div>
            )}

            {/* Floating Referral Bar at bottom */}
            <ExchangeFloatingBar />
        </div>
    );
};

export default GemHunterPage;
