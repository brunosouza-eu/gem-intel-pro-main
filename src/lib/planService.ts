/**
 * 💎 PLAN SERVICE
 * Manages user plans, VIP status, and feature access
 * SIMPLIFIED VERSION - Just check credits, don't spend automatically
 */

import { supabase } from '@/integrations/supabase/client';

// ===== PLAN DEFINITIONS =====

export type PlanType = 'starter' | 'vip';

export interface PlanFeatures {
    name: string;
    price: number;
    creditsPerDay: number;
    canExportPdf: boolean;
    canUseTradeMaster: boolean;
}

export const PLANS: Record<PlanType, PlanFeatures> = {
    starter: {
        name: 'Starter',
        price: 0,
        creditsPerDay: 5,
        canExportPdf: false,
        canUseTradeMaster: false,
    },
    vip: {
        name: 'VIP',
        price: 97,
        creditsPerDay: 9999,
        canExportPdf: true,
        canUseTradeMaster: true,
    },
};

// ===== FEATURE COSTS =====

export const FEATURE_COSTS = {
    view_analysis: 1,
    use_guru: 3,
    create_alert: 2,
    premium_indicator: 1,
    export_pdf: 3,
};

// ===== HELPER =====

function getSessionId(): string {
    let sessionId = localStorage.getItem('gem_session_id');
    if (!sessionId) {
        sessionId = 'anon_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('gem_session_id', sessionId);
    }
    return sessionId;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ===== MAIN FUNCTIONS =====

/**
 * Get user's current plan
 */
export async function getUserPlan(): Promise<{ planType: PlanType; features: PlanFeatures; isVip: boolean }> {
    const sessionId = getSessionId();

    const { data } = await db
        .from('user_profiles')
        .select('plan_type, vip_expires_at')
        .eq('username', sessionId)
        .maybeSingle();

    let planType: PlanType = 'starter';

    if (data?.plan_type === 'vip') {
        if (data.vip_expires_at) {
            const expiresAt = new Date(data.vip_expires_at);
            if (expiresAt > new Date()) {
                planType = 'vip';
            }
        } else {
            planType = 'vip';
        }
    }

    return {
        planType,
        features: PLANS[planType],
        isVip: planType === 'vip',
    };
}

/**
 * Get credits balance from local profile
 */
export async function getCreditsBalance(): Promise<number> {
    const sessionId = getSessionId();

    const { data } = await db
        .from('user_profiles')
        .select('credits')
        .eq('username', sessionId)
        .maybeSingle();

    return data?.credits || 0;
}

/**
 * Check if user can use a feature (just check, don't spend)
 */
export async function canUseFeature(feature: keyof typeof FEATURE_COSTS): Promise<{
    allowed: boolean;
    reason?: string;
    creditsNeeded?: number;
    creditsAvailable?: number;
}> {
    const { planType, features } = await getUserPlan();

    // VIP always allowed
    if (planType === 'vip') {
        return { allowed: true };
    }

    // Check feature-specific limits
    if (feature === 'export_pdf' && !features.canExportPdf) {
        return { allowed: false, reason: 'vip_only' };
    }

    // Get current credits
    const credits = await getCreditsBalance();
    const cost = FEATURE_COSTS[feature];

    if (credits < cost) {
        return {
            allowed: false,
            reason: 'insufficient_credits',
            creditsNeeded: cost,
            creditsAvailable: credits,
        };
    }

    return { allowed: true };
}

/**
 * Spend credits for a feature
 */
export async function spendCredits(feature: keyof typeof FEATURE_COSTS): Promise<{
    success: boolean;
    newBalance?: number;
    error?: string;
}> {
    const { planType } = await getUserPlan();

    // VIP doesn't spend credits
    if (planType === 'vip') {
        return { success: true };
    }

    const sessionId = getSessionId();
    const cost = FEATURE_COSTS[feature];

    // Get current credits
    const { data: profile } = await db
        .from('user_profiles')
        .select('id, credits, daily_credits_used')
        .eq('username', sessionId)
        .maybeSingle();

    if (!profile) {
        return { success: false, error: 'profile_not_found' };
    }

    if (profile.credits < cost) {
        return { success: false, error: 'insufficient_credits' };
    }

    const newBalance = profile.credits - cost;
    const newDailyUsed = (profile.daily_credits_used || 0) + cost;

    // Update credits
    const { error } = await db
        .from('user_profiles')
        .update({
            credits: newBalance,
            daily_credits_used: newDailyUsed,
            updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

    if (error) {
        console.error('Error spending credits:', error);
        return { success: false, error: 'update_failed' };
    }

    // Log transaction (optional, ignore errors)
    try {
        await db.from('credit_transactions').insert({
            amount: -cost,
            type: 'spend',
            source: feature,
            balance_after: newBalance,
        });
    } catch (e) {
        // Ignore transaction log errors
    }

    return { success: true, newBalance };
}

/**
 * Get time until credits reset
 */
export function getTimeUntilReset(): { hours: number; minutes: number; formatted: string } {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return {
        hours,
        minutes,
        formatted: `${hours}h ${minutes}min`,
    };
}
