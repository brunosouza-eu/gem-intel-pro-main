/**
 * 🎯 Mission Action Tracker
 * Simple utility to mark daily mission actions as completed.
 * Scoped per user_id + date in localStorage.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Mark a daily mission action as done for the current user.
 * Call this from components/pages when the user performs a tracked action.
 *
 * Supported actionIds:
 * - 'daily_login'     → auto (MissionsPanel handles it)
 * - 'view_analysis'   → when user views a token analysis
 * - 'use_guru'        → when user sends a Chat/Guru message
 * - 'visit_community' → when user visits /community
 * - 'read_course'     → when user opens a lesson
 */
export async function trackMissionAction(actionId: string): Promise<void> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) return;

        const today = new Date().toISOString().split('T')[0];
        const key = `action-done-${user.id}-${today}-${actionId}`;
        localStorage.setItem(key, 'true');
    } catch {
        // Silently fail — non-critical
    }
}

/**
 * Check if an action has been done today by the current user.
 */
export function hasActionDoneToday(userId: string, actionId: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    const key = `action-done-${userId}-${today}-${actionId}`;
    return localStorage.getItem(key) === 'true';
}
