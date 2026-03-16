import { getProducts } from '@/lib/shopify/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get('q');
    const sortKey = searchParams.get('sort') || 'RELEVANCE';
    const reverse = searchParams.get('reverse') === 'true';

    if (!query) {
        return NextResponse.json({ products: [] });
    }

    try {
        const { products } = await getProducts({ query, sortKey, reverse });
        return NextResponse.json({ products });
    } catch (e) {
        return NextResponse.json(
            { message: 'Failed to search products' },
            { status: 500 }
        );
    }
}