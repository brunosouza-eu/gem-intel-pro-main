import React, { useState, useEffect } from 'react';
import { Shield, Zap, Lock, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMonetization } from '@/contexts/MonetizationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CreditWallProps {
    toolName: string;
    toolIcon: 'sniper' | 'trademaster';
    storageKey: string;
    cost?: number;
    children: React.ReactNode;
}

export const CreditWall: React.FC<CreditWallProps> = ({
    toolName,
    toolIcon,
    storageKey,
    cost = 1,
    children
}) => {
    const [isUnlocked, setIsUnlocked] = useState(true); // Default true briefly to avoid flicker
    const [isChecking, setIsChecking] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const { credits, spendCredit } = useMonetization();
    const { language } = useLanguage();
    const pt = language === 'pt';
    const navigate = useNavigate();

    useEffect(() => {
        // Check local storage to see if they already unlocked it (valid for 12 hours)
        const unlockedJson = localStorage.getItem(`unlocked_${storageKey}`);
        if (unlockedJson) {
            try {
                const unlockedData = JSON.parse(unlockedJson);
                if (unlockedData && unlockedData.expiresAt && Date.now() < unlockedData.expiresAt) {
                    setIsUnlocked(true);
                } else {
                    // Expired
                    setIsUnlocked(false);
                    localStorage.removeItem(`unlocked_${storageKey}`);
                }
            } catch (e) {
                setIsUnlocked(false);
            }
        } else {
            setIsUnlocked(false);
        }
        setIsChecking(false);
    }, [storageKey]);

    const handleUnlock = async () => {
        if (credits < cost) {
            toast.error(
                pt ?
                    `Saldo insuficiente. Você precisa de ${cost} ${cost === 1 ? 'crédito' : 'créditos'}.` :
                    `Insufficient balance. You need ${cost} ${cost === 1 ? 'credit' : 'credits'}.`
            );
            return;
        }

        setIsProcessing(true);

        // Spend credit
        const success = await spendCredit(cost, storageKey, `Unlock ${toolName}`);

        setIsProcessing(false);

        if (success) {
            const expiresAt = Date.now() + 12 * 60 * 60 * 1000; // 12 hours
            localStorage.setItem(`unlocked_${storageKey}`, JSON.stringify({ expiresAt }));
            setIsUnlocked(true);
            toast.success(
                pt ? `${toolName} desbloqueado com sucesso!` : `${toolName} unlocked successfully!`
            );
        }
    };

    if (isChecking) return null; // Don't flash locked state

    if (isUnlocked) {
        return <>{children}</>;
    }

    // Locked State UI
    return (
        <div className="relative w-full rounded-2xl border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm">
            {/* Blurred preview background */}
            <div className="absolute inset-0 opacity-20 filter blur-md pointer-events-none select-none overflow-hidden">
                {/* Fake content to blur */}
                <div className="p-8 space-y-6">
                    <div className="h-12 w-1/3 bg-primary/20 rounded animate-pulse" />
                    <div className="grid grid-cols-3 gap-4">
                        <div className="h-48 bg-primary/10 rounded animate-pulse" />
                        <div className="h-48 bg-primary/10 rounded animate-pulse" />
                        <div className="h-48 bg-primary/10 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Paywall Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 shadow-xl shadow-primary/10 border border-primary/20 relative">
                    {toolIcon === 'sniper' ? (
                        <Crosshair className="w-8 h-8 text-primary" />
                    ) : (
                        <Zap className="w-8 h-8 text-primary" />
                    )}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                </div>

                <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                    {toolName} <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase font-bold tracking-wider">PREMIUM</span>
                </h2>

                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
                    {pt
                        ? `Esta é uma ferramenta premium avançada. Desbloqueie o acesso total por 12 horas utilizando seus créditos.`
                        : `This is an advanced premium tool. Unlock full access for 12 hours using your credits.`}
                </p>

                <div className="p-6 rounded-xl bg-muted/30 border border-border/50 max-w-sm w-full backdrop-blur-md">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm font-semibold">{pt ? 'Custo de Acesso' : 'Access Cost'}</span>
                        <div className="flex items-center gap-1.5 font-bold text-lg">
                            <span className="text-primary">💎</span>
                            {cost} {pt ? (cost === 1 ? 'Crédito' : 'Créditos') : (cost === 1 ? 'Credit' : 'Credits')}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6 pt-6 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">{pt ? 'Seu Saldo' : 'Your Balance'}</span>
                        <div className="flex items-center gap-1 text-sm font-semibold">
                            <span className="text-primary/70">💎</span>
                            <span className={credits >= cost ? 'text-foreground' : 'text-red-400'}>
                                {credits}
                            </span>
                        </div>
                    </div>

                    <Button
                        onClick={handleUnlock}
                        disabled={isProcessing}
                        className={cn(
                            "w-full font-bold shadow-lg transition-all",
                            credits >= cost
                                ? "bg-gradient-to-r from-primary to-primary/80 hover:shadow-primary/25 hover:scale-[1.02]"
                                : "bg-muted text-muted-foreground"
                        )}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {pt ? 'Processando...' : 'Processing...'}
                            </span>
                        ) : credits >= cost ? (
                            <span className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                {pt ? 'Desbloquear Acesso' : 'Unlock Access'}
                            </span>
                        ) : (
                            pt ? 'Saldo Insuficiente' : 'Insufficient Balance'
                        )}
                    </Button>

                    {credits < cost && (
                        <Button
                            variant="link"
                            className="w-full mt-2 text-xs text-primary/80 hover:text-primary"
                            onClick={() => navigate('/upgrade')}
                        >
                            {pt ? 'Comprar mais créditos →' : 'Buy more credits →'}
                        </Button>
                    )}
                </div>

                <p className="mt-8 text-[10px] text-muted-foreground/50 max-w-xs">
                    {pt
                        ? 'O acesso permanecerá liberado de forma contínua durante as próximas 12 horas.'
                        : 'Access will remain unlocked continuously for the next 12 hours.'}
                </p>
            </div>
        </div>
    );
};
