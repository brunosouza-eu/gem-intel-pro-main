/**
 * ✨ InspiredCard — Daily Word of Wisdom
 * A beautiful, glowing card that provides inspiration and reflection
 */

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Quote, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const WISDOM_WORDS = [
    {
        verse: "Pois eu bem sei os planos que tenho para vocês, planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.",
        ref: "Jeremias 29:11",
        category: "Providência"
    },
    {
        verse: "O que ganha o seu pão com a mão preguiçosa empobrece; mas a mão dos diligentes enriquece.",
        ref: "Provérbios 10:4",
        category: "Diligência"
    },
    {
        verse: "Consagre ao Senhor tudo o que você faz, e os seus planos serão bem-sucedidos.",
        ref: "Provérbios 16:3",
        category: "Propósito"
    },
    {
        verse: "Tudo o que fizerem, façam de todo o coração, como para o Senhor, e não para os homens.",
        ref: "Colossenses 3:23",
        category: "Excelência"
    },
    {
        verse: "O Senhor é o meu pastor; de nada terei falta.",
        ref: "Salmos 23:1",
        category: "Confiança"
    },
    {
        verse: "Pedir e lhes será dado; busquem e encontrarão; batam e a porta será aberta para vocês.",
        ref: "Mateus 7:7",
        category: "Fé"
    },
    {
        verse: "Conserva o teu caminho longe da preguiça, e a diligência te fará prosperar.",
        ref: "Provérbios 12:24",
        category: "Trabalho"
    },
    {
        verse: "O coração do homem traça o seu caminho, mas o Senhor lhe dirige os passos.",
        ref: "Provérbios 16:9",
        category: "Direção"
    },
    {
        verse: "Não fomos chamados para o medo, mas para o poder, o amor e o equilíbrio.",
        ref: "2 Timóteo 1:7",
        category: "Coragem"
    }
];

export const InspiredCard: React.FC<{ className?: string }> = ({ className }) => {
    // Select word based on date to keep it "Daily"
    const dailyWord = useMemo(() => {
        const day = new Date().getDate();
        const month = new Date().getMonth();
        const index = (day + month) % WISDOM_WORDS.length;
        return WISDOM_WORDS[index];
    }, []);

    return (
        <Card className={cn(
            "relative overflow-hidden border-none bg-gradient-to-br from-amber-500/10 via-background to-orange-500/5 glass",
            "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)]",
            className
        )}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-16 h-16 text-amber-500 animate-pulse" />
            </div>
            
            <CardContent className="relative p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20 shrink-0">
                        <Quote className="w-5 h-5 text-black" />
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80">
                                Reflexão do Dia
                            </span>
                            <div className="h-px w-8 bg-amber-500/30" />
                        </div>
                        
                        <blockquote className="text-base sm:text-lg font-medium leading-relaxed text-foreground/90 italic">
                            "{dailyWord.verse}"
                        </blockquote>
                        
                        <div className="flex items-center justify-between pt-2">
                            <cite className="not-italic text-sm font-bold text-amber-500">
                                — {dailyWord.ref}
                            </cite>
                            
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-amber-500 uppercase">
                                    {dailyWord.category}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            
            {/* Subtle bottom light effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        </Card>
    );
};

export default InspiredCard;
