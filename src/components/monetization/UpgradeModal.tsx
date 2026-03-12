/**
 * 👑 UPGRADE MODAL
 * Full-screen modal to encourage VIP upgrade
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGamification } from '@/contexts/GamificationContext';
import { getTimeUntilReset } from '@/lib/planService';
import {
    X, Crown, Zap, Clock, AlertTriangle,
    CheckCircle, Sparkles, TrendingUp, Shield,
    MessageSquare, Bell, FileText, BarChart3, Layers
} from 'lucide-react';

// Hotmart checkout URL — replace with your actual product link
const HOTMART_ELITE_URL = 'https://pay.hotmart.com/SEU_PRODUTO_ELITE_MENSAL';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    reason?: 'insufficient_credits' | 'vip_only' | 'daily_limit' | string;
    creditsNeeded?: number;
    feature?: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
    isOpen,
    onClose,
    reason = 'insufficient_credits',
    creditsNeeded = 0,
    feature,
}) => {
    const { language } = useLanguage();
    const { profile } = useGamification();
    const timeUntilReset = getTimeUntilReset();
    const isPt = language === 'pt';
    const isEs = language === 'es';

    if (!isOpen) return null;

    // Localized text helper
    const txt = (pt: string, en: string, es: string) => {
        if (isPt) return pt;
        if (isEs) return es;
        return en;
    };

    // Localized pricing
    const priceDisplay = isPt ? 'R$ 97' : '$19';
    const priceOldDisplay = isPt ? 'R$ 147' : '$29';
    const periodDisplay = txt('/mês', '/mo', '/mes');

    const features = [
        { icon: Zap, text: txt('Créditos Ilimitados', 'Unlimited Credits', 'Créditos Ilimitados') },
        { icon: MessageSquare, text: txt('Crypto Guru sem limites', 'Unlimited Crypto Guru', 'Crypto Guru sin límites') },
        { icon: BarChart3, text: txt('Trade Master completo', 'Full Trade Master', 'Trade Master completo') },
        { icon: Layers, text: txt('Curso Trade Master incluso', 'Trade Master Course included', 'Curso Trade Master incluido') },
        { icon: Bell, text: txt('Alertas ilimitados', 'Unlimited Alerts', 'Alertas ilimitados') },
        { icon: FileText, text: txt('Exportar relatórios PDF', 'Export PDF Reports', 'Exportar informes PDF') },
        { icon: TrendingUp, text: txt('Histórico completo', 'Full History', 'Historial completo') },
        { icon: Shield, text: txt('Suporte prioritário', 'Priority Support', 'Soporte prioritario') },
        { icon: Crown, text: txt('Badge VIP exclusiva', 'Exclusive VIP Badge', 'Insignia VIP exclusiva') },
    ];

    const getTitle = () => {
        if (reason === 'vip_only') {
            return txt('Recurso Exclusivo VIP', 'VIP Exclusive Feature', 'Recurso Exclusivo VIP');
        }
        if (reason === 'daily_limit') {
            return txt('Limite Diário Atingido', 'Daily Limit Reached', 'Límite Diario Alcanzado');
        }
        return txt('Seus Créditos Acabaram', 'You\'re Out of Credits', 'Sin Créditos');
    };

    const getSubtitle = () => {
        if (reason === 'vip_only') {
            return txt(
                'Este recurso está disponível apenas para membros VIP',
                'This feature is only available for VIP members',
                'Este recurso solo está disponible para miembros VIP'
            );
        }
        return txt(
            `Você precisa de ${creditsNeeded} créditos para usar esta função`,
            `You need ${creditsNeeded} credits to use this feature`,
            `Necesitas ${creditsNeeded} créditos para usar esta función`
        );
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={cn(
                'relative z-10 w-full max-w-md rounded-2xl overflow-hidden',
                'bg-gradient-to-br from-card via-card to-primary/5',
                'border border-primary/30 shadow-2xl shadow-primary/20',
                'animate-in zoom-in-95 duration-300'
            )}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header with icon */}
                <div className="pt-8 pb-4 px-6 text-center">
                    <div className={cn(
                        'inline-flex items-center justify-center w-20 h-20 mb-4',
                        'rounded-full',
                        reason === 'vip_only'
                            ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20'
                            : 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
                    )}>
                        {reason === 'vip_only' ? (
                            <Crown className="w-10 h-10 text-amber-400" />
                        ) : (
                            <AlertTriangle className="w-10 h-10 text-red-400" />
                        )}
                    </div>

                    <h2 className="text-2xl font-bold mb-2">{getTitle()}</h2>
                    <p className="text-muted-foreground">{getSubtitle()}</p>

                    {/* Time until reset (only for credit issues) */}
                    {reason !== 'vip_only' && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>
                                {txt('Renovação em:', 'Resets in:', 'Renueva en:')} {timeUntilReset.formatted}
                            </span>
                        </div>
                    )}
                </div>

                {/* VIP Features */}
                <div className="px-6 pb-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
                        <div className="flex items-center gap-2 mb-3">
                            <Crown className="w-5 h-5 text-amber-400" />
                            <span className="font-bold text-amber-400">
                                {txt('Seja VIP e tenha:', 'Go VIP and get:', '¡Hazte VIP y obtén:')}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {features.map((feat, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                                    <span className="text-foreground/80">{feat.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="px-6 pb-6">
                    <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-muted-foreground line-through text-lg">{priceOldDisplay}</span>
                            <span className="text-3xl font-bold text-foreground">{priceDisplay}</span>
                            <span className="text-muted-foreground">{periodDisplay}</span>
                        </div>
                        <p className="text-sm text-green-400 mt-1">
                            <Sparkles className="w-4 h-4 inline mr-1" />
                            {txt('34% de desconto!', '34% discount!', '¡34% de descuento!')}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => {
                            window.open(HOTMART_ELITE_URL, '_blank');
                        }}
                        className={cn(
                            'w-full py-4 rounded-xl font-bold text-lg',
                            'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500',
                            'text-black shadow-lg shadow-amber-500/30',
                            'hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02]',
                            'active:scale-[0.98] transition-all duration-200',
                            'flex items-center justify-center gap-2'
                        )}
                    >
                        <Crown className="w-5 h-5" />
                        {txt('QUERO SER VIP AGORA', 'BECOME VIP NOW', '¡QUIERO SER VIP AHORA!')}
                    </button>

                    {/* Skip option */}
                    <button
                        onClick={onClose}
                        className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {txt('Continuar com plano grátis', 'Continue with free plan', 'Continuar con plan gratis')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
