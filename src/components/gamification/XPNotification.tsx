/**
 * ✨ XP Notification Component
 * Toast that appears when user earns XP
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/contexts/GamificationContext';
import { X, Sparkles } from 'lucide-react';

const XPNotification: React.FC = () => {
    const { xpNotifications, dismissXPNotification } = useGamification();

    if (xpNotifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
            {xpNotifications.map((notification) => (
                <div
                    key={notification.id}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-xl',
                        'bg-gradient-to-r from-primary/90 to-info/90',
                        'text-white shadow-lg backdrop-blur-sm',
                        'animate-in slide-in-from-right duration-300',
                        'border border-white/20'
                    )}
                >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="font-bold">+{notification.amount} XP</span>
                    <span className="text-white/80 text-sm hidden sm:inline">
                        {notification.action}
                    </span>
                    <button
                        onClick={() => dismissXPNotification(notification.id)}
                        className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default XPNotification;
