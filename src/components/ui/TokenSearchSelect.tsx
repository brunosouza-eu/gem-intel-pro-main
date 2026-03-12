import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import CryptoLogo from '@/components/swing/CryptoLogo';

interface Token {
    id: string;
    name: string;
    ticker: string;
}

interface TokenSearchSelectProps {
    tokens: Token[];
    value: string;
    onValueChange: (value: string) => void;
    /** If true, onValueChange returns token.id. If false/default, returns token.ticker */
    valueKey?: 'id' | 'ticker';
    placeholder?: string;
    className?: string;
}

export const TokenSearchSelect: React.FC<TokenSearchSelectProps> = ({
    tokens,
    value,
    onValueChange,
    valueKey = 'ticker',
    placeholder = 'Escolha um token...',
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    // Find selected token for display
    const selectedToken = useMemo(() => {
        if (!value) return null;
        return tokens.find(t => (valueKey === 'id' ? t.id : t.ticker) === value) || null;
    }, [tokens, value, valueKey]);

    // Filter tokens by search (matches name or ticker)
    const filteredTokens = useMemo(() => {
        if (!search.trim()) return tokens;
        const q = search.toLowerCase().trim();
        return tokens.filter(t =>
            t.ticker.toLowerCase().includes(q) ||
            t.name.toLowerCase().includes(q)
        );
    }, [tokens, search]);

    // Calculate dropdown position based on trigger element
    const updateDropdownPosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownStyle({
            position: 'fixed',
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            zIndex: 9999,
        });
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                triggerRef.current && !triggerRef.current.contains(target) &&
                dropdownRef.current && !dropdownRef.current.contains(target)
            ) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Update position when open and on scroll/resize
    useEffect(() => {
        if (!isOpen) return;
        updateDropdownPosition();
        window.addEventListener('scroll', updateDropdownPosition, true);
        window.addEventListener('resize', updateDropdownPosition);
        return () => {
            window.removeEventListener('scroll', updateDropdownPosition, true);
            window.removeEventListener('resize', updateDropdownPosition);
        };
    }, [isOpen, updateDropdownPosition]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const handleSelect = (token: Token) => {
        onValueChange(valueKey === 'id' ? token.id : token.ticker);
        setIsOpen(false);
        setSearch('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onValueChange('');
        setSearch('');
    };

    const dropdownPanel = isOpen ? createPortal(
        <div
            ref={dropdownRef}
            style={dropdownStyle}
            className={cn(
                "rounded-md border border-border bg-popover shadow-xl",
                "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
            )}
        >
            {/* Search Input */}
            <div className="p-2 border-b border-border">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por nome ou ticker..."
                        className={cn(
                            "w-full h-9 pl-8 pr-8 rounded-md text-sm bg-muted/50 border border-border/50",
                            "placeholder:text-muted-foreground/60",
                            "focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
                            "transition-colors"
                        )}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted text-muted-foreground"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Token List */}
            <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin">
                {filteredTokens.length === 0 ? (
                    <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                        Nenhum token encontrado
                    </div>
                ) : (
                    filteredTokens.map(token => {
                        const isSelected = (valueKey === 'id' ? token.id : token.ticker) === value;
                        return (
                            <button
                                key={token.id}
                                type="button"
                                onClick={() => handleSelect(token)}
                                className={cn(
                                    "flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm transition-colors",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    isSelected && "bg-primary/10 text-primary font-medium"
                                )}
                            >
                                <CryptoLogo symbol={token.ticker} size={22} className="shrink-0" />
                                <span className="font-bold text-xs w-14 text-left shrink-0 opacity-70">
                                    {token.ticker}
                                </span>
                                <span className="truncate">{token.name}</span>
                                {isSelected && (
                                    <span className="ml-auto text-primary text-xs">✓</span>
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="px-3 py-1.5 border-t border-border text-[10px] text-muted-foreground text-center">
                {filteredTokens.length} token{filteredTokens.length !== 1 ? 's' : ''} disponíve{filteredTokens.length !== 1 ? 'is' : 'l'}
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className={cn("relative", className)}>
            {/* Trigger Button */}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
                    "ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "hover:bg-accent/50 transition-colors",
                    !selectedToken && "text-muted-foreground"
                )}
            >
                <span className="truncate flex items-center gap-2">
                    {selectedToken ? (
                        <>
                            <CryptoLogo symbol={selectedToken.ticker} size={20} className="shrink-0" />
                            {selectedToken.name} ({selectedToken.ticker})
                        </>
                    ) : placeholder}
                </span>
                <div className="flex items-center gap-1 ml-2 shrink-0">
                    {selectedToken && (
                        <span
                            role="button"
                            onClick={handleClear}
                            className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </span>
                    )}
                    <ChevronDown className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180"
                    )} />
                </div>
            </button>

            {dropdownPanel}
        </div>
    );
};
