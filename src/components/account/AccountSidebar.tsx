"use client";

import { useState } from 'react';
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

export default function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { customer, isLoading, logout } = useAuth();

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
            <div className="p-6 border-b border-stone-200/60">
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
            <nav className="p-3 space-y-0.5 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
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
            <div className="p-3 border-t border-stone-200/60 mt-auto">
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
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-72 bg-white/80 backdrop-blur-sm border-r border-stone-200/60 h-[calc(100vh-120px)] sticky top-[120px]">
                <SidebarContent />
            </aside>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-stone-900 text-white rounded-full shadow-lg hover:bg-stone-800 transition-colors"
            >
                <Menu size={22} />
            </button>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                        className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-5 border-b border-stone-200/60">
                            <h2 className="font-serif text-xl text-stone-900">My Account</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-stone-100 rounded-full transition-colors">
                                <X className="text-stone-500" size={20} />
                            </button>
                        </div>
                        <SidebarContent />
                    </div>
                </div>
            )}
        </>
    );
}
