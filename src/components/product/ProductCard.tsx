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
        // Find smallest compareAtPrice across variants or just first one
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
        <div className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all duration-300">
            {/* Absolute Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
                {product.tags?.includes('Best Seller') && <Badge variant="glass">Best Seller</Badge>}
                {product.tags?.includes('New') && <Badge variant="new">New</Badge>}
            </div>

            <div className="absolute top-3 right-3 z-20">
                <WishlistButton product={product} />
            </div>

            {/* Image Container with Hover Swap */}
            <Link 
                href={`/collections/${collectionHandle}/${product.handle}`}
                className="relative aspect-[4/5] bg-gray-50 overflow-hidden block"
            >
                {firstImage ? (
                    <>
                        <Image
                            src={firstImage.url}
                            alt={firstImage.altText || product.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNTAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Y5ZmFmYiIvPjwvc3ZnPg=="
                        />
                        {secondImage && (
                            <Image
                                src={secondImage.url}
                                alt={secondImage.altText || product.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                            />
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                )}
            </Link>

            {/* Product Info */}
            <div className="flex flex-col flex-1 justify-between p-4">
                <Link href={`/collections/${collectionHandle}/${product.handle}`} className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-rose-600 transition-colors">
                        {product.title}
                    </h3>
                    
                    {/* Jewelry Specs */}
                    <div className="text-xs text-gray-500 space-y-1 my-2 flex-grow">
                        {metadata?.['Metal Type'] && (
                            <div className="flex justify-between border-b border-gray-50 pb-1">
                                <span>Metal:</span> 
                                <span className="font-medium text-gray-700">{metadata['Metal Type']}</span>
                            </div>
                        )}
                        {metadata?.['Gross Weight'] && (
                            <div className="flex justify-between border-b border-gray-50 pb-1">
                                <span>Weight:</span> 
                                <span className="font-medium text-gray-700">{metadata['Gross Weight']}</span>
                            </div>
                        )}
                        {metadata?.['Purity'] && (
                            <div className="flex justify-between border-gray-50 pb-1">
                                <span>Purity:</span> 
                                <span className="font-medium text-gray-700">{metadata['Purity']}</span>
                            </div>
                        )}
                        {/* Fake hallmark for mockup if undefined but generally fetched from tags/metafields */}
                        {product.tags?.includes('Hallmark') && (
                            <div className="flex justify-between">
                                <span>Certification:</span> 
                                <span className="font-medium text-yellow-600 bg-yellow-50 px-1 rounded">BIS Hallmark</span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Price and Action Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <PriceDisplay 
                        minPrice={minPrice} 
                        maxPrice={maxPrice} 
                        compareAtPriceMin={compareAtPriceMin} 
                        currencyCode={currency}
                        size="md"
                    />
                    
                    <div className="w-full">
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
