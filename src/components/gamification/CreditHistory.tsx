import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTransactionHistory, CreditTransaction } from '@/lib/creditsService';
import { Loader2, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

export const CreditHistory = () => {
    const { language } = useLanguage();
    const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const history = await getTransactionHistory(20);
                setTransactions(history);
            } catch (error) {
                console.error('Error loading credit history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>{language === 'pt' ? 'Nenhuma transação recente' : 'No recent transactions'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground px-1">
                {language === 'pt' ? 'HISTÓRICO RECENTE' : 'RECENT HISTORY'}
            </h3>

            <div className="space-y-2">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-lg",
                                tx.type === 'earn'
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-red-500/10 text-red-500"
                            )}>
                                {tx.type === 'earn' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            </div>
                            <div>
                                <p className="font-medium text-sm">
                                    {tx.description || (language === 'pt' ? 'Transação' : 'Transaction')}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">
                                    {format(new Date(tx.created_at), "d MMM, HH:mm", {
                                        locale: language === 'pt' ? ptBR : enUS
                                    })}
                                </p>
                            </div>
                        </div>
                        <span className={cn(
                            "font-bold",
                            tx.type === 'earn' ? "text-green-500" : "text-red-500"
                        )}>
                            {tx.type === 'earn' ? '+' : ''}{tx.amount}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
