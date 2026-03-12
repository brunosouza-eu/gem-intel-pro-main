import React from 'react';
import { AlertHistoryItem } from '@/contexts/AlertContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowUp, ArrowDown, TrendingUp, TrendingDown, Volume2,
    Clock, CheckCircle2, XCircle, Trash2, History
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertTimelineProps {
    history: AlertHistoryItem[];
    onClear: () => void;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
    price_above: <ArrowUp className="w-4 h-4" />,
    price_below: <ArrowDown className="w-4 h-4" />,
    pct_change_up: <TrendingUp className="w-4 h-4" />,
    pct_change_down: <TrendingDown className="w-4 h-4" />,
    volume_spike: <Volume2 className="w-4 h-4" />,
};

const TYPE_LABEL: Record<string, string> = {
    price_above: 'Preço Acima',
    price_below: 'Preço Abaixo',
    pct_change_up: 'Alta %',
    pct_change_down: 'Queda %',
    volume_spike: 'Volume',
};

const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`;
};

export const AlertTimeline: React.FC<AlertTimelineProps> = ({ history, onClear }) => {
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                <div className="p-4 rounded-full bg-muted/30 mb-4">
                    <History className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhum histórico</h3>
                <p className="text-muted-foreground text-center max-w-md text-sm">
                    Quando seus alertas forem disparados, eles aparecerão aqui com todos os detalhes.
                </p>
            </div>
        );
    }

    // Group by date
    const grouped = history.reduce<Record<string, AlertHistoryItem[]>>((acc, item) => {
        const dateKey = new Date(item.triggeredAt).toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
    }, {});

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {history.length} evento{history.length !== 1 ? 's' : ''} registrado{history.length !== 1 ? 's' : ''}
                </p>
                <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive gap-1">
                    <Trash2 className="w-3 h-3" />
                    Limpar
                </Button>
            </div>

            {/* Timeline */}
            {Object.entries(grouped).map(([date, items]) => (
                <div key={date}>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 capitalize">
                        {date}
                    </h4>
                    <div className="relative space-y-3">
                        {/* Timeline line */}
                        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-border via-border/50 to-transparent" />

                        {items.map((item, idx) => (
                            <div key={item.id} className="relative flex gap-4 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                                {/* Timeline dot */}
                                <div className={cn(
                                    "relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    item.success ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                                )}>
                                    {item.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 bg-card/50 border border-border/50 rounded-lg p-3 hover:border-border transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{item.ticker}</span>
                                            <Badge variant="outline" className="text-[10px]">
                                                {TYPE_ICON[item.type]}
                                                <span className="ml-1">{TYPE_LABEL[item.type]}</span>
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[10px]",
                                                    item.priority === 'critical' ? 'text-red-400 bg-red-500/10' :
                                                        item.priority === 'high' ? 'text-orange-400 bg-orange-500/10' :
                                                            item.priority === 'medium' ? 'text-yellow-400 bg-yellow-500/10' :
                                                                'text-blue-400 bg-blue-500/10'
                                                )}
                                            >
                                                {item.priority}
                                            </Badge>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(item.triggeredAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-muted-foreground">
                                            Alvo: <span className="text-primary font-mono">{item.type.includes('pct') ? `${item.targetValue}%` : formatPrice(item.targetValue)}</span>
                                        </span>
                                        <span className="text-muted-foreground">→</span>
                                        <span className="text-muted-foreground">
                                            Disparou em: <span className="text-success font-mono font-bold">{formatPrice(item.triggeredPrice)}</span>
                                        </span>
                                    </div>

                                    {item.note && (
                                        <p className="text-[10px] text-muted-foreground mt-1 italic">📝 {item.note}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
