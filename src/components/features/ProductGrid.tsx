"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/shopify/product';
import { usePriceFormatter } from '@/hooks/usePriceFormatter';

function ProductCard({ product }: { product: Product }) {
    const { format } = usePriceFormatter(product.priceRange.minVariantPrice.currencyCode);
    const price = product.priceRange.minVariantPrice.amount;
    const image = product.featuredImage;

    // Find first collection that is not 'frontpage'
    const nonFrontpageCollection = product.collections?.edges.find(
        edge => edge.node.handle !== 'frontpage'
    );
    const collectionHandle = nonFrontpageCollection?.node?.handle || 'all';

    return (
        <Link href={`/collections/${collectionHandle}/${product.handle}`} className="group block">
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100 mb-4">
                {image ? (
                    <Image
                        src={image.url}
                        alt={image.altText || product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        priority={false}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-200">
                        No Image
                    </div>
                )}
                {/* Quick Add overlay can go here */}
            </div>
            <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-yellow-700 transition-colors">
                    {product.title}
                </h3>
                <p className="text-sm text-gray-500">{format(price)}</p>
            </div>
        </Link>
    );
}

export default function ProductGrid({
    title,
    products,
}: {
    title: string;
    products: Product[];
}) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif text-center mb-12 text-gray-900">{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
