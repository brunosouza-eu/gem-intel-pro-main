/**
 * 🎮 XP Progress Bar Component
 * Shows XP progress to next level - Mobile-first design
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/contexts/GamificationContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface XPProgressBarProps {
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({
    showLabel = true,
    size = 'md',
    className,
}) => {
    const { language } = useLanguage();
    const { profile, xpProgress, levelInfo } = useGamification();

    const heights = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    };

    const nextLevel = (profile?.level || 1) + 1;

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-muted-foreground">
                        {levelInfo.icon} Lvl {profile?.level || 1}
                    </span>
                    <span className="text-muted-foreground">
                        {xpProgress.current}/{xpProgress.required} XP
                    </span>
                </div>
            )}

            <div className={cn(
                'w-full bg-muted/50 rounded-full overflow-hidden',
                heights[size]
            )}>
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-500 ease-out',
                        'bg-gradient-to-r from-primary via-info to-accent'
                    )}
                    style={{ width: `${xpProgress.percentage}%` }}
                />
            </div>

            {showLabel && xpProgress.percentage < 100 && (
                <p className="text-[10px] text-muted-foreground mt-0.5 text-right">
                    {language === 'pt' ? `Faltam ${xpProgress.required - xpProgress.current} XP para Lvl ${nextLevel}` : `${xpProgress.required - xpProgress.current} XP to Lvl ${nextLevel}`}
                </p>
            )}
        </div>
    );
};

export default XPProgressBar;
