import React from 'react';
import { cn } from '@/lib/utils';

// ─── Referral Links ─────────────────────────────────────────────────
const REFERRAL_LINKS = {
    binance: 'https://www.binance.com/register?ref=1221295078',
    bybit: 'https://partner.bybit.com/b/155513',
    mexc: 'https://www.mexc.com/pt-BR/acquisition/custom-sign-up?shareCode=mexc-3tNJW',
    gateio: 'https://gate.io/signup/YOUR_CODE_HERE',
};

// ─── Compact inline version (for toolbars / headers) ────────────────
export const ExchangeButtons: React.FC<{ className?: string; size?: 'sm' | 'md' }> = ({ className, size = 'sm' }) => {
    const isSmall = size === 'sm';
    return (
        <div className={cn('flex items-center gap-1.5', className)}>
            <a
                href={REFERRAL_LINKS.binance}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg transition-all hover:scale-105 active:scale-95',
                    isSmall
                        ? 'px-2.5 py-1.5 text-[11px]'
                        : 'px-3.5 py-2 text-xs',
                    'bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20 hover:bg-[#F0B90B]/20'
                )}
            >
                <BinanceIcon className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                <span className="font-semibold">Binance</span>
            </a>
            <a
                href={REFERRAL_LINKS.bybit}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg transition-all hover:scale-105 active:scale-95',
                    isSmall
                        ? 'px-2.5 py-1.5 text-[11px]'
                        : 'px-3.5 py-2 text-xs',
                    'bg-[#F7A600]/10 text-[#F7A600] border border-[#F7A600]/20 hover:bg-[#F7A600]/20'
                )}
            >
                <BybitIcon className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                <span className="font-semibold">Bybit</span>
            </a>
        </div>
    );
};

// ─── Full banner version (for pages / landing page) ─────────────────
export const ExchangeBanner: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={cn(
            'flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl',
            'bg-white/[0.02] border border-white/5',
            className
        )}>
            <p className="text-xs sm:text-sm text-white/40 text-center shrink-0">
                Abra sua conta e opere com:
            </p>
            <div className="flex items-center gap-2">
                <a
                    href={REFERRAL_LINKS.binance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20 hover:bg-[#F0B90B]/20 transition-all hover:scale-105 active:scale-95"
                >
                    <BinanceIcon className="w-4 h-4" />
                    Binance
                </a>
                <span className="text-white/20 text-xs">ou</span>
                <a
                    href={REFERRAL_LINKS.bybit}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#F7A600]/10 text-[#F7A600] border border-[#F7A600]/20 hover:bg-[#F7A600]/20 transition-all hover:scale-105 active:scale-95"
                >
                    <BybitIcon className="w-4 h-4" />
                    Bybit
                </a>
            </div>
        </div>
    );
};

// ─── Floating sticky bar (for tool pages — bottom of screen) ────────
export const ExchangeFloatingBar: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={cn(
            'fixed bottom-0 left-0 right-0 z-40',
            'bg-background/80 backdrop-blur-xl border-t border-border/50',
            'px-3 py-2 sm:py-2.5',
            className
        )}>
            <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-2">
                <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                    Opere com segurança:
                </p>
                <p className="text-[10px] text-muted-foreground sm:hidden">
                    Opere:
                </p>
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide">
                    <a
                        href={REFERRAL_LINKS.binance}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20 hover:bg-[#F0B90B]/20 transition-all shrink-0"
                    >
                        <BinanceIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        Binance
                    </a>
                    <a
                        href={REFERRAL_LINKS.bybit}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold bg-[#F7A600]/10 text-[#F7A600] border border-[#F7A600]/20 hover:bg-[#F7A600]/20 transition-all shrink-0"
                    >
                        <BybitIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        Bybit
                    </a>
                    <a
                        href={REFERRAL_LINKS.mexc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold bg-[#00B897]/10 text-[#00B897] border border-[#00B897]/20 hover:bg-[#00B897]/20 transition-all shrink-0"
                    >
                        <MexcIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        MEXC
                    </a>
                    <a
                        href={REFERRAL_LINKS.gateio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold bg-[#2354e6]/10 text-[#5B8DEF] border border-[#2354e6]/20 hover:bg-[#2354e6]/20 transition-all shrink-0"
                    >
                        <GateIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        Gate.io
                    </a>
                </div>
            </div>
        </div>
    );
};

// ─── SVG Icons (simple, lightweight) ────────────────────────────────
const BinanceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L6.5 7.5L8.36 9.36L12 5.72L15.64 9.36L17.5 7.5L12 2Z" />
        <path d="M2 12L3.86 10.14L5.72 12L3.86 13.86L2 12Z" />
        <path d="M6.5 16.5L12 22L17.5 16.5L15.64 14.64L12 18.28L8.36 14.64L6.5 16.5Z" />
        <path d="M18.28 12L20.14 10.14L22 12L20.14 13.86L18.28 12Z" />
        <path d="M14.12 12L12 9.88L9.88 12L12 14.12L14.12 12Z" />
    </svg>
);

const BybitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4 4h6v6H4V4zm0 10h6v6H4v-6zm10-10h6v6h-6V4zm0 10h6v6h-6v-6z" opacity="0.3" />
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm8 14.18l-8 4-8-4V8.82l8-4 8 4v7.36z" />
    </svg>
);

const MexcIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18L18.82 8.5 12 12.82 5.18 8.5 12 4.18zM5 9.82l6 3.36v6.64l-6-3.36V9.82zm8 9.98v-6.62l6-3.36v6.64l-6 3.34z" />
    </svg>
);

const GateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <path d="M12 7v5h5v2h-7V7h2z" />
    </svg>
);

export default ExchangeButtons;
