/**
 * 👤 Profile Page — Premium Social Profile
 * Editable profile with gamification stats, badges, achievements, and social features
 * Binance-style design with gradient cover and animated interactions
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { BADGES, LEVELS, getBadgeInfo } from '@/lib/gamificationService';
import { getUserPosts } from '@/lib/communityService';
import XPProgressBar from '@/components/gamification/XPProgressBar';
import StreakIndicator from '@/components/gamification/StreakIndicator';
import UserLevelBadge from '@/components/gamification/UserLevelBadge';
import MissionsPanel from '@/components/gamification/MissionsPanel';
import ReferralSystem from '@/components/gamification/ReferralSystem';
import { CreditHistory } from '@/components/gamification/CreditHistory';
import { PostCard } from '@/components/community/PostCard';
import { FollowersList } from '@/components/community/FollowersList';
import { EditProfileModal } from '@/components/community/EditProfileModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    ArrowLeft,
    Trophy,
    Target,
    Eye,
    Bot,
    Flame,
    Award,
    Lock,
    ChevronRight,
    Users,
    MessageSquare,
    BarChart3,
    Edit3,
    MapPin,
    Globe,
    CalendarDays,
    Crown,
    Sparkles,
    Settings
} from 'lucide-react';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { user } = useAuth();
    const { profile, badges, rank, levelInfo, xpProgress, isLoading } = useGamification();
    const [userPosts, setUserPosts] = useState<any[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const pt = language === 'pt';

    // Check if user has a badge
    const hasBadge = (badgeId: string) => badges.some(b => b.badge_id === badgeId);

    // Load user posts
    useEffect(() => {
        if (user?.id) {
            loadUserPosts();
        }
    }, [user?.id]);

    const loadUserPosts = async () => {
        if (!user?.id) return;
        setLoadingPosts(true);
        try {
            const posts = await getUserPosts(user.id);
            setUserPosts(posts);
        } catch (error) {
            console.error('Error loading user posts:', error);
        } finally {
            setLoadingPosts(false);
        }
    };

    const getLevelColor = () => {
        const lvl = profile?.level || 1;
        if (lvl >= 10) return 'from-amber-500 via-orange-500 to-red-500';
        if (lvl >= 7) return 'from-purple-500 via-pink-500 to-rose-500';
        if (lvl >= 4) return 'from-blue-500 via-cyan-500 to-teal-500';
        return 'from-blue-600 via-indigo-600 to-purple-600';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                    <p className="text-sm text-muted-foreground">{pt ? 'Carregando perfil...' : 'Loading profile...'}</p>
                </div>
            </div>
        );
    }

    const memberSince = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString(pt ? 'pt-BR' : 'en-US', { month: 'long', year: 'numeric' })
        : '';

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Cover / Hero Section */}
            <div className="relative">
                {/* Gradient Cover */}
                <div className={cn(
                    "h-36 sm:h-44 w-full relative",
                    `bg-gradient-to-br ${getLevelColor()}`
                )}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

                    {/* Back + Settings */}
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors backdrop-blur-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white text-xs font-medium transition-colors backdrop-blur-sm"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            {pt ? 'Editar' : 'Edit'}
                        </button>
                    </div>
                </div>

                {/* Avatar + Name (overlaps cover) */}
                <div className="relative -mt-14 px-6 mb-4 max-w-lg mx-auto">
                    <div className="flex items-end gap-4">
                        <Avatar className="w-24 h-24 ring-4 ring-background shadow-xl">
                            <AvatarImage src={profile?.avatar_url || ''} className="object-cover w-full h-full" />
                            <AvatarFallback className={cn(
                                "text-3xl font-bold text-white bg-gradient-to-br",
                                getLevelColor()
                            )}>
                                {profile?.username?.charAt(0)?.toUpperCase() || '?'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="pb-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold">{profile?.username || 'Anonymous'}</h1>
                                {(profile?.level || 0) >= 7 && <Crown className="w-4 h-4 text-amber-400" />}
                            </div>
                            <UserLevelBadge size="sm" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-5 max-w-lg mx-auto">
                {/* Bio & Info */}
                <div className="space-y-2">
                    {profile?.bio && (
                        <p className="text-sm">{profile.bio}</p>
                    )}
                    <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
                        {profile?.location && (
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {profile.location}
                            </span>
                        )}
                        {profile?.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                                <Globe className="w-3 h-3" /> {profile.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                        {memberSince && (
                            <span className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" /> {pt ? 'Membro desde' : 'Joined'} {memberSince}
                            </span>
                        )}
                    </div>
                </div>

                {/* XP Progress */}
                <div className={cn(
                    "rounded-2xl p-4 border border-border/50",
                    "bg-card/80 backdrop-blur-sm"
                )}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold">{profile?.xp || 0} XP</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            #{rank || '—'} {pt ? 'no ranking' : 'rank'}
                        </span>
                    </div>
                    <XPProgressBar size="lg" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className={cn(
                        "p-3 rounded-xl text-center border border-border/30",
                        "bg-card/60 backdrop-blur-sm"
                    )}>
                        <MessageSquare className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <p className="text-lg font-bold">{profile?.posts_count || 0}</p>
                        <p className="text-[9px] text-muted-foreground">Posts</p>
                    </div>
                    <div className={cn(
                        "p-3 rounded-xl text-center border border-border/30",
                        "bg-card/60 backdrop-blur-sm"
                    )}>
                        <Users className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                        <p className="text-lg font-bold">{profile?.followers_count || 0}</p>
                        <p className="text-[9px] text-muted-foreground">{pt ? 'Seguidores' : 'Followers'}</p>
                    </div>
                    <div className={cn(
                        "p-3 rounded-xl text-center border border-border/30",
                        "bg-card/60 backdrop-blur-sm"
                    )}>
                        <Users className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                        <p className="text-lg font-bold">{profile?.following_count || 0}</p>
                        <p className="text-[9px] text-muted-foreground">{pt ? 'Seguindo' : 'Following'}</p>
                    </div>
                    <div className={cn(
                        "p-3 rounded-xl text-center border border-border/30",
                        "bg-card/60 backdrop-blur-sm"
                    )}>
                        <Flame className={cn(
                            'w-4 h-4 mx-auto mb-1',
                            (profile?.streak_days || 0) >= 7 ? 'text-orange-400' : 'text-muted-foreground'
                        )} />
                        <p className="text-lg font-bold">{profile?.streak_days || 0}</p>
                        <p className="text-[9px] text-muted-foreground">Streak</p>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="missions" className="w-full">
                    <TabsList className="flex w-full overflow-x-auto no-scrollbar h-11 bg-muted/30 rounded-xl gap-0.5 p-1">
                        <TabsTrigger value="missions" className="text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm shrink-0 flex-1">
                            🎯 Missões
                        </TabsTrigger>
                        <TabsTrigger value="referral" className="text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm shrink-0 flex-1">
                            🤝 Indicar
                        </TabsTrigger>
                        <TabsTrigger value="posts" className="text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm shrink-0 flex-1">
                            Posts
                        </TabsTrigger>
                        <TabsTrigger value="overview" className="text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm shrink-0 flex-1">
                            Stats
                        </TabsTrigger>
                        <TabsTrigger value="badges" className="text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm shrink-0 flex-1">
                            Badges
                        </TabsTrigger>
                        <TabsTrigger value="followers" className="text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm shrink-0 flex-1">
                            Social
                        </TabsTrigger>
                    </TabsList>

                    {/* Missions Tab */}
                    <TabsContent value="missions" className="mt-4">
                        <MissionsPanel />
                    </TabsContent>

                    {/* Referral Tab */}
                    <TabsContent value="referral" className="mt-4">
                        <ReferralSystem />
                    </TabsContent>

                    {/* Posts Tab */}
                    <TabsContent value="posts" className="mt-4">
                        <div className="space-y-4">
                            {loadingPosts ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                                </div>
                            ) : userPosts.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="inline-flex p-3 rounded-2xl bg-muted/20 mb-3">
                                        <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {pt ? 'Você ainda não fez nenhum post.' : 'No posts yet.'}
                                    </p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">
                                        {pt ? 'Vá para a comunidade e compartilhe seus insights!' : 'Go to the community and share your insights!'}
                                    </p>
                                </div>
                            ) : (
                                userPosts.map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* Stats Tab */}
                    <TabsContent value="overview" className="mt-4 space-y-3">
                        <div className={cn(
                            'flex items-center justify-between p-4 rounded-xl',
                            'bg-card/60 border border-border/30'
                        )}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Eye className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {pt ? 'Análises Visualizadas' : 'Analyses Viewed'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">+5 XP {pt ? 'cada' : 'each'}</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold">{profile?.total_analyses_viewed || 0}</span>
                        </div>

                        <div className={cn(
                            'flex items-center justify-between p-4 rounded-xl',
                            'bg-card/60 border border-border/30'
                        )}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <Bot className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {pt ? 'Uso do Crypto Guru' : 'Crypto Guru Uses'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">+10 XP {pt ? 'cada' : 'each'}</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold">{profile?.total_guru_uses || 0}</span>
                        </div>

                        <div className={cn(
                            'flex items-center justify-between p-4 rounded-xl',
                            'bg-card/60 border border-border/30'
                        )}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                    <Trophy className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {pt ? 'Ranking Global' : 'Global Rank'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{pt ? 'Sua posição' : 'Your position'}</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold">#{rank || '—'}</span>
                        </div>

                        <CreditHistory />
                    </TabsContent>

                    {/* Badges Tab */}
                    <TabsContent value="badges" className="mt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-muted-foreground">
                                {pt ? 'CONQUISTAS' : 'ACHIEVEMENTS'}
                            </h3>
                            <span className="text-xs text-muted-foreground">{badges.length}/{BADGES.length}</span>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {BADGES.map(badge => {
                                const unlocked = hasBadge(badge.id);
                                return (
                                    <div
                                        key={badge.id}
                                        className={cn(
                                            'aspect-square rounded-xl flex flex-col items-center justify-center gap-1',
                                            'border transition-all cursor-pointer',
                                            unlocked
                                                ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 hover:scale-105'
                                                : 'bg-muted/20 border-border/30 opacity-50 grayscale'
                                        )}
                                        title={pt ? badge.namePt : badge.name}
                                    >
                                        <span className="text-xl">{unlocked ? badge.icon : <Lock className="w-4 h-4 text-muted-foreground" />}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </TabsContent>

                    {/* Social Tab */}
                    <TabsContent value="followers" className="mt-4">
                        <Tabs defaultValue="followers_list" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/30 rounded-xl h-9">
                                <TabsTrigger value="followers_list" className="text-xs rounded-lg">
                                    {pt ? 'Seguidores' : 'Followers'} ({profile?.followers_count || 0})
                                </TabsTrigger>
                                <TabsTrigger value="following_list" className="text-xs rounded-lg">
                                    {pt ? 'Seguindo' : 'Following'} ({profile?.following_count || 0})
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="followers_list">
                                {user?.id && <FollowersList userId={user.id} type="followers" />}
                            </TabsContent>
                            <TabsContent value="following_list">
                                {user?.id && <FollowersList userId={user.id} type="following" />}
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                profile={profile}
                onSuccess={() => {
                    // Just rely on the context to refresh instead of reloading the page
                }}
            />
        </div>
    );
};

export default ProfilePage;
