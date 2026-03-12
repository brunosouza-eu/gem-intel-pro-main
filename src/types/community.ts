/**
 * 🌐 COMMUNITY TYPES
 * TypeScript types for community features
 */

export type PostType = 'insight' | 'analysis' | 'question' | 'alert_share';

export interface Post {
    id: string;
    user_id: string;
    content: string;
    post_type: PostType;
    token_id?: string;
    analysis_id?: string;
    media_urls?: string[];
    likes_count: number;
    comments_count: number;
    created_at: string;
    updated_at: string;

    // Joined data from RPC
    username?: string;
    avatar_url?: string;
    level?: number;
    user_liked?: boolean;
}

export interface PostLike {
    id: string;
    post_id: string;
    user_id: string;
    created_at: string;
}

export interface PostComment {
    id: string;
    post_id: string;
    user_id: string;
    parent_comment_id?: string;
    content: string;
    likes_count: number;
    created_at: string;
    updated_at: string;

    // Joined data
    username?: string;
    avatar_url?: string;
    level?: number;
    user_liked?: boolean;
    replies?: PostComment[];
}

export interface CommentLike {
    id: string;
    comment_id: string;
    user_id: string;
    created_at: string;
}

export interface UserFollow {
    id: string;
    follower_id: string;
    following_id: string;
    created_at: string;
}

export interface UserProfile {
    id: string;
    user_id: string | null;
    username: string | null;
    avatar_url: string | null;
    xp: number;
    level: number;
    credits: number;
    plan_type: 'starter' | 'vip';
    vip_expires_at: string | null;
    streak_days: number;
    longest_streak: number;
    last_login_date: string | null;
    total_analyses_viewed: number;
    total_guru_uses: number;
    created_at: string;
    updated_at: string;

    // Community fields
    followers_count: number;
    following_count: number;
    posts_count: number;
    bio?: string;
    location?: string;
    website?: string;
}

export type FeedFilter = 'recent' | 'following' | 'trending' | 'hot';

export interface CreatePostParams {
    content: string;
    post_type: PostType;
    token_id?: string;
    analysis_id?: string;
}

export interface CreateCommentParams {
    post_id: string;
    content: string;
    parent_comment_id?: string;
}

// ===== NEW TYPES =====

export interface UpdateProfileParams {
    username?: string;
    bio?: string;
    location?: string;
    website?: string;
    avatar_url?: string;
}

export interface TrendingTopic {
    token: string;
    mentions: number;
    change_24h?: number;
}

export interface TopTrader {
    user_id: string;
    username: string;
    avatar_url: string | null;
    level: number;
    xp: number;
    posts_count: number;
    followers_count: number;
}
