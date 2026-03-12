/**
 * 🌐 COMMUNITY SERVICE
 * Service layer for community features — with link blocking and ban checks
 */

import { supabase } from '@/integrations/supabase/client';
import type {
    Post,
    PostComment,
    CreatePostParams,
    CreateCommentParams,
    FeedFilter,
    UpdateProfileParams,
    TrendingTopic,
    TopTrader
} from '@/types/community';

// ===== CONTENT MODERATION =====

const LINK_PATTERNS = [
    /https?:\/\//i,
    /www\./i,
    /\.[a-z]{2,6}(\/|$)/i,  // .com, .io, .xyz, etc.
    /t\.me\//i,
    /discord\.(gg|com)/i,
    /telegram\./i,
    /bit\.ly/i,
    /tinyurl/i,
];

export function containsLink(text: string): boolean {
    // Allow $TOKEN mentions (e.g. $BTC, $ETH)
    const cleaned = text.replace(/\$[A-Z]{2,10}/g, '');
    return LINK_PATTERNS.some(pattern => pattern.test(cleaned));
}

export function sanitizeText(text: string): string {
    // Strip anything that looks like a URL
    return text
        .replace(/https?:\/\/[^\s]+/gi, '[link removido]')
        .replace(/www\.[^\s]+/gi, '[link removido]')
        .trim();
}

async function checkBanned(): Promise<{ banned: boolean; reason?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { banned: false };

        // @ts-ignore
        const { data } = await supabase
            .from('profiles')
            .select('is_banned, banned_reason')
            .eq('id', user.id)
            .maybeSingle();

        if (data?.is_banned) {
            return { banned: true, reason: data.banned_reason || 'Conta suspensa pela moderação.' };
        }
        return { banned: false };
    } catch {
        return { banned: false };
    }
}

// ===== POSTS =====

export async function createPost(params: CreatePostParams): Promise<{ success: boolean; post?: Post; error?: string }> {
    try {
        // Check ban
        const ban = await checkBanned();
        if (ban.banned) return { success: false, error: ban.reason || 'Conta suspensa.' };

        // Check for links
        if (containsLink(params.content)) {
            return { success: false, error: 'Links não são permitidos na comunidade. Remova URLs do seu post.' };
        }

        const { data, error } = await supabase.rpc('create_post', {
            p_content: params.content,
            p_post_type: params.post_type,
            p_token_id: params.token_id || null,
            p_analysis_id: params.analysis_id || null,
        });

        if (error) throw error;

        return { success: data.success, post: data.post };
    } catch (error: any) {
        console.error('Error creating post:', error);
        return { success: false, error: error.message };
    }
}

export async function getFeed(
    page: number = 0,
    limit: number = 20,
    filter: FeedFilter = 'recent'
): Promise<Post[]> {
    try {
        const rpcFilter = filter === 'hot' ? 'trending' : filter;
        const { data, error } = await supabase.rpc('get_feed', {
            p_page: page,
            p_limit: limit,
            p_filter: rpcFilter,
        });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching feed:', error);
        return [];
    }
}

export async function getUserPosts(userId: string, page: number = 0, limit: number = 20): Promise<Post[]> {
    try {
        const { data, error } = await supabase.rpc('get_user_posts', {
            p_user_id: userId,
            p_page: page,
            p_limit: limit,
        });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return [];
    }
}

export async function togglePostLike(postId: string): Promise<{ success: boolean; liked?: boolean; likes_count?: number }> {
    try {
        const { data, error } = await supabase.rpc('toggle_post_like', {
            p_post_id: postId,
        });

        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error('Error toggling post like:', error);
        return { success: false };
    }
}

export async function deletePost(postId: string): Promise<boolean> {
    try {
        // @ts-ignore
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        return false;
    }
}

export async function updatePost(postId: string, newContent: string): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        // Check if admin
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .maybeSingle();
        const isAdmin = !!roleData;

        let query = supabase.from('posts').update({ content: newContent }).eq('id', postId);

        if (!isAdmin) {
            query = query.eq('user_id', user.id);
        }

        const { error } = await query;

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating post:', error);
        return false;
    }
}

// ===== COMMENTS =====

export async function addComment(params: CreateCommentParams): Promise<{ success: boolean; comment?: PostComment; error?: string }> {
    try {
        // Check ban
        const ban = await checkBanned();
        if (ban.banned) return { success: false, error: ban.reason || 'Conta suspensa.' };

        // Check for links
        if (containsLink(params.content)) {
            return { success: false, error: 'Links não são permitidos nos comentários.' };
        }

        const { data, error } = await supabase.rpc('add_comment', {
            p_post_id: params.post_id,
            p_content: params.content,
            p_parent_comment_id: params.parent_comment_id || null,
        });
        if (error) throw error;
        return { success: true, comment: data };
    } catch (error: any) {
        console.error('Error adding comment:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteComment(commentId: string): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        // @ts-ignore
        const { error } = await supabase
            .from('post_comments')
            .delete()
            .match({ id: commentId, user_id: user.id });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting comment:', error);
        return false;
    }
}

export async function getPostComments(postId: string): Promise<PostComment[]> {
    try {
        // @ts-ignore
        const { data, error } = await supabase
            .from('post_comments')
            .select(`
        *,
        profiles:user_id (
          username,
          avatar_url,
          level
        )
      `)
            .eq('post_id', postId)
            .is('parent_comment_id', null)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map(comment => ({
            ...comment,
            username: comment.profiles?.username,
            avatar_url: comment.profiles?.avatar_url,
            level: comment.profiles?.level,
        }));
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}

export async function toggleCommentLike(commentId: string): Promise<{ success: boolean; liked?: boolean; likes_count?: number }> {
    try {
        const { data, error } = await supabase.rpc('toggle_comment_like', {
            p_comment_id: commentId,
        });

        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error('Error toggling comment like:', error);
        return { success: false };
    }
}

// ===== FOLLOWS =====

export async function toggleFollow(userId: string): Promise<{ success: boolean; following?: boolean; followers_count?: number }> {
    try {
        // @ts-ignore
        const { data, error } = await supabase.rpc('toggle_follow', {
            p_user_id: userId,
        });

        if (error) throw error;
        return data;
    } catch (error: any) {
        console.error('Error toggling follow:', error);
        return { success: false };
    }
}

export async function getFollowers(userId: string): Promise<any[]> {
    try {
        // @ts-ignore
        const { data, error } = await supabase
            .from('user_follows')
            .select(`
        follower_id,
        profiles:follower_id (
          id,
          username,
          avatar_url,
          level,
          followers_count
        )
      `)
            .eq('following_id', userId);

        if (error) throw error;
        return (data || []).map(f => f.profiles);
    } catch (error) {
        console.error('Error fetching followers:', error);
        return [];
    }
}

export async function getFollowing(userId: string): Promise<any[]> {
    try {
        // @ts-ignore
        const { data, error } = await supabase
            .from('user_follows')
            .select(`
        following_id,
        profiles:following_id (
          id,
          username,
          avatar_url,
          level,
          followers_count
        )
      `)
            .eq('follower_id', userId);

        if (error) throw error;
        return (data || []).map(f => f.profiles);
    } catch (error) {
        console.error('Error fetching following:', error);
        return [];
    }
}

export async function isFollowing(userId: string): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        // @ts-ignore
        const { data, error } = await supabase
            .from('user_follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', userId)
            .maybeSingle();

        if (error) throw error;
        return !!data;
    } catch (error) {
        console.error('Error checking follow status:', error);
        return false;
    }
}

// ===== PROFILE =====

export async function updateProfile(params: UpdateProfileParams): Promise<{ success: boolean; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Não autenticado.' };

        // Validate no links in bio/location
        if (params.bio && containsLink(params.bio)) {
            return { success: false, error: 'Links não são permitidos na bio.' };
        }
        if (params.location && containsLink(params.location)) {
            return { success: false, error: 'Links não são permitidos na localização.' };
        }

        const updateData: Record<string, any> = {};
        if (params.username !== undefined) updateData.username = params.username;
        if (params.bio !== undefined) updateData.bio = params.bio;
        if (params.location !== undefined) updateData.location = params.location;
        if (params.avatar_url !== undefined) updateData.avatar_url = params.avatar_url;
        updateData.updated_at = new Date().toISOString();

        // @ts-ignore
        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id);

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message || 'Erro ao salvar perfil.' };
    }
}

// ===== DISCOVERY =====

export async function getTrendingTopics(): Promise<TrendingTopic[]> {
    try {
        // @ts-ignore
        const { data, error } = await supabase
            .from('posts')
            .select('content, token_id')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;

        const mentions: Record<string, number> = {};
        (data || []).forEach(post => {
            const tokens = post.content.match(/\$([A-Z]{2,10})/g);
            if (tokens) {
                tokens.forEach(t => {
                    const token = t.replace('$', '');
                    mentions[token] = (mentions[token] || 0) + 1;
                });
            }
            if (post.token_id) {
                mentions[post.token_id] = (mentions[post.token_id] || 0) + 1;
            }
        });

        return Object.entries(mentions)
            .map(([token, count]) => ({ token, mentions: count }))
            .sort((a, b) => b.mentions - a.mentions)
            .slice(0, 10);
    } catch (error) {
        console.error('Error fetching trending topics:', error);
        return [];
    }
}

export async function getTopTraders(limit: number = 10): Promise<TopTrader[]> {
    try {
        // @ts-ignore
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, level, xp, posts_count, followers_count')
            .order('xp', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return (data || []).map(p => ({
            user_id: p.id || '',
            username: p.username || 'Anonymous',
            avatar_url: p.avatar_url,
            level: p.level || 1,
            xp: p.xp || 0,
            posts_count: p.posts_count || 0,
            followers_count: p.followers_count || 0,
        }));
    } catch (error) {
        console.error('Error fetching top traders:', error);
        return [];
    }
}

export async function getSuggestedFollows(limit: number = 5): Promise<TopTrader[]> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        // @ts-ignore
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, level, xp, posts_count, followers_count')
            .neq('id', user.id)
            .order('followers_count', { ascending: false })
            .limit(limit + 10);

        if (error) throw error;

        // @ts-ignore
        const { data: following } = await supabase
            .from('user_follows')
            .select('following_id')
            .eq('follower_id', user.id);

        const followingSet = new Set((following || []).map(f => f.following_id));

        return (data || [])
            .filter(p => p.id && !followingSet.has(p.id))
            .slice(0, limit)
            .map(p => ({
                user_id: p.id || '',
                username: p.username || 'Anonymous',
                avatar_url: p.avatar_url,
                level: p.level || 1,
                xp: p.xp || 0,
                posts_count: p.posts_count || 0,
                followers_count: p.followers_count || 0,
            }));
    } catch (error) {
        console.error('Error fetching suggested follows:', error);
        return [];
    }
}

// ===== ADMIN MODERATION =====

export async function adminDeletePost(postId: string): Promise<boolean> {
    try {
        // @ts-ignore
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error admin deleting post:', error);
        return false;
    }
}

export async function adminDeleteComment(commentId: string): Promise<boolean> {
    try {
        // @ts-ignore
        const { error } = await supabase
            .from('post_comments')
            .delete()
            .eq('id', commentId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error admin deleting comment:', error);
        return false;
    }
}

export async function adminBanUser(userId: string, reason: string): Promise<boolean> {
    try {
        // @ts-ignore
        const { error } = await supabase
            .from('profiles')
            .update({
                is_banned: true,
                banned_at: new Date().toISOString(),
                banned_reason: reason,
            })
            .eq('id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error banning user:', error);
        return false;
    }
}

export async function adminUnbanUser(userId: string): Promise<boolean> {
    try {
        // @ts-ignore
        const { error } = await supabase
            .from('profiles')
            .update({
                is_banned: false,
                banned_at: null,
                banned_reason: null,
            })
            .eq('id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error unbanning user:', error);
        return false;
    }
}

export async function adminGetAllPosts(page: number = 0, limit: number = 20): Promise<Post[]> {
    try {
        // @ts-ignore
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles:user_id (
                    username,
                    avatar_url,
                    level,
                    is_banned
                )
            `)
            .order('created_at', { ascending: false })
            .range(page * limit, (page + 1) * limit - 1);

        if (error) throw error;

        return (data || []).map(post => ({
            ...post,
            username: post.profiles?.username,
            avatar_url: post.profiles?.avatar_url,
            level: post.profiles?.level,
            is_banned: post.profiles?.is_banned,
        }));
    } catch (error) {
        console.error('Error fetching all posts:', error);
        return [];
    }
}

export async function adminGetBannedUsers(): Promise<any[]> {
    try {
        // @ts-ignore
        const { data, error } = await supabase
            .from('profiles')
            .select('id, email, username, avatar_url, level, is_banned, banned_at, banned_reason')
            .eq('is_banned', true)
            .order('banned_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching banned users:', error);
        return [];
    }
}

export async function adminGetCommunityStats(): Promise<{
    totalPosts: number;
    totalComments: number;
    bannedUsers: number;
    postsToday: number;
}> {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // @ts-ignore
        const [posts, comments, banned, todayPosts] = await Promise.all([
            supabase.from('posts').select('*', { count: 'exact', head: true }),
            supabase.from('post_comments').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_banned', true),
            supabase.from('posts').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
        ]);

        return {
            totalPosts: posts.count || 0,
            totalComments: comments.count || 0,
            bannedUsers: banned.count || 0,
            postsToday: todayPosts.count || 0,
        };
    } catch (error) {
        console.error('Error fetching community stats:', error);
        return { totalPosts: 0, totalComments: 0, bannedUsers: 0, postsToday: 0 };
    }
}
