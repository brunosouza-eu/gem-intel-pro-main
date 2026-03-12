import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    HelpCircle, ChevronDown, ChevronUp, Zap, LineChart, Activity,
    Target, Brain, Info
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export const TradeMasterTutorial = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <Card className="glass border-primary/20 overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-warning/20 to-primary/20">
                        <HelpCircle className="w-5 h-5 text-warning" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-sm">
                            {t('howToUseTM')}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {t('tmTutorialDesc')}
                        </p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>

            {isOpen && (
                <CardContent className="pt-0 pb-5 space-y-5 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                    <div className="border-t border-border/50" />

                    {/* Section 1: Dashboard */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-warning" />
                            {t('yourCommandCenter')}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <LineChart className="w-4 h-4 text-success" />
                                    <span className="font-semibold text-sm">{t('interactiveChart')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {t('interactiveChartDesc')}
                                </p>
                            </div>

                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-info" />
                                    <span className="font-semibold text-sm">{t('tokenTable')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {t('tokenTableDesc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Indicators */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-purple-400" />
                            {t('mainIndicators')}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                                <div className="p-1.5 rounded bg-primary/10 shrink-0">
                                    <Target className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">RSI</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {t('rsiDesc')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                                <div className="p-1.5 rounded bg-success/10 shrink-0">
                                    <LineChart className="w-3.5 h-3.5 text-success" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">MACD</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {t('macdDesc')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                                <div className="p-1.5 rounded bg-warning/10 shrink-0">
                                    <Target className="w-3.5 h-3.5 text-warning" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">{t('supportResistance')}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {t('supportDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Guru */}
                    <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-2">
                            <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-blue-400" />
                                <span className="font-semibold text-sm">Crypto Guru (IA)</span>
                                <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">Premium</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {t('guruDesc')}
                            </p>
                        </div>
                    </div>

                </CardContent>
            )}
        </Card>
    );
};
