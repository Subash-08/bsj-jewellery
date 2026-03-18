'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/shopify/product';
import { Badge } from '@/components/ui/Badge';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { WishlistButton } from '@/components/ui/WishlistButton';
import AddToCart from '@/components/product/AddToCart';

interface ProductCardProps {
    product: Product;
    collectionHandle?: string;
}

export function ProductCard({ product, collectionHandle = 'all' }: ProductCardProps) {
    const minPrice = product.priceRange.minVariantPrice.amount;
    const maxPrice = product.priceRange.maxVariantPrice.amount;
    const currency = product.priceRange.minVariantPrice.currencyCode;

    // Use the first variant's compareAtPrice for discount logic if it exists
    let compareAtPriceMin: string | undefined = undefined;
    if (product.variants && product.variants.length > 0) {
        const compareAtPrices = product.variants
            .map(v => v.compareAtPrice?.amount)
            .filter(Boolean) as string[];

        if (compareAtPrices.length > 0) {
            compareAtPriceMin = Math.min(...compareAtPrices.map(Number)).toString();
        }
    }

    const firstImage = product.featuredImage || product.images?.[0];
    const secondImage = product.images?.[1] || firstImage;
    const metadata = product.jewelryMetafields;

    return (
        <div className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden border border-stone-100 hover:shadow-md transition-all duration-300">

            {/* Sale / New Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                {product.tags?.includes('Best Seller') && <Badge variant="glass">Best Seller</Badge>}
                {product.tags?.includes('New') && <Badge variant="new">New</Badge>}
            </div>

            {/* Wishlist — frosted floating bubble */}
            <div className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm">
                <WishlistButton product={product} />
            </div>

            {/* Image — 3/4 aspect with hover swap + scale */}
            <Link
                href={`/collections/${collectionHandle}/${product.handle}`}
                className="relative aspect-[1/1] bg-stone-50 overflow-hidden block"
            >
                {firstImage ? (
                    <>
                        <Image
                            src={firstImage.url}
                            alt={firstImage.altText || product.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover w-full h-full transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNTAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Y5ZmFmYiIvPjwvc3ZnPg=="
                        />
                        {secondImage && (
                            <Image
                                src={secondImage.url}
                                alt={secondImage.altText || product.title}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover w-full h-full absolute inset-0 opacity-0 scale-105 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
                            />
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-stone-300">No Image</div>
                )}
            </Link>

            {/* Product Info */}
            <div className="flex flex-col flex-1 justify-between p-4 space-y-1">
                <Link href={`/collections/${collectionHandle}/${product.handle}`} className="flex-1">
                    <h3 className="text-sm font-semibold text-stone-800 leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
                        {product.title}
                    </h3>

                    {/* Jewelry Specs — minimal, only when metafields present */}
                    {(metadata?.['Metal Type'] || metadata?.['Gross Weight'] || metadata?.['Purity']) && (
                        <div className="text-xs text-stone-400 space-y-1 mt-2">
                            {metadata?.['Metal Type'] && (
                                <div className="flex justify-between">
                                    <span>Metal</span>
                                    <span className="font-medium text-stone-600">{metadata['Metal Type']}</span>
                                </div>
                            )}
                            {metadata?.['Gross Weight'] && (
                                <div className="flex justify-between">
                                    <span>Weight</span>
                                    <span className="font-medium text-stone-600">{metadata['Gross Weight']}</span>
                                </div>
                            )}
                            {metadata?.['Purity'] && (
                                <div className="flex justify-between">
                                    <span>Purity</span>
                                    <span className="font-medium text-stone-600">{metadata['Purity']}</span>
                                </div>
                            )}
                            {product.tags?.includes('Hallmark') && (
                                <div className="flex justify-between">
                                    <span>Hallmark</span>
                                    <span className="font-medium text-amber-600">BIS Certified</span>
                                </div>
                            )}
                        </div>
                    )}
                </Link>

                {/* Price + CTA */}
                <div className="pt-3 mt-2 border-t border-stone-100">
                    <PriceDisplay
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        compareAtPriceMin={compareAtPriceMin}
                        currencyCode={currency}
                        size="md"
                    />

                    {/* Luxury CTA — subtle text link style */}
                    <div className="mt-3">
                        <AddToCart
                            availableForSale={product.availableForSale}
                            variantId={product.variants?.[0]?.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
