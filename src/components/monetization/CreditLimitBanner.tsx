/**
 * 💳 CREDIT LIMIT BANNER
 * Shows remaining credits and upgrade CTA
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGamification } from '@/contexts/GamificationContext';
import { getTimeUntilReset } from '@/lib/planService';
import { Coins, Clock, Crown, AlertTriangle, Zap } from 'lucide-react';

interface CreditLimitBannerProps {
    className?: string;
    onUpgradeClick?: () => void;
}

const CreditLimitBanner: React.FC<CreditLimitBannerProps> = ({
    className,
    onUpgradeClick,
}) => {
    const { language } = useLanguage();
    const { profile } = useGamification();
    const isPt = language === 'pt';

    const credits = profile?.credits || 0;
    const isLow = credits <= 2;
    const isEmpty = credits === 0;
    const timeUntilReset = getTimeUntilReset();

    // Don't show if PRO or ELITE
    if (profile?.plan === 'pro' || profile?.plan === 'elite') {
        return null;
    }

    // Show different styles based on credit level
    if (isEmpty) {
        return (
            <div className={cn(
                'flex items-center justify-between gap-3 p-3 rounded-xl',
                'bg-gradient-to-r from-red-500/20 to-orange-500/20',
                'border border-red-500/30',
                className
            )}>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <div>
                        <p className="font-semibold text-red-400 text-sm">
                            {isPt ? 'Créditos esgotados!' : 'Credits depleted!'}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {isPt ? 'Renova em' : 'Resets in'} {timeUntilReset.formatted}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onUpgradeClick}
                    className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold',
                        'bg-gradient-to-r from-amber-500 to-yellow-500 text-black',
                        'hover:opacity-90 transition-opacity',
                        'flex items-center gap-1'
                    )}
                >
                    <Crown className="w-3 h-3" />
                    VIP
                </button>
            </div>
        );
    }

    if (isLow) {
        return (
            <div className={cn(
                'flex items-center justify-between gap-3 p-3 rounded-xl',
                'bg-gradient-to-r from-amber-500/10 to-yellow-500/10',
                'border border-amber-500/20',
                className
            )}>
                <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-400" />
                    <div>
                        <p className="font-semibold text-amber-400 text-sm">
                            {isPt ? `${credits} créditos restando` : `${credits} credits left`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {isPt ? 'Use com sabedoria!' : 'Use wisely!'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onUpgradeClick}
                    className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold',
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30',
                        'hover:bg-amber-500/30 transition-colors',
                        'flex items-center gap-1'
                    )}
                >
                    <Zap className="w-3 h-3" />
                    {isPt ? 'Upgrade' : 'Upgrade'}
                </button>
            </div>
        );
    }

    // Normal state - compact display
    return (
        <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg',
            'bg-muted/30 border border-border/50',
            className
        )}>
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">{credits}</span>
            <span className="text-xs text-muted-foreground">
                {isPt ? 'créditos' : 'credits'}
            </span>
        </div>
    );
};

export default CreditLimitBanner;
