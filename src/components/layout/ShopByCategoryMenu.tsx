"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, LayoutGrid, ArrowRight } from 'lucide-react';
import { CATEGORY_DATA, type Category } from '@/lib/categories';
import { cn } from '@/lib/utils';

export default function ShopByCategoryMenu() {
    const [activeCategory, setActiveCategory] = useState<Category>(CATEGORY_DATA[0]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div
            className="group static"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
        >
            {/* Trigger Button */}
            <button
                className={cn(
                    "flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-medium tracking-wide uppercase transition-all rounded-sm",
                    isMenuOpen ? "bg-rose-600" : "hover:bg-rose-600"
                )}
            >
                <LayoutGrid size={16} />
                Shop By Category
                <ChevronDown size={14} className={cn("transition-transform duration-300", isMenuOpen && "rotate-180")} />
            </button>

            {/* Full Width Dropdown */}
            <div
                className={cn(
                    "absolute left-0 top-full w-full bg-white shadow-2xl border-t border-stone-100 transition-all duration-300 ease-in-out z-40 origin-top",
                    isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible pointer-events-none"
                )}
            >
                <div className="container mx-auto flex min-h-[450px]">

                    {/* Left Sidebar: Category List */}
                    <div className="w-1/4 border-r border-stone-100 bg-stone-50/50 py-6">
                        <ul className="space-y-1 px-4">
                            {CATEGORY_DATA.map((cat) => (
                                <li
                                    key={cat.id}
                                    onMouseEnter={() => setActiveCategory(cat)}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 cursor-pointer rounded-md text-sm font-medium transition-all",
                                        activeCategory.id === cat.id
                                            ? "bg-white text-rose-600 shadow-sm border border-stone-100"
                                            : "text-stone-700 hover:bg-stone-100 hover:text-gray-800"
                                    )}
                                >
                                    {cat.name}
                                    {activeCategory.id === cat.id && <ChevronRight size={14} />}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 px-8">
                            <Link href="/collections" className="text-xs font-bold uppercase text-rose-600 hover:underline flex items-center gap-1">
                                View All Categories <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>

                    {/* Right Content: Grids */}
                    <div className="w-3/4 p-8 bg-white animate-fade-in">
                        <div className="mb-6 pb-4 border-b border-stone-100 flex justify-between items-end">
                            <h3 className="font-serif text-2xl text-stone-800">{activeCategory.name}</h3>
                            <Link href={`/collections/${activeCategory.id}`} className="text-xs font-bold text-rose-600 uppercase tracking-widest hover:text-rose-700">
                                Explore {activeCategory.name}
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-y-8 gap-x-12">

                            {/* Column 1: Sub Categories & Gender */}
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-stone-400 mb-3 tracking-wider">Sub Category</h4>
                                    <ul className="space-y-2">
                                        {activeCategory.subCategories?.map(item => (
                                            <li key={item}>
                                                <Link href={`/collections/${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-gray-600 hover:text-rose-600 hover:translate-x-1 transition-all inline-block">
                                                    {item}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-stone-400 mb-3 tracking-wider">Gender</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {activeCategory.gender?.map(item => (
                                            <span key={item} className="text-xs border border-stone-200 px-2 py-1 rounded-sm text-stone-600 hover:border-rose-400 hover:text-rose-600 cursor-pointer transition-colors">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Occasion & Collections */}
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-stone-400 mb-3 tracking-wider">Occasion</h4>
                                    <ul className="space-y-2">
                                        {activeCategory.occasion?.map(item => (
                                            <li key={item}>
                                                <Link href={`/collections/${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-stone-600 hover:text-rose-600 transition-colors">
                                                    {item}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-stone-400 mb-3 tracking-wider">Collections</h4>
                                    <ul className="space-y-2">
                                        {activeCategory.collection?.map(item => (
                                            <li key={item}>
                                                <Link href={`/collections/${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-stone-600 hover:text-rose-600 transition-colors">
                                                    {item}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Column 3: Design, Price & Feature Image */}
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-stone-400 mb-3 tracking-wider">Design Style</h4>
                                        <ul className="space-y-2">
                                            {activeCategory.design?.map(item => (
                                                <li key={item}>
                                                    <Link href={`/collections/${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-stone-600 hover:text-rose-600 transition-colors">
                                                        {item}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-stone-400 mb-3 tracking-wider">Price Range</h4>
                                        <ul className="space-y-2">
                                            {activeCategory.price?.map(item => (
                                                <li key={item}>
                                                    <Link href={`/shop?price=${encodeURIComponent(item)}`} className="text-xs text-stone-600 hover:text-rose-600 transition-colors">
                                                        {item}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Decorative Image Card */}
                                <div className="relative h-48 w-full rounded-md overflow-hidden group/card mt-4">
                                    <div className="absolute inset-0 bg-gray-800/20 group-hover/card:bg-gray-800/10 transition-colors z-10"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=400"
                                        alt="Category Feature"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-3 left-3 z-20">
                                        <p className="text-white text-xs font-bold uppercase">Trending Now</p>
                                        <p className="text-white text-xs opacity-90">In {activeCategory.name}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
