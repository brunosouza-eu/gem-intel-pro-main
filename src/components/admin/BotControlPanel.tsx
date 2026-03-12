/**
 * 🤖 Bot Control Panel — Admin Component
 * Manage community bots: status, manual trigger, activity log
 */
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
    Bot,
    Play,
    Power,
    PowerOff,
    Activity,
    Loader2,
    RefreshCw,
    Zap,
    MessageSquare,
    Heart,
    UserPlus,
    Clock,
    TrendingUp,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BotStats {
    total_bots: number;
    active_bots: number;
    total_posts: number;
    total_comments: number;
    total_likes: number;
    posts_today: number;
    comments_today: number;
    last_activity: string | null;
}

interface BotProfile {
    id: string;
    persona_name: string;
    persona_style: string;
    is_active: boolean;
    topics: string[];
    user_id: string;
    profiles: {
        username: string;
        avatar_url: string | null;
        level: number;
        xp: number;
        posts_count: number;
    } | null;
}

export default function BotControlPanel() {
    const { language } = useLanguage();
    const { session } = useAuth();
    const pt = language === 'pt';

    const [stats, setStats] = useState<BotStats | null>(null);
    const [bots, setBots] = useState<BotProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [triggering, setTriggering] = useState(false);
    const [triggerResult, setTriggerResult] = useState<any>(null);
    const [togglingBot, setTogglingBot] = useState<string | null>(null);

    useEffect(() => {
        loadBotData();
    }, []);

    const loadBotData = async () => {
        setLoading(true);
        try {
            const token = session?.access_token;
            if (!token) return;

            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/community-bots`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ action: 'get_stats' }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
                setBots(data.bots || []);
            }
        } catch (err) {
            console.error('Failed to load bot stats:', err);
        }
        setLoading(false);
    };

    const handleTrigger = async () => {
        setTriggering(true);
        setTriggerResult(null);
        try {
            const token = session?.access_token;
            if (!token) return;

            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/community-bots`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ action: 'generate_activity' }),
                }
            );

            const data = await response.json();
            setTriggerResult(data);

            // Reload stats after trigger
            setTimeout(() => loadBotData(), 2000);
        } catch (err) {
            console.error('Failed to trigger bots:', err);
            setTriggerResult({ error: 'Failed to trigger' });
        }
        setTriggering(false);
    };

    const handleToggleBot = async (botId: string, currentActive: boolean) => {
        setTogglingBot(botId);
        try {
            const token = session?.access_token;
            if (!token) return;

            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/community-bots`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ action: 'toggle_bot', bot_id: botId, is_active: !currentActive }),
                }
            );

            if (response.ok) {
                setBots(prev => prev.map(b =>
                    b.id === botId ? { ...b, is_active: !currentActive } : b
                ));
            }
        } catch (err) {
            console.error('Failed to toggle bot:', err);
        }
        setTogglingBot(null);
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'post': return <MessageSquare className="w-3 h-3" />;
            case 'comment': return <MessageSquare className="w-3 h-3" />;
            case 'like': return <Heart className="w-3 h-3" />;
            case 'follow': return <UserPlus className="w-3 h-3" />;
            default: return <Activity className="w-3 h-3" />;
        }
    };

    const getStyleColor = (style: string) => {
        const colors: Record<string, string> = {
            'analytical': 'text-blue-400',
            'energetic': 'text-yellow-400',
            'educational': 'text-green-400',
            'data-driven': 'text-cyan-400',
            'passionate': 'text-pink-400',
            'maximalist': 'text-orange-400',
            'adventurous': 'text-purple-400',
            'technical': 'text-indigo-400',
            'conservative': 'text-emerald-400',
            'concise': 'text-gray-400',
        };
        return colors[style] || 'text-muted-foreground';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-bold">
                        {pt ? '🤖 Controle de Bots' : '🤖 Bot Control'}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={loadBotData}
                        className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleTrigger}
                        disabled={triggering}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
                    >
                        {triggering ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Zap className="w-3.5 h-3.5" />
                        )}
                        {pt ? 'Disparar Bots' : 'Trigger Bots'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-card/60 border border-border/30">
                        <div className="flex items-center gap-2 mb-1">
                            <Bot className="w-4 h-4 text-primary" />
                            <span className="text-xs text-muted-foreground">{pt ? 'Bots Ativos' : 'Active Bots'}</span>
                        </div>
                        <p className="text-xl font-bold">{stats.active_bots}<span className="text-sm text-muted-foreground">/{stats.total_bots}</span></p>
                    </div>
                    <div className="p-3 rounded-xl bg-card/60 border border-border/30">
                        <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-muted-foreground">{pt ? 'Posts (Bot)' : 'Bot Posts'}</span>
                        </div>
                        <p className="text-xl font-bold">{stats.total_posts} <span className="text-xs text-emerald-400">+{stats.posts_today} {pt ? 'hoje' : 'today'}</span></p>
                    </div>
                    <div className="p-3 rounded-xl bg-card/60 border border-border/30">
                        <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-muted-foreground">{pt ? 'Comentários' : 'Comments'}</span>
                        </div>
                        <p className="text-xl font-bold">{stats.total_comments} <span className="text-xs text-emerald-400">+{stats.comments_today} {pt ? 'hoje' : 'today'}</span></p>
                    </div>
                    <div className="p-3 rounded-xl bg-card/60 border border-border/30">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span className="text-xs text-muted-foreground">{pt ? 'Última Ação' : 'Last Action'}</span>
                        </div>
                        <p className="text-sm font-medium mt-1">
                            {stats.last_activity
                                ? formatDistanceToNow(new Date(stats.last_activity), { addSuffix: true, locale: pt ? ptBR : undefined })
                                : (pt ? 'Nenhuma' : 'None')
                            }
                        </p>
                    </div>
                </div>
            )}

            {/* Trigger Result */}
            {triggerResult && (
                <div className={cn(
                    "p-4 rounded-xl border text-sm",
                    triggerResult.error
                        ? "bg-red-500/5 border-red-500/20 text-red-400"
                        : "bg-emerald-500/5 border-emerald-500/20"
                )}>
                    {triggerResult.error ? (
                        <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            <span>{triggerResult.error || triggerResult.message}</span>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-emerald-400 font-medium">
                                <CheckCircle className="w-4 h-4" />
                                <span>{triggerResult.bots_acted || 0} {pt ? 'bots atuaram' : 'bots acted'}!</span>
                            </div>
                            {triggerResult.results?.map((r: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground ml-6">
                                    {getActionIcon(r.action)}
                                    <span className={r.success ? 'text-emerald-400' : 'text-red-400'}>
                                        @{r.username || r.bot} → {r.action}: {r.detail?.slice(0, 80) || ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Bot List */}
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {pt ? 'Bots Registrados' : 'Registered Bots'}
                </h4>
                {bots.map(bot => (
                    <div
                        key={bot.id}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border transition-all",
                            bot.is_active
                                ? "bg-card/60 border-border/30"
                                : "bg-muted/20 border-border/10 opacity-60"
                        )}
                    >
                        {/* Status dot */}
                        <div className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            bot.is_active ? "bg-emerald-400 shadow-lg shadow-emerald-400/50" : "bg-gray-500"
                        )} />

                        {/* Avatar initial */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {bot.profiles?.username?.charAt(0)?.toUpperCase() || '?'}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold">{bot.profiles?.username || bot.persona_name}</span>
                                <span className={cn("text-[9px] font-medium", getStyleColor(bot.persona_style))}>
                                    {bot.persona_style}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-muted-foreground">
                                    Lvl {bot.profiles?.level || 1} • {bot.profiles?.xp || 0} XP • {bot.profiles?.posts_count || 0} posts
                                </span>
                            </div>
                            <div className="flex gap-1 flex-wrap mt-1">
                                {bot.topics?.slice(0, 4).map((topic, i) => (
                                    <span key={i} className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/70">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Toggle */}
                        <button
                            onClick={() => handleToggleBot(bot.id, bot.is_active)}
                            disabled={togglingBot === bot.id}
                            className={cn(
                                "p-2 rounded-lg transition-colors flex-shrink-0",
                                bot.is_active
                                    ? "hover:bg-red-500/10 text-emerald-400 hover:text-red-400"
                                    : "hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400"
                            )}
                            title={bot.is_active ? (pt ? 'Desativar' : 'Deactivate') : (pt ? 'Ativar' : 'Activate')}
                        >
                            {togglingBot === bot.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : bot.is_active ? (
                                <Power className="w-4 h-4" />
                            ) : (
                                <PowerOff className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                ))}

                {bots.length === 0 && (
                    <div className="text-center py-8">
                        <Bot className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">
                            {pt ? 'Nenhum bot configurado. Execute o setup primeiro.' : 'No bots configured. Run setup first.'}
                        </p>
                        <code className="text-xs text-primary/60 mt-2 block">node setup-community-bots.mjs</code>
                    </div>
                )}
            </div>
        </div>
    );
}
