import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/lib/env';

export function middleware(request: NextRequest) {
    const token = request.cookies.get(env.AUTH_COOKIE_NAME);
    const path = request.nextUrl.pathname;

    // 1. Protected Account Routes: /account/*
    if (path.startsWith('/account')) {
        if (!token) {
            const url = new URL('/login', request.url);
            url.searchParams.set('returnUrl', path);
            return NextResponse.redirect(url);
        }
    }

    // 2. Auth Routes (Login/Register): Redirect to account if already logged in
    if (path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/forgot-password')) {
        if (token) {
            return NextResponse.redirect(new URL('/account', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/account/:path*',
        '/login',
        '/register',
        '/forgot-password',
    ],
};
