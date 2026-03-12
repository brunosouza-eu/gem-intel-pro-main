import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target, TrendingUp, Zap, Rocket, DollarSign, ArrowUpRight } from 'lucide-react';

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  minScore: number;
  minRR: number;
  icon: React.ReactNode;
}

const STRATEGIES: TradingStrategy[] = [
  {
    id: 'swing_pro',
    name: 'Swing Trade Pro',
    description: 'Estratégia equilibrada com EMAs + Ichimoku + Volume',
    timeframe: '4h',
    minScore: 60,
    minRR: 2.0,
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: 'scalping',
    name: 'Scalping Agressivo',
    description: 'Trades rápidos com RSI + MACD + Momentum',
    timeframe: '1h',
    minScore: 45,
    minRR: 1.5,
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: 'hold',
    name: 'Hold Position',
    description: 'Posições de longo prazo baseadas em tendência',
    timeframe: '1d',
    minScore: 75,
    minRR: 3.0,
    icon: <Target className="w-4 h-4" />,
  },
  {
    id: 'meme_hunter',
    name: 'Memecoin Hunter',
    description: 'Caça de memecoins com volume e momentum',
    timeframe: '1h',
    minScore: 50,
    minRR: 2.0,
    icon: <Rocket className="w-4 h-4" />,
  },
  {
    id: 'dca',
    name: 'DCA Inteligente',
    description: 'Acumulação em zonas de suporte e Fibonacci',
    timeframe: '1d',
    minScore: 70,
    minRR: 2.5,
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    id: 'breakout',
    name: 'Breakout Trader',
    description: 'Rompimentos de estrutura com volume confirmado',
    timeframe: '4h',
    minScore: 65,
    minRR: 2.0,
    icon: <ArrowUpRight className="w-4 h-4" />,
  },
];

interface StrategySelectorProps {
  selectedStrategy: TradingStrategy;
  onStrategyChange: (strategy: TradingStrategy) => void;
  customMinScore?: number;
  onMinScoreChange?: (value: number) => void;
}

const StrategySelector: React.FC<StrategySelectorProps> = ({
  selectedStrategy,
  onStrategyChange,
  customMinScore,
  onMinScoreChange,
}) => {
  const { language } = useLanguage();
  const minScore = customMinScore ?? selectedStrategy.minScore;

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          {language === 'pt' ? 'Estratégia de Trading' : 'Trading Strategy'}
        </h3>
      </div>

      <Select 
        value={selectedStrategy.id} 
        onValueChange={(value) => {
          const strategy = STRATEGIES.find(s => s.id === value);
          if (strategy) onStrategyChange(strategy);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STRATEGIES.map(strategy => (
            <SelectItem key={strategy.id} value={strategy.id}>
              <div className="flex items-center gap-2">
                {strategy.icon}
                <span>{strategy.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Strategy Details */}
      <div className="p-3 rounded-lg bg-muted/50 space-y-2">
        <p className="text-sm text-muted-foreground">{selectedStrategy.description}</p>
        <div className="flex gap-4 text-xs">
          <span className="text-primary">⏱ {selectedStrategy.timeframe.toUpperCase()}</span>
          <span className="text-success">📊 Min: {selectedStrategy.minScore}%</span>
          <span className="text-amber-400">🎯 R:R {selectedStrategy.minRR}:1</span>
        </div>
      </div>

      {/* Min Score Slider */}
      {onMinScoreChange && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {language === 'pt' ? 'Score Mínimo' : 'Minimum Score'}
            </span>
            <span className="font-bold text-primary">{minScore}%</span>
          </div>
          <Slider
            value={[minScore]}
            onValueChange={(value) => onMinScoreChange(value[0])}
            min={30}
            max={90}
            step={5}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export { STRATEGIES };
export default StrategySelector;
