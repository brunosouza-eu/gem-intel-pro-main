import React, { useState, useMemo, useEffect } from 'react';
import { AlertType, AlertPriority, useAlerts } from '@/contexts/AlertContext';
import { useRealtimePrices } from '@/lib/realtimeService';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { TokenSearchSelect } from '@/components/ui/TokenSearchSelect';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    ArrowUp, ArrowDown, TrendingUp, TrendingDown, Volume2,
    Zap, Shield, Rocket, AlertTriangle, Target, Bell, Loader2, Repeat, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Token {
    id: string;
    name: string;
    ticker: string;
}

interface QuickPreset {
    name: string;
    icon: React.ReactNode;
    type: AlertType;
    description: string;
    priority: AlertPriority;
    targetMultiplier?: number; // For price-based presets
    targetPct?: number; // For pct-based presets
    gradient: string;
}

const QUICK_PRESETS: QuickPreset[] = [
    {
        name: 'Pump Alert',
        icon: <Rocket className="w-5 h-5" />,
        type: 'pct_change_up',
        description: 'Alerta quando subir 5%',
        priority: 'high',
        targetPct: 5,
        gradient: 'from-emerald-500/20 to-emerald-700/20 hover:from-emerald-500/30 hover:to-emerald-700/30',
    },
    {
        name: 'Dump Alert',
        icon: <AlertTriangle className="w-5 h-5" />,
        type: 'pct_change_down',
        description: 'Alerta quando cair 5%',
        priority: 'critical',
        targetPct: 5,
        gradient: 'from-red-500/20 to-red-700/20 hover:from-red-500/30 hover:to-red-700/30',
    },
    {
        name: 'Breakout',
        icon: <Zap className="w-5 h-5" />,
        type: 'price_above',
        description: 'Alerta rompimento +3%',
        priority: 'high',
        targetMultiplier: 1.03,
        gradient: 'from-blue-500/20 to-blue-700/20 hover:from-blue-500/30 hover:to-blue-700/30',
    },
    {
        name: 'Suporte',
        icon: <Shield className="w-5 h-5" />,
        type: 'price_below',
        description: 'Alerta teste suporte -3%',
        priority: 'medium',
        targetMultiplier: 0.97,
        gradient: 'from-amber-500/20 to-amber-700/20 hover:from-amber-500/30 hover:to-amber-700/30',
    },
];

const TYPE_OPTIONS = [
    { value: 'price_above', label: '↑ Preço Acima de', icon: <ArrowUp className="w-4 h-4 text-success" /> },
    { value: 'price_below', label: '↓ Preço Abaixo de', icon: <ArrowDown className="w-4 h-4 text-destructive" /> },
    { value: 'pct_change_up', label: '📈 Alta % desde agora', icon: <TrendingUp className="w-4 h-4 text-success" /> },
    { value: 'pct_change_down', label: '📉 Queda % desde agora', icon: <TrendingDown className="w-4 h-4 text-destructive" /> },
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Baixa', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { value: 'medium', label: 'Média', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { value: 'high', label: 'Alta', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { value: 'critical', label: 'Crítica', color: 'text-red-400', bg: 'bg-red-500/10' },
];

export const CreateAlertForm: React.FC = () => {
    const { addAlert } = useAlerts();
    const [tokens, setTokens] = useState<Token[]>([]);
    const [selectedTicker, setSelectedTicker] = useState('');
    const [alertType, setAlertType] = useState<AlertType>('price_above');
    const [targetValue, setTargetValue] = useState('');
    const [priority, setPriority] = useState<AlertPriority>('medium');
    const [recurring, setRecurring] = useState(false);
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const selectedTickerSymbol = useMemo(() => {
        const token = tokens.find(t => t.ticker === selectedTicker);
        return token?.ticker || '';
    }, [tokens, selectedTicker]);

    const { getPrice } = useRealtimePrices(selectedTickerSymbol ? [selectedTickerSymbol] : []);
    const currentPriceData = selectedTickerSymbol ? getPrice(selectedTickerSymbol) : undefined;
    const currentPrice = currentPriceData?.price;

    // Fetch tokens
    useEffect(() => {
        (async () => {
            const { data } = await supabase.from('tokens').select('id, name, ticker').order('name');
            if (data) setTokens(data);
        })();
    }, []);

    const isPctType = alertType === 'pct_change_up' || alertType === 'pct_change_down';

    const handleCreate = async () => {
        const val = parseFloat(targetValue);
        if (!selectedTicker || !val || val <= 0) return;

        setIsLoading(true);
        const success = await addAlert({
            ticker: selectedTicker,
            type: alertType,
            targetValue: val,
            priority,
            recurring,
            note: note || undefined,
        });
        setIsLoading(false);

        if (success) {
            setTargetValue('');
            setNote('');
            setPriority('medium');
            setRecurring(false);
        }
    };

    const handlePreset = async (preset: QuickPreset) => {
        if (!selectedTicker) return;

        let targetVal: number;
        if (preset.targetPct) {
            targetVal = preset.targetPct;
        } else if (preset.targetMultiplier && currentPrice) {
            targetVal = currentPrice * preset.targetMultiplier;
        } else {
            return;
        }

        setIsLoading(true);
        await addAlert({
            ticker: selectedTicker,
            type: preset.type,
            targetValue: targetVal,
            priority: preset.priority,
            recurring: false,
            note: `Preset: ${preset.name}`,
        });
        setIsLoading(false);
    };

    const formatPrice = (p: number) => {
        if (p >= 1000) return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (p >= 1) return `$${p.toFixed(2)}`;
        return `$${p.toFixed(6)}`;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Token Selector */}
            <Card className="glass">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Selecionar Token
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TokenSearchSelect
                        tokens={tokens}
                        value={selectedTicker}
                        onValueChange={setSelectedTicker}
                        valueKey="ticker"
                        placeholder="Escolha um token..."
                    />

                    {currentPrice && selectedTicker && (
                        <div className="mt-3 p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Preço Atual de {selectedTicker}:</span>
                            <span className={cn(
                                "font-mono font-bold text-lg",
                                currentPriceData && currentPriceData.change24h >= 0 ? 'text-success' : 'text-destructive'
                            )}>
                                {formatPrice(currentPrice)}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Presets */}
            {selectedTicker && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                        <Sparkles className="w-4 h-4" />
                        PRESETS RÁPIDOS
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {QUICK_PRESETS.map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => handlePreset(preset)}
                                disabled={isLoading || (!currentPrice && !preset.targetPct)}
                                className={cn(
                                    "relative overflow-hidden p-4 rounded-xl border border-border/50 transition-all duration-300",
                                    "bg-gradient-to-br", preset.gradient,
                                    "hover:scale-[1.02] hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed",
                                    "text-left group"
                                )}
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="p-2 rounded-lg bg-white/5 w-fit group-hover:scale-110 transition-transform">
                                        {preset.icon}
                                    </div>
                                    <span className="font-bold text-sm">{preset.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{preset.description}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Alert Form */}
            <Card className="glass">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        Alerta Personalizado
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Alert Type */}
                    <div className="space-y-2">
                        <Label>Tipo de Alerta</Label>
                        <Select value={alertType} onValueChange={(v) => { setAlertType(v as AlertType); setTargetValue(''); }}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TYPE_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        <span className="flex items-center gap-2">
                                            {opt.icon}
                                            {opt.label}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Target Value */}
                    <div className="space-y-2">
                        <Label>{isPctType ? 'Variação Alvo (%)' : 'Preço Alvo (USD)'}</Label>
                        <div className="relative">
                            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="number"
                                value={targetValue}
                                onChange={e => setTargetValue(e.target.value)}
                                placeholder={isPctType ? 'Ex: 5 (para 5%)' : 'Ex: 100000'}
                                className="pl-9"
                                step={isPctType ? '0.5' : '0.01'}
                            />
                        </div>
                        {currentPrice && !isPctType && targetValue && (
                            <p className="text-xs text-muted-foreground">
                                {alertType === 'price_above' ? '↑' : '↓'} {((Math.abs(parseFloat(targetValue) - currentPrice) / currentPrice) * 100).toFixed(2)}% do preço atual
                            </p>
                        )}
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                        <Label>Prioridade</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {PRIORITY_OPTIONS.map(p => (
                                <button
                                    key={p.value}
                                    onClick={() => setPriority(p.value as AlertPriority)}
                                    className={cn(
                                        "py-2 px-3 rounded-lg text-xs font-bold border transition-all",
                                        priority === p.value
                                            ? `${p.bg} ${p.color} border-current shadow-sm`
                                            : 'border-border/50 text-muted-foreground hover:border-border'
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recurring */}
                    <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Repeat className="w-4 h-4 text-purple-400" />
                            <div>
                                <p className="text-sm font-medium">Alerta Recorrente</p>
                                <p className="text-[10px] text-muted-foreground">Dispara múltiplas vezes (cooldown 1 min)</p>
                            </div>
                        </div>
                        <Switch checked={recurring} onCheckedChange={setRecurring} />
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <Label>Nota (Opcional)</Label>
                        <Textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="Ex: Vender metade da posição, Comprar no rompimento..."
                            rows={2}
                            className="resize-none"
                        />
                    </div>

                    {/* Create Button */}
                    <Button
                        onClick={handleCreate}
                        disabled={isLoading || !selectedTicker || !targetValue || parseFloat(targetValue) <= 0}
                        className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 py-6 text-base font-bold gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Bell className="w-5 h-5" />
                        )}
                        Criar Alerta Personalizado
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground">
                        Custo: 1 Crédito por alerta • Notificações via Browser + Som + Toast
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
