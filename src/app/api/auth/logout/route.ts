import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteCustomerAccessToken } from '@/lib/shopify/client';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    // Best effort: revoke token on Shopify
    if (accessToken) {
        try {
            await deleteCustomerAccessToken(accessToken);
        } catch (error) {
            console.warn('Failed to revoke Shopify token during logout:', error);
        }
    }

    // Always clear the cookie
    cookieStore.delete(env.AUTH_COOKIE_NAME);

    return NextResponse.json({ success: true });
}
