import React from 'react';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface BetaLockedGateProps {
    toolName: string;
    toolDescription: { pt: string; en: string };
    features: { icon: React.ElementType; label: { pt: string; en: string } }[];
    gradient?: string;
}

export const BetaLockedGate: React.FC<BetaLockedGateProps> = ({
    toolName,
    toolDescription,
    features,
    gradient = 'from-amber-400 via-orange-400 to-red-400',
}) => {
    const { language } = useLanguage();
    const pt = language === 'pt';

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
            {/* Animated Lock + BETA Badge */}
            <div className="relative mb-8">
                {/* Outer glow pulses */}
                <div className="absolute inset-0 w-36 h-36 -m-2 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/20 blur-2xl animate-pulse" />
                <div className="absolute inset-0 w-36 h-36 -m-2 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />

                {/* Lock circle */}
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-amber-500/30 flex items-center justify-center shadow-2xl">
                    <Lock className="w-14 h-14 text-amber-400" />
                </div>

                {/* BETA badge overlay */}
                <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[11px] font-black tracking-wider shadow-lg shadow-amber-500/30 animate-bounce" style={{ animationDuration: '2s' }}>
                    BETA
                </div>
            </div>

            {/* Title */}
            <h1 className={cn('text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r', gradient)}>
                {toolName}
            </h1>

            {/* Beta description */}
            <div className="mb-3">
                <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 gap-1.5 px-3 py-1 text-xs">
                    <Sparkles className="w-3 h-3" />
                    {pt ? 'Versão Beta — Acesso Restrito' : 'Beta Version — Restricted Access'}
                </Badge>
            </div>

            <p className="text-lg text-muted-foreground max-w-md mb-2">
                {pt ? toolDescription.pt : toolDescription.en}
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-sm mb-8">
                {pt
                    ? 'Esta ferramenta está em fase de testes. Em breve será liberada para todos os membros. Aguarde o lançamento oficial!'
                    : 'This tool is in testing phase. It will be available to all members soon. Stay tuned for the official launch!'}
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mb-8">
                {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-card/50 border border-border/30 hover:border-amber-500/20 transition-colors">
                        <f.icon className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-xs text-muted-foreground">{pt ? f.label.pt : f.label.en}</span>
                    </div>
                ))}
            </div>

            {/* Coming soon badge */}
            <Badge variant="outline" className="border-amber-500/40 text-amber-400 px-4 py-2 text-sm gap-2">
                <Crown className="w-4 h-4" />
                {pt ? '🚀 Em breve para todos' : '🚀 Coming soon for everyone'}
            </Badge>

            {/* Subtle footer */}
            <p className="text-[10px] text-muted-foreground/40 mt-6 max-w-xs">
                {pt
                    ? 'Apenas administradores têm acesso durante a fase beta.'
                    : 'Only administrators have access during the beta phase.'}
            </p>
        </div>
    );
};
