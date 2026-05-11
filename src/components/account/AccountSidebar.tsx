"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    MapPin,
    User,
    Heart,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthProvider';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { label: 'Orders', href: '/account/orders', icon: Package },
    { label: 'Addresses', href: '/account/addresses', icon: MapPin },
    { label: 'Profile', href: '/account/profile', icon: User },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
];

const mobileMainNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { label: 'Orders', href: '/account/orders', icon: Package },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    { label: 'Profile', href: '/account/profile', icon: User },
];

const mobileMoreNavItems: NavItem[] = [
    { label: 'Addresses', href: '/account/addresses', icon: MapPin },
];

export default function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { customer, isLoading, logout } = useAuth();
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const handleSignOut = async () => {
        await logout();
    };

    const isActive = (href: string) => {
        if (href === '/account') {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

    const getInitials = () => {
        if (!customer) return 'U';
        const firstInitial = customer.firstName?.charAt(0) || '';
        const lastInitial = customer.lastName?.charAt(0) || '';
        return (firstInitial + lastInitial) || customer.email.charAt(0).toUpperCase();
    };

    const getDisplayName = () => {
        if (!customer) return 'Welcome Back!';
        if (customer.firstName && customer.lastName) {
            return `${customer.firstName} ${customer.lastName}`;
        }
        if (customer.firstName) return customer.firstName;
        return 'Welcome Back!';
    };

    const SidebarContent = () => (
        <>
            {/* User Profile Header */}
            <div className="p-6 border-b border-stone-200/60 flex-shrink-0">
                {isLoading ? (
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-stone-200 animate-pulse"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-stone-200 rounded animate-pulse mb-2"></div>
                            <div className="h-3 bg-stone-200 rounded animate-pulse w-3/4"></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
                            {getInitials()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-stone-900 text-base truncate">{getDisplayName()}</h3>
                            <p className="text-sm text-stone-500 truncate">{customer?.email || ''}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                active
                                    ? "bg-stone-900 text-white shadow-sm"
                                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                            )}
                        >
                            <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                            <span className="font-medium text-sm flex-1">{item.label}</span>
                            {active && <ChevronRight size={14} className="opacity-60" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Sign Out Button */}
            <div className="p-3 border-t border-stone-200/60 mt-auto flex-shrink-0">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50/60 transition-all duration-200 w-full"
                >
                    <LogOut size={18} strokeWidth={1.8} />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar: Sticky, full height minus header */}
            <aside className="hidden lg:flex lg:flex-col w-72 bg-white/80 backdrop-blur-sm border-r border-stone-200/60 sticky top-[120px] h-[calc(100vh-120px)]">
                <SidebarContent />
            </aside>

            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 shadow-[0_-4px_15px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom)]">
                <nav className="flex justify-around items-center px-1 py-1.5">
                    {mobileMainNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-[20%] h-14 transition-colors",
                                    active ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
                                )}
                            >
                                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} className="mb-1" />
                                <span className="text-[10px] font-medium leading-none tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                        className={cn(
                            "flex flex-col items-center justify-center w-[20%] h-14 transition-colors",
                            isMoreOpen ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
                        )}
                    >
                        <Menu size={20} strokeWidth={isMoreOpen ? 2.5 : 1.8} className="mb-1" />
                        <span className="text-[10px] font-medium leading-none tracking-wide">More</span>
                    </button>
                </nav>
            </div>

            {/* Mobile "More" Slide-up Menu */}
            {isMoreOpen && (
                <div 
                    className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] flex flex-col justify-end transition-opacity" 
                    onClick={() => setIsMoreOpen(false)}
                >
                    <div 
                        className="bg-white rounded-t-3xl w-full pt-5 px-4 shadow-xl animate-in slide-in-from-bottom-full duration-300"
                        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-5 px-2">
                            <h3 className="font-serif font-medium text-lg text-stone-900">More Options</h3>
                            <button onClick={() => setIsMoreOpen(false)} className="p-2 -mr-2 text-stone-400 hover:text-stone-600 bg-stone-50 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-1">
                            {mobileMoreNavItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMoreOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors",
                                            active ? "bg-stone-100 text-stone-900 font-semibold" : "text-stone-700 hover:bg-stone-50"
                                        )}
                                    >
                                        <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </Link>
                                );
                            })}
                            
                            <div className="h-px bg-stone-100 my-2 mx-2"></div>
                            
                            <button
                                onClick={() => {
                                    setIsMoreOpen(false);
                                    handleSignOut();
                                }}
                                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl w-full text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={18} strokeWidth={1.8} />
                                <span className="font-medium text-sm">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
