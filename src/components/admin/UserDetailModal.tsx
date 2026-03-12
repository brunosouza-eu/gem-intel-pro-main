import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    Crown, Shield, Mail, Phone, Calendar, LogIn, Coins, Ban, Globe,
    Clock, CreditCard, ArrowUp, ArrowDown, Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AdminUser, UserDetails as UserDetailsType, CreditTransaction } from '@/hooks/useAdmin';

interface UserDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: AdminUser | null;
    onGetDetails: (userId: string) => Promise<UserDetailsType | null>;
    onAdjustCredits: () => void;
    onBlockUser: () => void;
    onUnblockUser: () => void;
    onChangePlan: (plan: 'free' | 'pro') => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
    open, onOpenChange, user, onGetDetails, onAdjustCredits, onBlockUser, onUnblockUser, onChangePlan,
}) => {
    const [details, setDetails] = useState<UserDetailsType | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && user) {
            setLoading(true);
            onGetDetails(user.id).then((d) => {
                setDetails(d);
                setLoading(false);
            }).catch(() => setLoading(false));
        } else {
            setDetails(null);
        }
    }, [open, user]);

    if (!user) return null;

    const initials = (user.full_name || user.email || '?')
        .split(' ')
        .map(s => s[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const formatDate = (date: string | null) => {
        if (!date) return '—';
        try { return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: ptBR }); }
        catch { return date; }
    };

    const transactions: CreditTransaction[] = details?.recent_transactions || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl bg-card max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="sr-only">Detalhes do Usuário</DialogTitle>
                </DialogHeader>

                {/* User Header */}
                <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/30">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold truncate">
                            {user.full_name || 'Sem nome'}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Badge
                                variant={user.plan === 'pro' ? 'default' : 'secondary'}
                                className={user.plan === 'pro' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : ''}
                            >
                                {user.plan === 'pro' && <Crown className="w-3 h-3 mr-1" />}
                                {(user.plan || 'free').toUpperCase()}
                            </Badge>
                            {user.is_admin && (
                                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                    <Shield className="w-3 h-3 mr-1" />ADMIN
                                </Badge>
                            )}
                            {user.is_blocked && (
                                <Badge variant="destructive">
                                    <Ban className="w-3 h-3 mr-1" />BLOQUEADO
                                </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                                <Globe className="w-3 h-3 mr-1" />
                                {user.provider === 'google' ? 'Google' : 'Email'}
                            </Badge>
                        </div>
                    </div>
                </div>

                <Separator className="my-2" />

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <InfoItem icon={Mail} label="Email" value={user.email} />
                    <InfoItem icon={Phone} label="Telefone" value={user.phone || '—'} />
                    <InfoItem icon={Calendar} label="Cadastro" value={formatDate(user.created_at)} />
                    <InfoItem icon={LogIn} label="Último Login" value={formatDate(user.last_login_at)} />
                    <InfoItem icon={Clock} label="Total Logins" value={String(user.login_count)} />
                    <InfoItem
                        icon={Coins}
                        label="Créditos"
                        value={String(user.credits)}
                        valueClassName="text-amber-400 font-bold text-lg"
                    />
                </div>

                {user.is_blocked && user.blocked_reason && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-2">
                        <p className="text-sm font-medium text-red-400">Motivo do Bloqueio:</p>
                        <p className="text-sm text-muted-foreground">{user.blocked_reason}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Bloqueado em: {formatDate(user.blocked_at)}
                        </p>
                    </div>
                )}

                <Separator className="my-2" />

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="gap-1" onClick={onAdjustCredits}>
                        <Coins className="w-3.5 h-3.5" />Ajustar Créditos
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => onChangePlan(user.plan === 'pro' ? 'free' : 'pro')}
                    >
                        <CreditCard className="w-3.5 h-3.5" />
                        {user.plan === 'pro' ? 'Downgrade' : 'Upgrade'}
                    </Button>
                    {user.is_blocked ? (
                        <Button size="sm" variant="outline" className="gap-1 text-emerald-400 border-emerald-500/30" onClick={onUnblockUser}>
                            Desbloquear
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline" className="gap-1 text-red-400 border-red-500/30" onClick={onBlockUser}>
                            <Ban className="w-3.5 h-3.5" />Bloquear
                        </Button>
                    )}
                </div>

                <Separator className="my-2" />

                {/* Transaction History */}
                <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-400" />
                        Histórico de Créditos
                    </h4>
                    {loading && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    {!loading && transactions.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Nenhuma transação encontrada
                        </p>
                    )}
                    {!loading && transactions.length > 0 && (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className={`p-1.5 rounded-full ${tx.amount > 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                            {tx.amount > 0
                                                ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                                                : <ArrowDown className="w-3.5 h-3.5 text-red-400" />
                                            }
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{tx.source}</p>
                                            <p className="text-xs text-muted-foreground">{tx.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {formatDate(tx.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Helper component
const InfoItem: React.FC<{
    icon: React.ElementType;
    label: string;
    value: string;
    valueClassName?: string;
}> = ({ icon: Icon, label, value, valueClassName }) => (
    <div className="flex items-start gap-2">
        <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className={`text-sm truncate ${valueClassName || ''}`}>{value}</p>
        </div>
    </div>
);

export default UserDetailModal;
