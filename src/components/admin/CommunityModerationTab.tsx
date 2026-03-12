/**
 * 🛡️ Community Moderation Tab
 * Admin tool for managing community content, banning users, and deleting posts
 */
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    adminGetAllPosts,
    adminGetBannedUsers,
    adminGetCommunityStats,
    adminDeletePost,
    adminDeleteComment,
    adminBanUser,
    adminUnbanUser,
} from '@/lib/communityService';
import type { Post } from '@/types/community';
import BotControlPanel from './BotControlPanel';
import {
    Trash2,
    Ban,
    Shield,
    ShieldOff,
    MessageSquare,
    Users,
    AlertTriangle,
    BarChart3,
    Search,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Loader2,
    CheckCircle,
    XCircle,
    Bot
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CommunityStats {
    totalPosts: number;
    totalComments: number;
    bannedUsers: number;
    postsToday: number;
}

interface BannedUser {
    id: string;
    email: string;
    username: string;
    avatar_url: string | null;
    level: number;
    banned_at: string;
    banned_reason: string;
}

export default function CommunityModerationTab() {
    const { language } = useLanguage();
    const pt = language === 'pt';

    const [tab, setTab] = useState<'posts' | 'banned' | 'bots'>('posts');
    const [stats, setStats] = useState<CommunityStats>({ totalPosts: 0, totalComments: 0, bannedUsers: 0, postsToday: 0 });
    const [posts, setPosts] = useState<any[]>([]);
    const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Ban modal state
    const [banModal, setBanModal] = useState<{ userId: string; username: string } | null>(null);
    const [banReason, setBanReason] = useState('');

    // Delete confirmation
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (tab === 'posts') loadPosts();
        if (tab === 'banned') loadBanned();
    }, [tab, page]);

    const loadData = async () => {
        setLoading(true);
        const [s] = await Promise.all([
            adminGetCommunityStats(),
        ]);
        setStats(s);
        await loadPosts();
        setLoading(false);
    };

    const loadPosts = async () => {
        const data = await adminGetAllPosts(page, 15);
        setPosts(data);
    };

    const loadBanned = async () => {
        const data = await adminGetBannedUsers();
        setBannedUsers(data);
    };

    const handleDeletePost = async (postId: string) => {
        setActionLoading(postId);
        const success = await adminDeletePost(postId);
        if (success) {
            setPosts(prev => prev.filter(p => p.id !== postId));
            setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
        }
        setActionLoading(null);
        setDeleteConfirm(null);
    };

    const handleBanUser = async () => {
        if (!banModal || !banReason.trim()) return;
        setActionLoading(banModal.userId);
        const success = await adminBanUser(banModal.userId, banReason.trim());
        if (success) {
            setStats(prev => ({ ...prev, bannedUsers: prev.bannedUsers + 1 }));
            setBanModal(null);
            setBanReason('');
            loadBanned();
        }
        setActionLoading(null);
    };

    const handleUnbanUser = async (userId: string) => {
        setActionLoading(userId);
        const success = await adminUnbanUser(userId);
        if (success) {
            setBannedUsers(prev => prev.filter(u => u.id !== userId));
            setStats(prev => ({ ...prev, bannedUsers: prev.bannedUsers - 1 }));
        }
        setActionLoading(null);
    };

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={<MessageSquare className="w-5 h-5 text-blue-400" />} label={pt ? 'Total Posts' : 'Total Posts'} value={stats.totalPosts} />
                <StatCard icon={<MessageSquare className="w-5 h-5 text-green-400" />} label={pt ? 'Posts Hoje' : 'Posts Today'} value={stats.postsToday} />
                <StatCard icon={<BarChart3 className="w-5 h-5 text-purple-400" />} label={pt ? 'Comentários' : 'Comments'} value={stats.totalComments} />
                <StatCard icon={<Ban className="w-5 h-5 text-red-400" />} label={pt ? 'Banidos' : 'Banned'} value={stats.bannedUsers} color="red" />
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-2 border-b border-border/50 pb-2">
                <button
                    onClick={() => { setTab('posts'); setPage(0); }}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors",
                        tab === 'posts' ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <MessageSquare className="w-4 h-4" />
                    {pt ? 'Posts' : 'Posts'}
                </button>
                <button
                    onClick={() => setTab('banned')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors",
                        tab === 'banned' ? "bg-red-500/10 text-red-400 border-b-2 border-red-400" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Ban className="w-4 h-4" />
                    {pt ? 'Banidos' : 'Banned'} ({stats.bannedUsers})
                </button>
                <button
                    onClick={() => setTab('bots')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors",
                        tab === 'bots' ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-400" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Bot className="w-4 h-4" />
                    {pt ? '🤖 Bots' : '🤖 Bots'}
                </button>
                <button
                    onClick={loadData}
                    className="ml-auto p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Posts Tab */}
            {tab === 'posts' && (
                <div className="space-y-3">
                    {posts.length === 0 ? (
                        <p className="text-center py-10 text-muted-foreground text-sm">
                            {pt ? 'Nenhum post encontrado.' : 'No posts found.'}
                        </p>
                    ) : posts.map(post => (
                        <div key={post.id} className="flex items-start gap-3 p-3 rounded-xl bg-card/60 border border-border/30 group">
                            {/* Avatar */}
                            <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarImage src={post.avatar_url || ''} />
                                <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    {post.username?.charAt(0)?.toUpperCase() || '?'}
                                </AvatarFallback>
                            </Avatar>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-semibold">{post.username || 'Anônimo'}</span>
                                    {post.is_banned && (
                                        <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded-full">BANIDO</span>
                                    )}
                                    <span className="text-[10px] text-muted-foreground">
                                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: pt ? ptBR : undefined })}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.content}</p>
                                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                                    <span>❤ {post.likes_count || 0}</span>
                                    <span>💬 {post.comments_count || 0}</span>
                                    <span className="uppercase text-primary/60">{post.post_type}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                                {/* Ban user button */}
                                {!post.is_banned && post.user_id && (
                                    <button
                                        onClick={() => setBanModal({ userId: post.user_id, username: post.username || 'User' })}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        title={pt ? 'Banir usuário' : 'Ban user'}
                                    >
                                        <Ban className="w-3.5 h-3.5" />
                                    </button>
                                )}

                                {/* Delete post */}
                                {deleteConfirm === post.id ? (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            disabled={actionLoading === post.id}
                                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                            title={pt ? 'Confirmar' : 'Confirm'}
                                        >
                                            {actionLoading === post.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(null)}
                                            className="p-1.5 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDeleteConfirm(post.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        title={pt ? 'Deletar' : 'Delete'}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/30 hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> {pt ? 'Anterior' : 'Previous'}
                        </button>
                        <span className="text-xs text-muted-foreground">{pt ? 'Página' : 'Page'} {page + 1}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={posts.length < 15}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/30 hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            {pt ? 'Próxima' : 'Next'} <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Banned Users Tab */}
            {tab === 'banned' && (
                <div className="space-y-3">
                    {bannedUsers.length === 0 ? (
                        <div className="text-center py-10">
                            <Shield className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-sm text-muted-foreground">
                                {pt ? 'Nenhum usuário banido.' : 'No banned users.'}
                            </p>
                        </div>
                    ) : bannedUsers.map(user => (
                        <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                            <Avatar className="w-9 h-9">
                                <AvatarImage src={user.avatar_url || ''} />
                                <AvatarFallback className="text-xs bg-red-500/20 text-red-400">{user.username?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{user.username || user.email}</span>
                                    <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">BANIDO</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {pt ? 'Motivo:' : 'Reason:'} {user.banned_reason || '—'}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    {user.banned_at && formatDistanceToNow(new Date(user.banned_at), { addSuffix: true, locale: pt ? ptBR : undefined })}
                                </p>
                            </div>
                            <button
                                onClick={() => handleUnbanUser(user.id)}
                                disabled={actionLoading === user.id}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                            >
                                {actionLoading === user.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldOff className="w-3.5 h-3.5" />}
                                {pt ? 'Desbanir' : 'Unban'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Bots Tab */}
            {tab === 'bots' && (
                <BotControlPanel />
            )}

            {/* Ban Modal */}
            {banModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBanModal(null)} />
                    <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border/50 shadow-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 text-red-400">
                            <Ban className="w-5 h-5" />
                            <h3 className="font-bold">
                                {pt ? 'Banir Usuário' : 'Ban User'}
                            </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {pt
                                ? `Banir "${banModal.username}" da comunidade?`
                                : `Ban "${banModal.username}" from the community?`
                            }
                        </p>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                {pt ? 'Motivo do banimento' : 'Ban reason'} *
                            </label>
                            <textarea
                                value={banReason}
                                onChange={e => setBanReason(e.target.value)}
                                placeholder={pt ? 'Descreva o motivo...' : 'Describe the reason...'}
                                rows={3}
                                className="w-full px-3 py-2.5 rounded-xl text-sm bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setBanModal(null); setBanReason(''); }}
                                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-muted/50 hover:bg-muted transition-colors"
                            >
                                {pt ? 'Cancelar' : 'Cancel'}
                            </button>
                            <button
                                onClick={handleBanUser}
                                disabled={!banReason.trim() || actionLoading === banModal.userId}
                                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {actionLoading === banModal.userId
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Ban className="w-4 h-4" />
                                }
                                {pt ? 'Banir' : 'Ban'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple stat card
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color?: string }) {
    return (
        <div className={cn(
            "p-3 rounded-xl border border-border/30",
            color === 'red' ? 'bg-red-500/5' : 'bg-card/60'
        )}>
            <div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}
