"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import TopBar from './TopBar';
import ShopByCategoryMenu from './ShopByCategoryMenu';

export default function Navbar() {
    const { itemCount, setIsCartOpen } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <TopBar />
            <header className={cn(
                "fixed w-full z-50 transition-all duration-300 border-b border-stone-200",
                isScrolled ? "top-0 bg-white/95 backdrop-blur-md shadow-sm py-2" : "top-[28px] bg-white py-2"
            )}>
                <div className="container mx-auto px-4 relative">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Mobile Menu & Logo */}
                        <div className="flex items-center gap-4">
                            <button className="lg:hidden p-1" onClick={() => setIsMobileMenuOpen(true)}>
                                <Menu size={24} />
                            </button>
                            <Link href="/" className="flex flex-col items-start group shrink-0">
                                <h1 className="font-serif text-2xl lg:text-3xl font-bold tracking-widest text-gray-800 group-hover:text-rose-600 transition-colors">BSJ</h1>
                                <span className="text-[0.5rem] lg:text-[0.6rem] tracking-[0.3em] uppercase text-rose-600">Jewellery</span>
                            </Link>
                        </div>

                        {/* Middle: Search & Location */}
                        <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative">
                            <div className="flex w-full items-center border border-stone-300 rounded-md bg-stone-50 focus-within:ring-1 focus-within:ring-rose-400 focus-within:border-rose-400 focus-within:bg-white transition-all">
                                <input
                                    type="text"
                                    placeholder="Search for Rings, Necklaces..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 h-10 placeholder:text-stone-400"
                                />
                                <button className="px-4 h-10 text-stone-400 hover:text-rose-600 transition-colors">
                                    <Search size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 lg:gap-6 shrink-0">
                            <button className="lg:hidden p-2" onClick={() => setShowSearch(!showSearch)}>
                                <Search size={22} />
                            </button>

                            <Link href="/account" className="hidden sm:flex flex-col items-center cursor-pointer group">
                                <User size={22} className="text-stone-700 group-hover:text-rose-600 transition-colors" />
                                <span className="text-[10px] uppercase font-medium mt-1">Profile</span>
                            </Link>

                            <Link href="/wishlist" className="hidden sm:flex flex-col items-center cursor-pointer group relative">
                                <Heart size={22} className="text-stone-700 group-hover:text-rose-600 transition-colors" />
                                <span className="text-[10px] uppercase font-medium mt-1">Wishlist</span>
                            </Link>

                            <div
                                className="flex flex-col items-center cursor-pointer group relative"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <div className="relative">
                                    <ShoppingBag size={22} className="text-stone-700 group-hover:text-rose-600 transition-colors" />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full animate-fade-in">
                                            {itemCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] uppercase font-medium mt-1">Cart</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    <div className={cn(
                        "lg:hidden overflow-hidden transition-all duration-300",
                        showSearch ? "h-14 mt-2 opacity-100" : "h-0 opacity-0"
                    )}>
                        <div className="flex items-center border border-stone-300 rounded-md bg-stone-50 px-3 h-10">
                            <Search size={18} className="text-stone-400" />
                            <input type="text" placeholder="Search jewellery..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2" />
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center justify-between mt-4 border-t border-stone-100 pt-3 relative">
                        {/* 1. Shop By Category (Left Aligned) */}
                        <div className="flex-shrink-0">
                            <ShopByCategoryMenu />
                        </div>

                        {/* 2. Navigation Links with Dropdowns (Centered) */}
                        <div className="flex-1 flex justify-center items-center gap-8 px-4">
                            {/* Gold Jewellery Dropdown */}
                            <div className="relative group">
                                <button className="text-sm font-medium text-stone-600 hover:text-rose-600 uppercase tracking-wide transition-colors py-2 flex items-center gap-1">
                                    Gold Jewellery
                                    <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg border border-stone-100 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <div className="py-2">
                                        {['Chains', 'Necklaces', 'Bangles', 'Bracelets', 'Rings', 'Earrings', 'Anklets', 'Toe Rings'].map((item) => (
                                            <Link
                                                key={item}
                                                href={`/shop/${item.toLowerCase().replace(' ', '-')}`}
                                                className="block px-4 py-2 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Silver Jewellery Dropdown */}
                            <div className="relative group">
                                <button className="text-sm font-medium text-stone-600 hover:text-rose-600 uppercase tracking-wide transition-colors py-2 flex items-center gap-1">
                                    Silver Jewellery
                                    <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg border border-stone-100 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <div className="py-2">
                                        {['Silver Chains', 'Silver Rings', 'Silver Anklets', 'Silver Bracelets', 'Silver Earrings'].map((item) => (
                                            <Link
                                                key={item}
                                                href={`/shop/${item.toLowerCase().replace(' ', '-')}`}
                                                className="block px-4 py-2 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Collections Dropdown */}
                            <div className="relative group">
                                <button className="text-sm font-medium text-stone-600 hover:text-rose-600 uppercase tracking-wide transition-colors py-2 flex items-center gap-1">
                                    Collections
                                    <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg border border-stone-100 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <div className="py-2">
                                        {['Bridal Collection', 'Daily Wear', 'Festive Collection', 'Lightweight Jewellery', 'New Arrivals'].map((item) => (
                                            <Link
                                                key={item}
                                                href={`/collections/${item.toLowerCase().replace(' ', '-')}`}
                                                className="block px-4 py-2 text-sm text-stone-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* About Link */}
                            <Link
                                href="/about"
                                className="text-sm font-medium text-stone-600 hover:text-rose-600 uppercase tracking-wide transition-colors relative group py-2"
                            >
                                About
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>

                            {/* Contact Us Link */}
                            <Link
                                href="/contact"
                                className="text-sm font-medium text-stone-600 hover:text-rose-600 uppercase tracking-wide transition-colors relative group py-2"
                            >
                                Contact Us
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>

                        {/* 3. Live Rates (Right Aligned) */}
                        <div className="flex-shrink-0 pl-4 border-l border-stone-100">
                            <Link href="/live-prices" className="text-sm font-bold text-red-600 hover:text-red-700 uppercase tracking-wide flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                Live Rates
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-gray-900/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white p-6 shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
                            <h2 className="font-serif text-2xl text-gray-800">Menu</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X className="text-stone-500" /></button>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg mb-6">
                            <User className="text-rose-600" />
                            <div>
                                <p className="text-sm font-bold">Welcome Guest</p>
                                <p className="text-xs text-stone-500">Login to manage orders</p>
                            </div>
                            <Link
                                href="/account"
                                className="ml-auto h-8 px-3 text-xs border border-stone-300 rounded hover:bg-stone-100 flex items-center"
                            >
                                Login
                            </Link>
                        </div>

                        <nav className="flex-1 overflow-y-auto space-y-1">
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'Gold Jewellery', href: '/shop' },
                                { label: 'Silver Jewellery', href: '/shop' },
                                { label: 'Rings', href: '/shop/rings' },
                                { label: 'Earrings', href: '/shop/earrings' },
                                { label: 'Necklaces', href: '/shop/necklaces' },
                                { label: 'Bangles', href: '/shop/bangles' },
                                { label: 'Bridal Collection', href: '/collections/bridal-collection' },
                                { label: 'New Arrivals', href: '/collections/new-arrivals' },
                                { label: 'About', href: '/about' },
                                { label: 'Contact Us', href: '/contact' },
                                { label: 'Live Gold Rates', href: '/live-prices' },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center justify-between text-base font-medium text-gray-700 py-3 px-2 border-b border-stone-50 hover:bg-stone-50 hover:text-rose-600 transition-colors rounded-md"
                                >
                                    {item.label}
                                    <ChevronDown size={16} className="-rotate-90 text-stone-300" />
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-6 pt-6 border-t border-stone-100 space-y-4">
                            <div className="flex items-center gap-3 text-stone-600">
                                <Phone size={18} /> <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-3 text-stone-600">
                                <Mail size={18} /> <span>support@bsj.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
