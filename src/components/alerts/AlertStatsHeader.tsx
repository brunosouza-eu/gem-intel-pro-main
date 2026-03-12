import React, { useMemo } from 'react';
import { AlertStats } from '@/contexts/AlertContext';
import { Bell, Zap, TrendingUp, BarChart3 } from 'lucide-react';

interface AlertStatsHeaderProps {
    stats: AlertStats;
}

const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    gradient: string;
    delay: number;
}> = ({ icon, label, value, gradient, delay }) => (
    <div
        className={`relative overflow-hidden rounded-xl p-4 ${gradient} animate-fade-in`}
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="relative flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                {icon}
            </div>
            <div>
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
            </div>
        </div>
        {/* Decorative glow */}
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/5 blur-xl" />
    </div>
);

export const AlertStatsHeader: React.FC<AlertStatsHeaderProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
                icon={<Bell className="w-5 h-5 text-white" />}
                label="Alertas Ativos"
                value={stats.activeCount}
                gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
                delay={0}
            />
            <StatCard
                icon={<Zap className="w-5 h-5 text-white" />}
                label="Disparados Hoje"
                value={stats.triggeredToday}
                gradient="bg-gradient-to-br from-blue-600 to-blue-800"
                delay={100}
            />
            <StatCard
                icon={<TrendingUp className="w-5 h-5 text-white" />}
                label="Taxa de Sucesso"
                value={`${stats.successRate}%`}
                gradient="bg-gradient-to-br from-purple-600 to-purple-800"
                delay={200}
            />
            <StatCard
                icon={<BarChart3 className="w-5 h-5 text-white" />}
                label="Total Criados"
                value={stats.totalCreated}
                gradient="bg-gradient-to-br from-amber-600 to-amber-800"
                delay={300}
            />
        </div>
    );
};
