import React, { useState } from 'react';
import { Bot, ShieldAlert, Rocket, TrendingUp, Zap, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function GemHunterTutorial() {
    const { language } = useLanguage();
    const pt = language === 'pt';
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={cn(
            "mb-6 relative overflow-hidden rounded-2xl border border-primary/20",
            "bg-gradient-to-br from-card to-card/50 backdrop-blur-sm transition-all duration-300"
        )}>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Target className="w-48 h-48 text-primary" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 blur-xl pointer-events-none" />

            <div className="relative">
                {/* Clickable Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full text-left p-6 sm:p-8 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-primary/20">
                            <span className="text-xl">💎</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                {pt ? 'Como caçar Gemas antes da Binance' : 'How to hunt Gems before Binance'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {pt
                                    ? 'O guia definitivo para surfar grandes altas comprando moedas no início.'
                                    : 'The definitive guide to riding massive waves by buying early.'}
                            </p>
                        </div>
                    </div>
                    <div className="shrink-0 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        {isExpanded
                            ? <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            : <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        }
                    </div>
                </button>

                {/* Collapsible Content */}
                <div className={cn(
                    "transition-all duration-300 overflow-hidden",
                    isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                )}>
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* Step 1: Corretoras Menores */}
                            <div className="bg-background/50 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-2 mb-2 text-primary">
                                    <TrendingUp className="w-4 h-4" />
                                    <h3 className="font-semibold text-sm">{pt ? 'Corretoras Tier 2' : 'Tier 2 Exchanges'}</h3>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {pt
                                        ? 'Grandes projetos quase sempre começam em corretoras menores focadas em volume. Mexc, Gate.io e KuCoin são os maiores berçários.'
                                        : 'Major projects almost always start on smaller, volume-focused exchanges. MEXC, Gate.io, and KuCoin are the biggest nurseries.'}
                                </p>
                                <div className="mt-3 pt-3 flex items-center gap-2 text-[10px] font-medium text-emerald-400 border-t border-border/50">
                                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                                    {pt ? 'Risco Médio • Retorno Alto' : 'Medium Risk • High Return'}
                                </div>
                            </div>

                            {/* Step 2: Corretoras Descentralizadas (DEX) */}
                            <div className="bg-background/50 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-2 mb-2 text-primary">
                                    <Zap className="w-4 h-4" />
                                    <h3 className="font-semibold text-sm">{pt ? 'O Início On-Chain' : 'The On-Chain Start'}</h3>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {pt
                                        ? 'Antes mesmo da MEXC, o token nasce na Blockchain (Solana, Base, Ethereum). Compra-se via Raydium ou Uniswap usando carteiras.'
                                        : 'Even before MEXC, tokens are born on-chain (Solana, Base, Ethereum). You buy via Raydium or Uniswap using wallets.'}
                                </p>
                                <div className="mt-3 pt-3 flex items-center gap-2 text-[10px] font-medium text-amber-500 border-t border-border/50">
                                    <ShieldAlert className="w-3 h-3" />
                                    {pt ? 'Risco Alto • Retorno Muito Alto' : 'High Risk • Very High Return'}
                                </div>
                            </div>

                            {/* Step 3: Telegram Bots */}
                            <div className="bg-background/50 rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-2 text-primary">
                                        <Bot className="w-4 h-4" />
                                        <h3 className="font-semibold text-sm">{pt ? 'O Método "Sniper"' : 'The "Sniper" Method'}</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {pt
                                            ? 'Profissionais não usam sites lentos de DEX. Eles usam Trading Bots no Telegram configurados para comprar Frações de segundo após o lançamento.'
                                            : 'Pros don\'t use slow DEX websites. They use Telegram Trading Bots to buy fractions of a second after launch.'}
                                    </p>
                                    <div className="mt-3 pt-3 flex items-center gap-2 text-[10px] font-medium text-primary border-t border-border/50">
                                        <Rocket className="w-3 h-3 text-red-400" />
                                        {pt ? 'Extremo Risco • Retorno Insano' : 'Extreme Risk • Insane Return'}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 flex items-start sm:items-center gap-3">
                            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
                            <p>
                                <strong>{pt ? 'ATENÇÃO:' : 'WARNING:'}</strong> {pt ? 'O mercado de gemas (low-caps e memecoins) foca alto risco. Para cada token que faz 100x, dezenas vão a zero. Jamais invista dinheiro que você não pode perder. Utilize Stop Loss rígido se operar on-chain.' : 'The gems market (low-caps and memecoins) is high risk. For every 100x token, dozens go to zero. Never invest money you cannot afford to lose. Use strict Stop Loss on-chain.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
