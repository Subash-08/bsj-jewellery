"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function useProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Redirect to login, optionally saving the return URL
            const params = new URLSearchParams();
            params.set('returnUrl', pathname);
            router.push(`/login?${params.toString()}`);
        }
    }, [isLoading, isAuthenticated, router, pathname]);

    return { isAuthenticated, isLoading };
}
