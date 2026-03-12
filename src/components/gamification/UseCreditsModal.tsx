/**
 * 💰 Use Credits Modal Component
 * Confirm dialog before spending credits
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGamification } from '@/contexts/GamificationContext';
import { Coins, X, AlertTriangle, Check } from 'lucide-react';

interface UseCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    amount: number;
    feature: string;
    description?: string;
}

const UseCreditsModal: React.FC<UseCreditsModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    amount,
    feature,
    description,
}) => {
    const { language } = useLanguage();
    const { profile } = useGamification();

    const currentCredits = profile?.credits || 0;
    const hasEnough = currentCredits >= amount;
    const remaining = currentCredits - amount;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={cn(
                'relative z-10 w-full max-w-sm p-6 rounded-2xl',
                'bg-card border shadow-2xl',
                'animate-in zoom-in-95 duration-200',
                hasEnough ? 'border-amber-500/30' : 'border-red-500/30'
            )}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Content */}
                <div className="text-center">
                    {/* Icon */}
                    <div className={cn(
                        'inline-flex items-center justify-center w-16 h-16 mb-4',
                        'rounded-full',
                        hasEnough
                            ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20'
                            : 'bg-red-500/20'
                    )}>
                        {hasEnough ? (
                            <Coins className="w-8 h-8 text-amber-400" />
                        ) : (
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2">
                        {hasEnough
                            ? (language === 'pt' ? 'Usar Créditos?' : 'Use Credits?')
                            : (language === 'pt' ? 'Créditos Insuficientes' : 'Insufficient Credits')
                        }
                    </h3>

                    {/* Feature name */}
                    <p className="text-muted-foreground mb-4">
                        {feature}
                    </p>

                    {/* Cost display */}
                    <div className={cn(
                        'flex items-center justify-center gap-2 py-3 px-4 rounded-xl mb-4',
                        hasEnough ? 'bg-amber-500/10' : 'bg-red-500/10'
                    )}>
                        <Coins className={cn(
                            'w-5 h-5',
                            hasEnough ? 'text-amber-400' : 'text-red-400'
                        )} />
                        <span className={cn(
                            'text-xl font-bold',
                            hasEnough ? 'text-amber-400' : 'text-red-400'
                        )}>
                            {amount}
                        </span>
                        <span className="text-muted-foreground">
                            {language === 'pt' ? 'créditos' : 'credits'}
                        </span>
                    </div>

                    {/* Balance info */}
                    <div className="text-sm text-muted-foreground mb-6">
                        <p>
                            {language === 'pt' ? 'Saldo atual:' : 'Current balance:'}{' '}
                            <span className="font-bold text-foreground">{currentCredits}</span>
                        </p>
                        {hasEnough && (
                            <p>
                                {language === 'pt' ? 'Após uso:' : 'After use:'}{' '}
                                <span className="font-bold text-foreground">{remaining}</span>
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className={cn(
                                'flex-1 py-3 rounded-xl font-semibold',
                                'bg-muted hover:bg-muted/80 transition-colors'
                            )}
                        >
                            {language === 'pt' ? 'Cancelar' : 'Cancel'}
                        </button>

                        {hasEnough ? (
                            <button
                                onClick={onConfirm}
                                className={cn(
                                    'flex-1 py-3 rounded-xl font-semibold',
                                    'bg-gradient-to-r from-amber-500 to-yellow-500 text-white',
                                    'hover:opacity-90 transition-opacity',
                                    'flex items-center justify-center gap-2'
                                )}
                            >
                                <Check className="w-4 h-4" />
                                {language === 'pt' ? 'Confirmar' : 'Confirm'}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    onClose();
                                    // Navigate to buy credits (future)
                                }}
                                className={cn(
                                    'flex-1 py-3 rounded-xl font-semibold',
                                    'bg-gradient-to-r from-primary to-info text-white',
                                    'hover:opacity-90 transition-opacity'
                                )}
                            >
                                {language === 'pt' ? 'Obter Mais' : 'Get More'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UseCreditsModal;
