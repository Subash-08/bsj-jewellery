"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ShoppingBag,
    Heart,
    User,
    Menu,
    X,
    Phone,
    Mail,
    ChevronDown,
    Search,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import TopBar from "./TopBar";
import CartDrawer from "./CartDrawer";
import HeaderSearch from "@/components/search/HeaderSearch";
import AccountDrawer from './AccountDrawer';
import { useAuth } from '@/context/AuthProvider';
import Image from "next/image";
// ── ADDED ────────────────────────────────────────────────────────────────────
import MobileCategoryMenu from "./MobileCategoryMenu";
import type { NavCategory } from "@/types/shopify/collection";
// ────────────────────────────────────────────────────────────────────────────

// ── CHANGE 1: added mobileCategories prop ───────────────────────────────────
interface NavbarProps {
    categoryMenuSlot?: React.ReactNode;
    mobileCategories?: NavCategory[];
}
// ────────────────────────────────────────────────────────────────────────────

function MobileAccordion({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-b border-[#f1ece3]">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center py-3 text-gray-800 font-medium"
            >
                {title}
                <ChevronDown
                    size={16}
                    className={cn(
                        "transition-transform",
                        open && "rotate-180"
                    )}
                />
            </button>

            <div
                className={cn(
                    "overflow-hidden transition-all",
                    open ? "max-h-96 pb-3" : "max-h-0"
                )}
            >
                <div className="pl-2 space-y-1">{children}</div>
            </div>
        </div>
    );
}

// ── CHANGE 2: destructure mobileCategories (defaults to []) ─────────────────
export default function Navbar({ categoryMenuSlot, mobileCategories = [] }: NavbarProps) {
    // ────────────────────────────────────────────────────────────────────────────
    const { itemCount, isCartOpen, setIsCartOpen } = useCart();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isCartHovered, setIsCartHovered] = useState(false);

    const { customer, isAuthenticated, logout } = useAuth();
    const [isAccountHovered, setIsAccountHovered] = useState(false);
    const accountHoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleAccountMouseEnter = () => {
        accountHoverTimeout.current = setTimeout(() => {
            setIsAccountHovered(true);
        }, 300);
    };

    const handleAccountMouseLeave = () => {
        if (accountHoverTimeout.current) clearTimeout(accountHoverTimeout.current);
    };

    const handleAccountClick = () => {
        if (accountHoverTimeout.current) clearTimeout(accountHoverTimeout.current);
        if (isAuthenticated) {
            setIsAccountHovered(prev => !prev);
        } else {
            router.push('/login');
        }
    };

    return (
        <>
            <TopBar />

            <header
                className={cn(
                    "fixed w-full z-50 transition-all duration-300",
                    isScrolled
                        ? "top-0 bg-[#faf8f4]/95 backdrop-blur-md shadow-md border-b border-[#e8e3d9]"
                        : "top-[34px]"
                )}
            >
                {/* MAIN HEADER */}
                <div className="bg-[#faf8f4] border-b border-[#e8e3d9]">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-[1fr_auto_1fr] lg:grid-cols-[200px_1fr_200px] items-center h-[58px] gap-4">

                            {/* LEFT — Logo + Mobile Menu */}
                            <div className="flex items-center gap-4">
                                <button
                                    className="lg:hidden p-1"
                                    onClick={() => setIsMobileMenuOpen(true)}
                                >
                                    <Menu size={24} className="text-gray-700" />
                                </button>

                                <Link
                                    href="/"
                                    className="flex flex-col items-start group shrink-0"
                                >
                                    <Image src="/logo2.png" alt="Logo" width={100} height={100} />
                                </Link>
                            </div>

                            {/* CENTER — Search */}
                            <div className="hidden lg:flex w-full relative flex justify-center items-center">
                                <HeaderSearch variant="desktop" />
                            </div>

                            {/* Mobile: center column is empty spacer */}
                            <div className="lg:hidden" />

                            {/* RIGHT — Icons */}
                            <div className="flex items-center justify-end gap-3 lg:gap-5 shrink-0">
                                <button
                                    className="lg:hidden p-2"
                                    onClick={() => setShowSearch(!showSearch)}
                                >
                                    <Search size={22} className="text-gray-700" />
                                </button>

                                <div
                                    className="hidden sm:flex flex-col items-center cursor-pointer group"
                                    onMouseEnter={handleAccountMouseEnter}
                                    onMouseLeave={handleAccountMouseLeave}
                                    onClick={handleAccountClick}
                                >
                                    <User
                                        size={20}
                                        className="text-gray-700 group-hover:text-amber-600 transition-colors"
                                    />
                                    <span className="text-[9px] uppercase tracking-widest font-medium mt-1 text-gray-500">
                                        {isAuthenticated ? (customer?.firstName ?? 'Account') : 'Sign In'}
                                    </span>
                                </div>

                                <Link
                                    href="/wishlist"
                                    className="hidden sm:flex flex-col items-center group"
                                >
                                    <Heart
                                        size={20}
                                        className="text-gray-700 group-hover:text-amber-600 transition-colors"
                                    />
                                    <span className="text-[9px] uppercase tracking-widest font-medium mt-1 text-gray-500">
                                        Wishlist
                                    </span>
                                </Link>

                                <div
                                    className="flex flex-col items-center cursor-pointer group relative"
                                    onClick={() => router.push('/cart')}
                                    onMouseEnter={() => setIsCartHovered(true)}
                                >
                                    <div className="relative">
                                        <ShoppingBag
                                            size={20}
                                            className="text-gray-700 group-hover:text-amber-600 transition-colors"
                                        />
                                        {itemCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 text-white text-[10px] flex items-center justify-center rounded-full">
                                                {itemCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widests font-medium mt-1 text-gray-500">
                                        Cart
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* MOBILE SEARCH */}
                        <div
                            className={cn(
                                "lg:hidden overflow-hidden transition-all duration-300",
                                showSearch ? "h-14 mt-2 opacity-100" : "h-0 opacity-0"
                            )}
                        >
                            <HeaderSearch
                                variant="mobile"
                                onClose={() => setShowSearch(false)}
                            />
                        </div>
                    </div>
                </div>

                {/* SECONDARY NAV — desktop only, unchanged */}
                <nav
                    className={cn(
                        "hidden lg:block bg-[#f8f5ef] border-b border-[#e8e3d9] transition-all duration-300",
                        isScrolled ? "py-1" : "py-1"
                    )}
                >
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-center gap-8 relative">
                            {categoryMenuSlot}

                            {/* GOLD JEWELLERY */}
                            <div className="relative group">
                                <button className="text-[11px] font-medium text-gray-700 hover:text-amber-600 uppercase tracking-widest transition-colors py-2 flex items-center gap-1">
                                    Gold Jewellery
                                    <ChevronDown
                                        size={13}
                                        className="transition-transform duration-300 group-hover:rotate-180"
                                    />
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl border border-[#efe8dc] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <div className="py-2">
                                        {[
                                            "Chains",
                                            "Necklaces",
                                            "Bangles",
                                            "Bracelets",
                                            "Rings",
                                            "Earrings",
                                            "Anklets",
                                            "Toe Rings",
                                        ].map((item) => (
                                            <Link
                                                key={item}
                                                href={`/shop/${item.toLowerCase().replace(" ", "-")}`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* SILVER */}
                            <div className="relative group">
                                <button className="text-[11px] font-medium text-gray-700 hover:text-amber-600 uppercase tracking-widest transition-colors py-2 flex items-center gap-1">
                                    Silver Jewellery
                                    <ChevronDown
                                        size={13}
                                        className="transition-transform duration-300 group-hover:rotate-180"
                                    />
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl border border-[#efe8dc] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <div className="py-2">
                                        {[
                                            "Silver Chains",
                                            "Silver Rings",
                                            "Silver Anklets",
                                            "Silver Bracelets",
                                            "Silver Earrings",
                                        ].map((item) => (
                                            <Link
                                                key={item}
                                                href={`/shop/${item.toLowerCase().replace(" ", "-")}`}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/about"
                                className="text-[11px] font-medium text-gray-700 hover:text-amber-600 uppercase tracking-widest transition-colors relative group py-2"
                            >
                                About
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-500 transition-all duration-300 group-hover:w-full" />
                            </Link>

                            <Link
                                href="/contact"
                                className="text-[11px] font-medium text-gray-700 hover:text-amber-600 uppercase tracking-widest transition-colors relative group py-2"
                            >
                                Contact Us
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-500 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div
                        className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-[#faf8f4] shadow-xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center px-5 py-4 border-b border-[#e8e3d9]">
                            <h2 className="font-serif text-xl text-gray-900">Menu</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="text-gray-600" />
                            </button>
                        </div>

                        {/* TOP ACTIONS */}
                        <div className="grid grid-cols-3 border-b border-[#e8e3d9] text-center">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    if (isAuthenticated) router.push("/account");
                                    else router.push("/login");
                                }}
                                className="py-4 flex flex-col items-center gap-1"
                            >
                                <User size={18} />
                                <span className="text-[10px] uppercase">Account</span>
                            </button>

                            <Link
                                href="/wishlist"
                                className="py-4 flex flex-col items-center gap-1"
                            >
                                <Heart size={18} />
                                <span className="text-[10px] uppercase">Wishlist</span>
                            </Link>

                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    router.push("/cart");
                                }}
                                className="py-4 flex flex-col items-center gap-1 relative"
                            >
                                <ShoppingBag size={18} />
                                {itemCount > 0 && (
                                    <span className="absolute top-2 right-[30%] h-4 w-4 bg-amber-500 text-white text-[10px] flex items-center justify-center rounded-full">
                                        {itemCount}
                                    </span>
                                )}
                                <span className="text-[10px] uppercase">Cart</span>
                            </button>
                        </div>

                        {/* MENU CONTENT */}
                        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">

                            {/* HOME */}
                            <Link
                                href="/"
                                className="block py-3 px-2 text-gray-800 font-medium border-b border-[#f1ece3]"
                            >
                                Home
                            </Link>

                            {/*
                             * ── CHANGE 3: replaced {categoryMenuSlot} with <MobileCategoryMenu>
                             *
                             * BEFORE:
                             *   {categoryMenuSlot && (
                             *     <div className="border-b border-[#f1ece3] py-3">
                             *       {categoryMenuSlot}   ← rendered the desktop hover component
                             *     </div>
                             *   )}
                             *
                             * AFTER:
                             *   Render MobileCategoryMenu fed with live mobileCategories prop.
                             *   Falls back to a plain /collections link if prop is empty.
                             */}
                            {mobileCategories.length > 0 ? (
                                <MobileCategoryMenu categories={mobileCategories} />
                            ) : (
                                <Link
                                    href="/collections"
                                    className="block py-3 px-2 text-gray-800 font-medium border-b border-[#f1ece3]"
                                >
                                    Shop By Category
                                </Link>
                            )}

                            {/* GOLD JEWELLERY */}
                            <MobileAccordion title="Gold Jewellery">
                                {[
                                    "Chains",
                                    "Necklaces",
                                    "Bangles",
                                    "Bracelets",
                                    "Rings",
                                    "Earrings",
                                    "Anklets",
                                    "Toe Rings",
                                ].map((item) => (
                                    <Link
                                        key={item}
                                        href={`/shop/${item.toLowerCase().replace(/ /g, "-")}`}
                                        className="block py-2 text-sm text-gray-600 hover:text-amber-600"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </MobileAccordion>

                            {/* SILVER JEWELLERY */}
                            <MobileAccordion title="Silver Jewellery">
                                {[
                                    "Silver Chains",
                                    "Silver Rings",
                                    "Silver Anklets",
                                    "Silver Bracelets",
                                    "Silver Earrings",
                                ].map((item) => (
                                    <Link
                                        key={item}
                                        href={`/shop/${item.toLowerCase().replace(/ /g, "-")}`}
                                        className="block py-2 text-sm text-gray-600 hover:text-amber-600"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </MobileAccordion>

                            {/* STATIC LINKS */}
                            <Link
                                href="/about"
                                className="block py-3 px-2 text-gray-800 font-medium border-b border-[#f1ece3]"
                            >
                                About
                            </Link>

                            <Link
                                href="/contact"
                                className="block py-3 px-2 text-gray-800 font-medium border-b border-[#f1ece3]"
                            >
                                Contact Us
                            </Link>
                        </nav>

                        {/* FOOTER */}
                        <div className="px-5 py-5 border-t border-[#e8e3d9] space-y-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Phone size={16} />
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={16} />
                                <span>support@bsj.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <AccountDrawer
                isOpen={isAccountHovered}
                onClose={() => setIsAccountHovered(false)}
                isLoggedIn={isAuthenticated ?? false}
                customerName={customer ? `${customer.firstName} ${customer.lastName}`.trim() : undefined}
                customerEmail={customer?.email}
                onSignOut={logout}
            />
            <CartDrawer
                isOpen={isCartHovered || isCartOpen}
                onClose={() => {
                    setIsCartHovered(false);
                    setIsCartOpen(false);
                }}
                onCartClick={() => {
                    setIsCartHovered(false);
                    setIsCartOpen(false);
                }}
            />
        </>
    );
}