import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
    return (
        <div className="relative w-full h-[70vh] bg-stone-50 overflow-hidden flex items-center justify-center">
            {/* Background decoration or image would go here. For now, a subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-100 to-stone-200 opacity-50" />

            <div className="relative z-10 text-center max-w-3xl px-6">
                <h1 className="text-4xl md:text-6xl font-serif font-medium text-gray-900 mb-6 tracking-tight">
                    Exquisite Jewelry for <span className="italic text-yellow-700">Every Occasion</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-10 font-light leading-relaxed">
                    Discover our curated collection of fine diamonds, gold, and precious gemstones.
                    Timeless elegance designed to be cherished forever.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/collections"
                        className="px-8 py-4 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300"
                    >
                        Shop Collections
                    </Link>
                    <Link
                        href="/products/compare"
                        className="px-8 py-4 border border-black text-black text-sm font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
                    >
                        New Arrivals
                    </Link>
                </div>
            </div>
        </div>
    );
}
