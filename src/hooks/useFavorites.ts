import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'gem-intel-favorites';

export function useFavorites() {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setFavorites(new Set(parsed));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    }, []);

    // Save favorites to localStorage whenever they change
    const saveFavorites = useCallback((newFavorites: Set<string>) => {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify([...newFavorites]));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }, []);

    const toggleFavorite = useCallback((ticker: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(ticker)) {
                newFavorites.delete(ticker);
            } else {
                newFavorites.add(ticker);
            }
            saveFavorites(newFavorites);
            return newFavorites;
        });
    }, [saveFavorites]);

    const isFavorite = useCallback((ticker: string) => {
        return favorites.has(ticker);
    }, [favorites]);

    const addFavorite = useCallback((ticker: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            newFavorites.add(ticker);
            saveFavorites(newFavorites);
            return newFavorites;
        });
    }, [saveFavorites]);

    const removeFavorite = useCallback((ticker: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            newFavorites.delete(ticker);
            saveFavorites(newFavorites);
            return newFavorites;
        });
    }, [saveFavorites]);

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        addFavorite,
        removeFavorite,
        favoritesCount: favorites.size,
    };
}
