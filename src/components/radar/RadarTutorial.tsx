import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    HelpCircle, ChevronDown, ChevronUp, Eye, TrendingUp, Target, Rocket, BarChart3
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export const RadarTutorial = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <Card className="glass border-primary/20 overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-blue-600/20">
                        <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-sm">
                            {t('howRadarWorks')}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {t('radarTutorialDesc')}
                        </p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>

            {isOpen && (
                <CardContent className="pt-0 pb-5 space-y-5 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                    <div className="border-t border-border/50" />

                    {/* Section 1: Intro */}
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t('radarMonitorDesc')}
                        </p>
                    </div>

                    {/* Section 2: Phases */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <BarChart3 className="w-3.5 h-3.5 text-primary" />
                            {t('cyclePhases')}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                            {/* Watching */}
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-info" />
                                    <span className="font-semibold text-sm">{t('watchingScore')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {t('watchingDesc')}
                                </p>
                            </div>

                            {/* Accumulation */}
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-purple-400" />
                                    <span className="font-semibold text-sm">{t('accumulationScore')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {t('accumulationDesc')}
                                </p>
                            </div>

                            {/* Trigger Ready */}
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-warning" />
                                    <span className="font-semibold text-sm">{t('triggerScore')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {t('triggerDesc')}
                                </p>
                            </div>

                            {/* In Progress */}
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Rocket className="w-4 h-4 text-success" />
                                    <span className="font-semibold text-sm">{t('inProgressScore')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {t('inProgressDesc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: How Score Works */}
                    <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-blue-600/5 border border-primary/10 space-y-2">
                            <h4 className="text-xs font-bold flex items-center gap-2">
                                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                                {t('howScoreWorks')}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {t('howScoreWorksDesc')}
                            </p>
                        </div>
                    </div>

                </CardContent>
            )}
        </Card>
    );
};
