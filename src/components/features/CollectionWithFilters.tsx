"use client";

import { useJewelryFilterOptions, useFilteredJewelry } from '@/hooks/useJewelryFilters';
import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/shopify/product';

export default function CollectionWithFilters({ initialProducts, collectionHandle }: { initialProducts: Product[], collectionHandle: string }) {
    // Filter by Main Collection Name first
    // Note: We are doing this client side for the demo instruction, but usually should happen server side or via API query.
    const collectionProducts = initialProducts.filter(product => {
        const collectionName = product.jewelryMetafields?.['Collection Name'];
        // If no collection name metafield, include it? Or exclude?
        // For demo purposes, we'll be permissive if handle matches roughly, or just show all if no metafields
        if (!collectionName) return true;
        return collectionName.toLowerCase() === collectionHandle.toLowerCase();
    });

    const [selectedMetal, setSelectedMetal] = useState<string[]>([]);
    // ... state for other filters can be expanded. For now, following Step 9 structure which mostly renders options.

    // We need to manage state for filters to make them work interactively
    const [filters, setFilters] = useState<any>({});

    const handleFilterChange = (type: string, value: string) => {
        setFilters((prev: any) => {
            const current = prev[type] || [];
            const updated = current.includes(value)
                ? current.filter((i: string) => i !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    // Convert generic state to Typed Filters
    const activeFilters = {
        metalType: filters.metal,
        stoneType: filters.stone,
        occasion: filters.occasion,
        gender: filters.gender
    };

    const filteredProducts = useFilteredJewelry(collectionProducts, activeFilters);
    const filterOptions = useJewelryFilterOptions(collectionProducts);

    return (
        <div className="flex flex-col md:flex-row gap-8 p-6">

            {/* Filters sidebar */}
            <aside className="filters w-full md:w-64 flex-shrink-0 bg-rose-50 p-6 rounded-lg h-fit border border-rose-100">
                <h2 className="text-xl font-serif mb-4 text-gray-900">Filters</h2>

                {/* Metal Type Filter */}
                {filterOptions.metalTypes.length > 0 && (
                    <div className="filter-group mb-6">
                        <h3 className="font-semibold mb-2">Metal Type</h3>
                        {filterOptions.metalTypes.map(metal => (
                            <label key={metal} className="flex items-center space-x-2 cursor-pointer mb-1">
                                <input
                                    type="checkbox"
                                    name="metal"
                                    value={metal}
                                    checked={filters.metal?.includes(metal)}
                                    onChange={() => handleFilterChange('metal', metal)}
                                    className="rounded text-rose-600 focus:ring-rose-500"
                                />
                                <span>{metal}</span>
                            </label>
                        ))}
                    </div>
                )}

                {/* Stone Type Filter */}
                {filterOptions.stoneTypes.length > 0 && (
                    <div className="filter-group mb-6">
                        <h3 className="font-semibold mb-2">Stone Type</h3>
                        {filterOptions.stoneTypes.map(stone => (
                            <label key={stone} className="flex items-center space-x-2 cursor-pointer mb-1">
                                <input
                                    type="checkbox"
                                    name="stone"
                                    value={stone}
                                    checked={filters.stone?.includes(stone)}
                                    onChange={() => handleFilterChange('stone', stone)}
                                    className="rounded text-blue-900 focus:ring-blue-900"
                                />
                                <span>{stone}</span>
                            </label>
                        ))}
                    </div>
                )}

                {/* Occasion Filter */}
                {filterOptions.occasions.length > 0 && (
                    <div className="filter-group mb-6">
                        <h3 className="font-semibold mb-2">Occasion</h3>
                        {filterOptions.occasions.map(occasion => (
                            <label key={occasion} className="flex items-center space-x-2 cursor-pointer mb-1">
                                <input
                                    type="checkbox"
                                    name="occasion"
                                    value={occasion}
                                    checked={filters.occasion?.includes(occasion)}
                                    onChange={() => handleFilterChange('occasion', occasion)}
                                    className="rounded text-blue-900 focus:ring-blue-900"
                                />
                                <span>{occasion}</span>
                            </label>
                        ))}
                    </div>
                )}

                {/* Gender Filter */}
                {filterOptions.genders.length > 0 && (
                    <div className="filter-group mb-6">
                        <h3 className="font-semibold mb-2">Gender</h3>
                        {filterOptions.genders.map(gender => (
                            <label key={gender} className="flex items-center space-x-2 cursor-pointer mb-1">
                                <input
                                    type="checkbox"
                                    name="gender"
                                    value={gender}
                                    checked={filters.gender?.includes(gender)}
                                    onChange={() => handleFilterChange('gender', gender)}
                                    className="rounded text-blue-900 focus:ring-blue-900"
                                />
                                <span>{gender}</span>
                            </label>
                        ))}
                    </div>
                )}
            </aside>

            {/* Product Grid */}
            <main className="product-grid flex-1">
                <h1 className="text-4xl font-serif mb-8 capitalize text-gray-900">{collectionHandle} Collection</h1>

                {filteredProducts.length === 0 ? (
                    <div className="text-gray-500">No products match your filters.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-card border border-gray-200 rounded-lg p-4 hover:shadow-xl hover:border-rose-200 transition-all bg-white group">
                                <Link href={`/collections/${collectionHandle}/${product.handle}`}>
                                    <div className="aspect-square bg-gray-100 rounded mb-4 overflow-hidden relative">
                                        {product.featuredImage ? (
                                            <img src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-rose-600 transition-colors">{product.title}</h3>
                                    <div className="text-sm text-gray-500 space-y-1 mb-2">
                                        {product.jewelryMetafields?.['Metal Type'] && <p>{product.jewelryMetafields['Metal Type']}</p>}
                                        {product.jewelryMetafields?.['Stone Type'] && <p>{product.jewelryMetafields['Stone Type']}</p>}
                                    </div>
                                    <p className="font-bold text-rose-600 text-lg">{product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
