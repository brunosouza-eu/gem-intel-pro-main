import React from 'react';
import { cn } from '@/lib/utils';
import { Radar, Bot, Crosshair, Brain, Bell, LineChart, Target, Flame, CircleDot } from 'lucide-react';

const TOOLS = [
  { icon: Radar, label: 'Radar', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { icon: Crosshair, label: 'Sniper', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  { icon: Bot, label: 'AutoPilot', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { icon: Brain, label: 'Oráculo', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { icon: LineChart, label: 'Trade Master', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { icon: Bell, label: 'Alertas', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { icon: CircleDot, label: 'Bubble Gem', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { icon: Flame, label: 'Gem Hunter', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
];

/**
 * FloatingTools
 * Cria a esteira de ícones "flutuantes" animada estilo Sine Wave (referência Print 1)
 */
const FloatingTools: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("relative w-full max-w-5xl mx-auto py-12 pb-20 overflow-visible", className)}>
        
      {/* CSS customizado apenas para essa animação de levitação (onda) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
        .animate-wave-float {
             animation: custom-float 4s ease-in-out infinite;
        }
      `}} />

      <div className="flex flex-wrap sm:flex-nowrap justify-center gap-4 sm:gap-6 lg:gap-8 px-4">
        {TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          // Offset the animation to create a wave effect
          const delay = `${i * 0.4}s`;
          
          return (
            <div 
              key={tool.label}
              className="group relative flex flex-col items-center gap-3 animate-wave-float"
              style={{ animationDelay: delay }}
            >
              {/* Glass Circle */}
              <div className={cn(
                "relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full border backdrop-blur-md transition-all duration-300",
                "bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.08] shadow-lg",
                // tool.border, tool.bg // Use se quiser colorido, mas branco fosco é mais parecido com a ref
              )}>
                 <Icon className={cn("w-6 h-6 sm:w-7 sm:h-7 opacity-70 group-hover:opacity-100 transition-opacity", tool.color)} />
                 
                 {/* Glow no hover */}
                 <div className={cn("absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity", tool.bg)} />
              </div>
              
              {/* Tooltip super sutil (opcional) */}
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 text-[11px] font-bold tracking-wider text-white/50 uppercase transition-all translate-y-2 group-hover:translate-y-0 text-center whitespace-nowrap">
                  {tool.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingTools;
