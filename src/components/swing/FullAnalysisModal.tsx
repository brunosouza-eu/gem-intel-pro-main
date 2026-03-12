import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, BarChart3, Copy, Check, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeToken } from '@/lib/swingAnalysisService';
import { generateNarrativeAnalysis, type AnalysisData } from '@/lib/narrativeAnalysis';

interface FullAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticker: string;
}

const FullAnalysisModal: React.FC<FullAnalysisModalProps> = ({
  isOpen,
  onClose,
  ticker,
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [narrativeText, setNarrativeText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      toast({
        title: language === 'pt' ? '🔄 Analisando...' : '🔄 Analyzing...',
        description: language === 'pt'
          ? `Buscando dados históricos de ${ticker}...`
          : `Fetching historical data for ${ticker}...`,
      });

      // Fetch and analyze directly from Binance
      const analysis = await analyzeToken(ticker, '4h');

      // Convert to AnalysisData format
      const analysisData: AnalysisData = {
        ticker: analysis.ticker,
        timeframe: analysis.timeframe,
        currentPrice: analysis.currentPrice,
        change24h: analysis.change24h,
        ema21: analysis.ema21,
        ema50: analysis.ema50,
        ema100: analysis.ema100,
        ema200: analysis.ema200,
        rsi: analysis.rsi,
        adx: analysis.adx,
        diPlus: analysis.diPlus,
        diMinus: analysis.diMinus,
        macdLine: analysis.macdLine,
        macdSignal: analysis.macdSignal,
        macdHistogram: analysis.macdHistogram,
        stochK: analysis.stochK,
        stochD: analysis.stochD,
        atr: analysis.atr,
        tenkan: analysis.tenkan,
        kijun: analysis.kijun,
        senkouA: analysis.senkouA,
        senkouB: analysis.senkouB,
        cloudPosition: analysis.cloudPosition,
        supertrendDirection: analysis.supertrendDirection,
        supertrendValue: analysis.supertrendValue,
        volumeRatio: analysis.volumeRatio,
        buyPressure: analysis.buyPressure,
        keySupport: analysis.keySupport,
        keyResistance: analysis.keyResistance,
        fib236: analysis.fib236,
        fib382: analysis.fib382,
        fib500: analysis.fib500,
        fib618: analysis.fib618,
        fib786: analysis.fib786,
        fibZone: analysis.fibZone,
        buyScore: analysis.buyScore,
        sellScore: analysis.sellScore,
        signal: analysis.signal,
        stopLoss: analysis.stopLoss,
        takeProfit: analysis.takeProfit,
        riskReward: analysis.riskReward,
        htfTrend: analysis.htfTrend,
        mtfTrend: analysis.mtfTrend,
        patternsDetected: analysis.patternsDetected,
      };

      // Generate narrative analysis
      const narrative = generateNarrativeAnalysis(analysisData);
      setNarrativeText(narrative);

      toast({
        title: language === 'pt' ? '✅ Análise Completa!' : '✅ Analysis Complete!',
        description: language === 'pt'
          ? '15+ indicadores analisados'
          : '15+ indicators analyzed',
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        language === 'pt'
          ? `Erro ao analisar ${ticker}. Verifique se o par existe na Binance.`
          : `Error analyzing ${ticker}. Check if the pair exists on Binance.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && ticker && !narrativeText) {
      runAnalysis();
    }
  }, [isOpen, ticker]);

  const handleCopy = async () => {
    if (narrativeText) {
      await navigator.clipboard.writeText(narrativeText);
      setCopied(true);
      toast({
        title: language === 'pt' ? 'Copiado!' : 'Copied!',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (narrativeText) {
      const blob = new Blob([narrativeText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analise-${ticker}-${new Date().toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleClose = () => {
    setNarrativeText(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b border-border bg-gradient-to-r from-primary/20 to-info/20">
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>
              {language === 'pt' ? 'ANÁLISE TÉCNICA COMPLETA' : 'COMPLETE TECHNICAL ANALYSIS'}
            </span>
            <span className="text-primary font-bold">{ticker}/USDT</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
              </div>
              <h3 className="text-lg font-semibold mt-6">
                {language === 'pt' ? 'Analisando gráfico...' : 'Analyzing chart...'}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
                {language === 'pt'
                  ? 'Buscando dados históricos da Binance e calculando 15+ indicadores técnicos. Isso pode levar alguns segundos.'
                  : 'Fetching historical data from Binance and calculating 15+ technical indicators. This may take a few seconds.'}
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="text-destructive text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-destructive">{error}</h3>
              <Button onClick={runAnalysis} className="mt-4">
                {language === 'pt' ? 'Tentar novamente' : 'Try again'}
              </Button>
            </div>
          ) : narrativeText ? (
            <>
              {/* Action buttons */}
              <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/30">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {language === 'pt' ? 'Copiar' : 'Copy'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  {language === 'pt' ? 'Baixar' : 'Download'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runAnalysis}
                  className="gap-2 ml-auto"
                  disabled={isLoading}
                >
                  <RefreshCw className="w-4 h-4" />
                  {language === 'pt' ? 'Atualizar' : 'Refresh'}
                </Button>
              </div>

              {/* Analysis content with enhanced formatting */}
              <ScrollArea className="h-[calc(90vh-180px)]">
                <div className="p-6 sm:p-8">
                  <div className="prose prose-invert max-w-none
                    /* Global spacing */
                    [&>*]:mb-6
                    
                    /* H1 - Main title with gradient underline */
                    [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-primary 
                    [&>h1]:border-b-2 [&>h1]:border-primary/50 [&>h1]:pb-4 [&>h1]:mb-8
                    
                    /* H2 - Section headers with left accent */
                    [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-info
                    [&>h2]:border-l-4 [&>h2]:border-info [&>h2]:pl-4 [&>h2]:py-2
                    [&>h2]:bg-info/10 [&>h2]:rounded-r-lg [&>h2]:mb-6 [&>h2]:mt-10
                    
                    /* H3 - Subsection headers */
                    [&>h3]:text-lg [&>h3]:font-medium [&>h3]:text-success
                    [&>h3]:mb-4 [&>h3]:mt-6 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-2
                    
                    /* Paragraphs */
                    [&>p]:text-muted-foreground [&>p]:leading-7 [&>p]:mb-4
                    
                    /* Strong/Bold text - Primary color */
                    [&_strong]:text-primary [&_strong]:font-bold
                    
                    /* Blockquotes */
                    [&>blockquote]:border-l-4 [&>blockquote]:border-warning
                    [&>blockquote]:bg-warning/10 [&>blockquote]:pl-4 [&>blockquote]:py-3
                    [&>blockquote]:rounded-r-lg [&>blockquote]:my-6
                    [&>blockquote]:text-warning [&>blockquote]:italic
                    
                    /* Unordered lists */
                    [&>ul]:space-y-3 [&>ul]:my-4 [&>ul]:ml-4
                    [&>ul>li]:text-muted-foreground [&>ul>li]:leading-relaxed
                    [&>ul>li]:pl-2 [&>ul>li]:border-l-2 [&>ul>li]:border-primary/30
                    
                    /* Ordered lists */
                    [&>ol]:space-y-3 [&>ol]:my-4 [&>ol]:ml-4
                    [&>ol>li]:text-muted-foreground [&>ol>li]:leading-relaxed
                    
                    /* Horizontal rules */
                    [&>hr]:border-border [&>hr]:my-10 [&>hr]:border-t-2
                  ">
                    <ReactMarkdown>{narrativeText}</ReactMarkdown>
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <BarChart3 className="w-16 h-16 text-primary mb-6" />
              <h3 className="text-lg font-semibold mb-2">
                {language === 'pt' ? 'Análise Técnica Profissional' : 'Professional Technical Analysis'}
              </h3>
              <Button
                onClick={runAnalysis}
                className="bg-gradient-to-r from-primary to-info hover:opacity-90 gap-2"
                size="lg"
              >
                <BarChart3 className="w-5 h-5" />
                {language === 'pt' ? 'Gerar Análise' : 'Generate Analysis'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullAnalysisModal;