import React, { useMemo } from 'react';
import { CryptoAlert, AlertPriority } from '@/contexts/AlertContext';
import { useRealtimePrices } from '@/lib/realtimeService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    ArrowUp, ArrowDown, Percent, Volume2,
    Trash2, Bell, BellOff, Clock, Target,
    TrendingUp, TrendingDown, Repeat, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AlertCardProps {
    alert: CryptoAlert;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const PRIORITY_CONFIG: Record<AlertPriority, { color: string; border: string; bg: string; label: string }> = {
    low: { color: 'text-blue-400', border: 'border-l-blue-500', bg: 'bg-blue-500/10', label: 'Baixa' },
    medium: { color: 'text-yellow-400', border: 'border-l-yellow-500', bg: 'bg-yellow-500/10', label: 'Média' },
    high: { color: 'text-orange-400', border: 'border-l-orange-500', bg: 'bg-orange-500/10', label: 'Alta' },
    critical: { color: 'text-red-400', border: 'border-l-red-500', bg: 'bg-red-500/10', label: 'Crítica' },
};

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; colorClass: string }> = {
    price_above: { icon: <ArrowUp className="w-4 h-4" />, label: 'Preço Acima', colorClass: 'text-success' },
    price_below: { icon: <ArrowDown className="w-4 h-4" />, label: 'Preço Abaixo', colorClass: 'text-destructive' },
    pct_change_up: { icon: <TrendingUp className="w-4 h-4" />, label: 'Alta %', colorClass: 'text-success' },
    pct_change_down: { icon: <TrendingDown className="w-4 h-4" />, label: 'Queda %', colorClass: 'text-destructive' },
    volume_spike: { icon: <Volume2 className="w-4 h-4" />, label: 'Volume Spike', colorClass: 'text-primary' },
};

const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`;
};

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onToggle, onDelete }) => {
    const { getPrice } = useRealtimePrices([alert.ticker]);
    const priceData = getPrice(alert.ticker);
    const currentPrice = priceData?.price;

    const priorityConfig = PRIORITY_CONFIG[alert.priority];
    const typeConfig = TYPE_CONFIG[alert.type] || TYPE_CONFIG.price_above;

    // Calculate progress toward target
    const progress = useMemo(() => {
        if (!currentPrice) return 0;

        if (alert.type === 'price_above') {
            if (currentPrice >= alert.targetValue) return 100;
            const basePrice = alert.basePrice || currentPrice * 0.9;
            const range = alert.targetValue - basePrice;
            if (range <= 0) return 0;
            return Math.max(0, Math.min(100, ((currentPrice - basePrice) / range) * 100));
        }

        if (alert.type === 'price_below') {
            if (currentPrice <= alert.targetValue) return 100;
            const basePrice = alert.basePrice || currentPrice * 1.1;
            const range = basePrice - alert.targetValue;
            if (range <= 0) return 0;
            return Math.max(0, Math.min(100, ((basePrice - currentPrice) / range) * 100));
        }

        if (alert.type === 'pct_change_up' || alert.type === 'pct_change_down') {
            const base = alert.basePrice || currentPrice;
            if (!base) return 0;
            const currentChange = Math.abs(((currentPrice - base) / base) * 100);
            return Math.min(100, (currentChange / alert.targetValue) * 100);
        }

        return 0;
    }, [currentPrice, alert]);

    // Distance to target text
    const distanceText = useMemo(() => {
        if (!currentPrice) return '—';
        if (alert.type === 'pct_change_up' || alert.type === 'pct_change_down') {
            const base = alert.basePrice || currentPrice;
            if (!base) return '—';
            const currentChange = ((currentPrice - base) / base) * 100;
            return `${currentChange >= 0 ? '+' : ''}${currentChange.toFixed(2)}% / ${alert.type === 'pct_change_up' ? '+' : '-'}${alert.targetValue}%`;
        }
        const diff = alert.targetValue - currentPrice;
        const diffPct = ((diff / currentPrice) * 100);
        return `${diffPct >= 0 ? '+' : ''}${diffPct.toFixed(2)}%`;
    }, [currentPrice, alert]);

    const isTriggered = !!alert.triggeredAt;
    const isNearTarget = progress >= 80;

    // Progress bar color
    const progressColor = progress >= 80
        ? 'bg-gradient-to-r from-amber-500 to-red-500'
        : progress >= 50
            ? 'bg-gradient-to-r from-blue-500 to-amber-500'
            : 'bg-gradient-to-r from-blue-500 to-blue-400';

    return (
        <Card className={cn(
            "relative overflow-hidden border-l-4 transition-all duration-300",
            priorityConfig.border,
            alert.isActive ? 'glass hover:border-primary/30' : 'opacity-50 bg-muted/20',
            isTriggered && 'border-l-success',
            isNearTarget && alert.isActive && 'shadow-lg shadow-amber-500/10',
        )}>
            {/* Near target animated glow */}
            {isNearTarget && alert.isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent animate-pulse pointer-events-none" />
            )}

            <div className="relative p-4">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold",
                            typeConfig.colorClass,
                            alert.type === 'price_above' || alert.type === 'pct_change_up' ? 'bg-success/10' : 'bg-destructive/10'
                        )}>
                            {typeConfig.icon}
                            {typeConfig.label}
                        </div>
                        <span className="font-bold text-lg">{alert.ticker}</span>
                        <Badge variant="outline" className={cn("text-[10px]", priorityConfig.color, priorityConfig.bg)}>
                            {priorityConfig.label}
                        </Badge>
                        {alert.recurring && (
                            <Badge variant="outline" className="text-[10px] text-purple-400 bg-purple-500/10">
                                <Repeat className="w-3 h-3 mr-1" />
                                Loop
                            </Badge>
                        )}
                        {isTriggered && (
                            <Badge className="text-[10px] bg-success/20 text-success border-success/30">
                                ✓ Disparado
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            checked={alert.isActive}
                            onCheckedChange={() => onToggle(alert.id)}
                        />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Remover Alerta</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tem certeza que deseja remover este alerta para {alert.ticker}? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(alert.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Remover
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Price & Target Row */}
                <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Preço Atual</p>
                        <p className={cn(
                            "font-mono font-bold text-lg",
                            currentPrice && priceData && priceData.change24h >= 0 ? 'text-success' : 'text-destructive'
                        )}>
                            {currentPrice ? formatPrice(currentPrice) : '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            {alert.type.includes('pct') ? 'Alvo (%)' : 'Preço Alvo'}
                        </p>
                        <p className="font-mono font-bold text-lg text-primary">
                            {alert.type.includes('pct') ? `${alert.targetValue}%` : formatPrice(alert.targetValue)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Distância</p>
                        <p className={cn(
                            "font-mono font-bold text-lg",
                            isNearTarget ? 'text-amber-400 animate-pulse' : 'text-muted-foreground'
                        )}>
                            {distanceText}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Progresso até o alvo</span>
                        <span className="font-mono">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all duration-1000 ease-out", progressColor)}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Note */}
                {alert.note && (
                    <p className="text-xs text-muted-foreground mt-2 italic border-t border-border/50 pt-2">
                        📝 {alert.note}
                    </p>
                )}

                {/* Timestamp */}
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-2">
                    <Clock className="w-3 h-3" />
                    Criado em {new Date(alert.createdAt).toLocaleDateString('pt-BR')} às {new Date(alert.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </Card>
    );
};
