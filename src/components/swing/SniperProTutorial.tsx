import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    HelpCircle, ChevronDown, ChevronUp, Zap, Target, Crosshair, TrendingUp,
    Calculator, AlertTriangle, Shield, CheckCircle2, Pin, Brain, Activity, BarChart3, Layers
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export const SniperProTutorial = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useLanguage();
    const isPt = language === 'pt';

    return (
        <Card className="glass border-primary/20 overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-red-600/20 to-orange-600/20">
                        <HelpCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-sm">
                            {isPt ? 'Como usar o Sniper Pro?' : 'How to use Sniper Pro?'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {isPt ? 'Tutorial rápido — Modos, Sinais e Calculadora Inteligente' : 'Quick tutorial — Modes, Signals & Smart Calculator'}
                        </p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>

            {isOpen && (
                <CardContent className="pt-0 pb-5 space-y-5 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                    <div className="border-t border-border/50" />

                    {/* Section 1: How Signals Work */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Brain className="w-3.5 h-3.5 text-purple-400" />
                            {isPt ? 'Como o Sinal é Gerado ?' : 'How is the Signal Generated?'}
                        </h4>
                        <div className="grid gap-3">
                            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/20 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-purple-400">1</span>
                                    </div>
                                    <span className="font-semibold text-sm">{isPt ? 'Coleta de Dados (Binance API)' : 'Data Collection (Binance API)'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed pl-9">
                                    {isPt
                                        ? '200 candles de 4h são buscados para cada token. A partir deles, 16 indicadores técnicos são calculados: EMA(21,50,200), RSI, MACD, ATR, Supertrend, Ichimoku, Estocástico, ADX/DI, Volume, Fibonacci, Suporte/Resistência.'
                                        : '200 4h candles are fetched per token. From these, 16 technical indicators are calculated: EMA(21,50,200), RSI, MACD, ATR, Supertrend, Ichimoku, Stochastic, ADX/DI, Volume, Fibonacci, Support/Resistance.'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/20 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-blue-400">2</span>
                                    </div>
                                    <span className="font-semibold text-sm">{isPt ? 'Análise Inteligente' : 'Smart Analysis'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed pl-9">
                                    {isPt
                                        ? 'O motor detecta setups (Pullback EMA, RSI Sobrevenda, MACD Cross, Breakout, etc.), conta confluências com pesos, e calcula o plano de trade (Entry, SL, TP1, TP2) baseado no ATR — tudo adaptado ao modo selecionado.'
                                        : 'The engine detects setups (Pullback EMA, RSI Oversold, MACD Cross, Breakout, etc.), counts weighted confluences, and calculates the trade plan (Entry, SL, TP1, TP2) based on ATR — all adapted to the selected mode.'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 border border-cyan-500/20 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-cyan-400">3</span>
                                    </div>
                                    <span className="font-semibold text-sm">{isPt ? 'Classificação do Sinal' : 'Signal Classification'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed pl-9">
                                    {isPt
                                        ? 'Com base nas confluências e R:R, o sinal recebe um nível: ELITE (muitas confluências + R:R alto), FORTE, MODERADO, ou AGUARDAR. O contexto do BTC é usado como filtro de segurança.'
                                        : 'Based on confluences and R:R, the signal receives a level: ELITE (many confluences + high R:R), FORTE, MODERADO, or AGUARDAR. BTC context is used as a safety filter.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Modes */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-red-500" />
                            {isPt ? 'Modos de Operação (Diferenças Reais)' : 'Trading Modes (Real Differences)'}
                        </h4>
                        <div className="grid md:grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-muted/20 border border-primary/30 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    <span className="font-semibold text-sm">Sniper</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground">SL: 1.0× ATR ({isPt ? 'apertado' : 'tight'})</p>
                                    <p className="text-[10px] text-muted-foreground">TP: 3.0× {isPt ? 'do risco' : 'of risk'} (R:R ≥ 3:1)</p>
                                    <p className="text-[10px] text-muted-foreground">ELITE: ≥8 {isPt ? 'confluências' : 'confluences'}</p>
                                </div>
                                <p className="text-[10px] text-amber-400 font-medium">
                                    {isPt ? '→ Poucas entradas, alta precisão' : '→ Few entries, high precision'}
                                </p>
                            </div>

                            <div className="p-3 rounded-lg bg-muted/20 border border-warning/30 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-warning" />
                                    <span className="font-semibold text-sm">Day Trade</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground">SL: 1.5× ATR ({isPt ? 'médio' : 'medium'})</p>
                                    <p className="text-[10px] text-muted-foreground">TP: 2.0× {isPt ? 'do risco' : 'of risk'} (R:R ≥ 2:1)</p>
                                    <p className="text-[10px] text-muted-foreground">ELITE: ≥7 {isPt ? 'confluências' : 'confluences'}</p>
                                </div>
                                <p className="text-[10px] text-amber-400 font-medium">
                                    {isPt ? '→ Momentum + volume intraday' : '→ Intraday momentum + volume'}
                                </p>
                            </div>

                            <div className="p-3 rounded-lg bg-muted/20 border border-emerald-500/30 space-y-2">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    <span className="font-semibold text-sm">Swing</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground">SL: 2.5× ATR ({isPt ? 'largo' : 'wide'})</p>
                                    <p className="text-[10px] text-muted-foreground">TP: 1.5× {isPt ? 'do risco' : 'of risk'} (R:R ≥ 1.5:1)</p>
                                    <p className="text-[10px] text-muted-foreground">ELITE: ≥6 {isPt ? 'confluências' : 'confluences'}</p>
                                </div>
                                <p className="text-[10px] text-amber-400 font-medium">
                                    {isPt ? '→ Tendências macro, holds de dias' : '→ Macro trends, multi-day holds'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Reading the Cards */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            {isPt ? 'Entendendo os Cards' : 'Understanding the Cards'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                                <div className="p-1.5 rounded bg-amber-500/10 shrink-0">
                                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">{isPt ? 'Grau (A+ a D)' : 'Grade (A+ to D)'}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {isPt
                                            ? 'Baseado no score de confluências ponderadas. A+: ≥90, A: ≥75, B+: ≥60'
                                            : 'Based on weighted confluence score. A+: ≥90, A: ≥75, B+: ≥60'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                                <div className="p-1.5 rounded bg-red-500/10 shrink-0">
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">{isPt ? 'Warnings' : 'Warnings'}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {isPt
                                            ? 'Alertas automáticos: RSI sobrecomprado, volume baixo, BTC em queda, ADX fraco'
                                            : 'Auto alerts: RSI overbought, low volume, BTC declining, weak ADX'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                                <div className="p-1.5 rounded bg-primary/10 shrink-0">
                                    <Pin className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">{isPt ? 'Fixar Token' : 'Pin Token'}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {isPt ? 'Fixe tokens para mantê-los no topo independente dos filtros' : 'Pin tokens to keep them at the top regardless of filters'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                                <div className="p-1.5 rounded bg-cyan-500/10 shrink-0">
                                    <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">{isPt ? 'Calculadora de Lucro' : 'Profit Calculator'}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {isPt ? 'Simule seu retorno com base no SL/TP do sinal e seu capital' : 'Simulate your return based on the signal SL/TP and your capital'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Indicator Breakdown */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-blue-400" />
                            {isPt ? 'Indicadores Utilizados (16)' : 'Indicators Used (16)'}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                                { name: 'EMA 21/50/200', weight: isPt ? 'Tendência' : 'Trend' },
                                { name: 'RSI (14)', weight: isPt ? 'Sobre/Venda' : 'Over/Sold' },
                                { name: 'MACD', weight: 'Momentum' },
                                { name: 'ATR (14)', weight: 'SL/TP' },
                                { name: 'Supertrend', weight: isPt ? 'Direção' : 'Direction' },
                                { name: 'Ichimoku', weight: isPt ? 'Nuvem' : 'Cloud' },
                                { name: isPt ? 'Estocástico' : 'Stochastic', weight: isPt ? 'Reversão' : 'Reversal' },
                                { name: 'ADX/DI±', weight: isPt ? 'Força' : 'Strength' },
                                { name: 'Volume', weight: isPt ? 'Pressão' : 'Pressure' },
                                { name: 'Fibonacci', weight: isPt ? 'Zonas' : 'Zones' },
                                { name: isPt ? 'Suporte' : 'Support', weight: isPt ? 'Demanda' : 'Demand' },
                                { name: isPt ? 'Resistência' : 'Resistance', weight: isPt ? 'Oferta' : 'Supply' },
                            ].map((ind, i) => (
                                <div key={i} className="p-2 rounded bg-muted/20 border border-border/30 text-center">
                                    <p className="text-[10px] font-semibold">{ind.name}</p>
                                    <p className="text-[9px] text-muted-foreground">{ind.weight}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </CardContent>
            )}
        </Card>
    );
};
