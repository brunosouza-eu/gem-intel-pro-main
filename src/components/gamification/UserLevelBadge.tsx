/**
 * ⭐ User Level Badge Component
 * Shows user level with icon
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/contexts/GamificationContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserLevelBadgeProps {
    showName?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const UserLevelBadge: React.FC<UserLevelBadgeProps> = ({
    showName = true,
    size = 'md',
    className,
}) => {
    const { language } = useLanguage();
    const { profile, levelInfo } = useGamification();

    const sizes = {
        sm: 'text-xs px-1.5 py-0.5',
        md: 'text-sm px-2 py-1',
        lg: 'text-base px-3 py-1.5',
    };

    // Level-based gradient colors
    const getLevelGradient = () => {
        const level = profile?.level || 1;
        if (level >= 6) return 'from-amber-500 to-yellow-400'; // Legend
        if (level >= 5) return 'from-purple-500 to-pink-400'; // Master
        if (level >= 4) return 'from-blue-500 to-cyan-400'; // Expert
        if (level >= 3) return 'from-green-500 to-emerald-400'; // Trader
        if (level >= 2) return 'from-slate-500 to-slate-400'; // Apprentice
        return 'from-slate-600 to-slate-500'; // Newbie
    };

    const name = language === 'pt' ? levelInfo.name : levelInfo.nameEn;

    return (
        <div className={cn(
            'inline-flex items-center gap-1 rounded-full font-medium',
            'bg-gradient-to-r text-white shadow-sm',
            getLevelGradient(),
            sizes[size],
            className
        )}>
            <span>{levelInfo.icon}</span>
            {showName && (
                <span className="font-semibold">{name}</span>
            )}
        </div>
    );
};

export default UserLevelBadge;
