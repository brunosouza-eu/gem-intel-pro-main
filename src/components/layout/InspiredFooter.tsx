/**
 * 🕊️ InspiredFooter
 * A sophisticated, heartfelt footer that reflects the project's values
 */

import React from 'react';
import { Heart, Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const InspiredFooter: React.FC<{ className?: string }> = ({ className }) => {
    const year = new Date().getFullYear();
    
    return (
        <footer className={cn("mt-auto py-8 px-6 border-t border-border/40", className)}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Brand & Purpose */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-gradient">💎 Gem Intel Pro</span>
                        <div className="h-4 w-px bg-border mx-1" />
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                            Tecnologia & Propósito
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-xs">
                        Equipando traders com inteligência de elite e valores inabaláveis.
                    </p>
                </div>

                {/* Inspiration Message */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/5 via-primary/5 to-cyan-500/5 border border-border/50 backdrop-blur-sm relative group overflow-hidden">
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        
                        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                        <p className="text-xs font-medium text-foreground/80">
                            Desenvolvido com fé e propósito • Para a honra e glória de Deus
                        </p>
                        <Heart className="w-4 h-4 text-primary fill-primary/20" />
                    </div>
                    
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                        <span className="hover:text-primary transition-colors cursor-pointer">Termos</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="hover:text-primary transition-colors cursor-pointer">Privacidade</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="hover:text-primary transition-colors cursor-pointer">Suporte</span>
                    </div>
                </div>

                {/* Copyright */}
                <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1">
                    <p className="text-xs font-bold text-foreground/70">
                        © {year} Imperium Digital
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        SECURE INFRASTRUCTURE
                    </div>
                </div>
            </div>
            
            {/* Minimalist lower bar */}
            <div className="mt-8 text-center">
                <p className="text-[9px] text-muted-foreground/30 uppercase tracking-[0.4em] font-black">
                    Tudo é Dele, por Ele e para Ele.
                </p>
            </div>
        </footer>
    );
};

export default InspiredFooter;
