/**
 * 🔥 Streak Indicator Component
 * Shows current login streak with fire animation
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/contexts/GamificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Flame } from 'lucide-react';

interface StreakIndicatorProps {
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const StreakIndicator: React.FC<StreakIndicatorProps> = ({
    showLabel = true,
    size = 'md',
    className,
}) => {
    const { language } = useLanguage();
    const { profile } = useGamification();

    const streak = profile?.streak_days || 0;

    const sizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    // Color based on streak length
    const getStreakColor = () => {
        if (streak >= 30) return 'text-amber-400';
        if (streak >= 7) return 'text-orange-500';
        if (streak >= 3) return 'text-orange-400';
        return 'text-muted-foreground';
    };

    return (
        <div className={cn(
            'flex items-center gap-1',
            sizes[size],
            className
        )}>
            <Flame className={cn(
                iconSizes[size],
                getStreakColor(),
                streak >= 7 && 'animate-pulse'
            )} />
            <span className={cn('font-bold', getStreakColor())}>
                {streak}
            </span>
            {showLabel && (
                <span className="text-muted-foreground hidden sm:inline">
                    {language === 'pt' ? 'dias' : 'days'}
                </span>
            )}
        </div>
    );
};

export default StreakIndicator;
