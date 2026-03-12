import React, { useState } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Ban, AlertTriangle } from 'lucide-react';
import type { AdminUser } from '@/hooks/useAdmin';

interface BlockUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: AdminUser | null;
    onBlock: (userId: string, reason: string) => Promise<boolean>;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({
    open, onOpenChange, user, onBlock,
}) => {
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleBlock = async () => {
        if (!user || !reason.trim()) return;
        setSubmitting(true);
        const success = await onBlock(user.id, reason.trim());
        setSubmitting(false);
        if (success) {
            setReason('');
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <Ban className="w-5 h-5" />
                        Bloquear Usuário
                    </DialogTitle>
                    <DialogDescription>
                        {user?.email}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-destructive">Ação importante</p>
                            <p className="text-muted-foreground">
                                O usuário não poderá acessar a plataforma enquanto estiver bloqueado.
                            </p>
                        </div>
                    </div>

                    <div>
                        <Label>Motivo do bloqueio *</Label>
                        <Textarea
                            placeholder="Ex: Violação dos termos de uso, Abuso do sistema..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="mt-1"
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleBlock}
                        disabled={submitting || !reason.trim()}
                    >
                        {submitting ? 'Bloqueando...' : 'Confirmar Bloqueio'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BlockUserModal;
