"use client";

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
            <aside className="hidden lg:flex lg:flex-col w-72 bg-white/80 backdrop-blur-sm border-r border-stone-200/60 sticky top-[120px]">
                <SidebarContent />
            </aside>

            {/* Mobile Navigation Bar */}
            <div className="lg:hidden bg-white border-b border-stone-200/60 w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <nav className="flex px-4 py-3 gap-2 w-max">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200",
                                    active
                                        ? "bg-stone-900 text-white shadow-sm"
                                        : "bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
                                )}
                            >
                                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                                <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
                    >
                        <LogOut size={16} strokeWidth={1.8} />
                        <span className="font-medium text-sm whitespace-nowrap">Sign Out</span>
                    </button>
                </nav>
            </div>
        </>
    );
}
