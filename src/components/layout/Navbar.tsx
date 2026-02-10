"use client";

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Suspense } from 'react';
import { ProfileDropdown } from '@/components/auth/ProfileDropdown';

function CartIcon() {
    const { cart } = useCart();
    const quantity = cart?.totalQuantity || 0;

    return (
        <Link href="/cart" className="relative p-2 text-black hover:text-gray-600 transition-colors">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
            </svg>
            {quantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-black rounded-full">
                    {quantity}
                </span>
            )}
        </Link>
    );
}

function SearchIcon() {
    return (
        <Link href="/search" className="p-2 text-black hover:text-gray-600 transition-colors">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
            </svg>
        </Link>
    );
}

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-serif font-bold tracking-tighter text-black">
                            BSJ JEWELLERS
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        <Link href="/collections" className="text-sm font-medium text-gray-900 hover:text-black uppercase tracking-wide">
                            Collections
                        </Link>
                        <Link href="/search?q=rings" className="text-sm font-medium text-gray-900 hover:text-black uppercase tracking-wide">
                            Rings
                        </Link>
                        <Link href="/search?q=necklaces" className="text-sm font-medium text-gray-900 hover:text-black uppercase tracking-wide">
                            Necklaces
                        </Link>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <SearchIcon />
                        <ProfileDropdown />
                        <Suspense fallback={<div className="w-6 h-6" />}>
                            <CartIcon />
                        </Suspense>
                    </div>
                </div>
            </div>
        </nav>
    );
}
