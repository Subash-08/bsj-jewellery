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
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCustomer } from '@/hooks/useCustomer';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { label: 'Orders', href: '/account/orders', icon: Package },
    { label: 'Profile', href: '/account/profile', icon: User },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
];

export default function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { customer, loading } = useCustomer();

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
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
            <div className="p-6 border-b border-stone-200 bg-gradient-to-br from-rose-50 to-white">
                {loading ? (
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-stone-200 animate-pulse"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-stone-200 rounded animate-pulse mb-2"></div>
                            <div className="h-3 bg-stone-200 rounded animate-pulse w-3/4"></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
                            {getInitials()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-800 text-lg truncate">{getDisplayName()}</h3>
                            <p className="text-sm text-stone-600 truncate">{customer?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-1 flex-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                active
                                    ? "bg-rose-600 text-white shadow-md"
                                    : "text-stone-700 hover:bg-rose-50 hover:text-rose-600"
                            )}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Sign Out Button */}
            <div className="p-4 border-t border-stone-200">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-80 bg-white border-r border-stone-200 h-[calc(100vh-120px)] sticky top-[120px]">
                <SidebarContent />
            </aside>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition-colors"
            >
                <Menu size={24} />
            </button>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-gray-900/50" onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                        className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b border-stone-200">
                            <h2 className="font-serif text-2xl text-gray-800">My Account</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="text-stone-500" />
                            </button>
                        </div>
                        <SidebarContent />
                    </div>
                </div>
            )}
        </>
    );
}
