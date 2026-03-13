export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
            <div className="aspect-[4/5] bg-gray-200"></div>
            <div className="p-4 flex flex-col flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                
                <div className="space-y-2 mb-4 flex-grow">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                </div>
            </div>
        </div>
    );
}
