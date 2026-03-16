import { shopifyFetch } from '@/lib/shopify/fetch';
import { predictiveSearchQuery } from '@/lib/shopify/queries';
import { buildSearchQuery } from '@/lib/shopify/search-query';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const rawQuery = searchParams.get('q');

    if (!rawQuery || rawQuery.trim().length < 2) {
        return NextResponse.json({ products: [], collections: [], queries: [] });
    }

    // Sanitize and apply boosting strategy (title OR tag OR text)
    const query = buildSearchQuery(rawQuery);

    if (!query) {
        return NextResponse.json({ products: [], collections: [], queries: [] });
    }

    try {
        const res = await shopifyFetch<{
            predictiveSearch: {
                products: Array<{
                    id: string;
                    title: string;
                    handle: string;
                    availableForSale: boolean;
                    featuredImage: { url: string; altText: string | null } | null;
                    priceRange: {
                        minVariantPrice: { amount: string; currencyCode: string };
                    };
                }>;
                collections: Array<{
                    id: string;
                    title: string;
                    handle: string;
                }>;
                queries: Array<{
                    text: string;
                    styledText: string;
                }>;
            };
        }>({
            query: predictiveSearchQuery,
            variables: { query, limit: 8 },
            // Removed cache: 'no-store' to let Next.js Data Cache handle cross-user caching for 60s
        });

        return NextResponse.json(res.body.predictiveSearch);
    } catch (e) {
        console.error('Predictive search error:', e);
        return NextResponse.json(
            { products: [], collections: [], queries: [], error: 'Search unavailable' },
            { status: 500 }
        );
    }
}
