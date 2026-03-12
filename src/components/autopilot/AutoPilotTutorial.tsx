/**
 * 🤖 AutoPilot Bot Tutorial
 * In-app collapsible tutorial explaining how to use the AutoPilot Bot
 * Follows the same pattern as SniperProTutorial, TradeMasterTutorial, etc.
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    HelpCircle, ChevronDown, ChevronUp, Bot, Target, Crosshair,
    TrendingUp, BarChart3, AlertTriangle, Shield, CheckCircle2,
    Play, Pause, Settings, Zap, Eye, Wallet, DollarSign,
    Activity, Award, Flame, ArrowRight, Lock, Crown, Sparkles
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export const AutoPilotTutorial = () => {
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
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-600/20 to-orange-600/20">
                        <HelpCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-sm">
                            {isPt ? '📖 Como usar o AutoPilot Bot' : '📖 How to use AutoPilot Bot'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {isPt
                                ? 'Guia completo: Paper Trading, Estratégias, Gestão de Risco e Configurações'
                                : 'Complete guide: Paper Trading, Strategies, Risk Management and Settings'}
                        </p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>

            {isOpen && (
                <CardContent className="pt-0 pb-5 space-y-6 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                    <div className="border-t border-border/50" />

                    {/* ─── Section 1: O que é o AutoPilot ─── */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Bot className="w-3.5 h-3.5 text-amber-400" />
                            {isPt ? 'O que é o AutoPilot Bot?' : 'What is AutoPilot Bot?'}
                        </h4>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {isPt
                                    ? 'O AutoPilot Bot é um robô de trading inteligente que executa operações automaticamente baseado nos sinais do Sniper Pro e outras estratégias. Atualmente funciona em modo Paper Trading (simulação com dinheiro virtual de $10.000), permitindo testar e validar estratégias antes de usar dinheiro real.'
                                    : 'AutoPilot Bot is an intelligent trading robot that automatically executes trades based on Sniper Pro signals and other strategies. Currently it works in Paper Trading mode (simulation with $10,000 virtual money), allowing you to test and validate strategies before using real money.'}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400">
                                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                                    {isPt ? 'Sem risco real' : 'No real risk'}
                                </Badge>
                                <Badge variant="outline" className="text-[9px] border-blue-500/30 text-blue-400">
                                    <Activity className="w-2.5 h-2.5 mr-1" />
                                    {isPt ? 'Dinheiro virtual' : 'Virtual money'}
                                </Badge>
                                <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-400">
                                    <Crown className="w-2.5 h-2.5 mr-1" />
                                    {isPt ? 'Exclusivo Master VIP' : 'Master VIP Exclusive'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* ─── Section 2: Começando ─── */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Play className="w-3.5 h-3.5 text-emerald-400" />
                            {isPt ? 'Primeiros Passos — Como Começar' : 'Getting Started'}
                        </h4>
                        <div className="space-y-2">
                            {[
                                {
                                    step: '1',
                                    icon: Eye,
                                    title: isPt ? 'Explore os Trades Demo' : 'Explore Demo Trades',
                                    desc: isPt
                                        ? 'Ao acessar pela primeira vez, você verá 5 trades de demonstração (BTC, ETH, SOL, AVAX, LINK) com resultados simulados para entender como funciona.'
                                        : 'On first access, you\'ll see 5 demo trades (BTC, ETH, SOL, AVAX, LINK) with simulated results to understand how it works.',
                                    color: 'text-blue-400',
                                    bg: 'bg-blue-500/10',
                                },
                                {
                                    step: '2',
                                    icon: Settings,
                                    title: isPt ? 'Configure sua Estratégia' : 'Configure your Strategy',
                                    desc: isPt
                                        ? 'Vá na aba "Estratégia" e escolha entre Sniper Follow (segue sinais), DCA Smart (compra em quedas) ou Grid Adaptive (lucra em mercados laterais). Ajuste o score mínimo do Sniper (75 é recomendado).'
                                        : 'Go to "Strategy" tab and choose between Sniper Follow, DCA Smart, or Grid Adaptive. Adjust the minimum Sniper score (75 is recommended).',
                                    color: 'text-purple-400',
                                    bg: 'bg-purple-500/10',
                                },
                                {
                                    step: '3',
                                    icon: Shield,
                                    title: isPt ? 'Ajuste a Gestão de Risco' : 'Adjust Risk Management',
                                    desc: isPt
                                        ? 'Na aba "Risco", defina: tamanho da posição (3% recomendado), stop loss (2.5%), take profit (7.5%) e ative o trailing stop. Observe o resumo de risco no final para garantir que está confortável.'
                                        : 'In the "Risk" tab, set: position size (3% recommended), stop loss (2.5%), take profit (7.5%) and enable trailing stop.',
                                    color: 'text-red-400',
                                    bg: 'bg-red-500/10',
                                },
                                {
                                    step: '4',
                                    icon: Play,
                                    title: isPt ? 'Inicie o Bot' : 'Start the Bot',
                                    desc: isPt
                                        ? 'Clique no botão verde "▶ Iniciar" no canto superior direito. O status mudará para "🟢 Rodando" e o bot começará a monitorar sinais. Clique "⏸ Pausar" a qualquer momento para parar.'
                                        : 'Click the green "▶ Start" button in the top right. Status will change to "🟢 Running" and the bot will start monitoring signals.',
                                    color: 'text-emerald-400',
                                    bg: 'bg-emerald-500/10',
                                },
                            ].map((item) => (
                                <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                                    <div className={cn('flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-xs font-bold', item.bg, item.color)}>
                                        {item.step}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold flex items-center gap-1.5">
                                            <item.icon className={cn('w-3.5 h-3.5', item.color)} />
                                            {item.title}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── Section 3: As 3 Estratégias ─── */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Crosshair className="w-3.5 h-3.5 text-blue-400" />
                            {isPt ? 'As 3 Estratégias' : 'The 3 Strategies'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Crosshair className="w-4 h-4 text-blue-400" />
                                    <span className="font-semibold text-sm">Sniper Follow</span>
                                    <Badge className="bg-blue-500/20 text-blue-400 text-[8px] border-0">
                                        {isPt ? 'Recomendado' : 'Recommended'}
                                    </Badge>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    {isPt
                                        ? 'Segue automaticamente os sinais STRONG BUY/SELL do Sniper Pro. Quando o Sniper detecta um setup com score alto, o bot abre a posição com SL/TP automático baseado no sinal original.'
                                        : 'Automatically follows Sniper Pro STRONG BUY/SELL signals. When Sniper detects a high-score setup, the bot opens a position with automatic SL/TP based on the original signal.'}
                                </p>
                                <div className="flex items-center gap-1 text-[9px] text-blue-400">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    {isPt ? 'Melhor para iniciantes' : 'Best for beginners'}
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                    <span className="font-semibold text-sm">DCA Smart</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    {isPt
                                        ? 'Dollar Cost Average inteligente: compra automaticamente em quedas significativas e vende quando o preço sobe com trailing stop. Ideal para acumular posições em ativos que você acredita no longo prazo.'
                                        : 'Smart Dollar Cost Average: automatically buys on significant dips and sells when price rises with trailing stop. Ideal for accumulating positions in assets you believe in long-term.'}
                                </p>
                                <div className="flex items-center gap-1 text-[9px] text-emerald-400">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    {isPt ? 'Ideal para longo prazo' : 'Ideal for long-term'}
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-purple-400" />
                                    <span className="font-semibold text-sm">Grid Adaptive</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    {isPt
                                        ? 'Cria uma grade de ordens de compra e venda em intervalos definidos pelo ATR e Fibonacci. Lucra com as oscilações naturais do preço. Funciona mesmo em mercados sem tendência definida (lateralizados).'
                                        : 'Creates a grid of buy/sell orders at intervals defined by ATR and Fibonacci. Profits from natural price oscillations. Works even in sideways markets.'}
                                </p>
                                <div className="flex items-center gap-1 text-[9px] text-purple-400">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    {isPt ? 'Bom em mercados laterais' : 'Good in sideways markets'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Section 4: Gestão de Risco ─── */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-red-400" />
                            {isPt ? 'Gestão de Risco — Proteja Seu Capital' : 'Risk Management — Protect Your Capital'}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                                <div className="p-1.5 rounded bg-red-500/10 shrink-0">
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">Stop Loss (SL)</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {isPt
                                            ? 'Define a perda máxima por trade. Se o preço cair X%, o bot fecha automaticamente para proteger seu capital. Recomendado: 2-3%.'
                                            : 'Sets the maximum loss per trade. If price drops X%, the bot closes automatically. Recommended: 2-3%.'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                                <div className="p-1.5 rounded bg-emerald-500/10 shrink-0">
                                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">Take Profit (TP)</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {isPt
                                            ? 'Define o alvo de lucro. Quando o preço subir X%, o bot fecha automaticamente realizando o lucro. Recomendado: 5-10% (R:R de 1:3).'
                                            : 'Sets the profit target. When price rises X%, the bot closes automatically. Recommended: 5-10% (1:3 R:R).'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                                <div className="p-1.5 rounded bg-blue-500/10 shrink-0">
                                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">Trailing Stop</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {isPt
                                            ? 'Move o stop loss automaticamente conforme o preço sobe, garantindo que você capture o máximo do movimento sem perder os lucros já obtidos.'
                                            : 'Automatically moves stop loss as price rises, ensuring you capture the maximum move without losing profits already made.'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                                <div className="p-1.5 rounded bg-amber-500/10 shrink-0">
                                    <Wallet className="w-3.5 h-3.5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold">{isPt ? 'Tamanho da Posição' : 'Position Size'}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {isPt
                                            ? 'Define quanto do seu capital será usado por trade. 3% significa que cada trade usa no máximo $300 de $10.000. NUNCA coloque mais de 5% por trade!'
                                            : 'Defines how much capital per trade. 3% means each trade uses max $300 of $10,000. NEVER risk more than 5% per trade!'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Section 5: Entendendo as Stats ─── */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                            {isPt ? 'Entendendo o Dashboard de Performance' : 'Understanding the Performance Dashboard'}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                                {
                                    icon: Wallet, label: isPt ? 'SALDO' : 'BALANCE',
                                    desc: isPt ? 'Capital atual = Inicio + P&L' : 'Current capital = Start + P&L',
                                    color: 'text-emerald-400',
                                },
                                {
                                    icon: DollarSign, label: 'P&L',
                                    desc: isPt ? 'Lucro ou prejuízo total acumulado' : 'Total accumulated profit or loss',
                                    color: 'text-emerald-400',
                                },
                                {
                                    icon: Award, label: 'WIN RATE',
                                    desc: isPt ? '% de trades que deram lucro. Bom: acima de 55%' : '% of profitable trades. Good: above 55%',
                                    color: 'text-blue-400',
                                },
                                {
                                    icon: Flame, label: isPt ? 'MELHOR TRADE' : 'BEST TRADE',
                                    desc: isPt ? 'Maior % de lucro em um único trade' : 'Highest % profit in a single trade',
                                    color: 'text-amber-400',
                                },
                                {
                                    icon: Activity, label: 'DRAWDOWN',
                                    desc: isPt ? 'Queda máxima do pico. Bom: abaixo de 10%' : 'Max decline from peak. Good: below 10%',
                                    color: 'text-red-400',
                                },
                                {
                                    icon: BarChart3, label: 'PROFIT FACTOR',
                                    desc: isPt ? 'Lucro bruto ÷ Perda bruta. Bom: acima de 1.5' : 'Gross profit ÷ Gross loss. Good: above 1.5',
                                    color: 'text-purple-400',
                                },
                            ].map((stat, i) => (
                                <div key={i} className="p-2.5 rounded-lg bg-muted/20 border border-border/50">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <stat.icon className={cn('w-3 h-3', stat.color)} />
                                        <span className="text-[9px] font-bold uppercase">{stat.label}</span>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground leading-relaxed">{stat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─── Section 6: Dicas ─── */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            {isPt ? 'Dicas de Ouro' : 'Golden Tips'}
                        </h4>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-500/20 space-y-2">
                            {[
                                isPt ? '🎯 Comece com Paper Trading e só passe para Live quando tiver Win Rate > 60% em pelo menos 50 trades' : '🎯 Start with Paper Trading and only go Live when Win Rate > 60% in at least 50 trades',
                                isPt ? '🛡️ NUNCA arrisque mais de 3% do capital por trade — preservar capital é mais importante que lucrar' : '🛡️ NEVER risk more than 3% per trade — preserving capital is more important than profiting',
                                isPt ? '📊 R:R mínimo de 1:2.5 — se seu SL é 2%, seu TP deve ser no mínimo 5%' : '📊 Minimum 1:2.5 R:R — if your SL is 2%, your TP should be at least 5%',
                                isPt ? '⏰ Deixe o bot rodar por pelo menos 7 dias antes de avaliar resultados — alguns dias são ruins para qualquer estratégia' : '⏰ Let the bot run for at least 7 days before evaluating — some days are bad for any strategy',
                                isPt ? '🔄 Use "Resetar Demo" para começar do zero se quiser testar uma nova configuração' : '🔄 Use "Reset Demo" to start fresh if you want to test a new configuration',
                                isPt ? '📱 As configurações são salvas automaticamente no seu navegador' : '📱 Settings are automatically saved in your browser',
                            ].map((tip, i) => (
                                <p key={i} className="text-[10px] text-muted-foreground/90 leading-relaxed">{tip}</p>
                            ))}
                        </div>
                    </div>

                    {/* ─── Section 7: Aviso Legal ─── */}
                    <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[10px] font-semibold text-red-400 mb-0.5">
                                {isPt ? '⚠️ Aviso Importante' : '⚠️ Important Notice'}
                            </p>
                            <p className="text-[9px] text-muted-foreground leading-relaxed">
                                {isPt
                                    ? 'Nenhum bot de trading garante lucros. O mercado de criptomoedas é extremamente volátil e pode causar perdas significativas. O AutoPilot é uma ferramenta de auxílio — a responsabilidade final é sempre sua. Use gestão de risco adequada e só invista o que pode perder.'
                                    : 'No trading bot guarantees profits. The cryptocurrency market is extremely volatile. AutoPilot is an assistance tool — final responsibility is always yours. Use proper risk management and only invest what you can afford to lose.'}
                            </p>
                        </div>
                    </div>

                </CardContent>
            )}
        </Card>
    );
};

export default AutoPilotTutorial;
