import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAlerts, AlertType } from '@/contexts/AlertContext';
import { Bell, Target, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { useRealtimePrices } from '@/lib/realtimeService';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticker: string;
    currentPrice: number;
    initialTargetPrice?: number;
    initialNote?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, ticker, currentPrice, initialTargetPrice, initialNote }) => {
    const { addAlert } = useAlerts();
    const [targetPrice, setTargetPrice] = useState<string>(
        initialTargetPrice ? initialTargetPrice.toString() : currentPrice.toString()
    );
    const [note, setNote] = useState(initialNote || '');
    const [isLoading, setIsLoading] = useState(false);

    // Update state when props change (specifically for pre-filled data)
    React.useEffect(() => {
        if (isOpen) {
            setTargetPrice(initialTargetPrice ? initialTargetPrice.toString() : currentPrice.toString());
            setNote(initialNote || '');
        }
    }, [isOpen, initialTargetPrice, initialNote, currentPrice]);

    const priceNum = parseFloat(targetPrice);
    const type: AlertType = priceNum > currentPrice ? 'price_above' : 'price_below';

    const formatPrice = (p: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p);
    }

    const handleCreate = async () => {
        if (!priceNum) return;
        setIsLoading(true);

        const success = await addAlert({
            ticker,
            targetValue: priceNum,
            type,
            note,
            priority: 'medium',
            recurring: false
        });

        setIsLoading(false);
        if (success) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        Criar Alerta para {ticker}
                    </DialogTitle>
                    <DialogDescription>
                        Você será notificado quando o preço atingir seu alvo.
                        <br />
                        <span className="text-xs text-muted-foreground">Custo: 1 Crédito por alerta.</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm text-muted-foreground">Preço Atual:</span>
                        <span className="font-mono font-bold text-lg animate-pulse">
                            {formatPrice(currentPrice)}
                        </span>
                    </div>

                    <div className="grid gap-2">
                        <Label>Preço Alvo</Label>
                        <div className="relative">
                            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="number"
                                value={targetPrice}
                                onChange={e => setTargetPrice(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <span>Condição:</span>
                        {type === 'price_above' ? (
                            <span className="flex items-center gap-1 text-success font-bold bg-success/10 px-2 py-1 rounded">
                                <ArrowUp className="w-4 h-4" /> Cruza para Cima
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-destructive font-bold bg-destructive/10 px-2 py-1 rounded">
                                <ArrowDown className="w-4 h-4" /> Cruza para Baixo
                            </span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label>Nota (Opcional)</Label>
                        <Input
                            placeholder="Ex: Vender metade, Comprar rompimento..."
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleCreate} disabled={isLoading} className="gap-2">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                        Criar Alerta
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
