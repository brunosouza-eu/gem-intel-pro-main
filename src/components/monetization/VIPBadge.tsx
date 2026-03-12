/**
 * 👑 VIP BADGE
 * Shows VIP status with crown icon
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Crown } from 'lucide-react';

interface VIPBadgeProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    className?: string;
}

const VIPBadge: React.FC<VIPBadgeProps> = ({
    size = 'md',
    showText = true,
    className,
}) => {
    const sizes = {
        sm: 'px-2 py-0.5 text-xs gap-1',
        md: 'px-3 py-1 text-sm gap-1.5',
        lg: 'px-4 py-2 text-base gap-2',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    return (
        <div className={cn(
            'inline-flex items-center font-bold rounded-full',
            'bg-gradient-to-r from-amber-500 to-yellow-500 text-black',
            'shadow-lg shadow-amber-500/30',
            sizes[size],
            className
        )}>
            <Crown className={iconSizes[size]} />
            {showText && <span>VIP</span>}
        </div>
    );
};

export default VIPBadge;
