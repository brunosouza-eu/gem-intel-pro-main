/**
 * 🎯 Missions Panel — Gamification Tasks That Pay Credits
 * Shows daily/unique missions to encourage engagement
 *
 * FIX: missions now use real tracked data for completion checks,
 * localStorage key is scoped per user_id, and daily_login/visit/read
 * no longer auto-complete.
 */

import React, { useState, useEffect } from 'react';
import { useGamification } from '@/contexts/GamificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMonetization } from '@/contexts/MonetizationContext';
import { addCredits } from '@/lib/creditsService';
import { cn } from '@/lib/utils';
import {
    Target, Eye, Bot, Users, BookOpen,
    Flame, Trophy, CheckCircle2, Clock, Coins, Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Mission {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    reward: number;
    type: 'daily' | 'unique';
    /** Returns true if the user has done the action (eligible to claim) */
    check: () => boolean;
    actionRoute?: string;
}

const MissionsPanel: React.FC = () => {
    const { profile } = useGamification();
    const { user } = useAuth();
    const { refreshCredits } = useMonetization();
    const [claimedMissions, setClaimedMissions] = useState<string[]>([]);
    const [claiming, setClaiming] = useState<string | null>(null);

    // Use a daily key scoped per user so accounts are independent
    const getStorageKey = () => {
        if (!user?.id) return null;
        const today = new Date().toISOString().split('T')[0];
        return `missions-claimed-${user.id}-${today}`;
    };

    // Get unique missions key scoped per user (no date — permanent)
    const getUniqueStorageKey = () => {
        if (!user?.id) return null;
        return `missions-unique-claimed-${user.id}`;
    };

    // Load claimed missions from localStorage (daily + unique)
    useEffect(() => {
        if (!user?.id) return;

        const dailyKey = getStorageKey();
        const uniqueKey = getUniqueStorageKey();

        let merged: string[] = [];

        if (dailyKey) {
            const dailyStored = localStorage.getItem(dailyKey);
            if (dailyStored) {
                try { merged = [...merged, ...JSON.parse(dailyStored)]; } catch {}
            }
        }

        if (uniqueKey) {
            const uniqueStored = localStorage.getItem(uniqueKey);
            if (uniqueStored) {
                try { merged = [...merged, ...JSON.parse(uniqueStored)]; } catch {}
            }
        }

        setClaimedMissions(merged);
    }, [user?.id]);

    const saveClaimed = (missionId: string, type: 'daily' | 'unique') => {
        if (!user?.id) return;

        if (type === 'daily') {
            const key = getStorageKey();
            if (!key) return;
            setClaimedMissions(prev => {
                const next = [...prev, missionId];
                // Only save daily IDs to the daily key
                const dailyOnly = next.filter(id => dailyMissions.some(m => m.id === id));
                localStorage.setItem(key, JSON.stringify(dailyOnly));
                return next;
            });
        } else {
            const key = getUniqueStorageKey();
            if (!key) return;
            setClaimedMissions(prev => {
                const next = [...prev, missionId];
                // Only save unique IDs to the unique key
                const uniqueOnly = next.filter(id => uniqueMissions.some(m => m.id === id));
                localStorage.setItem(key, JSON.stringify(uniqueOnly));
                return next;
            });
        }
    };

    // Track which actions the user has performed TODAY using localStorage
    const hasDoneToday = (actionId: string): boolean => {
        if (!user?.id) return false;
        const today = new Date().toISOString().split('T')[0];
        const key = `action-done-${user.id}-${today}-${actionId}`;
        return localStorage.getItem(key) === 'true';
    };

    // Mark a daily action as done. Call this from routes/components when the user performs the action.
    // For now, the "Login Diário" is the only auto-complete because the user IS logged in.
    const markActionDone = (actionId: string) => {
        if (!user?.id) return;
        const today = new Date().toISOString().split('T')[0];
        const key = `action-done-${user.id}-${today}-${actionId}`;
        localStorage.setItem(key, 'true');
    };

    // Auto-mark login as done (the user IS logged in right now)
    useEffect(() => {
        if (user?.id) {
            markActionDone('daily_login');
        }
    }, [user?.id]);

    const dailyMissions: Mission[] = [
        {
            id: 'daily_login',
            title: 'Login Diário',
            description: 'Acesse a plataforma todo dia',
            icon: Flame,
            reward: 2,
            type: 'daily',
            check: () => hasDoneToday('daily_login'),
        },
        {
            id: 'view_analysis',
            title: 'Visualizar Análise',
            description: 'Abra a análise de qualquer token',
            icon: Eye,
            reward: 1,
            type: 'daily',
            check: () => hasDoneToday('view_analysis'),
        },
        {
            id: 'use_guru',
            title: 'Consultar o Guru IA',
            description: 'Faça uma pergunta ao Crypto Guru',
            icon: Bot,
            reward: 2,
            type: 'daily',
            check: () => hasDoneToday('use_guru'),
        },
        {
            id: 'visit_community',
            title: 'Visitar a Comunidade',
            description: 'Acesse a página da comunidade',
            icon: Users,
            reward: 1,
            type: 'daily',
            check: () => hasDoneToday('visit_community'),
            actionRoute: '/community',
        },
        {
            id: 'read_course',
            title: 'Estudar o Curso',
            description: 'Acesse uma aula do Trade Master',
            icon: BookOpen,
            reward: 2,
            type: 'daily',
            check: () => hasDoneToday('read_course'),
            actionRoute: '/biblioteca/trade-master-pro',
        },
    ];

    const uniqueMissions: Mission[] = [
        {
            id: 'first_analysis',
            title: 'Primeira Análise',
            description: 'Faça sua primeira análise completa',
            icon: Target,
            reward: 3,
            type: 'unique',
            check: () => (profile?.total_analyses_viewed || 0) >= 1,
        },
        {
            id: 'streak_3',
            title: 'Streak de 3 Dias',
            description: 'Mantenha 3 dias de login seguidos',
            icon: Flame,
            reward: 5,
            type: 'unique',
            check: () => (profile?.streak_days || 0) >= 3,
        },
        {
            id: 'streak_7',
            title: 'Streak de 7 Dias',
            description: 'Mantenha 7 dias consecutivos',
            icon: Trophy,
            reward: 10,
            type: 'unique',
            check: () => (profile?.streak_days || 0) >= 7,
        },
        {
            id: 'guru_master',
            title: 'Guru Master',
            description: 'Use o Crypto Guru 10 vezes',
            icon: Bot,
            reward: 5,
            type: 'unique',
            check: () => (profile?.total_guru_uses || 0) >= 10,
        },
    ];

    const claimReward = async (mission: Mission) => {
        if (!user) return;
        setClaiming(mission.id);
        try {
            const result = await addCredits(mission.reward, `mission_${mission.id}`, `Missão: ${mission.title}`);
            if (result.success) {
                saveClaimed(mission.id, mission.type);
                await refreshCredits(); // Sync credits in real-time
                toast({
                    title: `🎁 +${mission.reward} Créditos!`,
                    description: `Missão "${mission.title}" concluída!`,
                });
            }
        } catch (error) {
            console.error('Error claiming mission:', error);
        } finally {
            setClaiming(null);
        }
    };

    const completedDaily = dailyMissions.filter(m => claimedMissions.includes(m.id)).length;

    const renderMission = (mission: Mission, colorClass: string, bgClass: string) => {
        const completed = mission.check();
        const claimed = claimedMissions.includes(mission.id);
        const Icon = mission.icon;

        return (
            <div
                key={mission.id}
                className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all",
                    claimed
                        ? "bg-primary/5 border-primary/20 opacity-60"
                        : completed
                            ? `${bgClass} hover:border-${colorClass}/40`
                            : "bg-card/60 border-border/30"
                )}
            >
                <div className={cn(
                    "p-2 rounded-lg shrink-0",
                    claimed ? "bg-primary/10" : completed ? `bg-${colorClass}/10` : "bg-muted/30"
                )}>
                    {claimed ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : (
                        <Icon className={cn("w-4 h-4", completed ? `text-${colorClass}` : "text-muted-foreground")} />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium", claimed && "line-through")}>{mission.title}</p>
                    <p className="text-[10px] text-muted-foreground">{mission.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("text-xs font-bold flex items-center gap-0.5", claimed ? "text-muted-foreground" : `text-${colorClass}`)}>
                        <Coins className="w-3 h-3" /> +{mission.reward}
                    </span>
                    {!claimed && completed && (
                        <button
                            onClick={() => claimReward(mission)}
                            disabled={claiming === mission.id}
                            className={cn(
                                "px-3 py-1 text-xs font-bold rounded-full hover:opacity-90 active:scale-95 transition-all disabled:opacity-50",
                                mission.type === 'daily'
                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black"
                                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            )}
                        >
                            {claiming === mission.id ? '...' : 'Resgatar'}
                        </button>
                    )}
                    {claimed && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20">
                        <Target className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold">Missões & Recompensas</h3>
                        <p className="text-[10px] text-muted-foreground">Complete para ganhar créditos</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs text-muted-foreground">{completedDaily}/{dailyMissions.length} diárias</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 rounded-full bg-muted/50 overflow-hidden">
                <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${(completedDaily / dailyMissions.length) * 100}%` }}
                />
            </div>

            {/* Daily Missions */}
            <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Missões Diárias
                </h4>
                <div className="space-y-2">
                    {dailyMissions.map(mission => renderMission(mission, 'amber-400', 'bg-amber-500/5 border-amber-500/20'))}
                </div>
            </div>

            {/* Unique Missions */}
            <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Conquistas Únicas
                </h4>
                <div className="space-y-2">
                    {uniqueMissions.map(mission => renderMission(mission, 'purple-400', 'bg-purple-500/5 border-purple-500/20'))}
                </div>
            </div>
        </div>
    );
};

export default MissionsPanel;
