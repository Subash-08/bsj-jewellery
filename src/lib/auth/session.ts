import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/shopify/client';
import { env } from '@/lib/env';

/**
 * Server-side helper to retrieve the current customer session.
 * Reads the auth cookie and fetches customer data from Shopify.
 * Returns null if no token exists or the token is invalid.
 *
 * MUST be called from a Server Component or Route Handler only.
 * Uses cache: 'no-store' internally (via getCustomer) to avoid stale data.
 */
export async function getCustomerFromSession() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!accessToken) {
        return null;
    }

    try {
        const customer = await getCustomer(accessToken);
        return customer || null;
    } catch (error) {
        console.error('Server-side customer fetch failed:', error);
        return null;
    }
}
