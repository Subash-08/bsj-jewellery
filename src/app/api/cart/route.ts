import { getCart } from '@/lib/shopify/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const cartId = searchParams.get('id');

    if (!cartId) {
        return NextResponse.json({ message: 'Missing cart ID' }, { status: 400 });
    }

    try {
        const cart = await getCart(cartId);
        if (!cart) {
            return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
        }
        return NextResponse.json(cart);
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed to fetch cart' },
            { status: 500 }
        );
    }
}
