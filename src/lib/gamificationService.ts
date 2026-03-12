/**
 * 🎮 GAMIFICATION SERVICE
 * Complete gamification system with XP, levels, badges, and streak
 * Refactored to use 'profiles' table directly + 'deduct_credits' RPC
 */

import { supabase } from '@/integrations/supabase/client';
import { spendCredits as secureSpendCredits } from './creditsService';

// ===== CONSTANTS =====

export const LEVELS = [
    { level: 1, name: 'Novato', nameEn: 'Newbie', xpRequired: 0, icon: '🌱' },
    { level: 2, name: 'Aprendiz', nameEn: 'Apprentice', xpRequired: 100, icon: '📚' },
    { level: 3, name: 'Trader', nameEn: 'Trader', xpRequired: 500, icon: '📊' },
    { level: 4, name: 'Expert', nameEn: 'Expert', xpRequired: 1500, icon: '⭐' },
    { level: 5, name: 'Master', nameEn: 'Master', xpRequired: 5000, icon: '🏆' },
    { level: 6, name: 'Legend', nameEn: 'Legend', xpRequired: 10000, icon: '👑' },
];

export const BADGES = [
    { id: 'first_blood', name: 'First Blood', namePt: 'Primeira Análise', description: 'View your first analysis', descriptionPt: 'Visualize sua primeira análise', icon: '🎯', xpReward: 25 },
    { id: 'bull_run', name: 'Bull Run', namePt: 'Corrida de Alta', description: 'View 10 bullish tokens', descriptionPt: 'Veja 10 tokens bullish', icon: '📈', xpReward: 50 },
    { id: 'streak_7', name: 'On Fire', namePt: 'Em Chamas', description: '7-day login streak', descriptionPt: 'Streak de 7 dias', icon: '🔥', xpReward: 100 },
    { id: 'streak_30', name: 'Diamond Hands', namePt: 'Mãos de Diamante', description: '30-day login streak', descriptionPt: 'Streak de 30 dias', icon: '💎', xpReward: 500 },
    { id: 'whale_watcher', name: 'Whale Watcher', namePt: 'Caçador de Baleias', description: 'View 50 analyses', descriptionPt: 'Veja 50 análises', icon: '🦈', xpReward: 100 },
    { id: 'guru_fan', name: 'Guru Fan', namePt: 'Fã do Guru', description: 'Use Crypto Guru 20 times', descriptionPt: 'Use o Crypto Guru 20 vezes', icon: '🤖', xpReward: 75 },
    { id: 'top_10', name: 'Top 10', namePt: 'Top 10', description: 'Reach top 10 in leaderboard', descriptionPt: 'Entre no top 10 do ranking', icon: '🏆', xpReward: 200 },
    { id: 'champion', name: 'Champion', namePt: 'Campeão', description: 'Reach #1 in leaderboard', descriptionPt: 'Fique em #1 no ranking', icon: '👑', xpReward: 500 },
    { id: 'early_adopter', name: 'Early Adopter', namePt: 'Pioneiro', description: 'Joined during beta', descriptionPt: 'Entrou durante o beta', icon: '🚀', xpReward: 100 },
    { id: 'night_owl', name: 'Night Owl', namePt: 'Coruja Noturna', description: 'Trade analysis after midnight', descriptionPt: 'Análise após meia-noite', icon: '🦉', xpReward: 25 },
];

export const XP_REWARDS = {
    daily_login: 10,
    view_analysis: 5,
    use_guru: 10,
    view_radar: 2,
    streak_7_bonus: 50,
    streak_30_bonus: 200,
    unlock_badge: 25,
    unlock_badge_bonus: 25
};

export const DAILY_LIMITS = {
    view_analysis: 20,
    use_guru: 10,
    view_radar: 50,
};

// ===== TYPES =====

export interface UserProfile {
    id: string;
    user_id: string | null;
    username: string | null;
    avatar_url: string | null;
    xp: number;
    level: number;
    credits: number;
    plan_type: 'starter' | 'vip' | 'pro';
    vip_expires_at: string | null;
    streak_days: number;
    longest_streak: number;
    last_login_date: string | null;
    total_analyses_viewed: number;
    total_guru_uses: number;
    created_at: string;
    updated_at: string;
    // Community fields
    bio?: string;
    location?: string;
    website?: string;
    followers_count: number;
    following_count: number;
    posts_count: number;
    is_banned?: boolean;
    banned_reason?: string;
}

export interface UserBadge {
    id: string;
    user_id: string;
    badge_id: string;
    unlocked_at: string;
}

// ===== HELPER FUNCTIONS =====

export function calculateLevel(xp: number): number {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].xpRequired) return LEVELS[i].level;
    }
    return 1;
}

export function getLevelInfo(level: number) {
    return LEVELS.find(l => l.level === level) || LEVELS[0];
}

export function getXPProgress(xp: number): { current: number; required: number; percentage: number } {
    const currentLevel = calculateLevel(xp);
    const currentLevelInfo = getLevelInfo(currentLevel);
    const nextLevelInfo = getLevelInfo(currentLevel + 1);

    if (!nextLevelInfo || currentLevel >= LEVELS.length) {
        return { current: xp, required: xp, percentage: 100 };
    }

    const xpInCurrentLevel = xp - currentLevelInfo.xpRequired;
    const xpNeededForNextLevel = nextLevelInfo.xpRequired - currentLevelInfo.xpRequired;
    const percentage = Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);

    return { current: xpInCurrentLevel, required: xpNeededForNextLevel, percentage };
}

export function getBadgeInfo(badgeId: string) {
    return BADGES.find(b => b.id === badgeId);
}

function getSessionId(): string {
    let sessionId = localStorage.getItem('gem_session_id');
    if (!sessionId) {
        sessionId = 'anon_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('gem_session_id', sessionId);
    }
    return sessionId;
}

// Helper to map DB profile to UserProfile interface
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProfile(data: any): UserProfile {
    return {
        id: data.id,
        user_id: data.id, // same as id for auth users
        username: data.username || (data.email ? data.email.split('@')[0] : 'User'),
        avatar_url: data.avatar_url,
        xp: data.xp || 0,
        level: data.level || 1,
        credits: data.credits || 0,
        plan_type: (data.plan === 'pro' || data.plan === 'elite') ? 'vip' : 'starter',
        vip_expires_at: data.vip_expires_at,
        streak_days: data.streak_days || 0,
        longest_streak: data.longest_streak || 0,
        last_login_date: data.last_login_at ? data.last_login_at.split('T')[0] : null,
        total_analyses_viewed: data.total_analyses_viewed || 0,
        total_guru_uses: data.total_guru_uses || 0,
        created_at: data.created_at,
        updated_at: data.updated_at,
        // Community fields
        bio: data.bio || '',
        location: data.location || '',
        website: data.website || '',
        followers_count: data.followers_count || 0,
        following_count: data.following_count || 0,
        posts_count: data.posts_count || 0,
        is_banned: data.is_banned || false,
        banned_reason: data.banned_reason || '',
    };
}

// ===== MAIN SERVICE FUNCTIONS =====

export async function getOrCreateProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        if (data) {
            return mapProfile(data);
        }

        // Return null if not found (AuthContext usually handles creation)
        return null;
    }

    // Fallback for non-auth (limited support in new system)
    return null;
}

export async function addXP(actionType: string, amount?: number): Promise<{ newXP: number; leveledUp: boolean; newLevel?: number } | null> {
    const profile = await getOrCreateProfile();
    if (!profile) return null;

    const xpAmount = amount || XP_REWARDS[actionType as keyof typeof XP_REWARDS] || 0;
    if (xpAmount === 0) return null;

    // Check daily limits
    const limit = DAILY_LIMITS[actionType as keyof typeof DAILY_LIMITS];
    if (limit) {
        const today = new Date().toISOString().split('T')[0];
        // Note: user_actions might still be used for tracking history
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count } = await (supabase as any)
            .from('user_actions')
            .select('*', { count: 'exact', head: true })
            .eq('action_type', actionType)
            .gte('created_at', today);

        if ((count || 0) >= limit) return null;
    }

    const oldLevel = profile.level;
    const newXP = profile.xp + xpAmount;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > oldLevel;

    const { error } = await supabase
        .from('profiles')
        .update({
            xp: newXP,
            level: newLevel,
            updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

    if (error) {
        console.error('Error updating XP:', error);
        return null;
    }

    // Record action
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('user_actions').insert({
        user_id: profile.id, // Explicitly link to user
        action_type: actionType,
        xp_earned: xpAmount,
        metadata: { previous_xp: profile.xp, new_xp: newXP },
    });

    return { newXP, leveledUp, newLevel: leveledUp ? newLevel : undefined };
}

export async function recordDailyLogin(): Promise<{ xpEarned: number; streakDays: number; newBadges: string[] } | null> {
    const profile = await getOrCreateProfile();
    if (!profile) return null;

    const today = new Date().toISOString().split('T')[0];
    const lastLogin = profile.last_login_date;

    if (lastLogin === today) {
        return { xpEarned: 0, streakDays: profile.streak_days, newBadges: [] };
    }

    let newStreak = 1;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastLogin === yesterdayStr) {
        newStreak = profile.streak_days + 1;
    }

    const longestStreak = Math.max(profile.longest_streak, newStreak);
    let xpEarned = XP_REWARDS.daily_login;
    const newBadges: string[] = [];

    if (newStreak === 7) {
        xpEarned += XP_REWARDS.streak_7_bonus;
        newBadges.push('streak_7');
    }
    if (newStreak === 30) {
        xpEarned += XP_REWARDS.streak_30_bonus;
        newBadges.push('streak_30');
    }

    const newXP = profile.xp + xpEarned;
    const newLevel = calculateLevel(newXP);

    await supabase
        .from('profiles')
        .update({
            xp: newXP,
            level: newLevel,
            streak_days: newStreak,
            longest_streak: longestStreak,
            last_login_at: new Date().toISOString(), // Note: profiles uses last_login_at (timestamp)
            updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

    // Filter DB log
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('user_actions').insert({
        user_id: profile.id,
        action_type: 'daily_login',
        xp_earned: xpEarned,
        metadata: { streak: newStreak },
    });

    for (const badgeId of newBadges) {
        await awardBadge(badgeId);
    }

    return { xpEarned, streakDays: newStreak, newBadges };
}

export async function recordAnalysisView(ticker: string): Promise<void> {
    const profile = await getOrCreateProfile();
    if (!profile) return;

    const newCount = profile.total_analyses_viewed + 1;

    await supabase
        .from('profiles')
        .update({ total_analyses_viewed: newCount, updated_at: new Date().toISOString() })
        .eq('id', profile.id);

    await addXP('view_analysis');

    if (newCount === 1) await awardBadge('first_blood');
    if (newCount === 50) await awardBadge('whale_watcher');

    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) await awardBadge('night_owl');
}

export async function recordGuruUse(): Promise<void> {
    const profile = await getOrCreateProfile();
    if (!profile) return;

    const newCount = profile.total_guru_uses + 1;

    await supabase
        .from('profiles')
        .update({ total_guru_uses: newCount, updated_at: new Date().toISOString() })
        .eq('id', profile.id);

    await addXP('use_guru');

    if (newCount === 20) await awardBadge('guru_fan');
}

export async function awardBadge(badgeId: string): Promise<boolean> {
    const profile = await getOrCreateProfile();
    if (!profile) return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
        .from('user_badges')
        .select('id')
        .eq('user_id', profile.id)
        .eq('badge_id', badgeId)
        .maybeSingle();

    if (existing) return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('user_badges').insert({
        user_id: profile.id,
        badge_id: badgeId,
    });

    if (error) {
        console.error('Error awarding badge:', error);
        return false;
    }

    const badge = getBadgeInfo(badgeId);
    if (badge) await addXP('unlock_badge', badge.xpReward);

    return true;
}

export async function getUserBadges(): Promise<UserBadge[]> {
    const profile = await getOrCreateProfile();
    if (!profile) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
        .from('user_badges')
        .select('*')
        .eq('user_id', profile.id)
        .order('unlocked_at', { ascending: false });

    return (data || []) as UserBadge[];
}

export async function getLeaderboard(limit = 10): Promise<UserProfile[]> {
    const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(limit);

    // Map to UserProfile
    return (data || []).map(mapProfile);
}

export async function getUserRank(): Promise<number> {
    const profile = await getOrCreateProfile();
    if (!profile) return 0;

    const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('xp', profile.xp);

    return (count || 0) + 1;
}

// ===== CREDIT FUNCTIONS (Legacy Wrapper) =====

export const CREDIT_COSTS = {
    use_guru: 3,
    create_alert: 2,
    view_analysis: 1,
    export_pdf: 3,
    trade_master_analysis: 1,
} as const;

export async function canSpendCredits(cost: number): Promise<boolean> {
    const profile = await getOrCreateProfile();
    if (!profile) return false;

    // VIP has unlimited
    if (profile.plan_type === 'vip' || profile.plan_type === 'pro') return true;

    return profile.credits >= cost;
}

export async function spendCredits(action: keyof typeof CREDIT_COSTS): Promise<{
    success: boolean;
    newBalance?: number;
    error?: string;
}> {
    const cost = CREDIT_COSTS[action];
    const result = await secureSpendCredits(cost, 'gamification', `Action: ${action}`);

    if (result.success) {
        return { success: true, newBalance: result.newBalance };
    } else {
        return { success: false, error: result.error };
    }
}

export async function getCreditsBalance(): Promise<number> {
    const profile = await getOrCreateProfile();
    return profile?.credits || 0;
}

export function isVipUser(profile: UserProfile | null): boolean {
    if (!profile) return false;
    if (profile.plan_type !== 'vip' && profile.plan_type !== 'pro') return false;

    // Check expiration
    if (profile.vip_expires_at) {
        const expires = new Date(profile.vip_expires_at);
        if (expires < new Date()) return false;
    }

    return true;
}
