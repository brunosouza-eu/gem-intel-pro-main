/**
 * 📊 Usage Metrics Tab — Analytics dashboard for admin panel
 * Shows plan distribution, top active users, and feature usage
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    BarChart3, Users, Crown, Shield, TrendingUp, Activity, Coins, Zap,
} from 'lucide-react';
import type { AdminUser, AdminStats } from '@/hooks/useAdmin';

interface UsageMetricsTabProps {
    stats: AdminStats;
    users: AdminUser[];
}

const UsageMetricsTab: React.FC<UsageMetricsTabProps> = ({ stats, users }) => {
    // Plan distribution
    const planData = [
        { label: 'Free', count: stats.free_users, color: 'bg-slate-500', textColor: 'text-slate-400' },
        { label: 'Pro', count: stats.pro_users, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
        { label: 'Elite', count: stats.elite_users, color: 'bg-amber-500', textColor: 'text-amber-400' },
    ];
    const totalReal = stats.total_users || 1;

    // Top active users (by login_count, excluding bots)
    const topUsers = [...users]
        .filter(u => u.account_type !== 'bot')
        .sort((a, b) => (b.login_count || 0) - (a.login_count || 0))
        .slice(0, 10);

    // Users with most credits
    const topCredits = [...users]
        .filter(u => u.account_type !== 'bot')
        .sort((a, b) => (b.credits || 0) - (a.credits || 0))
        .slice(0, 10);

    // Recent signups (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = users
        .filter(u => u.account_type !== 'bot' && new Date(u.created_at) >= sevenDaysAgo)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const getInitials = (u: AdminUser) => {
        const name = u.full_name || u.email || '?';
        return name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="space-y-6">
            {/* Plan Distribution */}
            <Card className="border-border/30 bg-card/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Distribuição de Planos
                    </CardTitle>
                    <CardDescription>
                        {stats.total_users} usuários reais (excluindo {stats.bot_accounts} bots)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {planData.map((plan) => {
                            const pct = totalReal > 0 ? ((plan.count / totalReal) * 100) : 0;
                            return (
                                <div key={plan.label} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className={`font-semibold ${plan.textColor}`}>{plan.label}</span>
                                        <span className="text-muted-foreground">
                                            {plan.count} ({pct.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${plan.color} rounded-full transition-all duration-700`}
                                            style={{ width: `${Math.max(pct, 1)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Active Users */}
                <Card className="border-border/30 bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="w-5 h-5 text-violet-400" />
                            Usuários Mais Ativos
                        </CardTitle>
                        <CardDescription>Por número de logins</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {topUsers.map((u, i) => (
                                <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                    <span className={`text-sm font-bold w-6 text-center ${i < 3 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                                        #{i + 1}
                                    </span>
                                    <Avatar className="w-7 h-7 border border-border/50">
                                        <AvatarImage src={u.avatar_url || undefined} />
                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                            {getInitials(u)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{u.full_name || u.email}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs font-mono">
                                        {u.login_count || 0} logins
                                    </Badge>
                                </div>
                            ))}
                            {topUsers.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">Sem dados</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Credits */}
                <Card className="border-border/30 bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Coins className="w-5 h-5 text-amber-400" />
                            Maiores Saldos
                        </CardTitle>
                        <CardDescription>Usuários com mais créditos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {topCredits.map((u, i) => (
                                <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                    <span className={`text-sm font-bold w-6 text-center ${i < 3 ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                                        #{i + 1}
                                    </span>
                                    <Avatar className="w-7 h-7 border border-border/50">
                                        <AvatarImage src={u.avatar_url || undefined} />
                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                            {getInitials(u)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{u.full_name || u.email}</p>
                                        <Badge variant="secondary" className={`text-[9px] ${
                                            u.plan === 'elite' ? 'bg-amber-500/20 text-amber-400' :
                                            u.plan === 'pro' ? 'bg-emerald-500/20 text-emerald-400' : ''
                                        }`}>
                                            {u.plan.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <span className="font-mono text-sm font-bold text-amber-400">
                                        {(u.credits || 0).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            {topCredits.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">Sem dados</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Signups */}
            <Card className="border-border/30 bg-card/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="w-5 h-5 text-blue-400" />
                        Cadastros Recentes (7 dias)
                    </CardTitle>
                    <CardDescription>{recentUsers.length} novos usuários esta semana</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentUsers.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">Nenhum cadastro nos últimos 7 dias</p>
                    ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {recentUsers.map((u) => (
                                <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                    <Avatar className="w-7 h-7 border border-border/50">
                                        <AvatarImage src={u.avatar_url || undefined} />
                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                            {getInitials(u)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{u.full_name || u.email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(u.created_at).toLocaleDateString('pt-BR')} — {u.provider === 'google' ? 'Google' : 'Email'}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className={`text-[9px] ${
                                        u.plan === 'elite' ? 'bg-amber-500/20 text-amber-400' :
                                        u.plan === 'pro' ? 'bg-emerald-500/20 text-emerald-400' : ''
                                    }`}>
                                        {u.plan.toUpperCase()}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UsageMetricsTab;
