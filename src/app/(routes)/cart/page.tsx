"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag, Trash2, Plus, Minus,
    ChevronRight, Shield, Truck, Tag, Lock
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
    const { cart, itemCount, updateCartItem, removeCartItem } = useCart();
    const router = useRouter();
    const [couponCode, setCouponCode] = useState('');

    // ---- Business logic — UNTOUCHED ----
    const handleQuantityChange = async (lineId: string, currentQuantity: number, change: number) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity > 0) {
            await updateCartItem(lineId, newQuantity);
        }
    };

    const handleRemoveItem = async (lineId: string) => {
        await removeCartItem(lineId);
    };

    const handleCheckout = () => {
        if (cart?.checkoutUrl) {
            window.location.href = cart.checkoutUrl;
        }
    };
    // ---- End business logic ----

    // Empty state
    if (!cart || itemCount === 0) {
        return (
            <main className="min-h-screen bg-[#FAF8F5] pt-48 pb-32">
                <div className="max-w-md mx-auto px-4 text-center space-y-8">
                    <div className="flex justify-center text-stone-200">
                        <ShoppingBag size={120} strokeWidth={0.5} />
                    </div>
                    <h1 className="text-4xl font-serif font-light text-stone-900">
                        Your Bag is Empty
                    </h1>
                    <p className="text-sm text-stone-500 font-light tracking-widest leading-relaxed">
                        It looks like you haven&apos;t added anything to your bag yet.
                        Discover our collections and find something special.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-stone-900 text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-stone-800 transition-colors"
                        >
                            <ShoppingBag size={16} />
                            Start Shopping
                        </Link>
                        <Link
                            href="/collections/new-arrivals"
                            className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-stone-300 text-stone-700 text-xs uppercase tracking-[0.2em] font-bold hover:border-stone-900 transition-colors"
                        >
                            New Arrivals
                            <ChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Trust strips */}
                    <div className="grid grid-cols-3 gap-4 mt-16 pt-8 border-t border-stone-200">
                        {[
                            { icon: Truck, label: 'Free Shipping', sub: 'On orders above ₹5,000' },
                            { icon: Shield, label: 'Certified', sub: '100% authentic' },
                            { icon: Tag, label: 'Best Prices', sub: 'Market rates' },
                        ].map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="flex flex-col items-center gap-2 text-center">
                                <Icon size={24} className="text-stone-400" strokeWidth={1.5} />
                                <span className="text-xs font-bold text-stone-700 uppercase tracking-widest">{label}</span>
                                <span className="text-[10px] text-stone-500">{sub}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    const subtotal = parseFloat(cart.cost?.subtotalAmount?.amount || '0');
    const total = parseFloat(cart.cost?.totalAmount?.amount || '0');
    const tax = parseFloat(cart.cost?.totalTaxAmount?.amount || '0');

    return (
        <main className="min-h-screen bg-[#FAF8F5] pt-38 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page title */}
                <h1 className="text-4xl font-serif font-light text-stone-900 mb-4 ">
                    Your Shopping Bag
                </h1>
                <p className="text-stone-400 text-xs uppercase tracking-[0.2em] mb-12">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* ── Cart Items ── */}
                    <div className="lg:col-span-8 space-y-0">

                        {/* Table header — desktop only */}
                        <div className="hidden md:grid grid-cols-12 pb-5 border-b border-stone-200 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>

                        {cart.lines.edges.map(({ node: line }) => {
                            const unitPrice = parseFloat(line.cost.totalAmount.amount) / line.quantity;
                            return (
                                <div
                                    key={line.id}
                                    className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 py-8 border-b border-stone-100"
                                >
                                    {/* Product info */}
                                    <div className="col-span-6 flex items-start gap-5">
                                        {/* Image */}
                                        <div className="w-24 h-32 bg-stone-100 overflow-hidden flex-shrink-0">
                                            {line.merchandise.product.featuredImage ? (
                                                <Image
                                                    src={line.merchandise.product.featuredImage.url}
                                                    alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
                                                    width={96}
                                                    height={128}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-stone-100">
                                                    <ShoppingBag className="text-stone-300" size={32} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-1 pt-1">
                                            <h3 className="text-base font-serif tracking-wide text-stone-900">
                                                {line.merchandise.product.title}
                                            </h3>
                                            {line.merchandise.title !== 'Default Title' && (
                                                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                                                    {line.merchandise.title}
                                                </p>
                                            )}
                                            <button
                                                onClick={() => handleRemoveItem(line.id)}
                                                className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-rose-500 font-bold hover:opacity-60 transition-opacity pt-2"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={11} />
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Unit price */}
                                    <div className="col-span-2 text-center font-bold tracking-widest text-stone-800 text-sm">
                                        ₹{unitPrice.toLocaleString('en-IN')}
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-2 flex justify-center">
                                        <div className="flex items-center border border-stone-200 px-3 py-1.5 gap-4 bg-white">
                                            <button
                                                onClick={() => handleQuantityChange(line.id, line.quantity, -1)}
                                                className="text-stone-400 hover:text-stone-900 transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={13} />
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center text-stone-900">
                                                {line.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(line.id, line.quantity, 1)}
                                                className="text-stone-400 hover:text-stone-900 transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={13} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Line total */}
                                    <div className="col-span-2 text-right font-bold tracking-widest text-rose-500">
                                        ₹{parseFloat(line.cost.totalAmount.amount).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Continue shopping link */}
                        <div className="pt-8">
                            <button
                                onClick={() => router.back()}
                                className="text-xs uppercase tracking-widest font-bold flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors"
                            >
                                <ChevronRight size={14} className="rotate-180" />
                                <span>Continue Shopping</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="lg:col-span-4">
                        <div className="bg-stone-50 p-8 space-y-6 sticky top-32 border border-stone-100">
                            <h2 className="text-2xl font-serif font-light tracking-wide text-stone-900">
                                Order Summary
                            </h2>

                            {/* Coupon */}
                            <div className="pt-4 border-t border-stone-200">
                                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-2">
                                    Coupon Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 px-3 py-2 border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:border-stone-400 placeholder:text-stone-300"
                                    />
                                    <button className="px-4 py-2 border border-stone-200 bg-white text-stone-700 text-xs uppercase tracking-widest font-bold hover:bg-stone-100 transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Price rows */}
                            <div className="space-y-3 pt-4 border-t border-stone-200">
                                <div className="flex justify-between text-sm font-light tracking-widest text-stone-600">
                                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm font-light tracking-widest items-center">
                                    <span className="text-stone-600">Shipping</span>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-rose-500">
                                        Complimentary
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm font-light tracking-widest text-stone-600">
                                    <span>Tax</span>
                                    <span>
                                        {tax > 0 ? `₹${tax.toLocaleString('en-IN')}` : 'Calculated at checkout'}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="pt-5 border-t border-stone-200 flex justify-between items-center">
                                <span className="text-xl font-serif font-light text-stone-900">Total</span>
                                <span className="text-2xl font-bold tracking-widest text-rose-500">
                                    ₹{total.toLocaleString('en-IN')}
                                </span>
                            </div>

                            {/* Checkout */}
                            <button
                                onClick={handleCheckout}
                                className="w-full py-4 bg-stone-900 text-white text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition-colors"
                            >
                                <span>Proceed to Checkout</span>
                                <ChevronRight size={16} />
                            </button>

                            {/* Continue shopping */}
                            <Link
                                href="/shop"
                                className="block w-full py-3 border border-stone-200 text-stone-600 text-xs uppercase tracking-[0.2em] font-bold text-center hover:border-stone-400 transition-colors"
                            >
                                Continue Shopping
                            </Link>

                            {/* Trust strip */}
                            <div className="pt-4 border-t border-stone-200 space-y-3">
                                {[
                                    { icon: Lock, text: 'Secure checkout with SSL encryption' },
                                    { icon: Truck, text: 'Free shipping on orders above ₹5,000' },
                                    { icon: Shield, text: '100% certified authentic jewellery' },
                                ].map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-3 text-[10px] text-stone-500 uppercase tracking-widest font-medium">
                                        <Icon size={14} className="text-stone-400 flex-shrink-0" />
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Secure badge */}
                            <p className="text-center text-[10px] text-stone-400 uppercase tracking-[0.2em] font-medium">
                                Secure Checkout Guaranteed
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}