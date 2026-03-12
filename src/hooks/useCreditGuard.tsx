/**
 * 🛡️ USE CREDIT GUARD HOOK
 * Protects features that require credits
 * Uses gamificationService directly for reliability
 */

import React, { useState, useCallback } from 'react';
import { useGamification } from '@/contexts/GamificationContext';
import { useMonetization } from '@/contexts/MonetizationContext';
import { spendCredits, canSpendCredits, CREDIT_COSTS, isVipUser } from '@/lib/gamificationService';
import { UpgradeModal } from '@/components/monetization';
import { UseCreditsModal } from '@/components/gamification';

type FeatureType = keyof typeof CREDIT_COSTS;

interface CreditGuardResult {
    isChecking: boolean;
    showUpgradeModal: boolean;
    reason: string | null;
    creditsNeeded: number;
    creditsAvailable: number;
    checkAndUse: (feature: FeatureType) => Promise<boolean>;
    closeModal: () => void;
    isVip: boolean;
    timeUntilReset: string;
    guardModals: React.ReactNode;
}

export function useCreditGuard(): CreditGuardResult {
    const { profile, refreshProfile } = useGamification();
    const { refreshCredits } = useMonetization();
    const [isChecking, setIsChecking] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [reason, setReason] = useState<string | null>(null);
    const [creditsNeeded, setCreditsNeeded] = useState(0);
    const [pendingFeature, setPendingFeature] = useState<FeatureType | null>(null);
    const [resolveConfirm, setResolveConfirm] = useState<((val: boolean) => void) | null>(null);

    const creditsAvailable = profile?.credits || 0;
    const isVip = isVipUser(profile);

    const checkAndUse = useCallback(async (feature: FeatureType): Promise<boolean> => {
        console.log(`[CreditGuard] Checking ${feature}...`);
        setIsChecking(true);

        try {
            // VIP always allowed
            if (isVip) {
                console.log('[CreditGuard] VIP user - allowed');
                setIsChecking(false);
                return true;
            }

            const cost = CREDIT_COSTS[feature];
            console.log(`[CreditGuard] Cost: ${cost}, Available: ${creditsAvailable}`);

            // Check if can afford
            const canAfford = await canSpendCredits(cost);

            if (!canAfford) {
                console.log('[CreditGuard] Cannot afford - showing modal');
                setReason('insufficient_credits');
                setCreditsNeeded(cost);
                setShowUpgradeModal(true);
                setIsChecking(false);
                return false;
            }

            // Ask for user confirmation
            // We use a Promise to wait for the user to click Confirm or Cancel
            setIsChecking(false); // Stop showing loading while waiting for user input
            setPendingFeature(feature);
            const confirmed = await new Promise<boolean>((resolve) => {
                setResolveConfirm(() => resolve);
            });

            setPendingFeature(null);
            setResolveConfirm(null);

            if (!confirmed) {
                console.log('[CreditGuard] User cancelled');
                return false;
            }

            setIsChecking(true);

            // Spend credits
            const result = await spendCredits(feature);
            console.log('[CreditGuard] Spend result:', result);

            if (!result.success) {
                console.log('[CreditGuard] Spend failed:', result.error);
                setReason(result.error || 'unknown');
                setShowUpgradeModal(true);
                setIsChecking(false);
                return false;
            }

            // Refresh BOTH contexts to update UI everywhere
            await Promise.all([refreshProfile(), refreshCredits()]);
            console.log('[CreditGuard] Success! Credits spent.');

            setIsChecking(false);
            return true;
        } catch (error) {
            console.error('[CreditGuard] Error:', error);
            setIsChecking(false);
            return true; // Don't block on errors
        }
    }, [isVip, creditsAvailable, refreshProfile, refreshCredits]);

    const closeModal = useCallback(() => {
        setShowUpgradeModal(false);
        setReason(null);
    }, []);

    // Calculate time until credits reset (midnight)
    const getTimeUntilReset = useCallback(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    }, []);

    const featureLabels: Record<string, string> = {
        'use_guru': 'Crypto Guru Analysis',
        'export_data': 'Export Data',
        'create_alert': 'Premium Alert'
    };

    // Gamification Modals UI element
    const guardModals = (
        <>
            <UpgradeModal isOpen={showUpgradeModal} onClose={closeModal} />
            {pendingFeature && (
                <UseCreditsModal
                    isOpen={!!pendingFeature}
                    onClose={() => {
                        setPendingFeature(null);
                        if (resolveConfirm) resolveConfirm(false);
                    }}
                    onConfirm={() => {
                        setPendingFeature(null);
                        if (resolveConfirm) resolveConfirm(true);
                    }}
                    amount={CREDIT_COSTS[pendingFeature as keyof typeof CREDIT_COSTS] || 1}
                    feature={featureLabels[pendingFeature] || pendingFeature}
                />
            )}
        </>
    );

    return {
        isChecking,
        showUpgradeModal,
        reason,
        creditsNeeded,
        creditsAvailable,
        checkAndUse,
        closeModal,
        isVip,
        timeUntilReset: getTimeUntilReset(),
        guardModals,
    };
}

export default useCreditGuard;
