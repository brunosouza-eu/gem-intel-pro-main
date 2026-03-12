/**
 * ☀️🌙 Theme Toggle Button
 * Switches between light and dark mode, persisting to localStorage
 */

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'gem-intel-theme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return true;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return saved === 'dark';
        // Default to dark if no preference saved
        return true;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    }, [isDark]);

    // On mount, ensure the correct class is set
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved || saved === 'dark') {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className={cn(
                "relative p-2 rounded-full transition-all duration-300",
                "hover:bg-muted/60 active:scale-90",
                isDark
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-slate-600 hover:text-slate-800",
                className
            )}
            title={isDark ? 'Modo Claro' : 'Modo Escuro'}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
                <Moon className="w-5 h-5 transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
        </button>
    );
};

export default ThemeToggle;
