import React from 'react';
import { cn } from '@/lib/utils';

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. 'emerald', 'amber', 'cyan'
}

/**
 * GlowingCard
 * Efeito visual super premium de borda gradiente rotativa (Referência Print 2).
 * Ideal para destacar áreas de alto valor (como o AutoPilot ou Planos).
 */
const GlowingCard: React.FC<GlowingCardProps> = ({ 
    children, 
    className,
    glowColor = 'emerald'
}) => {
  
  // Mapeia as cores pra facilitar uso com Tailwind
  const colorMap: Record<string, string> = {
      'emerald': 'from-emerald-500 via-cyan-500 to-emerald-500',
      'amber': 'from-amber-500 via-yellow-500 to-amber-500',
      'purple': 'from-purple-500 via-pink-500 to-purple-500',
      'cyan': 'from-cyan-500 via-blue-500 to-cyan-500',
  };

  const gradientClasses = colorMap[glowColor] || colorMap['emerald'];

  return (
    <div className={cn("relative group rounded-[2rem] overflow-hidden p-[2px]", className)}>
        
        {/* CSS para animação da borda iluminada circulando */}
        <style dangerouslySetInnerHTML={{__html: `
            @keyframes border-spin {
                100% { transform: rotate(360deg); }
            }
            .animate-border-spin {
                animation: border-spin 4s linear infinite;
            }
        `}} />

        {/* Fundo escuro fixo do card real pra cobrir o miolo */}
        <div className="absolute inset-[2px] bg-[#0A0F1C] rounded-[calc(2rem-2px)] z-0" />
        
        {/* Gradiente Giratório (A Borda Animada) */}
        <div className="absolute inset-0 z-[-1] overflow-hidden mask-border bg-[#0A0F1C]">
            <div className={cn(
                "absolute -inset-[100%] mx-auto w-full aspect-square bg-[conic-gradient(from_0deg,var(--tw-gradient-stops))]",
                gradientClasses,
                "animate-border-spin opacity-40 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]"
            )} />
        </div>

        {/* Glow de Sombra Exterior Suave */}
        <div className={cn(
            "absolute inset-0 z-[-2] rounded-[2rem] bg-gradient-to-r blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500",
            gradientClasses
        )} />

        {/* Conteúdo Real do Card */}
        <div className="relative z-10 w-full h-full bg-[#0A0F1C]/80 backdrop-blur-xl rounded-[calc(2rem-2px)] overflow-hidden">
            {children}
        </div>
    </div>
  );
};

export default GlowingCard;
