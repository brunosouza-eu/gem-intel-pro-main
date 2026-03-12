/**
 * 🎮 GAMIFICATION CONTEXT
 * Global provider for gamification state
 */

import { supabase } from '@/integrations/supabase/client';
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    UserProfile,
    UserBadge,
    BADGES,
    LEVELS,
    getOrCreateProfile,
    recordDailyLogin,
    recordAnalysisView,
    recordGuruUse,
    getUserBadges,
    getUserRank,
    getXPProgress,
    getLevelInfo,
    getBadgeInfo,
} from '@/lib/gamificationService';

// ===== TYPES =====

interface XPNotification {
    id: string;
    amount: number;
    action: string;
    timestamp: number;
}

interface BadgeNotification {
    id: string;
    badge: typeof BADGES[0];
    timestamp: number;
}

interface GamificationState {
    // User data
    profile: UserProfile | null;
    badges: UserBadge[];
    rank: number;

    // Computed
    levelInfo: typeof LEVELS[0];
    xpProgress: { current: number; required: number; percentage: number };

    // Loading states
    isLoading: boolean;

    // Notifications
    xpNotifications: XPNotification[];
    badgeNotifications: BadgeNotification[];

    // Actions
    trackAnalysisView: (ticker: string) => Promise<void>;
    trackGuruUse: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    dismissXPNotification: (id: string) => void;
    dismissBadgeNotification: (id: string) => void;
}

const defaultState: GamificationState = {
    profile: null,
    badges: [],
    rank: 0,
    levelInfo: LEVELS[0],
    xpProgress: { current: 0, required: 100, percentage: 0 },
    isLoading: true,
    xpNotifications: [],
    badgeNotifications: [],
    trackAnalysisView: async () => { },
    trackGuruUse: async () => { },
    refreshProfile: async () => { },
    dismissXPNotification: () => { },
    dismissBadgeNotification: () => { },
};

const GamificationContext = createContext<GamificationState>(defaultState);

export const useGamification = () => useContext(GamificationContext);

// ===== PROVIDER =====

interface GamificationProviderProps {
    children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [badges, setBadges] = useState<UserBadge[]>([]);
    const [rank, setRank] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [xpNotifications, setXPNotifications] = useState<XPNotification[]>([]);
    const [badgeNotifications, setBadgeNotifications] = useState<BadgeNotification[]>([]);

    // Computed values
    const levelInfo = profile ? getLevelInfo(profile.level) : LEVELS[0];
    const xpProgress = profile ? getXPProgress(profile.xp) : { current: 0, required: 100, percentage: 0 };

    // Show XP notification
    const showXPNotification = useCallback((amount: number, action: string) => {
        const notification: XPNotification = {
            id: Math.random().toString(36).substring(2),
            amount,
            action,
            timestamp: Date.now(),
        };
        setXPNotifications(prev => [...prev, notification]);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setXPNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 3000);
    }, []);

    // Show badge notification
    const showBadgeNotification = useCallback((badgeId: string) => {
        const badge = getBadgeInfo(badgeId);
        if (!badge) return;

        const notification: BadgeNotification = {
            id: Math.random().toString(36).substring(2),
            badge,
            timestamp: Date.now(),
        };
        setBadgeNotifications(prev => [...prev, notification]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setBadgeNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
    }, []);

    // Dismiss notifications
    const dismissXPNotification = useCallback((id: string) => {
        setXPNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const dismissBadgeNotification = useCallback((id: string) => {
        setBadgeNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Refresh profile data
    const refreshProfile = useCallback(async () => {
        try {
            const newProfile = await getOrCreateProfile();
            if (newProfile) {
                setProfile(newProfile);

                const newBadges = await getUserBadges();
                setBadges(newBadges);

                const newRank = await getUserRank();
                setRank(newRank);
            }
        } catch (error) {
            console.error('Error refreshing profile:', error);
        }
    }, []);

    // Track analysis view
    const trackAnalysisView = useCallback(async (ticker: string) => {
        const previousViews = profile?.total_analyses_viewed || 0;

        await recordAnalysisView(ticker);
        // Track for daily mission
        try {
            const { trackMissionAction } = await import('@/lib/missionTracker');
            trackMissionAction('view_analysis');
        } catch {}
        await refreshProfile();

        // Show XP notification
        showXPNotification(5, `Análise de ${ticker}`);

        // Check for new badges
        if (previousViews === 0) {
            showBadgeNotification('first_blood');
        }
        if (previousViews === 49) {
            showBadgeNotification('whale_watcher');
        }
    }, [profile, refreshProfile, showXPNotification, showBadgeNotification]);

    // Track Guru use
    const trackGuruUse = useCallback(async () => {
        const previousUses = profile?.total_guru_uses || 0;

        await recordGuruUse();
        // Track for daily mission
        try {
            const { trackMissionAction } = await import('@/lib/missionTracker');
            trackMissionAction('use_guru');
        } catch {}
        await refreshProfile();

        // Show XP notification
        showXPNotification(10, 'Crypto Guru');

        // Check for badge
        if (previousUses === 19) {
            showBadgeNotification('guru_fan');
        }
    }, [profile, refreshProfile, showXPNotification, showBadgeNotification]);

    // Initialize on mount
    useEffect(() => {
        const init = async () => {
            setIsLoading(true);

            // Safety timeout — don't block the UI forever if Supabase hangs
            const timeoutId = setTimeout(() => {
                setIsLoading(false);
            }, 10000);

            try {
                // Get or create profile
                const newProfile = await getOrCreateProfile();
                if (newProfile) {
                    setProfile(newProfile);

                    // Record daily login
                    const loginResult = await recordDailyLogin();
                    if (loginResult && loginResult.xpEarned > 0) {
                        showXPNotification(loginResult.xpEarned, 'Login diário');

                        // Show badge notifications
                        for (const badgeId of loginResult.newBadges) {
                            showBadgeNotification(badgeId);
                        }
                    }

                    // Refresh all data
                    await refreshProfile();
                }
            } catch (error) {
                console.error('Error initializing gamification:', error);
            } finally {
                clearTimeout(timeoutId);
                setIsLoading(false);
            }
        };

        if (user) {
            init();
        } else {
            setProfile(null);
            setBadges([]);
            setRank(0);
            setIsLoading(false);
        }
    }, [user?.id, refreshProfile, showXPNotification, showBadgeNotification]);

    // Add realtime subscription for profile updates (so credits sync instantly across components)
    useEffect(() => {
        if (!profile?.id) return;

        const channel = supabase
            .channel('gamification-profile-updates')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${profile.id}`
                },
                (payload) => {
                    if (payload.new) {
                        setProfile(prev => prev ? { ...prev, ...payload.new } : null);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [profile?.id]);

    const value: GamificationState = {
        profile,
        badges,
        rank,
        levelInfo,
        xpProgress,
        isLoading,
        xpNotifications,
        badgeNotifications,
        trackAnalysisView,
        trackGuruUse,
        refreshProfile,
        dismissXPNotification,
        dismissBadgeNotification,
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};

export default GamificationProvider;
