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
// Add to imports
import AccountDrawer from './AccountDrawer';
import { useAuth } from '@/context/AuthProvider'; // adjust to your actual auth hook/context

interface NavbarProps {
    categoryMenuSlot?: React.ReactNode;
}

export default function Navbar({ categoryMenuSlot }: NavbarProps) {
    const { itemCount, isCartOpen, setIsCartOpen } = useCart();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isCartHovered, setIsCartHovered] = useState(false);

    // Add inside Navbar component, alongside other state
    const { customer, isAuthenticated, signOut } = useAuth(); // adjust to your auth API
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
            setIsAccountHovered(prev => !prev); // toggle drawer
        } else {
            router.push('/account/login');
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
                        <div className="flex items-center justify-between gap-4 h-[58px]">
                            {/* LEFT */}
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
                                    <h1 className="font-serif text-2xl lg:text-3xl font-bold tracking-widest text-gray-900 group-hover:text-amber-600 transition-colors">
                                        BSJ
                                    </h1>

                                    <span className="text-[0.55rem] lg:text-[0.65rem] tracking-[0.3em] uppercase text-amber-600">
                                        Jewellery
                                    </span>
                                </Link>
                            </div>

                            {/* SEARCH */}
                            <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative">
                                <HeaderSearch variant="desktop" />
                            </div>

                            {/* ICON GROUP */}
                            <div className="flex items-center gap-3 lg:gap-6 shrink-0">
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
                                    onClick={() => router.push("/cart")}
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

                                    <span className="text-[9px] uppercase tracking-widest font-medium mt-1 text-gray-500">
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

                {/* SECONDARY NAV */}
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
                        className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-[#faf8f4] p-6 shadow-xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-8 border-b border-[#e8e3d9] pb-4">
                            <h2 className="font-serif text-2xl text-gray-900">Menu</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X className="text-gray-600" />
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto space-y-1">
                            {[
                                { label: "Home", href: "/" },
                                { label: "Gold Jewellery", href: "/shop" },
                                { label: "Silver Jewellery", href: "/shop" },
                                { label: "Rings", href: "/shop/rings" },
                                { label: "Earrings", href: "/shop/earrings" },
                                { label: "Necklaces", href: "/shop/necklaces" },
                                { label: "Bangles", href: "/shop/bangles" },
                                { label: "Bridal Collection", href: "/collections/bridal-collection" },
                                { label: "New Arrivals", href: "/collections/new-arrivals" },
                                { label: "About", href: "/about" },
                                { label: "Contact Us", href: "/contact" },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center justify-between text-base font-medium text-gray-700 py-3 px-2 border-b border-[#f1ece3] hover:bg-amber-50 hover:text-amber-600 transition-colors rounded-md"
                                >
                                    {item.label}
                                    <ChevronDown size={16} className="-rotate-90 text-gray-300" />
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-6 pt-6 border-t border-[#e8e3d9] space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone size={18} />
                                <span>+91 98765 43210</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail size={18} />
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
                onSignOut={signOut}
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