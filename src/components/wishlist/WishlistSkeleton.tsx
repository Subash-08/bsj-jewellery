'use client';

export function WishlistSkeleton() {
    return (
        <div className="flex flex-col md:flex-row bg-white border border-stone-200 p-4 w-full gap-6 animate-pulse">
            {/* Image Skeleton */}
            <div className="relative aspect-square md:aspect-[4/5] w-full md:w-48 flex-shrink-0 bg-stone-100 rounded-sm"></div>

            {/* Product Info Skeleton */}
            <div className="flex flex-col flex-1 py-1 gap-4">
                <div>
                    <div className="h-6 bg-stone-100 rounded-sm w-3/4 mb-3"></div>
                    <div className="h-4 bg-stone-100 rounded-sm w-1/2 mb-6"></div>
                    
                    <div className="space-y-3">
                        <div className="h-3 bg-stone-100 rounded-sm w-48"></div>
                        <div className="h-3 bg-stone-100 rounded-sm w-40"></div>
                        <div className="h-3 bg-stone-100 rounded-sm w-32"></div>
                    </div>
                </div>

                <div className="mt-auto pt-2 space-y-3">
                    <div className="h-5 bg-stone-100 rounded-sm w-32"></div>
                    <div className="h-3 bg-stone-100 rounded-sm w-20"></div>
                </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex flex-col md:w-64 flex-shrink-0 gap-3 justify-end md:justify-center border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6">
                <div className="h-12 bg-stone-100 rounded-sm w-full"></div>
                <div className="h-12 bg-stone-50 rounded-sm w-full mt-2"></div>
            </div>
        </div>
    );
}
