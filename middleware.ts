import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const { pathname } = request.nextUrl;

    // 1. Security Headers (redundant if in next.config.js but good for edge cases)
    // response.headers.set('X-Frame-Options', 'DENY'); 

    // 2. Cart Sync (Placeholder)
    // Check for cart_id param to sync
    if (request.nextUrl.searchParams.has('cart_id')) {
        // implementation sync logic
    }

    // 3. Rate Limit (Placeholder)
    // const ip = request.ip ?? '127.0.0.1';
    // await rateLimit(ip);

    // 4. Geo Location (Placeholder)
    // const country = request.geo?.country || 'US';
    // response.cookies.set('user-country', country);

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};