import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { getCart, updateCartBuyerIdentity } from '@/lib/shopify/client';
import {
    CheckoutConfigurationError,
    getBuyerIp,
    getRequestHostname,
    resolveCheckoutUrl,
} from '@/lib/shopify/checkout';

export async function POST(req: NextRequest) {
    try {
        const body: unknown = await req.json();
        const cartId =
            typeof body === 'object' && body !== null && 'cartId' in body
                ? (body as { cartId?: unknown }).cartId
                : undefined;

        if (typeof cartId !== 'string' || !cartId.startsWith('gid://shopify/Cart/')) {
            return NextResponse.json({ error: 'Invalid cart ID.' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const accessToken = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;
        const buyerIp = getBuyerIp(req.headers);

        const cart = accessToken
            ? await updateCartBuyerIdentity(cartId, accessToken, buyerIp)
            : await getCart(cartId, buyerIp);

        if (!cart || cart.totalQuantity < 1) {
            return NextResponse.json({ error: 'Your cart is empty or expired.' }, { status: 409 });
        }

        const requestHostname = getRequestHostname(req.headers, req.nextUrl.hostname);
        const checkoutUrl = resolveCheckoutUrl(cart.checkoutUrl, requestHostname);
        return NextResponse.json({ checkoutUrl });
    } catch (error) {
        if (error instanceof CheckoutConfigurationError) {
            console.error('Checkout domain configuration error:', error.message);
            return NextResponse.json(
                {
                    error: 'Checkout is temporarily unavailable while the store domain is being configured.',
                    code: error.code,
                },
                { status: 503 }
            );
        }

        console.error('Checkout preparation failed:', error);
        return NextResponse.json(
            { error: 'Unable to prepare checkout. Please try again.' },
            { status: 500 }
        );
    }
}
