'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'bsj-recent-searches';
const MAX_SEARCHES = 5;

export function useRecentSearches() {
    const [searches, setSearches] = useState<string[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setSearches(JSON.parse(stored));
            }
        } catch {
            // localStorage unavailable or corrupt
        }
    }, []);

    const addSearch = useCallback((query: string) => {
        const trimmed = query.trim();
        if (!trimmed || trimmed.length < 2) return;

        setSearches(prev => {
            // Remove duplicates, add to front, cap at MAX
            const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
            const updated = [trimmed, ...filtered].slice(0, MAX_SEARCHES);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {
                // localStorage unavailable
            }
            return updated;
        });
    }, []);

    const clearSearches = useCallback(() => {
        setSearches([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // localStorage unavailable
        }
    }, []);

    return { searches, addSearch, clearSearches };
}
