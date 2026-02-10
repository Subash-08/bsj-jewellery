"use client";
import { useEffect } from 'react';

export function useLocalStorageSync(key: string, value: any) {
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
}