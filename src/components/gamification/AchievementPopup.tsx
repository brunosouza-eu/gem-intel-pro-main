/**
 * 🎖️ Achievement Popup Component
 * Modal that appears when user unlocks a badge
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/contexts/GamificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Award } from 'lucide-react';

const AchievementPopup: React.FC = () => {
    const { language } = useLanguage();
    const { badgeNotifications, dismissBadgeNotification } = useGamification();

    if (badgeNotifications.length === 0) return null;

    const notification = badgeNotifications[0]; // Show one at a time

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => dismissBadgeNotification(notification.id)}
            />

            {/* Modal */}
            <div className={cn(
                'relative z-10 w-full max-w-sm p-6 rounded-2xl',
                'bg-gradient-to-br from-card via-card to-primary/10',
                'border border-primary/30 shadow-2xl',
                'animate-in zoom-in-95 duration-300'
            )}>
                {/* Close button */}
                <button
                    onClick={() => dismissBadgeNotification(notification.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Content */}
                <div className="text-center">
                    {/* Confetti effect */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-1/4 text-2xl animate-bounce">🎉</div>
                        <div className="absolute top-0 right-1/4 text-2xl animate-bounce delay-100">✨</div>
                    </div>

                    {/* Badge icon */}
                    <div className={cn(
                        'inline-flex items-center justify-center w-20 h-20 mb-4',
                        'rounded-full bg-gradient-to-br from-primary to-accent',
                        'text-4xl shadow-lg ring-4 ring-primary/30',
                        'animate-pulse'
                    )}>
                        {notification.badge.icon}
                    </div>

                    {/* Title */}
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            {language === 'pt' ? 'Conquista Desbloqueada!' : 'Achievement Unlocked!'}
                        </span>
                    </div>

                    {/* Badge name */}
                    <h3 className="text-xl font-bold mb-2">
                        {language === 'pt' ? notification.badge.namePt : notification.badge.name}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4">
                        {language === 'pt' ? notification.badge.descriptionPt : notification.badge.description}
                    </p>

                    {/* XP reward */}
                    <div className={cn(
                        'inline-flex items-center gap-2 px-4 py-2 rounded-full',
                        'bg-primary/20 text-primary font-bold'
                    )}>
                        <span>+{notification.badge.xpReward} XP</span>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={() => dismissBadgeNotification(notification.id)}
                        className={cn(
                            'mt-6 w-full py-3 rounded-xl font-semibold',
                            'bg-gradient-to-r from-primary to-accent text-white',
                            'hover:opacity-90 transition-opacity'
                        )}
                    >
                        {language === 'pt' ? 'Incrível!' : 'Awesome!'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AchievementPopup;
