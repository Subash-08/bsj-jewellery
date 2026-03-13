"use client";

import type { Product } from '@/types/shopify/product';
import { usePriceFormatter } from '@/hooks/usePriceFormatter';

interface ProductInfoProps {
    product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const { format } = usePriceFormatter(product.priceRange.minVariantPrice.currencyCode);
    const minPrice = product.priceRange.minVariantPrice.amount;
    const maxPrice = product.priceRange.maxVariantPrice.amount;

    const isVariablePrice = minPrice !== maxPrice;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {/* Breadcrumb or Collection Link could go here */}
                {/* <p className="text-sm text-gray-500 tracking-wider uppercase">Collection Name</p> */}

                <h1 className="text-3xl md:text-4xl font-serif text-gray-900 leading-tight">
                    {product.title}
                </h1>

                <div className="flex items-center gap-4">
                    <span className="text-3xl font-semibold text-rose-600">
                        {format(minPrice)}
                        {isVariablePrice && ` - ${format(maxPrice)}`}
                    </span>
                    {/* Compare at price logic if needed */}
                </div>
            </div>

            <div
                className="prose prose-sm text-gray-600 leading-relaxed max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
            />
        </div>
    );
}
