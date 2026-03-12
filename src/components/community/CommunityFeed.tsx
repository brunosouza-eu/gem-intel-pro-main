/**
 * 📰 Community Feed — Enhanced
 * Premium feed with 4 filter tabs, shimmer skeletons, and infinite scroll
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { getFeed } from '@/lib/communityService';
import { Post, FeedFilter } from '@/types/community';
import { PostCard } from './PostCard';
import { Loader2, RefreshCw, Flame, Clock, Users, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface CommunityFeedProps {
    initialFilter?: FeedFilter;
    onCommentOpen?: (post: Post) => void;
}

const FILTERS: { value: FeedFilter; label: string; labelPt: string; icon: React.ReactNode }[] = [
    { value: 'recent', label: 'Recent', labelPt: 'Recentes', icon: <Clock className="w-3.5 h-3.5" /> },
    { value: 'following', label: 'Following', labelPt: 'Seguindo', icon: <Users className="w-3.5 h-3.5" /> },
    { value: 'trending', label: 'Trending', labelPt: 'Em Alta', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { value: 'hot', label: 'Hot 🔥', labelPt: 'Hot 🔥', icon: <Flame className="w-3.5 h-3.5" /> },
];

export function CommunityFeed({ initialFilter = 'recent', onCommentOpen }: CommunityFeedProps) {
    const { user } = useAuth();
    const { language } = useLanguage();
    const pt = language === 'pt';
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [filter, setFilter] = useState<FeedFilter>(initialFilter);
    const [refreshing, setRefreshing] = useState(false);
    const [newPostsBanner, setNewPostsBanner] = useState(0);
    const filterRef = useRef(filter);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    // Keep filterRef in sync
    useEffect(() => {
        filterRef.current = filter;
    }, [filter]);

    const loadPosts = useCallback(async (currentPage: number, currentFilter: FeedFilter, isRefresh = false) => {
        try {
            if (currentPage === 0) setLoading(true);
            else setLoadingMore(true);

            const newPosts = await getFeed(currentPage, 10, currentFilter);

            if (isRefresh || currentPage === 0) {
                setPosts(newPosts);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
            }

            setHasMore(newPosts.length === 10);
        } catch (error) {
            console.error('Error loading feed:', error);
            toast({
                title: pt ? "Erro ao carregar feed" : "Error loading feed",
                description: pt ? "Não foi possível carregar os posts. Tente novamente." : "Could not load posts. Try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    }, [pt]);

    useEffect(() => {
        setPage(0);
        loadPosts(0, filter);
    }, [filter, loadPosts]);

    // 🔴 REALTIME: Polling + Supabase Realtime (dual strategy)
    // Polling every 30s guarantees updates; Realtime gives instant updates when available
    const lastPostIdRef = useRef<string | null>(null);

    // Track the most recent post ID
    useEffect(() => {
        if (posts.length > 0 && filter === 'recent') {
            lastPostIdRef.current = posts[0]?.id || null;
        }
    }, [posts, filter]);

    // Polling: check for new posts every 30 seconds
    useEffect(() => {
        const pollInterval = setInterval(async () => {
            if (filterRef.current !== 'recent') return;

            try {
                const latestPosts = await getFeed(0, 1, 'recent');
                if (latestPosts.length > 0 && lastPostIdRef.current && latestPosts[0].id !== lastPostIdRef.current) {
                    console.log('🔴 New post detected via polling!');
                    loadPosts(0, 'recent', true);
                }
            } catch (err) {
                // Silent fail on poll
            }
        }, 30000); // 30 seconds

        return () => clearInterval(pollInterval);
    }, [loadPosts]);

    // Supabase Realtime: instant updates when WebSocket is available
    useEffect(() => {
        const channel = supabase
            .channel('community-feed-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'posts' },
                (_payload) => {
                    console.log('🔴 Realtime: new post detected!');
                    if (filterRef.current === 'recent') {
                        loadPosts(0, 'recent', true);
                    } else {
                        setNewPostsBanner(prev => prev + 1);
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'posts' },
                (payload) => {
                    setPosts(prev => prev.filter(p => p.id !== payload.old.id));
                }
            )
            .subscribe((status) => {
                console.log('🔴 Realtime subscription status:', status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [loadPosts]);

    useEffect(() => {
        if (inView && hasMore && !loading && !loadingMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadPosts(nextPage, filter);
        }
    }, [inView, hasMore, loading, loadingMore, filter, page, loadPosts]);

    const handleRefresh = () => {
        setRefreshing(true);
        setNewPostsBanner(0);
        setPage(0);
        loadPosts(0, filter, true);
    };

    const handlePostDeleted = (postId: string) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const handleShowNewPosts = () => {
        setNewPostsBanner(0);
        setFilter('recent');
        setPage(0);
        loadPosts(0, 'recent', true);
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 sticky top-0 bg-background/90 backdrop-blur-xl z-10 py-3 -mx-1 px-1 border-b border-border/30">
                <div className="flex gap-1.5 flex-1 overflow-x-auto no-scrollbar">
                    {FILTERS.map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            disabled={f.value === 'following' && !user}
                            className={cn(
                                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
                                filter === f.value
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                f.value === 'following' && !user && "opacity-40 cursor-not-allowed"
                            )}
                        >
                            {f.icon}
                            {pt ? f.labelPt : f.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleRefresh}
                    className={cn(
                        "p-2 rounded-xl hover:bg-muted/50 text-muted-foreground transition-all flex-shrink-0",
                        refreshing && "animate-spin"
                    )}
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* 🔴 Realtime: New Posts Banner */}
            {newPostsBanner > 0 && (
                <button
                    onClick={handleShowNewPosts}
                    className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-primary text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-4 h-4" />
                    {pt
                        ? `${newPostsBanner} novo${newPostsBanner > 1 ? 's' : ''} post${newPostsBanner > 1 ? 's' : ''} — Toque para ver`
                        : `${newPostsBanner} new post${newPostsBanner > 1 ? 's' : ''} — Tap to see`
                    }
                </button>
            )}

            {/* Loading Skeletons */}
            {loading && page === 0 ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-2xl border border-border/40 bg-card/60 p-4 space-y-3 animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-muted/50 shimmer" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-3.5 w-32 rounded-full bg-muted/50 shimmer" />
                                    <div className="h-3 w-20 rounded-full bg-muted/40 shimmer" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 w-full rounded-full bg-muted/30 shimmer" />
                                <div className="h-3 w-4/5 rounded-full bg-muted/30 shimmer" />
                                <div className="h-3 w-2/3 rounded-full bg-muted/30 shimmer" />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <div className="h-7 w-16 rounded-lg bg-muted/30 shimmer" />
                                <div className="h-7 w-16 rounded-lg bg-muted/30 shimmer" />
                                <div className="h-7 w-16 rounded-lg bg-muted/30 shimmer" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Empty State */}
                    {posts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="inline-flex p-4 rounded-2xl bg-muted/20 mb-4">
                                <Sparkles className="w-10 h-10 text-muted-foreground/50" />
                            </div>
                            <p className="font-medium text-muted-foreground">
                                {pt ? 'Nenhum post encontrado.' : 'No posts found.'}
                            </p>
                            <p className="text-sm text-muted-foreground/60 mt-1">
                                {pt ? 'Seja o primeiro a compartilhar uma ideia!' : 'Be the first to share an idea!'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onDelete={handlePostDeleted}
                                    onCommentOpen={onCommentOpen}
                                />
                            ))}
                        </div>
                    )}

                    {/* Infinite Scroll Trigger */}
                    {hasMore && (
                        <div ref={ref} className="flex justify-center py-6">
                            <div className="flex items-center gap-2 text-muted-foreground/50">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-xs">{pt ? 'Carregando mais...' : 'Loading more...'}</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
