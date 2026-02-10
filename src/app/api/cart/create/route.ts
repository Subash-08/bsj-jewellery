import { createCart } from '@/lib/shopify/client';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const cart = await createCart();
        return NextResponse.json(cart);
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed to create cart' },
            { status: 500 }
        );
    }
}