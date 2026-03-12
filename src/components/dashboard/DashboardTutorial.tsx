import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    HelpCircle, ChevronDown, ChevronUp, BarChart3, Activity,
    Zap, Target, Bell, MessageCircle, Radar, Sparkles, TrendingUp,
    Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export const DashboardTutorial: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useLanguage();
    const pt = language === 'pt';

    return (
        <Card className="glass border-primary/20 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-600/20">
                        <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-sm">
                            {pt ? 'Como usar o Dashboard?' : 'How to use the Dashboard?'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {pt ? 'Guia completo — seções, dados e navegação' : 'Complete guide — sections, data and navigation'}
                        </p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>

            {isOpen && (
                <CardContent className="pt-0 pb-5 space-y-5 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                    <div className="border-t border-border/50" />

                    {/* Section 1: Overview */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <BarChart3 className="w-3.5 h-3.5 text-primary" />
                            {pt ? 'Visão Geral' : 'Overview'}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {pt
                                ? 'O Dashboard é o seu centro de comando. Ele reúne todos os dados essenciais do mercado cripto em um único lugar: preços ao vivo, sentimento do mercado, top gainers/losers e acesso rápido a todas as ferramentas.'
                                : 'The Dashboard is your command center. It brings together all essential crypto market data in one place: live prices, market sentiment, top gainers/losers and quick access to all tools.'}
                        </p>
                    </div>

                    {/* Section 2: Sections explained */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-cyan-400" />
                            {pt ? 'Seções do Dashboard' : 'Dashboard Sections'}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-amber-400" />
                                    <span className="font-semibold text-xs">{pt ? 'BTC ao Vivo' : 'Live BTC'}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    {pt
                                        ? 'Preço do Bitcoin atualizado em tempo real via WebSocket direto da Binance. O badge mostra a variação de 24 horas.'
                                        : 'Bitcoin price updated in real-time via WebSocket from Binance. Badge shows 24h change.'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <Gauge className="w-4 h-4 text-red-400" />
                                    <span className="font-semibold text-xs">Fear & Greed Index</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    {pt
                                        ? 'Índice real do mercado cripto (API alternative.me) de 0 a 100. Valores baixos = Medo (possível hora de comprar). Valores altos = Ganância (possível correção).'
                                        : 'Real crypto market index (alternative.me API) from 0 to 100. Low = Fear (potential buy). High = Greed (potential correction).'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-cyan-400" />
                                    <span className="font-semibold text-xs">{pt ? 'Visão do Mercado' : 'Market Overview'}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    {pt
                                        ? 'Os top tokens com maiores variações nas últimas 24h. Preços ao vivo via WebSocket. Clique em qualquer moeda para abrir no Trade Master.'
                                        : 'Top tokens with the biggest 24h changes. Live prices via WebSocket. Click any coin to open in Trade Master.'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-primary" />
                                    <span className="font-semibold text-xs">{pt ? 'Estatísticas Rápidas' : 'Quick Stats'}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    {pt
                                        ? 'Total de tokens monitorados, ratio Bull/Bear (quantos estão subindo vs caindo), top gainer e top loser do dia.'
                                        : 'Total tracked tokens, Bull/Bear ratio (how many rising vs falling), top gainer and top loser of the day.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Navigation */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            {pt ? 'Acesso Rápido' : 'Quick Access'}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                                { icon: <Target className="w-3.5 h-3.5 text-violet-400" />, label: 'Trade Master', desc: pt ? 'Análise técnica' : 'Technical analysis' },
                                { icon: <Radar className="w-3.5 h-3.5 text-cyan-400" />, label: 'Radar', desc: pt ? 'Scanner de oportunidades' : 'Opportunity scanner' },
                                { icon: <Bell className="w-3.5 h-3.5 text-amber-400" />, label: pt ? 'Alertas' : 'Alerts', desc: pt ? 'Alertas de preço' : 'Price alerts' },
                                { icon: <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />, label: 'Chat IA', desc: pt ? 'Assistente IA' : 'AI Assistant' },
                            ].map(item => (
                                <div key={item.label} className="p-2 rounded-lg bg-muted/20 border border-border/30 text-center">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">{item.icon}<span className="text-[11px] font-semibold">{item.label}</span></div>
                                    <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Tips */}
                    <div className="space-y-2 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-cyan-600/5 border border-primary/10">
                        <h4 className="text-xs font-bold flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            {pt ? 'Dicas' : 'Tips'}
                        </h4>
                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold shrink-0">•</span>
                                <span>{pt ? 'Todos os preços são atualizados em tempo real via WebSocket direto da Binance' : 'All prices update in real-time via Binance WebSocket'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold shrink-0">•</span>
                                <span>{pt ? 'O Índice Fear & Greed é puxado da API pública alternative.me, o mesmo utilizado pela Binance' : 'Fear & Greed Index comes from alternative.me public API, same used by Binance'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold shrink-0">•</span>
                                <span>{pt ? 'Clique em qualquer token na "Visão do Mercado" para abrir sua análise completa no Trade Master' : 'Click any token in "Market Overview" to open its full analysis in Trade Master'}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold shrink-0">•</span>
                                <span>{pt ? 'Use os 4 cards de Acesso Rápido para navegar direto para as ferramentas' : 'Use the 4 Quick Access cards to navigate directly to tools'}</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};
