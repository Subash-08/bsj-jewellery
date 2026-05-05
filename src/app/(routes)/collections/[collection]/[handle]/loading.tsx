import React from 'react';

export default function ProductLoading() {
    return (
        <div className="bg-[#FAF8F5] min-h-screen">
            <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 animate-pulse">
                
                {/* BREADCRUMB SKELETON */}
                <div className="pt-4 pb-4 border-b border-stone-100 mb-6">
                    <div className="h-4 bg-stone-200/60 rounded w-1/3 max-w-[250px]"></div>
                </div>

                {/* HERO SKELETON */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6 py-2 md:py-4 items-start">
                    
                    {/* LEFT: Gallery Skeleton */}
                    <div className="lg:col-span-6 space-y-4">
                        {/* Main Image */}
                        <div className="w-full aspect-square md:aspect-[4/5] bg-stone-200/60 rounded-sm"></div>
                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-2 md:gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-full aspect-square bg-stone-200/60 rounded-sm"></div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Product Details Skeleton */}
                    <div className="lg:col-span-6 space-y-6 lg:mt-0 mt-2">
                        
                        {/* Tags */}
                        <div className="flex gap-2">
                            <div className="h-5 w-16 bg-stone-200/60 rounded-sm"></div>
                            <div className="h-5 w-20 bg-stone-200/60 rounded-sm"></div>
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                            <div className="h-8 w-3/4 bg-stone-200/60 rounded-sm"></div>
                            <div className="h-8 w-1/2 bg-stone-200/60 rounded-sm"></div>
                        </div>

                        {/* Price */}
                        <div className="h-8 w-32 bg-stone-200/60 rounded-sm"></div>

                        {/* Highlight Strip */}
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-stone-200/60 rounded-sm"></div>
                            ))}
                        </div>

                        {/* Variant / Quantity */}
                        <div className="space-y-4 pt-4 border-t border-stone-100">
                            <div className="h-5 w-24 bg-stone-200/60 rounded-sm"></div>
                            <div className="flex gap-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-10 w-10 bg-stone-200/60 rounded-full"></div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-3 pt-4">
                            <div className="h-12 w-full bg-stone-200/60 rounded-sm"></div>
                            <div className="h-12 w-full bg-stone-200/60 rounded-sm"></div>
                        </div>

                        {/* Description */}
                        <div className="pt-6 space-y-3 border-t border-stone-100">
                            <div className="h-5 w-1/4 bg-stone-200/60 rounded-sm mb-4"></div>
                            <div className="h-4 w-full bg-stone-200/60 rounded-sm"></div>
                            <div className="h-4 w-full bg-stone-200/60 rounded-sm"></div>
                            <div className="h-4 w-3/4 bg-stone-200/60 rounded-sm"></div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-8 bg-stone-200/60 rounded-sm"></div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* DETAILS — Specifications */}
                <div className="py-12 md:py-16 border-t border-stone-100 mt-12">
                    <div className="h-6 w-40 bg-stone-200/60 rounded-sm mb-8"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 max-w-3xl">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex justify-between border-b border-stone-100 pb-2">
                                <div className="h-4 w-24 bg-stone-200/60 rounded-sm"></div>
                                <div className="h-4 w-32 bg-stone-200/60 rounded-sm"></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
