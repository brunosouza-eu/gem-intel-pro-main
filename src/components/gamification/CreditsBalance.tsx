/**
 * 💰 Credits Balance Component
 * Shows credit balance with coin icon - Universal for all devices
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/contexts/GamificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Coins, Plus } from 'lucide-react';

interface CreditsBalanceProps {
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
    onClick?: () => void;
}

const CreditsBalance: React.FC<CreditsBalanceProps> = ({
    size = 'md',
    showLabel = false,
    className,
    onClick,
}) => {
    const { language } = useLanguage();
    const { profile } = useGamification();

    const credits = profile?.credits || 0;

    const sizes = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full font-semibold',
                'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
                'border border-amber-500/30 text-amber-400',
                'hover:border-amber-400 hover:bg-amber-500/30 transition-all',
                sizes[size],
                className
            )}
        >
            <Coins className={cn(iconSizes[size], 'text-amber-400')} />
            <span>{credits}</span>
            {showLabel && (
                <span className="text-amber-300/80">
                    {language === 'pt' ? 'créditos' : 'credits'}
                </span>
            )}
            {onClick && (
                <Plus className={cn(iconSizes[size], 'text-amber-300/60')} />
            )}
        </button>
    );
};

export default CreditsBalance;
