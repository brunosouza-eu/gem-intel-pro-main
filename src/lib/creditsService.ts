/**
 * 💰 CREDITS SERVICE
 * Complete credits system with earning, spending, and transaction history
 * Refactored to use secure RPCs
 */

import { supabase } from '@/integrations/supabase/client';

// ===== CONSTANTS =====

// Credit rewards for actions
export const CREDIT_REWARDS = {
    daily_login: 2,
    streak_7_bonus: 3,
    streak_30_bonus: 5,
    level_up: 5,
    badge_unlock: 2,
    first_analysis: 3,
    referral: 5,
};

// Credit costs for premium features
export const CREDIT_COSTS = {
    detailed_analysis: 1,
    ai_chat_message: 1,
    trade_master_analysis: 1,
    guru_analysis: 3,
    premium_alert: 2,
};

// Daily free credits by plan
export const DAILY_CREDITS = {
    free: 5,
    pro: 20,
    elite: 9999,  // Ilimitado
};

// ===== TYPES =====

export interface CreditTransaction {
    id: string;
    user_id: string;
    amount: number;
    type: 'earn' | 'spend';
    source: string;
    description: string | null;
    balance_after: number;
    metadata: Record<string, unknown>;
    created_at: string;
}

// ===== MAIN SERVICE FUNCTIONS =====

/**
 * Get user's current credit balance
 */
export async function getCreditsBalance(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return 0;

    const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .maybeSingle();

    if (error) {
        // Ignore AbortError which happens on rapid navigation/strict mode
        if (error.message?.includes('AbortError') || error.message?.includes('aborted')) {
            return 0;
        }
        console.error('Error fetching credits:', error);
        return 0;
    }

    return data?.credits || 0;
}

/**
 * Spend credits using secure RPC
 */
export async function spendCredits(
    amount: number,
    source: string,
    description?: string,
    metadata?: Record<string, unknown>
): Promise<{ success: boolean; newBalance: number; error?: string }> {
    try {
        const { data, error } = await supabase.rpc('deduct_credits', {
            p_amount: amount,
            p_description: description || `Spent on ${source}`
        });

        if (error) {
            console.error('RPC deduct_credits error:', error);
            // Fallback for "Insufficient credits" error from RPC
            if (error.message?.includes('Insufficient')) {
                return { success: false, newBalance: 0, error: 'Saldo insuficiente' };
            }
            throw error;
        }

        const result = data as any;

        if (!result.success) {
            return {
                success: false,
                newBalance: result.current || 0,
                error: result.error || 'Erro ao processar'
            };
        }

        return { success: true, newBalance: result.new_balance };

    } catch (err: any) {
        console.error('Unexpected error spending credits:', err);
        return { success: false, newBalance: 0, error: err.message || 'Erro no sistema' };
    }
}

/**
 * Check if user has enough credits
 */
export async function hasCredits(amount: number): Promise<boolean> {
    const balance = await getCreditsBalance();
    return balance >= amount;
}

/**
 * Get recent credit transactions
 */
export async function getTransactionHistory(limit = 20): Promise<CreditTransaction[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching history:', error);
        return [];
    }

    return (data || []) as CreditTransaction[];
}

/**
 * Claim daily login bonus using secure RPC
 */
export async function claimDailyLogin(): Promise<{ success: boolean; amount: number; error?: string }> {
    try {
        const { data, error } = await supabase.rpc('claim_daily_login');

        if (error) throw error;

        const result = data as any;

        if (!result.success) {
            // Already claimed is common, not really an error-error
            return { success: false, amount: 0, error: result.error };
        }

        return { success: true, amount: result.amount };

    } catch (err: any) {
        console.error('Error claiming daily login:', err);
        return { success: false, amount: 0, error: err.message };
    }
}

// Legacy wrappers for compatibility (if needed) but using new logic
export async function addCredits(amount: number, source: string, description?: string): Promise<{ success: boolean; newBalance: number }> {
    // NOTE: Adding credits securely should generally be done by admin RPC or system events (like Stripe webhooks).
    // For now, if we need client-side "add" for gamification (e.g. badge unlock), we can keep the old logic OR 
    // create a secure 'award_credits' RPC that verifies logic on server.
    // For this phase, we will assume 'addCredits' is only used for system rewards and keep it simple or migrate later.
    // Leaving standard update for now as we focused on spending security first.

    // WARN: This is less secure than RPC but acceptable for gamification rewards until we move that logic to backend
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, newBalance: 0 };

    const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single();
    const current = profile?.credits || 0;
    const newBalance = current + amount;

    await supabase.from('profiles').update({ credits: newBalance }).eq('id', user.id);

    await supabase.from('credit_transactions').insert({
        user_id: user.id,
        amount: amount,
        type: 'earn',
        source: source,
        description: description,
        balance_after: newBalance
    });

    return { success: true, newBalance };
}
