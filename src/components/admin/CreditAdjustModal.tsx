import React, { useState } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Coins, Plus, Minus, AlertTriangle } from 'lucide-react';
import type { AdminUser } from '@/hooks/useAdmin';

interface CreditAdjustModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: AdminUser | null;
    onAdjust: (userId: string, amount: number, reason: string) => Promise<boolean>;
}

const CreditAdjustModal: React.FC<CreditAdjustModalProps> = ({
    open, onOpenChange, user, onAdjust,
}) => {
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [isAdding, setIsAdding] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!user || !amount || !reason) return;

        const numAmount = parseInt(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        setSubmitting(true);
        const finalAmount = isAdding ? numAmount : -numAmount;
        const success = await onAdjust(user.id, finalAmount, reason);
        setSubmitting(false);

        if (success) {
            setAmount('');
            setReason('');
            onOpenChange(false);
        }
    };

    const newBalance = user
        ? Math.max(0, user.credits + (isAdding ? parseInt(amount || '0') : -parseInt(amount || '0')))
        : 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-amber-400" />
                        Ajustar Créditos
                    </DialogTitle>
                    <DialogDescription>
                        {user?.email} — Saldo atual: <span className="font-bold text-foreground">{user?.credits || 0}</span> créditos
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Add/Remove Toggle */}
                    <div className="flex gap-2">
                        <Button
                            variant={isAdding ? 'default' : 'outline'}
                            className={`flex-1 gap-2 ${isAdding ? 'bg-emerald-600 hover:bg-emerald-500' : ''}`}
                            onClick={() => setIsAdding(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar
                        </Button>
                        <Button
                            variant={!isAdding ? 'default' : 'outline'}
                            className={`flex-1 gap-2 ${!isAdding ? 'bg-red-600 hover:bg-red-500' : ''}`}
                            onClick={() => setIsAdding(false)}
                        >
                            <Minus className="w-4 h-4" />
                            Remover
                        </Button>
                    </div>

                    {/* Amount */}
                    <div>
                        <Label>Quantidade</Label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="Ex: 100"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    {/* Reason */}
                    <div>
                        <Label>Motivo</Label>
                        <Textarea
                            placeholder="Ex: Bônus de boas-vindas, Compensação..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="mt-1"
                            rows={2}
                        />
                    </div>

                    {/* Preview */}
                    {amount && parseInt(amount) > 0 && (
                        <div className={`rounded-lg p-3 text-sm ${isAdding ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                            <p>
                                Novo saldo: <span className="font-bold text-lg">{newBalance}</span> créditos
                            </p>
                        </div>
                    )}

                    {!isAdding && parseInt(amount || '0') > (user?.credits || 0) && (
                        <div className="flex items-center gap-2 text-amber-400 text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            O saldo será definido como 0 (não pode ser negativo)
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || !amount || !reason || parseInt(amount || '0') <= 0}
                        className={isAdding ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}
                    >
                        {submitting ? 'Processando...' : (isAdding ? 'Adicionar Créditos' : 'Remover Créditos')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreditAdjustModal;
