import React from 'react';
import { Button } from '@/components/ui/button';
import { useAffiliates } from '@/hooks/useAffiliates';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradeButtonProps {
    platform: 'mexc' | 'bybit' | 'binance';
    symbol?: string;
    className?: string;
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'premium';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    children?: React.ReactNode;
    showIcon?: boolean;
}

const PLATFORM_CONFIG = {
    mexc: {
        label: 'MEXC',
        color: 'bg-green-500 hover:bg-green-600 text-white',
        premiumColor: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0',
    },
    bybit: {
        label: 'Bybit',
        color: 'bg-amber-500 hover:bg-amber-600 text-white',
        premiumColor: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0',
    },
    binance: {
        label: 'Binance',
        color: 'bg-yellow-500 hover:bg-yellow-600 text-black',
        premiumColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black border-0',
    },
};

export const TradeButton: React.FC<TradeButtonProps> = ({
    platform,
    symbol,
    className,
    variant = 'default',
    size = 'default',
    children,
    showIcon = true,
}) => {
    const { getReferralLink } = useAffiliates();
    const config = PLATFORM_CONFIG[platform];

    // Safety check: if platform config doesn't exist, don't render
    if (!config) {
        console.error(`TradeButton: Unknown platform "${platform}"`);
        return null;
    }

    const handleClick = () => {
        const link = getReferralLink(platform, symbol);
        if (link && link !== '#') {
            window.open(link, '_blank');
        }
    };

    const isPremium = variant === 'premium';
    const customClass = isPremium ? config.premiumColor : '';
    const finalVariant = isPremium ? 'default' : variant;

    return (
        <Button
            variant={finalVariant}
            size={size}
            className={cn(customClass, className)}
            onClick={handleClick}
        >
            {children || `Trade on ${config.label}`}
            {showIcon && <ExternalLink className="w-4 h-4 ml-2 opacity-80" />}
        </Button>
    );
};
