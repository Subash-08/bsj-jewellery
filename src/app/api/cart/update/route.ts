import { updateCart, addToCart, removeFromCart } from '@/lib/shopify/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { cartId, lines, action } = await req.json();

    if (!cartId || !lines) {
        return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
    }

    try {
        let cart;
        switch (action) {
            case 'add':
                cart = await addToCart(cartId, lines);
                break;
            case 'remove':
                cart = await removeFromCart(cartId, lines.map((l: any) => l.id));
                break;
            case 'update':
                cart = await updateCart(cartId, lines);
                break;
            default:
                return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
        }
        return NextResponse.json(cart);
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed to update cart' },
            { status: 500 }
        );
    }
}