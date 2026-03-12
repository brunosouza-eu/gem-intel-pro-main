/**
 * 🤝 Referral System Component
 * Users get a shareable link and earn credits when their referrals sign up
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
    Share2, Copy, CheckCircle2, Users, Coins,
    Gift, ExternalLink, Trophy, Link2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReferralStats {
    total_clicks: number;
    total_signups: number;
    total_earned: number;
}

const ReferralSystem: React.FC = () => {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState<ReferralStats>({ total_clicks: 0, total_signups: 0, total_earned: 0 });

    const referralCode = user?.id?.slice(0, 8) || 'XXXXXX';
    const referralLink = `https://www.gemintelpro.com/?ref=${referralCode}`;

    // Load referral stats
    useEffect(() => {
        if (!user?.id) return;

        const loadStats = async () => {
            try {
                const { data, count } = await supabase
                    .from('profiles' as any)
                    .select('id', { count: 'exact' })
                    .eq('referred_by', user.id);

                setStats({
                    total_clicks: 0, // We'd need analytics for this
                    total_signups: count || 0,
                    total_earned: (count || 0) * 5, // 5 credits per referral
                });
            } catch (error) {
                console.error('Error loading referral stats:', error);
            }
        };

        loadStats();
    }, [user?.id]);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            toast({
                title: '🔗 Link copiado!',
                description: 'Compartilhe com seus amigos',
            });
            setTimeout(() => setCopied(false), 3000);
        } catch {
            // Fallback for mobile
            const el = document.createElement('textarea');
            el.value = referralLink;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Gem Intel Pro',
                    text: '🚀 Conheça a melhor plataforma de análise cripto com IA! Use meu link para ganhar bônus:',
                    url: referralLink,
                });
            } catch { }
        } else {
            copyLink();
        }
    };

    const tiers = [
        { label: '5 indicações', reward: '10 créditos bônus', reached: stats.total_signups >= 5 },
        { label: '15 indicações', reward: '25 créditos bônus', reached: stats.total_signups >= 15 },
        { label: '50 indicações', reward: 'Status Embaixador 👑', reached: stats.total_signups >= 50 },
    ];

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20">
                    <Share2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold">Indique & Ganhe</h3>
                    <p className="text-[10px] text-muted-foreground">Ganhe 5 créditos por cada indicação</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-card/60 border border-border/30 text-center">
                    <Users className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <p className="text-lg font-bold">{stats.total_signups}</p>
                    <p className="text-[9px] text-muted-foreground">Indicados</p>
                </div>
                <div className="p-3 rounded-xl bg-card/60 border border-border/30 text-center">
                    <Coins className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                    <p className="text-lg font-bold">{stats.total_earned}</p>
                    <p className="text-[9px] text-muted-foreground">Créditos Ganhos</p>
                </div>
                <div className="p-3 rounded-xl bg-card/60 border border-border/30 text-center">
                    <Trophy className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                    <p className="text-lg font-bold">
                        {stats.total_signups >= 50 ? '👑' : stats.total_signups >= 15 ? '🥈' : stats.total_signups >= 5 ? '🥉' : '—'}
                    </p>
                    <p className="text-[9px] text-muted-foreground">Nível</p>
                </div>
            </div>

            {/* Referral Link */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <p className="text-xs font-semibold text-center">Seu Link de Indicação</p>
                <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 bg-background/80 rounded-lg px-3 py-2 text-xs text-muted-foreground truncate border border-border/50">
                        <Link2 className="w-3 h-3 inline mr-1" />
                        {referralLink}
                    </div>
                    <button
                        onClick={copyLink}
                        className={cn(
                            "p-2 rounded-lg transition-all shrink-0",
                            copied
                                ? "bg-primary/20 text-primary"
                                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                        )}
                    >
                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>

                <button
                    onClick={shareLink}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Share2 className="w-4 h-4" />
                    Compartilhar Agora
                </button>
            </div>

            {/* Tiers */}
            <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Gift className="w-3 h-3" /> Metas de Indicação
                </h4>
                <div className="space-y-2">
                    {tiers.map((tier, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-xl border transition-all",
                                tier.reached
                                    ? "bg-primary/5 border-primary/20"
                                    : "bg-card/60 border-border/30"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                {tier.reached ? (
                                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                                )}
                                <span className="text-sm font-medium">{tier.label}</span>
                            </div>
                            <span className={cn(
                                "text-xs font-bold",
                                tier.reached ? "text-primary" : "text-muted-foreground"
                            )}>
                                {tier.reward}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it works */}
            <div className="rounded-xl bg-muted/20 border border-border/30 p-4">
                <p className="text-xs font-bold mb-2">Como funciona?</p>
                <ol className="space-y-1.5 text-[11px] text-muted-foreground list-decimal list-inside">
                    <li>Compartilhe seu link exclusivo com amigos</li>
                    <li>Quando eles se cadastrarem, você ganha <strong className="text-amber-400">5 créditos</strong></li>
                    <li>Acumule indicações e desbloqueie bônus extras</li>
                    <li>Alcance 50 indicações e ganhe o status <strong className="text-purple-400">Embaixador</strong></li>
                </ol>
            </div>
        </div>
    );
};

export default ReferralSystem;
