'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, X } from 'lucide-react';
import type { Product } from '@/types/shopify/product';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import AddToCart from '@/components/product/AddToCart';

interface WishlistItemCardProps {
    product: Product;
    onRemove: (id: string, e?: React.MouseEvent) => void;
}

export function WishlistItemCard({ product, onRemove }: WishlistItemCardProps) {
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
    const metadata = product.jewelryMetafields;

    // Build the link
    const collectionHandle = metadata?.['Collection Name']
        ? metadata['Collection Name'].toLowerCase().replace(/\s+/g, '-')
        : 'all';
    const productUrl = `/collections/${collectionHandle}/${product.handle}`;

    return (
        <div className="group relative flex flex-col md:flex-row bg-white border border-stone-200 p-4 transition-all duration-300 hover:border-stone-300 w-full gap-6">

            {/* Remove Action - Absolute Top Right */}
            <button
                onClick={(e) => onRemove(product.id, e)}
                className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-stone-900 transition-colors bg-white rounded-full lg:opacity-0 lg:group-hover:opacity-100 shadow-sm border border-stone-100"
                aria-label="Remove from Wishlist"
            >
                <X size={16} />
            </button>

            {/* LEFT SECTION: Image Container */}
            <Link href={productUrl} className="relative aspect-square md:aspect-[4/5] w-full md:w-28 flex-shrink-0 bg-stone-50 overflow-hidden block border border-stone-100">
                {firstImage ? (
                    <Image
                        src={firstImage.url}
                        alt={firstImage.altText || product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 200px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNTAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Y5ZmFmYiIvPjwvc3ZnPg=="
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-50">
                        <ShoppingBag className="text-stone-300" size={32} />
                    </div>
                )}
            </Link>

            {/* CENTER SECTION: Product Info */}
            <div className="flex flex-col flex-1 py-1">
                <Link href={productUrl} className="block group/link pr-12">
                    <h3 className="font-serif tracking-wide text-stone-900 text-lg md:text-xl mb-3 line-clamp-2 group-hover/link:text-stone-600 transition-colors">
                        {product.title}
                    </h3>
                </Link>

                {/* Jewelry Specs */}
                <div className="text-[11px] text-stone-500 uppercase tracking-widest space-y-2 mb-4">
                    {metadata?.['Metal Type'] && (
                        <div className="flex items-center gap-2">
                            <span className="w-16">Metal:</span>
                            <span className="font-medium text-stone-900">{metadata['Metal Type']}</span>
                        </div>
                    )}
                    {metadata?.['Gross Weight'] && (
                        <div className="flex items-center gap-2">
                            <span className="w-16">Weight:</span>
                            <span className="font-medium text-stone-900">{metadata['Gross Weight']}</span>
                        </div>
                    )}
                    {metadata?.['Purity'] && (
                        <div className="flex items-center gap-2">
                            <span className="w-16">Purity:</span>
                            <span className="font-medium text-stone-900">{metadata['Purity']}</span>
                        </div>
                    )}
                </div>

                {/* Price and Stock */}
                <div className="mt-auto pt-2 space-y-2">
                    <div className="font-bold tracking-widest text-stone-900 text-base">
                        <PriceDisplay
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            compareAtPriceMin={compareAtPriceMin}
                            currencyCode={currency}
                            size="md"
                        />
                        <span className="text-[10px] text-stone-400 font-normal ml-2 tracking-normal lowercase">(incl GST)</span>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#2E8B57]">
                        {product.availableForSale ? 'In Stock' : <span className="text-rose-600">Out of Stock</span>}
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION: Actions */}
            <div className="flex flex-col md:w-64 flex-shrink-0 gap-3 justify-end md:justify-center border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6">
                <AddToCart
                    availableForSale={product.availableForSale}
                    variantId={product.variants?.[0]?.id}
                />
                <Link
                    href={productUrl}
                    className="w-full text-center py-3 border border-stone-200 text-stone-600 text-xs uppercase tracking-[0.2em] font-bold hover:border-stone-900 hover:text-stone-900 transition-colors bg-white mt-2"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
