import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateCartBuyerIdentity } from '@/lib/shopify/client';
import { env } from '@/lib/env';

/**
 * POST /api/cart/sync-identity
 *
 * Syncs the current logged-in customer's identity with their Shopify cart.
 * Called by CheckoutButton before redirecting to Shopify Hosted Checkout.
 *
 * Body: { cartId: string }
 *
 * This ensures the checkout page recognizes the customer,
 * pre-fills their email, and shows saved addresses.
 */
export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

        if (!accessToken) {
            // Guest user — no identity to sync, still allow checkout
            return NextResponse.json({ synced: false, guest: true });
        }

        const body = await req.json();
        const { cartId } = body;

        if (!cartId) {
            return NextResponse.json(
                { error: 'Missing cartId' },
                { status: 400 }
            );
        }

        const updatedCart = await updateCartBuyerIdentity(cartId, accessToken);

        return NextResponse.json({
            synced: true,
            checkoutUrl: updatedCart.checkoutUrl,
        });
    } catch (error) {
        console.error('Cart identity sync failed:', error);
        // Don't block checkout if sync fails — let the user proceed
        return NextResponse.json({ synced: false, error: 'Sync failed' });
    }
}
