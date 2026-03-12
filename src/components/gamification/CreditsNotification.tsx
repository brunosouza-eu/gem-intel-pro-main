/**
 * 💰 Credits Notification Component
 * Toast that appears when user earns or spends credits
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Coins, X, TrendingUp, TrendingDown } from 'lucide-react';

export interface CreditNotification {
    id: string;
    amount: number;
    type: 'earn' | 'spend';
    description: string;
    timestamp: number;
}

interface CreditsNotificationProps {
    notifications: CreditNotification[];
    onDismiss: (id: string) => void;
}

const CreditsNotification: React.FC<CreditsNotificationProps> = ({
    notifications,
    onDismiss,
}) => {
    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-16 right-4 z-[100] flex flex-col gap-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-xl',
                        'shadow-lg backdrop-blur-sm',
                        'animate-in slide-in-from-right duration-300',
                        'border',
                        notification.type === 'earn'
                            ? 'bg-gradient-to-r from-amber-500/90 to-yellow-500/90 border-amber-400/30 text-white'
                            : 'bg-gradient-to-r from-red-500/90 to-orange-500/90 border-red-400/30 text-white'
                    )}
                >
                    <Coins className="w-4 h-4" />
                    {notification.type === 'earn' ? (
                        <TrendingUp className="w-4 h-4" />
                    ) : (
                        <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-bold">
                        {notification.type === 'earn' ? '+' : ''}{notification.amount}
                    </span>
                    <span className="text-white/80 text-sm hidden sm:inline">
                        {notification.description}
                    </span>
                    <button
                        onClick={() => onDismiss(notification.id)}
                        className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CreditsNotification;
