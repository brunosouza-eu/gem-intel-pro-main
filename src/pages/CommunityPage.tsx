/**
 * 💎 Comunidade Crypto Gem — Premium Social Experience
 * Instagram/Binance-style 3-column layout with stories, market pulse, drawer comments
 */
import React, { useState, useEffect } from 'react';
import { CommunityFeed } from '@/components/community/CommunityFeed';
import { CreatePostInline } from '@/components/community/CreatePostInline';
import { StoriesBar } from '@/components/community/StoriesBar';
import { MarketPulse } from '@/components/community/MarketPulse';
import { CommentDrawer } from '@/components/community/CommentDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGamification } from '@/contexts/GamificationContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import {
    getTrendingTopics,
    getTopTraders,
    getSuggestedFollows,
    toggleFollow
} from '@/lib/communityService';
import type { TrendingTopic, TopTrader } from '@/types/community';
import type { Post } from '@/types/community';
import {
    TrendingUp,
    Trophy,
    Users,
    UserPlus,
    Flame,
    Crown,
    Zap,
    Plus,
    Sparkles,
    Gem
} from 'lucide-react';

const CommunityPage = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const { profile } = useGamification();
    const navigate = useNavigate();
    const pt = language === 'pt';

    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [topTraders, setTopTraders] = useState<TopTrader[]>([]);
    const [suggestedFollows, setSuggestedFollows] = useState<TopTrader[]>([]);
    const [feedKey, setFeedKey] = useState(0);

    // Comment Drawer state
    const [drawerPost, setDrawerPost] = useState<Post | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        getTrendingTopics().then(setTrendingTopics);
        getTopTraders(8).then(setTopTraders);
        getSuggestedFollows(5).then(setSuggestedFollows);
        // Track daily mission: visit community
        import('@/lib/missionTracker').then(m => m.trackMissionAction('visit_community')).catch(() => {});
    }, []);

    const handlePostCreated = () => {
        setFeedKey(k => k + 1);
    };

    const handleFollow = async (userId: string) => {
        const result = await toggleFollow(userId);
        if (result.success) {
            setSuggestedFollows(prev => prev.filter(u => u.user_id !== userId));
        }
    };

    const handleCommentOpen = (post: Post) => {
        setDrawerPost(post);
        setDrawerOpen(true);
    };

    const getLevelColor = (level: number) => {
        if (level >= 10) return 'from-amber-400 to-orange-500';
        if (level >= 7) return 'from-purple-400 to-pink-500';
        if (level >= 4) return 'from-blue-400 to-cyan-500';
        return 'from-gray-400 to-gray-500';
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Header */}
            <div className="relative overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
                <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-600 shadow-lg shadow-primary/20">
                            <Gem className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                {pt ? 'Comunidade Crypto Gem' : 'Crypto Gem Community'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {pt ? 'Compartilhe insights, conecte-se com traders e descubra tendências.' : 'Share insights, connect with traders and discover trends.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main 3-Column Layout */}
            <div className="max-w-7xl mx-auto px-4 py-6">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT SIDEBAR — Hidden on mobile */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-5">

                        {/* User Card */}
                        {profile && (
                            <div className={cn(
                                "rounded-2xl p-4 border border-border/50",
                                "bg-card/80 backdrop-blur-sm"
                            )}>
                                <div className="flex items-center gap-3 mb-3">
                                    <Avatar className="w-11 h-11 ring-2 ring-primary/20">
                                        <AvatarImage src={profile.avatar_url || ''} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                                            {profile.username?.charAt(0)?.toUpperCase() || '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">{profile.username || 'Anonymous'}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Lvl {profile.level} • {profile.xp} XP
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2 rounded-lg bg-muted/30">
                                        <p className="text-sm font-bold">{profile.posts_count || 0}</p>
                                        <p className="text-[9px] text-muted-foreground">Posts</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/30">
                                        <p className="text-sm font-bold">{profile.followers_count || 0}</p>
                                        <p className="text-[9px] text-muted-foreground">{pt ? 'Seguidores' : 'Followers'}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/30">
                                        <p className="text-sm font-bold">{profile.following_count || 0}</p>
                                        <p className="text-[9px] text-muted-foreground">{pt ? 'Seguindo' : 'Following'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="w-full mt-3 py-2 rounded-xl text-xs font-medium text-primary border border-primary/20 hover:bg-primary/5 transition-colors"
                                >
                                    {pt ? 'Ver Meu Perfil' : 'View Profile'}
                                </button>
                            </div>
                        )}

                        {/* Trending Topics */}
                        <div className={cn(
                            "rounded-2xl p-4 border border-border/50",
                            "bg-card/80 backdrop-blur-sm"
                        )}>
                            <div className="flex items-center gap-2 mb-4">
                                <Flame className="w-4 h-4 text-orange-400" />
                                <h3 className="font-semibold text-sm">{pt ? 'Em Alta' : 'Trending'}</h3>
                            </div>

                            {trendingTopics.length > 0 ? (
                                <div className="space-y-2.5">
                                    {trendingTopics.slice(0, 8).map((topic, i) => (
                                        <div key={topic.token} className="flex items-center justify-between group cursor-pointer hover:bg-muted/30 p-1.5 -mx-1.5 rounded-lg transition-colors">
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                                                <span className="text-sm font-medium">
                                                    <span className="text-primary">${topic.token}</span>
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">
                                                {topic.mentions} {pt ? 'menções' : 'mentions'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-4">
                                    {pt ? 'Nenhum tópico em alta ainda' : 'No trending topics yet'}
                                </p>
                            )}
                        </div>

                        {/* Top Traders Leaderboard */}
                        <div className={cn(
                            "rounded-2xl p-4 border border-border/50",
                            "bg-card/80 backdrop-blur-sm"
                        )}>
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                <h3 className="font-semibold text-sm">{pt ? 'Top Traders' : 'Top Traders'}</h3>
                            </div>

                            <div className="space-y-2">
                                {topTraders.slice(0, 8).map((trader, i) => (
                                    <div key={trader.user_id} className="flex items-center gap-2.5 py-1.5 group cursor-pointer hover:bg-muted/30 p-1.5 -mx-1.5 rounded-lg transition-colors">
                                        <span className={cn(
                                            "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                                            i === 0 ? 'bg-amber-500/20 text-amber-400' :
                                                i === 1 ? 'bg-gray-400/20 text-gray-300' :
                                                    i === 2 ? 'bg-orange-600/20 text-orange-400' :
                                                        'bg-muted/50 text-muted-foreground'
                                        )}>
                                            {i + 1}
                                        </span>
                                        <Avatar className="w-7 h-7">
                                            <AvatarImage src={trader.avatar_url || ''} />
                                            <AvatarFallback className={cn("text-[10px] font-bold text-white bg-gradient-to-br", getLevelColor(trader.level))}>
                                                {trader.username?.charAt(0)?.toUpperCase() || '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">{trader.username}</p>
                                            <p className="text-[10px] text-muted-foreground">Lvl {trader.level} • {trader.xp} XP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* CENTER FEED — Main content */}
                    <main className="lg:col-span-6 space-y-5">
                        {/* Stories Bar */}
                        <div className={cn(
                            "rounded-2xl p-3 border border-border/40",
                            "bg-card/60 backdrop-blur-sm"
                        )}>
                            <StoriesBar />
                        </div>

                        {/* Inline Composer */}
                        <CreatePostInline onPostCreated={handlePostCreated} />

                        {/* Market Pulse */}
                        <MarketPulse />

                        {/* Feed */}
                        <CommunityFeed key={feedKey} onCommentOpen={handleCommentOpen} />
                    </main>

                    {/* RIGHT SIDEBAR — Hidden on mobile */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-5">

                        {/* Suggested Follows */}
                        {suggestedFollows.length > 0 && (
                            <div className={cn(
                                "rounded-2xl p-4 border border-border/50",
                                "bg-card/80 backdrop-blur-sm"
                            )}>
                                <div className="flex items-center gap-2 mb-4">
                                    <UserPlus className="w-4 h-4 text-blue-400" />
                                    <h3 className="font-semibold text-sm">{pt ? 'Quem Seguir' : 'Who to Follow'}</h3>
                                </div>

                                <div className="space-y-3">
                                    {suggestedFollows.map(person => (
                                        <div key={person.user_id} className="flex items-center gap-2.5">
                                            <Avatar className="w-9 h-9">
                                                <AvatarImage src={person.avatar_url || ''} />
                                                <AvatarFallback className={cn("text-xs font-bold text-white bg-gradient-to-br", getLevelColor(person.level))}>
                                                    {person.username?.charAt(0)?.toUpperCase() || '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium truncate">{person.username}</p>
                                                <p className="text-[10px] text-muted-foreground">{person.followers_count} {pt ? 'seguidores' : 'followers'}</p>
                                            </div>
                                            <button
                                                onClick={() => handleFollow(person.user_id)}
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                                {pt ? 'Seguir' : 'Follow'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Community Stats */}
                        <div className={cn(
                            "rounded-2xl p-4 border border-border/50",
                            "bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5",
                            "backdrop-blur-sm"
                        )}>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <h3 className="font-semibold text-sm">{pt ? 'Comunidade' : 'Community'}</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">{pt ? 'Membros ativos' : 'Active members'}</span>
                                    </div>
                                    <span className="text-xs font-semibold">{topTraders.length > 0 ? `${topTraders.length}+` : '—'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">{pt ? 'Tópicos em alta' : 'Trending topics'}</span>
                                    </div>
                                    <span className="text-xs font-semibold">{trendingTopics.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rules / Guidelines */}
                        <div className={cn(
                            "rounded-2xl p-4 border border-border/50",
                            "bg-card/80 backdrop-blur-sm"
                        )}>
                            <h3 className="font-semibold text-sm mb-3">
                                {pt ? '📋 Regras' : '📋 Guidelines'}
                            </h3>
                            <ul className="space-y-2 text-xs text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-400 mt-0.5">✓</span>
                                    {pt ? 'Compartilhe análises e insights reais' : 'Share real analyses and insights'}
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-400 mt-0.5">✓</span>
                                    {pt ? 'Seja respeitoso com outros traders' : 'Be respectful to other traders'}
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">✗</span>
                                    {pt ? 'Não faça spam ou shilling' : 'No spam or shilling'}
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 mt-0.5">✗</span>
                                    {pt ? 'Sem conselhos financeiros diretos' : 'No direct financial advice'}
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile FAB */}
            <div className="fixed bottom-24 right-6 z-40 lg:hidden">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={cn(
                        "rounded-full h-14 w-14 shadow-xl flex items-center justify-center",
                        "bg-gradient-to-r from-blue-600 to-purple-600",
                        "hover:scale-105 active:scale-95 transition-transform",
                        "shadow-primary/30"
                    )}
                >
                    <Plus className="w-7 h-7 text-white" />
                </button>
            </div>

            {/* Comment Drawer */}
            <CommentDrawer
                post={drawerPost}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </div>
    );
};

export default CommunityPage;
