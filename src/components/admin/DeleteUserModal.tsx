import React, { useState } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { AdminUser } from '@/hooks/useAdmin';

interface DeleteUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: AdminUser | null;
    onDelete: (userId: string) => Promise<boolean>;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ open, onOpenChange, user, onDelete }) => {
    const [confirmText, setConfirmText] = useState('');
    const [deleting, setDeleting] = useState(false);

    if (!user) return null;

    const canDelete = confirmText === user.email;

    const handleDelete = async () => {
        if (!canDelete) return;
        setDeleting(true);
        const success = await onDelete(user.id);
        setDeleting(false);
        if (success) {
            setConfirmText('');
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!deleting) { setConfirmText(''); onOpenChange(v); } }}>
            <DialogContent className="sm:max-w-md bg-card">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                        Excluir Conta Permanentemente
                    </DialogTitle>
                    <DialogDescription>
                        Esta ação é <strong className="text-red-400">irreversível</strong>. Todos os dados do usuário serão removidos.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-sm"><strong>Usuário:</strong> {user.full_name || 'Sem nome'}</p>
                        <p className="text-sm"><strong>Email:</strong> {user.email}</p>
                        <p className="text-sm"><strong>Plano:</strong> {user.plan.toUpperCase()}</p>
                        <p className="text-sm"><strong>Créditos:</strong> {user.credits}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground mb-2">
                            Digite <strong className="text-foreground">{user.email}</strong> para confirmar:
                        </p>
                        <Input
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder={user.email}
                            className="bg-background/50"
                            disabled={deleting}
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={!canDelete || deleting}
                            className="gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            {deleting ? 'Excluindo...' : 'Excluir Permanentemente'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteUserModal;
