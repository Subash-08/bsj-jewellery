"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, ChevronRight, Minus, Plus, Trash2, Lock } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { CartLineItem } from './CartLineItem';
import { CheckoutButton } from '../cart/CheckoutButton';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onCartClick: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCartClick }: CartDrawerProps) {
    // ---- Business logic — UNTOUCHED ----
    const { cart, itemCount, updateCartItem, removeCartItem } = useCart();
    const router = useRouter();
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleQuantityChange = async (lineId: string, currentQuantity: number, change: number) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity > 0) {
            await updateCartItem(lineId, newQuantity);
        }
    };

    const handleRemoveItem = async (lineId: string) => {
        await removeCartItem(lineId);
    };

    const handleViewCart = () => {
        onCartClick();
        router.push('/cart');
    };

    if (!isOpen) return null;
    // ---- End business logic ----

    return (
        <div
            onMouseLeave={onClose}
            className="fixed right-0 top-0 z-50"
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-playfair { font-family: 'Playfair Display', serif; }
            `}</style>

            <div
                ref={drawerRef}
                className={cn(
                    "fixed right-0 top-[80px] w-full sm:w-[420px] bg-white shadow-2xl border-l border-stone-100 z-50 transition-all duration-300 ease-in-out flex flex-col",
                    isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                )}
                style={{
                    maxHeight: 'calc(100vh - 80px)',
                    minWidth: '340px',
                    maxWidth: '30vw',
                }}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={18} className="text-[#230532] opacity-70" strokeWidth={1.5} />
                        <div>
                            <h3 className="font-jakarta text-[13px] font-bold uppercase tracking-[0.15em] text-[#18181b]">
                                Shopping Bag
                            </h3>
                            {itemCount > 0 && (
                                <p className="font-montserrat text-[11px] text-[#6b6b6b] mt-0.5">
                                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-50 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={18} className="text-[#6b6b6b]" />
                    </button>
                </div>

                {/* ── Cart Items ── */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-0">
                    {!cart || itemCount === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                            <div className="text-[#EADBF5]">
                                <ShoppingBag size={80} strokeWidth={0.5} />
                            </div>
                            <div className="space-y-2">
                                <p className="font-playfair font-semibold text-[20px] text-[#230532]">
                                    Your bag is empty
                                </p>
                                <p className="font-montserrat text-[12px] text-[#6b6b6b] italic">
                                    Discover our collections
                                </p>
                            </div>
                            <Link
                                href="/shop"
                                onClick={onClose}
                                className="px-8 py-3 bg-[#230532] text-white font-jakarta text-[13px] uppercase tracking-[0.15em] font-semibold hover:opacity-90 transition-opacity rounded-[4px]"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        /* Item list — using existing CartLineItem */
                        <div className="divide-y divide-stone-100">
                            {cart.lines.edges.map(({ node: line }) => (
                                <div key={line.id} className="py-4">
                                    <CartLineItem
                                        line={line}
                                        onQuantityChange={handleQuantityChange}
                                        onRemove={handleRemoveItem}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                {cart && itemCount > 0 && (
                    <div className="border-t border-stone-100 px-6 pt-5 pb-6 bg-white flex-shrink-0 space-y-4">

                        {/* Subtotal row */}
                        <div className="flex justify-between items-center">
                            <span className="font-jakarta text-[12px] uppercase tracking-[0.15em] font-bold text-[#6b6b6b]">
                                Subtotal
                            </span>
                            <span className="font-jakarta text-[18px] font-bold text-[#230532]">
                                ₹{parseFloat(cart.cost.subtotalAmount.amount).toLocaleString('en-IN')}
                            </span>
                        </div>

                        {/* Shipping note */}
                        <div className="flex justify-between items-center">
                            <span className="font-jakarta text-[12px] uppercase tracking-[0.15em] font-bold text-[#6b6b6b]">
                                Shipping
                            </span>
                            <span className="font-jakarta text-[11px] uppercase tracking-widest font-bold text-[#230532]">
                                Complimentary
                            </span>
                        </div>

                        {/* Action buttons */}
                        <div className="space-y-2 pt-2">
                            {/* Shopify checkout — existing CheckoutButton */}
                            <CheckoutButton />

                            {/* View full cart */}
                            <Link
                                href="/cart"
                                onClick={onClose}
                                className="flex justify-center items-center w-full py-3 border border-[#230532] text-[#230532] font-jakarta text-[12px] uppercase tracking-[0.15em] font-bold hover:bg-stone-50 transition-colors rounded-[4px]"
                            >
                                View Full Bag
                                <ChevronRight size={14} className="ml-2" />
                            </Link>
                        </div>

                        {/* Trust line */}
                        <div className="flex items-center justify-center gap-2 pt-1 font-montserrat text-[10px] text-[#6b6b6b] uppercase tracking-widest font-medium">
                            <Lock size={11} className="text-[#230532] opacity-60" />
                            <span>Secure Checkout Guaranteed</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
