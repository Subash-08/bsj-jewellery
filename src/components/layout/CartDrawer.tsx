"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag } from 'lucide-react';
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
    const { cart, itemCount, updateCartItem, removeCartItem } = useCart();
    const router = useRouter();
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close drawer when clicking outside
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

    return (
        <div
            onMouseLeave={onClose}
            className="fixed right-0 top-0 z-40"
        >
            {/* Invisible hover bridge to prevent drawer from closing */}
            <div
                className="fixed right-0 top-[0px] w-[100px] h-[100px] z-40"
            />

            <div
                ref={drawerRef}
                className={cn(
                    "fixed right-0 top-[80px] w-full sm:w-[400px] lg:w-[450px] bg-white shadow-2xl border-l border-stone-200 z-50 transition-all duration-300 ease-in-out",
                    isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                )}
                style={{
                    maxHeight: 'calc(100vh - 100px)',
                    height: 'auto',
                    maxWidth: '30vw',
                    minWidth: '350px'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-gradient-to-r from-rose-50 to-white">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="text-rose-600" size={22} />
                        <h3 className="font-semibold text-lg text-gray-800">
                            Shopping Cart
                            {itemCount > 0 && (
                                <span className="ml-2 text-sm font-normal text-stone-500">
                                    ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                                </span>
                            )}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-stone-100 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <X size={20} className="text-stone-600" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 320px)' }}>
                    {!cart || itemCount === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag size={36} className="text-stone-400" />
                            </div>
                            <p className="text-stone-600 font-medium mb-2">Your cart is empty</p>
                            <p className="text-sm text-stone-500 mb-4">Add items to get started</p>
                            <Link
                                href="/shop"
                                onClick={onClose}
                                className="px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors text-sm font-medium"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        cart.lines.edges.map(({ node: line }) => (
                            <CartLineItem
                                key={line.id}
                                line={line}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemoveItem}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart && itemCount > 0 && (
                    <div className="border-t border-stone-200 p-4 bg-gradient-to-r from-white to-rose-50">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-stone-600">Subtotal:</span>
                            <span className="text-xl font-bold text-gray-800">
                                ₹{parseFloat(cart.cost.subtotalAmount.amount).toLocaleString('en-IN')}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <CheckoutButton />
                            <Link
                                href="/cart"
                                onClick={onClose}
                                className="flex justify-center w-full py-2.5 bg-white text-stone-700 border border-stone-300 rounded-md hover:bg-stone-50 transition-colors font-medium text-sm"
                            >
                                View Cart Details
                            </Link>
                        </div>

                        {/* Additional Info */}
                        <p className="text-xs text-stone-500 text-center mt-3">
                            Shipping & taxes calculated at checkout
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
