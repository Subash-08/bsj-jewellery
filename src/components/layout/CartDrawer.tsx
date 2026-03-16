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
            {/* Invisible hover bridge */}
            <div className="fixed right-0 top-[0px] w-[100px] h-[100px] z-50 " />

            <div
                ref={drawerRef}
                className={cn(
                    "fixed right-0 top-[80px] w-full sm:w-[420px] bg-[#FAF8F5] shadow-2xl border-l border-stone-200 z-50 transition-all duration-300 ease-in-out flex flex-col",
                    isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                )}
                style={{
                    maxHeight: 'calc(100vh - 80px)',
                    minWidth: '340px',
                    maxWidth: '30vw',
                }}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={18} className="text-stone-400" strokeWidth={1.5} />
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-stone-900">
                                Shopping Bag
                            </h3>
                            {itemCount > 0 && (
                                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">
                                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={18} className="text-stone-500" />
                    </button>
                </div>

                {/* ── Cart Items ── */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-0">
                    {!cart || itemCount === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                            <div className="text-stone-200">
                                <ShoppingBag size={80} strokeWidth={0.5} />
                            </div>
                            <div className="space-y-2">
                                <p className="font-serif font-light text-xl text-stone-700">
                                    Your bag is empty
                                </p>
                                <p className="text-xs text-stone-400 tracking-widest uppercase">
                                    Discover our collections
                                </p>
                            </div>
                            <Link
                                href="/shop"
                                onClick={onClose}
                                className="px-8 py-3 bg-stone-900 text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-stone-800 transition-colors"
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
                    <div className="border-t border-stone-200 px-6 pt-5 pb-6 bg-[#FAF8F5] flex-shrink-0 space-y-4">

                        {/* Subtotal row */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs uppercase tracking-[0.15em] font-bold text-stone-400">
                                Subtotal
                            </span>
                            <span className="text-lg font-bold tracking-widest text-stone-900">
                                ₹{parseFloat(cart.cost.subtotalAmount.amount).toLocaleString('en-IN')}
                            </span>
                        </div>

                        {/* Shipping note */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs uppercase tracking-[0.15em] font-bold text-stone-400">
                                Shipping
                            </span>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-rose-500">
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
                                className="flex justify-center w-full py-3 border border-stone-200 text-stone-600 text-xs uppercase tracking-[0.15em] font-bold hover:border-stone-400 transition-colors"
                            >
                                View Full Bag
                                <ChevronRight size={14} className="ml-2 mt-0.5" />
                            </Link>
                        </div>

                        {/* Trust line */}
                        <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-stone-400 uppercase tracking-widest font-medium">
                            <Lock size={11} />
                            <span>Secure Checkout Guaranteed</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
