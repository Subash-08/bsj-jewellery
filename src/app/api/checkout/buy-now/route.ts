import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createCheckoutCart } from '@/lib/shopify/client';
import { env } from '@/lib/env';
import {
    CheckoutConfigurationError,
    getBuyerIp,
    getRequestHostname,
    resolveCheckoutUrl,
} from '@/lib/shopify/checkout';

/**
 * POST /api/checkout/buy-now
 *
 * Creates a separate one-item cart for Buy Now flow.
 * Attaches buyer identity if logged in (via cookie).
 * Never touches the main cart in localStorage.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { variantId, quantity } = body;

        if (!variantId || !quantity) {
            return NextResponse.json(
                { error: 'Missing variantId or quantity' },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        const accessToken = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;
        const buyerIp = getBuyerIp(req.headers);

        // Fetch customer email if logged in (needed for Shopify checkout pre-fill)
        let email: string | undefined;
        if (accessToken) {
            try {
                const { getCustomer } = await import('@/lib/shopify/client');
                const customer = await getCustomer(accessToken);
                email = customer?.email;
            } catch {
                // If customer fetch fails, proceed without email
            }
        }

        const cart = await createCheckoutCart(
            variantId,
            quantity,
            accessToken || undefined,
            email,
            buyerIp
        );

        const requestHostname = getRequestHostname(req.headers, req.nextUrl.hostname);
        const checkoutUrl = resolveCheckoutUrl(cart.checkoutUrl, requestHostname);

        return NextResponse.json({
            checkoutUrl,
            cartId: cart.id,
        });
    } catch (error) {
        if (error instanceof CheckoutConfigurationError) {
            console.error('Buy Now checkout domain configuration error:', error.message);
            return NextResponse.json(
                {
                    error: 'Checkout is temporarily unavailable while the store domain is being configured.',
                    code: error.code,
                },
                { status: 503 }
            );
        }

        console.error('Buy Now checkout creation failed:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Checkout creation failed' },
            { status: 500 }
        );
    }
}
