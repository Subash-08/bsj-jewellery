"use client";

import { useEffect, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    return (...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}