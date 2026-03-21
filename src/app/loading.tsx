import React from 'react';

export default function HomeLoading() {
    return (
        <main className="w-full bg-[#FAF8F5] min-h-screen pt-[var(--navbar-height)]">
            {/* 1. HERO SKELETON */}
            <div className="relative w-full h-[70vh] md:h-[85vh] bg-[#F0EBE2] animate-pulse flex flex-col items-center justify-center px-4 overflow-hidden">
                {/* Decorative background pulse */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent mix-blend-multiply" />
                
                {/* Hero Text Skeleton */}
                <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto w-full mt-10">
                    {/* Subtitle */}
                    <div className="h-3 w-40 md:w-56 bg-stone-300/40 rounded-full mb-6 max-w-full" />
                    {/* Main Title */}
                    <div className="h-8 md:h-16 w-[80%] md:w-[90%] bg-stone-300/50 rounded-lg mb-4" />
                    <div className="h-8 md:h-16 w-[60%] md:w-[70%] bg-stone-300/50 rounded-lg mb-8" />
                    
                    {/* Buttons */}
                    <div className="flex gap-4 w-full justify-center">
                        <div className="h-12 w-32 md:w-40 bg-stone-400/30 rounded-full" />
                        <div className="h-12 w-32 md:w-40 bg-stone-400/20 rounded-full" />
                    </div>
                </div>
            </div>

            {/* 2. CATEGORY SLIDER SKELETON */}
            <div className="py-16 md:py-24 w-full overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-10 md:mb-14">
                        <div className="w-full">
                            <div className="h-8 md:h-12 w-48 md:w-64 bg-[#E8E1D6] rounded-md animate-pulse mb-3" />
                            <div className="h-3 md:h-4 w-64 md:w-96 bg-[#E8E1D6]/60 rounded animate-pulse hidden md:block" />
                        </div>
                    </div>

                    {/* Circles (Categories) */}
                    <div className="flex gap-4 md:gap-8 overflow-hidden items-center">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 shrink-0">
                                {/* Circle Image */}
                                <div 
                                    className="w-[110px] h-[110px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] rounded-[40px] bg-[#EAE2D7] animate-pulse"
                                    style={{
                                        animationDelay: `${i * 0.15}s`
                                    }}
                                />
                                {/* Label */}
                                <div className="h-3 w-16 md:w-24 bg-[#E8E1D6] rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. FEATURED COLLECTIONS SKELETON (Masonry structure) */}
            <div className="py-16 md:py-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center w-full mb-12 flex flex-col items-center">
                    <div className="h-8 md:h-10 w-64 md:w-80 bg-[#E8E1D6] rounded-md animate-pulse mb-3" />
                    <div className="h-3 w-40 bg-[#E8E1D6]/60 rounded-md animate-pulse" />
                </div>

                {/* Grid (1:2 ratio masonry style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Left block */}
                    <div className="h-[400px] md:h-[600px] w-full bg-[#EAE2D7] rounded-xl animate-pulse" />
                    
                    {/* Right block - 2 stacked */}
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        <div className="h-[200px] md:h-[288px] w-full bg-[#EAE2D7] rounded-xl animate-pulse" />
                        <div className="h-[200px] md:h-[288px] w-full bg-[#E8E1D6] rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
            
        </main>
    );
}