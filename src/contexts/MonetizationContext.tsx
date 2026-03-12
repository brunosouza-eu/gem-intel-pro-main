import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { getCreditsBalance, spendCredits as serviceSpendCredits } from '@/lib/creditsService';

interface MonetizationContextType {
    credits: number;
    dailyUsed: number; // Keep for legacy compatibility if needed, else ignore
    maxDaily: number; // Keep for legacy compatibility
    loading: boolean;
    spendCredit: (cost?: number, source?: string, description?: string) => Promise<boolean>;
    refreshCredits: () => Promise<void>;
}

const MonetizationContext = createContext<MonetizationContextType | undefined>(undefined);

export const MonetizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchCredits = async () => {
        if (!user) return;
        try {
            const balance = await getCreditsBalance();
            setCredits(balance);
        } catch (error: any) {
            if (error.name !== 'AbortError' && error.message !== 'AbortError: The operation was aborted. ') {
                console.error('Error fetching credits:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCredits();

            // Subscribe to realtime changes on profiles table
            const channel = supabase
                .channel('credits-update-v2')
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'profiles',
                        filter: `id=eq.${user.id}`
                    },
                    (payload) => {
                        if (payload.new && typeof payload.new.credits === 'number') {
                            setCredits(payload.new.credits);
                        }
                    }
                )
                .subscribe();

            // Also subscribe to credit_transactions inserts for this user
            const txChannel = supabase
                .channel('credit-tx-realtime')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'credit_transactions',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        // When a new transaction is inserted, refresh the balance
                        if (payload.new && typeof payload.new.balance_after === 'number') {
                            setCredits(payload.new.balance_after);
                        } else {
                            fetchCredits(); // Fallback: re-fetch from DB
                        }
                    }
                )
                .subscribe();

            // Polling fallback: refresh balance every 15 seconds
            const pollInterval = setInterval(() => {
                fetchCredits();
            }, 15000);

            return () => {
                supabase.removeChannel(channel);
                supabase.removeChannel(txChannel);
                clearInterval(pollInterval);
            };
        } else {
            setLoading(false);
        }
    }, [user]);

    const spendCredit = async (
        cost: number = 1,
        source: string = 'unknown',
        description?: string
    ): Promise<boolean> => {
        if (!user) return false;

        // Optimistic check
        if (credits < cost) {
            toast({
                title: "Saldo Insuficiente 🔒",
                description: `Você precisa de ${cost} créditos. Seu saldo: ${credits}.`,
                variant: "destructive"
            });
            return false;
        }

        try {
            // Use the service which uses the secure RPC
            const result = await serviceSpendCredits(cost, source, description);

            if (result.success) {
                setCredits(result.newBalance); // Sync state immediately
                return true;
            } else {
                toast({
                    title: "Erro",
                    description: result.error || "Falha ao processar créditos.",
                    variant: "destructive"
                });
                return false;
            }
        } catch (error) {
            console.error('Error spending credit:', error);
            toast({
                title: "Erro",
                description: "Erro de conexão ou sistema.",
                variant: "destructive"
            });
            return false;
        }
    };

    return (
        <MonetizationContext.Provider value={{
            credits,
            dailyUsed: 0,
            maxDaily: 9999,
            loading,
            spendCredit,
            refreshCredits: fetchCredits
        }}>
            {children}
        </MonetizationContext.Provider>
    );
};

export const useMonetization = () => {
    const context = useContext(MonetizationContext);
    if (context === undefined) {
        throw new Error('useMonetization must be used within a MonetizationProvider');
    }
    return context;
};
