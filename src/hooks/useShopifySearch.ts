"use client";

import { useDebouncedCallback } from './useDebouncedCallback';
import { useState } from 'react';

export function useShopifySearch() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const performSearch = async (query: string) => {
        if (!query) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.products || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useDebouncedCallback(performSearch, 300);

    return {
        results,
        loading,
        handleSearch,
    };
}