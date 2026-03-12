import React, { useEffect, useRef, useState } from 'react';
import { Download, MonitorSmartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Extensão simples pra propriedade non-standard
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

const InstallPWAButton: React.FC<{ className?: string, variant?: 'icon' | 'full' }> = ({ className, variant = 'full' }) => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Checa se já tá instalado
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      toast.success("App instalado com sucesso!");
    });

    return () => window.removeEventListener('transitionend', handler);
  }, []);

  const onClick = async () => {
    if (!promptInstall) {
      toast.info("Para instalar o app, toque em 'Compartilhar' no Safari (iOS) ou 'Adicionar à Tela Inicial' no Chrome (Android).");
      return;
    }
    
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    
    if (outcome === 'accepted') {
       toast.success("Iniciando instalação...");
    }
  };

  // Se já tiver instalado, não precisamos lotar a UI
  if (isInstalled) return null;

  if (variant === 'icon') {
      return (
         <button 
           onClick={onClick}
           className={cn("p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all group", className)}
           title="Baixar App PWA"
         >
           <MonitorSmartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
         </button>
      )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 text-sm font-semibold bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 text-white/80 hover:text-emerald-400 px-4 py-2 rounded-xl transition-all",
        className
      )}
    >
      <Download className="w-4 h-4" />
      <span>Baixar App</span>
    </button>
  );
};

export default InstallPWAButton;
