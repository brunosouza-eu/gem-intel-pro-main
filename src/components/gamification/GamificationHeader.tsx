/**
 * 🏆 Gamification Header Component
 * Compact header showing XP, level, streak, and VIP status
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useGamification } from '@/contexts/GamificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Flame, Trophy, ChevronRight, Sparkles, Crown, Coins } from 'lucide-react';

interface GamificationHeaderProps {
    className?: string;
    compact?: boolean;
}

const GamificationHeader: React.FC<GamificationHeaderProps> = ({ className, compact = false }) => {
    const { language } = useLanguage();
    const { profile, levelInfo, xpProgress, rank, isLoading } = useGamification();
    const navigate = useNavigate();

    const isElite = profile?.plan === 'elite';
    const isPro = profile?.plan === 'pro';
    const isPremium = isElite || isPro;

    if (isLoading) {
        return (
            <div className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full',
                'bg-muted/50 animate-pulse',
                className
            )}>
                <div className="w-20 h-4 bg-muted rounded" />
            </div>
        );
    }

    // Compact version for mobile header
    if (compact) {
        return (
            <button
                onClick={() => navigate('/profile')}
                className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full',
                    isElite
                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30'
                        : isPro 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30'
                            : 'bg-card/80 backdrop-blur-sm border border-border/50',
                    'hover:border-primary/50 hover:bg-card transition-all',
                    'cursor-pointer group',
                    className
                )}
            >
                {isElite ? (
                    <>
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-sm text-amber-400">ELITE</span>
                    </>
                ) : isPro ? (
                    <>
                        <Crown className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-sm text-emerald-400">PRO</span>
                    </>
                ) : (
                    <>
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-sm">{profile?.credits || 0}</span>
                        <div className="w-px h-4 bg-border" />
                        <Flame className={cn(
                            'w-4 h-4',
                            (profile?.streak_days || 0) >= 7 ? 'text-orange-500' : 'text-muted-foreground'
                        )} />
                        <span className="font-bold text-sm">{profile?.streak_days || 0}</span>
                    </>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
        );
    }

    // Full version for sidebar
    return (
        <div className={cn('space-y-3', className)}>
            {/* VIP Badge or Level */}
            <div className="flex items-center gap-3">
                {isElite ? (
                    <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        'bg-gradient-to-br from-amber-500/30 to-yellow-500/30 border border-amber-500/50'
                    )}>
                        <Crown className="w-5 h-5 text-amber-400" />
                    </div>
                ) : isPro ? (
                    <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        'bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/50'
                    )}>
                        <Crown className="w-5 h-5 text-emerald-400" />
                    </div>
                ) : (
                    <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-xl',
                        'bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30'
                    )}>
                        {levelInfo.icon}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {isElite ? (
                            <span className="font-bold text-sm text-amber-400">Elite Member</span>
                        ) : isPro ? (
                            <span className="font-bold text-sm text-emerald-400">Pro Member</span>
                        ) : (
                            <>
                                <span className="font-bold text-sm">
                                    {language === 'pt' ? levelInfo.name : levelInfo.nameEn}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Lvl {profile?.level || 1}
                                </span>
                            </>
                        )}
                    </div>
                    {/* XP Progress Bar */}
                    {!isPremium && (
                        <>
                            <div className="mt-1 w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-info rounded-full transition-all"
                                    style={{ width: `${xpProgress.percentage}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                {xpProgress.current}/{xpProgress.required} XP
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between text-xs">
                {/* Credits or VIP unlimited */}
                <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span className="font-bold">
                        {isPremium ? '∞' : (profile?.credits || 0)}
                    </span>
                    <span className="text-muted-foreground">
                        {language === 'pt' ? 'créditos' : 'credits'}
                    </span>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-1.5">
                    <Flame className={cn(
                        'w-4 h-4',
                        (profile?.streak_days || 0) >= 7 ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'
                    )} />
                    <span className="font-bold">{profile?.streak_days || 0}</span>
                </div>

                {/* Rank */}
                <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="font-bold">#{rank || '—'}</span>
                </div>
            </div>
        </div>
    );
};

export default GamificationHeader;
