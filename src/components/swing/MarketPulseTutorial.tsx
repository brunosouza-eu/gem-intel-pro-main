import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    HelpCircle, ChevronDown, ChevronUp, Activity, BarChart3, Zap, ShieldAlert
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export const MarketPulseTutorial = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useLanguage();
    const pt = language === 'pt';

    return (
        <Card className="glass border-primary/20 overflow-hidden mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/20 transition-colors"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-600/20 to-cyan-600/20">
                        <HelpCircle className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-xs">
                            {pt ? 'Como usar o Market Pulse?' : 'How to use Market Pulse?'}
                        </h3>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            {isOpen && (
                <CardContent className="pt-0 pb-3 space-y-4 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                    <div className="border-t border-border/50" />

                    <div className="space-y-2">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {pt ? 'O Pulse avalia a condição MACRO do mercado lendo RSI, EMAs e tendências de todos os tokens simultaneamente.'
                                : 'Pulse evaluates MACRO market conditions by reading RSI, EMAs, and trends of all tokens simultaneously.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/20 border border-border/50">
                            <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-[11px] block">{pt ? 'Painel de Sentimento' : 'Sentiment Panel'}</span>
                                <p className="text-[10px] text-muted-foreground">
                                    {pt ? 'Mede a ganância/medo. Extremo Otimismo (>70) = evite comprar novas posições. Extremo Medo (<30) = procure boas entradas.'
                                        : 'Measures greed/fear. Extreme Optimism (>70) = avoid buying new longs. Extreme Fear (<30) = look for good entries.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/20 border border-border/50">
                            <BarChart3 className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-[11px] block">{pt ? 'Medidor de Força' : 'Strength Meter'}</span>
                                <p className="text-[10px] text-muted-foreground">
                                    {pt ? 'Mostra a % de tokens com força real de alta (acima da média 200). Abaixo de 40% = mercado fragilizado.'
                                        : 'Shows % of tokens with real upward strength (above 200 DMA). Below 40% = fragile market.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold text-[11px] block">{pt ? 'Top Picks & Alertas' : 'Top Picks & Alerts'}</span>
                                <p className="text-[10px] text-muted-foreground">
                                    {pt ? 'A IA destaca os setups mais "quentes" do momento. Sempre clique e verifique o contexto no gráfico R:R (Risco:Retorno).'
                                        : 'AI highlights the "hottest" setups. Always click and verify context in the R:R chart.'}
                                </p>
                            </div>
                        </div>
                    </div>

                </CardContent>
            )}
        </Card>
    );
};
