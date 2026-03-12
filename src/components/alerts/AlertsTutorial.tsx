import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    HelpCircle, ChevronDown, ChevronUp, Bell, Bot, Target,
    Volume2, Shield, Zap, TrendingUp, Sparkles, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const AlertsTutorial: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className="glass border-primary/20 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-blue-600/20">
                        <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-sm">Como Funcionam os Alertas?</h3>
                        <p className="text-xs text-muted-foreground">Tutorial completo — tipos, notificações e alertas IA</p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>

            {isOpen && (
                <CardContent className="pt-0 pb-5 space-y-5 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                    {/* Divider */}
                    <div className="border-t border-border/50" />

                    {/* Section 1: Two types */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-primary" />
                            Dois Tipos de Alertas
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                            {/* Custom Alerts */}
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-primary" />
                                    <span className="font-semibold text-sm">Alertas Personalizados</span>
                                    <Badge variant="outline" className="text-[10px]">1 crédito</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Você define o token, o tipo de alerta e o valor alvo. O sistema monitora os preços em tempo real e dispara quando o alvo é atingido.
                                </p>
                                <div className="space-y-1.5 mt-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <TrendingUp className="w-3 h-3 text-success" />
                                        <span><strong>Preço Acima/Abaixo</strong> — dispara quando atinge o valor</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <Target className="w-3 h-3 text-blue-400" />
                                        <span><strong>Variação %</strong> — dispara quando sobe/cai X%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <Volume2 className="w-3 h-3 text-amber-400" />
                                        <span><strong>Spike de Volume</strong> — detecta picos anormais</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Alerts */}
                            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-blue-400" />
                                    <span className="font-semibold text-sm">Alertas IA</span>
                                    <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">5 créditos</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    A IA analisa o token usando dados em tempo real da Binance (preço, volume, variação 24h) e gera um alerta estruturado de trading.
                                </p>
                                <div className="space-y-1.5 mt-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <Target className="w-3 h-3 text-success" />
                                        <span><strong>Zona de Entrada</strong> — faixa ideal para compra</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <Shield className="w-3 h-3 text-red-400" />
                                        <span><strong>Stop Loss</strong> — limite de perda máxima</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <Sparkles className="w-3 h-3 text-primary" />
                                        <span><strong>Alvos (T1-T3)</strong> — níveis de lucro progressivos</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                                        <span><strong>R:R</strong> — relação risco/retorno do setup</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Notifications */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                            Sistema de Notificações
                        </h4>
                        <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                            <p className="text-xs text-muted-foreground mb-3">
                                Quando um alerta personalizado é disparado, você recebe <strong>3 tipos de notificação</strong>:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex items-start gap-2">
                                    <div className="p-1.5 rounded bg-blue-500/10 shrink-0">
                                        <Bell className="w-3.5 h-3.5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold">Push Notification</p>
                                        <p className="text-[10px] text-muted-foreground">Alerta do navegador (mesmo com a aba minimizada)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="p-1.5 rounded bg-primary/10 shrink-0">
                                        <Volume2 className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold">Som + Voz</p>
                                        <p className="text-[10px] text-muted-foreground">Beep sonoro (todos) + voz em português (Alta/Crítica)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="p-1.5 rounded bg-amber-500/10 shrink-0">
                                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold">Toast In-App</p>
                                        <p className="text-[10px] text-muted-foreground">Aviso na tela com preço atingido e cor da prioridade</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Priority */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-red-400" />
                            Níveis de Prioridade
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                                { label: 'Baixa', color: 'bg-blue-600', desc: '1 beep suave' },
                                { label: 'Média', color: 'bg-primary', desc: '2 beeps curtos' },
                                { label: 'Alta', color: 'bg-orange-600', desc: '3 beeps + voz' },
                                { label: 'Crítica', color: 'bg-red-600', desc: '4 beeps urgentes + voz' },
                            ].map(p => (
                                <div key={p.label} className="p-2 rounded-lg bg-muted/20 border border-border/30 text-center">
                                    <Badge className={cn("text-[10px] mb-1", p.color, "text-white border-none")}>{p.label}</Badge>
                                    <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Quick tips */}
                    <div className="space-y-2 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-blue-600/5 border border-primary/10">
                        <h4 className="text-xs font-bold flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            Dicas Rápidas
                        </h4>
                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold shrink-0">•</span>
                                <span>Use os <strong>Presets Rápidos</strong> (Pump, Dump, Breakout, Suporte) para criar alertas com 1 clique</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold shrink-0">•</span>
                                <span>Ative <strong>Alerta Recorrente</strong> para ser notificado múltiplas vezes (cooldown de 1 min)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold shrink-0">•</span>
                                <span>Alertas IA usam <strong>dados reais da Binance</strong> para definir zona de entrada, stop e alvos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold shrink-0">•</span>
                                <span>Permita <strong>notificações do navegador</strong> para receber alertas mesmo com a aba minimizada</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};
