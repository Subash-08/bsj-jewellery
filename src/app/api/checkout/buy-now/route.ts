import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createCheckoutCart } from '@/lib/shopify/client';
import { env } from '@/lib/env';

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
            email
        );

        return NextResponse.json({
            checkoutUrl: cart.checkoutUrl,
            cartId: cart.id,
        });
    } catch (error) {
        console.error('Buy Now checkout creation failed:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Checkout creation failed' },
            { status: 500 }
        );
    }
}
