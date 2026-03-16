"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    X, User, LogOut, Package, Heart, MapPin,
    Settings, ChevronRight, Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    isLoggedIn: boolean;
    customerName?: string;
    customerEmail?: string;
    onSignOut: () => void;
}

export default function AccountDrawer({
    isOpen,
    onClose,
    isLoggedIn,
    customerName,
    customerEmail,
    onSignOut,
}: AccountDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSignOut = () => {
        onClose();
        onSignOut();
    };

    return (
        <div onMouseLeave={onClose} className="fixed right-0 top-0 z-50">
            <div
                ref={drawerRef}
                className={cn(
                    "fixed right-0 top-[80px] w-full sm:w-[360px] bg-[#FAF8F5] shadow-2xl border-l border-stone-200 z-50 transition-all duration-300 ease-in-out flex flex-col",
                    isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                )}
                style={{ maxHeight: 'calc(100vh - 80px)', minWidth: '300px' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
                    <div className="flex items-center gap-3">
                        <User size={18} className="text-stone-400" strokeWidth={1.5} />
                        <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900">
                            My Account
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                    >
                        <X size={18} className="text-stone-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {!isLoggedIn ? (
                        /* ── Guest state ── */
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6">
                            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center">
                                <User size={32} strokeWidth={1} className="text-stone-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-serif text-lg text-stone-700">
                                    Welcome to BSJ
                                </p>
                                <p className="text-xs text-stone-400 tracking-widest uppercase">
                                    Sign in to access your account
                                </p>
                            </div>
                            <div className="w-full space-y-2">
                                <Link
                                    href="/account/login"
                                    onClick={onClose}
                                    className="flex justify-center w-full py-3 bg-stone-900 text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-amber-600 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/account/register"
                                    onClick={onClose}
                                    className="flex justify-center w-full py-3 border border-stone-300 text-stone-600 text-xs uppercase tracking-[0.2em] font-bold hover:border-amber-400 hover:text-amber-600 transition-colors"
                                >
                                    Create Account
                                </Link>
                            </div>

                            {/* Guest shortcuts */}
                            <div className="w-full pt-4 border-t border-stone-100 space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-3 text-left">
                                    Quick Links
                                </p>
                                {[
                                    { label: 'Track Order', href: '/track-order', icon: Package },
                                    { label: 'Wishlist', href: '/wishlist', icon: Heart },
                                    { label: 'All Collections', href: '/collections', icon: Crown },
                                ].map(({ label, href, icon: Icon }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        onClick={onClose}
                                        className="flex items-center justify-between py-3 px-3 text-sm text-stone-600 hover:bg-amber-50 hover:text-amber-700 transition-colors rounded-md group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={16} className="text-stone-400 group-hover:text-amber-500" />
                                            {label}
                                        </div>
                                        <ChevronRight size={14} className="text-stone-300" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* ── Logged in state ── */
                        <div className="py-2">
                            {/* Profile card */}
                            <div className="px-6 py-5 border-b border-stone-100 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                    <span className="text-amber-700 font-bold text-lg font-serif">
                                        {customerName?.[0]?.toUpperCase() ?? 'U'}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-stone-900 text-sm truncate">
                                        {customerName ?? 'My Account'}
                                    </p>
                                    <p className="text-[11px] text-stone-400 truncate">
                                        {customerEmail}
                                    </p>
                                </div>
                            </div>

                            {/* Nav links */}
                            <div className="px-3 py-3 space-y-0.5">
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 px-3 pb-2 pt-1">
                                    My Account
                                </p>
                                {[
                                    { label: 'Profile', href: '/account', icon: User },
                                    { label: 'My Orders', href: '/account/orders', icon: Package },
                                    { label: 'Wishlist', href: '/wishlist', icon: Heart },
                                    { label: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
                                ].map(({ label, href, icon: Icon }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        onClick={onClose}
                                        className="flex items-center justify-between py-3 px-3 text-sm text-stone-600 hover:bg-amber-50 hover:text-amber-700 transition-colors rounded-md group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={16} className="text-stone-400 group-hover:text-amber-500 transition-colors" />
                                            {label}
                                        </div>
                                        <ChevronRight size={14} className="text-stone-300" />
                                    </Link>
                                ))}
                            </div>

                            {/* Sign out */}
                            <div className="px-6 pt-3 pb-6 border-t border-stone-100 mt-2">
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-3 w-full py-3 px-3 text-sm text-rose-500 hover:bg-rose-50 transition-colors rounded-md group"
                                >
                                    <LogOut size={16} className="text-rose-400" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}