import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
    HelpCircle, ChevronDown, ChevronUp, Bot, Sparkles, MessageSquare, ShieldAlert
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export const ChatTutorial = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useLanguage();
    const pt = language === 'pt';

    return (
        <Card className="glass border-primary/20 overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20">
                        <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-sm">
                            {pt ? 'Como conversar com a IA?' : 'How to chat with AI?'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {pt ? 'Dicas para obter as melhores respostas do Guru' : 'Tips to get the best answers from Guru'}
                        </p>
                    </div>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>

            {isOpen && (
                <CardContent className="pt-0 pb-5 space-y-5 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                    <div className="border-t border-border/50" />

                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {pt ? 'O Crypto Guru é uma IA treinada especificamente para análise técnica, métricas on-chain e contexto do mercado de criptomoedas.'
                                : 'Crypto Guru is an AI specifically trained for technical analysis, on-chain metrics, and cryptocurrency market context.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                            <div className="flex items-center gap-2">
                                <Bot className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-sm">{pt ? 'Análises de Tokens' : 'Token Analysis'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {pt ? 'Ex: "Qual a tendência atual do BTC?" ou "O RSI da SOL está sobrecomprado no gráfico de 4h?" A IA acessa os dados em tempo real.'
                                    : 'Ex: "What is the current trend for BTC?" or "Is SOL\'s RSI overbought on the 4h chart?" The AI accesses real-time data.'}
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-info" />
                                <span className="font-semibold text-sm">{pt ? 'Dúvidas e Conceitos' : 'Questions & Concepts'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {pt ? 'Ex: "Como funciona a média móvel (EMA)?" ou "O que significa divergência bullish no MACD?"'
                                    : 'Ex: "How does the moving average (EMA) work?" or "What does bullish divergence on MACD mean?"'}
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-warning" />
                                <span className="font-semibold text-sm">{pt ? 'Ideias de Trade' : 'Trade Ideas'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {pt ? 'Ex: "Procure tokens no Radar com Score acima de 70" ou "Monte uma estratégia de swing trade para ETH."'
                                    : 'Ex: "Look for tokens on Radar with a Score above 70" or "Build a swing trade strategy for ETH."'}
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 space-y-2">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-destructive" />
                                <span className="font-semibold text-sm">{pt ? 'Aviso Importante' : 'Important Notice'}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {pt ? 'O Guru fornece ferramentas educacionais e simulações, não aconselhamento financeiro. Gerencie seus riscos com stop loss.'
                                    : 'Guru provides educational tools and simulations, not financial advice. Manage your risks with stop losses.'}
                            </p>
                        </div>
                    </div>

                </CardContent>
            )}
        </Card>
    );
};
