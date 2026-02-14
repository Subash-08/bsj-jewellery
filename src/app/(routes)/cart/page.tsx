"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Tag, Truck, Shield, ChevronRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
    const { cart, itemCount, updateCartItem, removeCartItem } = useCart();
    const router = useRouter();
    const [couponCode, setCouponCode] = useState('');

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

    // Empty cart state
    if (!cart || itemCount === 0) {
        return (
            <main className="min-h-screen bg-rose-50 pt-32 pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        {/* Empty Cart Icon */}
                        <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                            <ShoppingBag size={64} className="text-stone-300" />
                        </div>

                        {/* Empty Cart Message */}
                        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4">
                            Your Cart is Empty
                        </h1>
                        <p className="text-stone-600 mb-8 text-lg">
                            Looks like you haven't added any jewellery to your cart yet.
                            <br />
                            Start shopping to find your perfect piece!
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/shop"
                                className="px-8 py-4 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <ShoppingBag size={20} />
                                Start Shopping
                            </Link>
                            <Link
                                href="/collections/new-arrivals"
                                className="px-8 py-4 bg-white text-stone-700 border-2 border-stone-300 rounded-md hover:bg-stone-50 transition-colors font-semibold flex items-center justify-center gap-2"
                            >
                                View New Arrivals
                                <ChevronRight size={20} />
                            </Link>
                        </div>

                        {/* Feature Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <Truck className="text-rose-600 mx-auto mb-3" size={32} />
                                <h3 className="font-semibold text-gray-800 mb-2">Free Shipping</h3>
                                <p className="text-sm text-stone-600">On orders above ₹5,000</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <Shield className="text-rose-600 mx-auto mb-3" size={32} />
                                <h3 className="font-semibold text-gray-800 mb-2">Certified Jewellery</h3>
                                <p className="text-sm text-stone-600">100% authentic & certified</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <Tag className="text-rose-600 mx-auto mb-3" size={32} />
                                <h3 className="font-semibold text-gray-800 mb-2">Best Prices</h3>
                                <p className="text-sm text-stone-600">Competitive market rates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-rose-50 pt-32 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-stone-600 hover:text-rose-600 transition-colors mb-4 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Continue Shopping</span>
                    </button>
                    <h1 className="text-4xl font-serif font-bold text-gray-800">Shopping Cart</h1>
                    <p className="text-stone-600 mt-2">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.lines.edges.map(({ node: line }) => (
                            <div
                                key={line.id}
                                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <div className="w-32 h-32 bg-stone-100 rounded-md overflow-hidden flex-shrink-0 border border-stone-200">
                                        {line.merchandise.product.featuredImage ? (
                                            <img
                                                src={line.merchandise.product.featuredImage.url}
                                                alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="text-stone-300" size={40} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                                    {line.merchandise.product.title}
                                                </h3>
                                                {line.merchandise.title !== 'Default Title' && (
                                                    <p className="text-sm text-stone-500">
                                                        {line.merchandise.title}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(line.id)}
                                                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-medium text-stone-600">Quantity:</span>
                                                <div className="flex items-center border-2 border-stone-300 rounded-md bg-white">
                                                    <button
                                                        onClick={() => handleQuantityChange(line.id, line.quantity, -1)}
                                                        className="p-2 hover:bg-stone-100 transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus size={16} className="text-stone-600" />
                                                    </button>
                                                    <span className="px-6 text-base font-semibold text-gray-800 min-w-[50px] text-center">
                                                        {line.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(line.id, line.quantity, 1)}
                                                        className="p-2 hover:bg-stone-100 transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus size={16} className="text-stone-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-800">
                                                    ₹{parseFloat(line.cost.totalAmount.amount).toLocaleString('en-IN')}
                                                </p>
                                                {line.quantity > 1 && (
                                                    <p className="text-sm text-stone-500">
                                                        ₹{(parseFloat(line.cost.totalAmount.amount) / line.quantity).toLocaleString('en-IN')} each
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
                            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Order Summary</h2>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-stone-700 mb-2">
                                    Have a coupon code?
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-sm"
                                    />
                                    <button className="px-4 py-2 bg-stone-100 text-stone-700 rounded-md hover:bg-stone-200 transition-colors font-medium text-sm">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-stone-200">
                                <div className="flex justify-between text-stone-600">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span className="font-semibold">
                                        ₹{parseFloat(cart.cost?.subtotalAmount?.amount || '0').toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div className="flex justify-between text-stone-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                                <div className="flex justify-between text-stone-600">
                                    <span>Tax</span>
                                    <span className="font-semibold">
                                        ₹{parseFloat(cart.cost?.totalTaxAmount?.amount || '0').toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-semibold text-gray-800">Total</span>
                                <span className="text-3xl font-bold text-rose-600">
                                    ₹{parseFloat(cart.cost?.totalAmount?.amount || '0').toLocaleString('en-IN')}
                                </span>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                className="w-full py-4 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-all duration-200 font-bold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-4"
                            >
                                Proceed to Checkout
                            </button>

                            {/* Continue Shopping */}
                            <Link
                                href="/shop"
                                className="block w-full py-3 bg-white text-stone-700 border-2 border-stone-300 rounded-md hover:bg-stone-50 transition-colors font-semibold text-center"
                            >
                                Continue Shopping
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-stone-200 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-stone-600">
                                    <Shield className="text-rose-600 flex-shrink-0" size={20} />
                                    <span>Secure checkout with SSL encryption</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-stone-600">
                                    <Truck className="text-rose-600 flex-shrink-0" size={20} />
                                    <span>Free shipping on orders above ₹5,000</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-stone-600">
                                    <Tag className="text-rose-600 flex-shrink-0" size={20} />
                                    <span>100% certified authentic jewellery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}