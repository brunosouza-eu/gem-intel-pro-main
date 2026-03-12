import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Brain, Loader2, Sparkles, TrendingUp, TrendingDown, AlertTriangle, Target, Coins } from 'lucide-react';
import { SwingAnalysis } from '@/hooks/useSwingAnalysis';
import CryptoLogo from './CryptoLogo';
import { useCreditGuard } from '@/hooks/useCreditGuard';
import { UpgradeModal } from '@/components/monetization';

interface GuruPanelProps {
  analyses: SwingAnalysis[];
  onSelectToken?: (ticker: string) => void;
}

interface GuruRecommendation {
  ticker: string;
  action: 'buy' | 'sell' | 'avoid';
  confidence: number;
  entry: number;
  reason: string;
}

interface GuruAnalysis {
  recommendations: GuruRecommendation[];
  marketContext: string;
  topPick: string;
}

const GuruPanel: React.FC<GuruPanelProps> = ({ analyses, onSelectToken }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [guruAnalysis, setGuruAnalysis] = useState<GuruAnalysis | null>(null);
  const { checkAndUse, showUpgradeModal, closeModal, creditsAvailable, guardModals } = useCreditGuard();

  const GURU_COST = 3;

  const askGuru = async () => {
    if (analyses.length === 0) {
      toast({
        title: language === 'pt' ? 'Sem dados' : 'No data',
        description: language === 'pt'
          ? 'Execute a análise primeiro'
          : 'Run analysis first',
        variant: 'destructive',
      });
      return;
    }

    // Check credits BEFORE calling Edge Function
    const canProceed = await checkAndUse('use_guru');
    if (!canProceed) {
      // useCreditGuard already shows the upgrade modal
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crypto-guru', {
        body: { analyses },
      });

      if (error) {
        // Handle 402 error from backend (double-check)
        if (error.message?.includes('402') || error.message?.includes('Créditos insuficientes')) {
          toast({
            title: language === 'pt' ? '💳 Créditos Insuficientes' : '💳 Insufficient Credits',
            description: language === 'pt'
              ? `Você precisa de ${GURU_COST} créditos para usar o Guru`
              : `You need ${GURU_COST} credits to use Guru`,
            variant: 'destructive',
          });
          return;
        }
        throw error;
      }

      setGuruAnalysis(data);

      toast({
        title: '🧠 GURU Analysis Complete',
        description: language === 'pt'
          ? 'Recomendações atualizadas!'
          : 'Recommendations updated!',
      });
    } catch (error: any) {
      console.error('Guru error:', error);
      toast({
        title: language === 'pt' ? 'Erro do GURU' : 'GURU Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'sell': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'border-success/50 bg-success/10';
      case 'sell': return 'border-destructive/50 bg-destructive/10';
      default: return 'border-amber-500/50 bg-amber-500/10';
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-primary/30 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/20 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold flex items-center gap-2">
                CRYPTO GURU
                <span className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary">
                  AI-Powered
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === 'pt'
                  ? 'Análise inteligente do mercado'
                  : 'Intelligent market analysis'}
              </p>
            </div>
          </div>
          <Button
            onClick={askGuru}
            disabled={isLoading || creditsAvailable < GURU_COST}
            size="sm"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : creditsAvailable < GURU_COST ? (
              <>
                <Coins className="w-4 h-4 mr-1" />
                {language === 'pt' ? 'Sem créditos' : 'No credits'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1" />
                {language === 'pt' ? `Consultar (${GURU_COST})` : `Ask (${GURU_COST})`}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Credit Guard Modals (Upgrade + Confirm) */}
      {guardModals}

      {/* Content */}
      <div className="p-4">
        {!guruAnalysis && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              {language === 'pt'
                ? 'Clique em "Consultar" para obter recomendações do GURU'
                : 'Click "Ask" to get GURU recommendations'}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {language === 'pt'
                ? 'Analisando mercado...'
                : 'Analyzing market...'}
            </p>
          </div>
        )}

        {guruAnalysis && !isLoading && (
          <div className="space-y-4">
            {/* Top Pick */}
            {guruAnalysis.topPick && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">
                    {language === 'pt' ? 'MELHOR OPORTUNIDADE' : 'TOP PICK'}
                  </span>
                </div>
                <p className="text-lg font-bold mt-1">{guruAnalysis.topPick}</p>
              </div>
            )}

            {/* Recommendations */}
            <div className="space-y-2">
              {guruAnalysis.recommendations?.slice(0, 5).map((rec, index) => (
                <button
                  key={index}
                  onClick={() => onSelectToken?.(rec.ticker)}
                  className={`w-full p-3 rounded-lg border transition-all hover:scale-[1.02] ${getActionColor(rec.action)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CryptoLogo symbol={rec.ticker} size={28} />
                      <div className="text-left">
                        <p className="font-semibold">{rec.ticker}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {rec.reason}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getActionIcon(rec.action)}
                      <div className="text-right">
                        <span className="text-xs font-bold">
                          {rec.confidence}%
                        </span>
                        {rec.entry > 0 && (
                          <p className="text-xs text-muted-foreground">
                            ${rec.entry.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Market Context */}
            {guruAnalysis.marketContext && (
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-xs text-muted-foreground mb-1">
                  {language === 'pt' ? 'Contexto do Mercado' : 'Market Context'}
                </p>
                <p>{guruAnalysis.marketContext}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuruPanel;
