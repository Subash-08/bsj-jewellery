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
        console.log("Checkout URL:", cart?.checkoutUrl);

        if (cart?.checkoutUrl) {
            window.location.href = cart.checkoutUrl;
        }
    };
    // ---- End business logic ----

    // Empty state
    if (!cart || itemCount === 0) {
        return (
            <main className="min-h-screen bg-white pt-6 pb-32">
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    .font-montserrat { font-family: 'Montserrat', sans-serif; }
                    .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                    .font-playfair { font-family: 'Playfair Display', serif; }
                `}</style>
                <div className="max-w-2xl mx-auto px-4 text-center space-y-8 mt-20">

                    <div className="flex justify-center items-center gap-4 text-[#230532] mb-2">
                        <span className="text-2xl hidden sm:block">✦</span>
                        <h1 className="text-[32px] md:text-[40px] font-playfair font-semibold">
                            Your Bag is Empty
                        </h1>
                        <span className="text-2xl hidden sm:block">✦</span>
                    </div>
                    <p className="text-[#52525b] font-montserrat italic text-[16px] leading-[24px]">
                        It looks like you haven&apos;t added anything to your bag yet.<br className="hidden sm:block" />
                        Discover our collections and find something special.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#230532] text-white font-jakarta text-[15px] font-semibold rounded hover:opacity-90 transition-opacity"
                        >
                            <ShoppingBag size={18} />
                            Start Shopping
                        </Link>
                        <Link
                            href="/collections/new-arrivals"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[#230532] text-[#230532] font-jakarta text-[15px] font-semibold rounded hover:bg-stone-50 transition-colors"
                        >
                            New Arrivals
                            <ChevronRight size={18} />
                        </Link>
                    </div>

                    {/* Trust strips */}
                    <div className="grid grid-cols-3 gap-4 mt-16 pt-8 border-t border-stone-100">
                        {[
                            { icon: Truck, label: 'Free Shipping', sub: 'On orders above ₹5,000' },
                            { icon: Shield, label: 'Certified', sub: '100% authentic' },
                            { icon: Tag, label: 'Best Prices', sub: 'Market rates' },
                        ].map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="flex flex-col items-center gap-2 text-center">
                                <Icon size={24} className="text-[#230532] opacity-60" strokeWidth={1.5} />
                                <span className="text-[12px] font-jakarta font-bold text-[#18181b] uppercase tracking-widest">{label}</span>
                                <span className="text-[11px] font-montserrat text-[#6b6b6b]">{sub}</span>
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
        <main className=" bg-white pt-6 pb-20">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-playfair { font-family: 'Playfair Display', serif; }
            `}</style>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">

                {/* Page title */}
                <h1 className="text-[32px] md:text-[40px] font-playfair font-semibold text-[#230532] mb-2">
                    Your Shopping Bag
                </h1>
                <p className="font-montserrat text-[#52525b] text-[14px] mb-4">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* ── Cart Items ── */}
                    <div className="lg:col-span-8 space-y-0">

                        {/* Table header — desktop only */}
                        <div className="hidden md:grid grid-cols-12 pb-5 border-b border-stone-200 text-[12px] font-jakarta uppercase tracking-widest font-bold text-[#6b6b6b]">
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
                                        <div className="w-24 h-32 bg-stone-50 overflow-hidden flex-shrink-0 border border-stone-100 rounded">
                                            {line.merchandise.product.featuredImage ? (
                                                <Image
                                                    src={line.merchandise.product.featuredImage.url}
                                                    alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
                                                    width={96}
                                                    height={128}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-stone-50">
                                                    <ShoppingBag className="text-stone-300" size={32} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-1 pt-1">
                                            <h3 className="text-[16px] md:text-[18px] font-jakarta font-semibold text-[#18181b]">
                                                {line.merchandise.product.title}
                                            </h3>
                                            {line.merchandise.title !== 'Default Title' && (
                                                <p className="text-[12px] font-montserrat text-[#6b6b6b] pt-1">
                                                    {line.merchandise.title}
                                                </p>
                                            )}
                                            <button
                                                onClick={() => handleRemoveItem(line.id)}
                                                className="flex items-center gap-1 text-[12px] font-jakarta font-medium text-rose-500 hover:opacity-60 transition-opacity pt-3"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={13} />
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Unit price */}
                                    <div className="col-span-2 text-center font-jakarta font-bold text-[#18181b] text-[15px]">
                                        ₹{unitPrice.toLocaleString('en-IN')}
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-2 flex justify-center">
                                        <div className="flex items-center border border-stone-200 px-3 py-1.5 gap-4 bg-white rounded-sm">
                                            <button
                                                onClick={() => handleQuantityChange(line.id, line.quantity, -1)}
                                                className="text-stone-400 hover:text-[#230532] transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-[15px] font-jakarta font-semibold w-4 text-center text-[#18181b]">
                                                {line.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(line.id, line.quantity, 1)}
                                                className="text-stone-400 hover:text-[#230532] transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Line total */}
                                    <div className="col-span-2 text-right font-jakarta font-bold text-[#230532] text-[16px]">
                                        ₹{parseFloat(line.cost.totalAmount.amount).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Continue shopping link */}
                        <div className="pt-8">
                            <button
                                onClick={() => router.back()}
                                className="text-[13px] font-jakarta font-semibold uppercase tracking-widest flex items-center gap-2 text-[#6b6b6b] hover:text-[#230532] transition-colors"
                            >
                                <ChevronRight size={16} className="rotate-180" />
                                <span>Continue Shopping</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="lg:col-span-4">
                        <div className="bg-stone-50/50 p-6 md:p-8 space-y-6 sticky top-32 border border-stone-100 rounded-sm">
                            <h2 className="text-[22px] font-playfair font-semibold text-[#230532]">
                                Order Summary
                            </h2>

                            {/* Coupon */}
                            <div className="pt-4 border-t border-stone-200">
                                <label className="block text-[11px] font-jakarta uppercase tracking-widest font-bold text-[#6b6b6b] mb-2">
                                    Coupon Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 px-3 py-2.5 border border-stone-200 bg-white font-montserrat text-[14px] text-[#18181b] focus:outline-none focus:border-[#230532] rounded-sm placeholder:text-stone-300"
                                    />
                                    <button className="px-5 py-2.5 bg-[#230532] text-white font-jakarta text-[13px] font-semibold rounded-sm hover:opacity-90 transition-opacity">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Price rows */}
                            <div className="space-y-4 pt-4 border-t border-stone-200">
                                <div className="flex justify-between font-montserrat text-[14px] text-[#52525b]">
                                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                                    <span className="font-jakarta font-semibold text-[#18181b]">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center font-montserrat text-[14px] text-[#52525b]">
                                    <span>Shipping</span>
                                    <span className="font-jakarta text-[12px] uppercase tracking-widest font-bold text-[#230532]">
                                        Complimentary
                                    </span>
                                </div>
                                <div className="flex justify-between font-montserrat text-[14px] text-[#52525b]">
                                    <span>Tax</span>
                                    <span className="font-jakarta font-semibold text-[#18181b]">
                                        {tax > 0 ? `₹${tax.toLocaleString('en-IN')}` : 'At checkout'}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="pt-5 border-t border-stone-200 flex justify-between items-center">
                                <span className="text-[20px] font-playfair font-semibold text-[#18181b]">Total</span>
                                <span className="text-[24px] font-jakarta font-bold text-[#230532]">
                                    ₹{total.toLocaleString('en-IN')}
                                </span>
                            </div>

                            {/* Checkout */}
                            <div className="pt-2">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-[#230532] text-white font-jakarta text-[14px] uppercase tracking-widest font-bold rounded flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                            {/* Continue shopping */}
                            <Link
                                href="/shop"
                                className="block w-full py-3 border border-[#230532] text-[#230532] font-jakarta text-[14px] uppercase tracking-widest font-bold text-center rounded hover:bg-stone-50 transition-colors"
                            >
                                Continue Shopping
                            </Link>

                            {/* Trust strip */}
                            <div className="pt-6 border-t border-stone-200 space-y-4">
                                {[
                                    { icon: Lock, text: 'Secure checkout with SSL encryption' },
                                    { icon: Truck, text: 'Free shipping on orders above ₹5,000' },
                                    { icon: Shield, text: '100% certified authentic jewellery' },
                                ].map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-3 font-montserrat text-[11px] text-[#6b6b6b] uppercase tracking-wider font-medium">
                                        <Icon size={16} className="text-[#230532] opacity-60 flex-shrink-0" />
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}