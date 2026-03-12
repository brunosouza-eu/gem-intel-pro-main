import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Users, Crown, UserX, Shield, Coins, TrendingUp, UserPlus, Activity, Bot, HeadphonesIcon, Sparkles,
} from 'lucide-react';
import type { AdminStats as AdminStatsType } from '@/hooks/useAdmin';

interface AdminDashboardTabProps {
    stats: AdminStatsType;
}

const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({ stats }) => {
    const mainCards = [
        { title: 'Total Usuários', value: stats.total_users, icon: Users, gradient: 'from-blue-500 to-cyan-500', bgGlow: 'bg-blue-500/10' },
        { title: 'Usuários PRO', value: stats.pro_users, icon: Shield, gradient: 'from-emerald-500 to-green-400', bgGlow: 'bg-emerald-500/10' },
        { title: 'Usuários ELITE', value: stats.elite_users, icon: Crown, gradient: 'from-amber-500 to-yellow-400', bgGlow: 'bg-amber-500/10' },
        { title: 'Ativos (7 dias)', value: stats.active_users_7d, icon: Activity, gradient: 'from-violet-500 to-purple-400', bgGlow: 'bg-violet-500/10' },
    ];

    const secondaryCards = [
        { title: 'Usuários FREE', value: stats.free_users, icon: Users, color: 'text-slate-400' },
        { title: 'Bloqueados', value: stats.blocked_users, icon: UserX, color: 'text-red-400' },
        { title: 'Administradores', value: stats.admin_users, icon: Shield, color: 'text-orange-400' },
        { title: 'Moderadores', value: stats.moderator_users, icon: HeadphonesIcon, color: 'text-violet-400' },
        { title: 'Contas Bot', value: stats.bot_accounts, icon: Bot, color: 'text-slate-400' },
        { title: 'Novos (7 dias)', value: stats.new_users_7d, icon: UserPlus, color: 'text-blue-400' },
        { title: 'Créditos em Circulação', value: stats.total_credits_in_circulation.toLocaleString('pt-BR'), icon: Coins, color: 'text-emerald-400' },
        { title: 'Novos (30 dias)', value: stats.new_users_30d, icon: TrendingUp, color: 'text-cyan-400' },
    ];

    // Revenue: Pro * R$47 + Elite * R$97
    const estimatedRevenue = (stats.pro_users * 47) + (stats.elite_users * 97);
    const totalPaying = stats.pro_users + stats.elite_users;
    const conversionRate = stats.total_users > 0
        ? ((totalPaying / stats.total_users) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="space-y-6">
            {/* Main KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainCards.map((card) => (
                    <Card
                        key={card.title}
                        className="relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:scale-[1.02] transition-transform"
                    >
                        <div className={`absolute inset-0 ${card.bgGlow} opacity-50`} />
                        <CardContent className="p-6 relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{card.title}</p>
                                    <p className="text-3xl font-bold mt-2">{card.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Revenue Banner */}
            <Card className="border-0 bg-gradient-to-r from-primary/10 via-accent/10 to-amber-500/10 backdrop-blur-sm">
                <CardContent className="p-5 flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Taxa de Conversão Free → Pago</p>
                        <p className="text-2xl font-bold text-primary">{conversionRate}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Assinantes Pagantes</p>
                        <p className="text-2xl font-bold flex items-center gap-2">
                            <span className="text-emerald-400">{stats.pro_users} Pro</span>
                            <span className="text-muted-foreground">+</span>
                            <span className="text-amber-400">{stats.elite_users} Elite</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Receita Estimada</p>
                        <p className="text-2xl font-bold text-emerald-400">
                            R$ {estimatedRevenue.toLocaleString('pt-BR')}
                            <span className="text-sm font-normal text-muted-foreground">/mês</span>
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Secondary Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {secondaryCards.map((card) => (
                    <Card key={card.title} className="border-border/30 bg-card/30 backdrop-blur-sm">
                        <CardContent className="p-4 text-center">
                            <card.icon className={`w-5 h-5 mx-auto mb-2 ${card.color}`} />
                            <p className="text-xl font-bold">{card.value}</p>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{card.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardTab;
