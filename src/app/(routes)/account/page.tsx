"use client";

import Link from 'next/link';
import { Package, MapPin, Heart, TrendingUp, ShoppingBag, Truck, Clock } from 'lucide-react';
import { useCustomer } from '@/hooks/useCustomer';

export default function AccountDashboard() {
    const { customer, loading, isLoggedIn } = useCustomer();

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-12 border border-stone-200 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
                    <p className="mt-4 text-stone-600">Loading your account...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn || !customer) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-12 border border-stone-200 text-center">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Please Sign In</h2>
                    <p className="text-stone-600 mb-6">You need to be logged in to view your account</p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const totalOrders = customer.orders.edges.length;
    const activeOrders = customer.orders.edges.filter(({ node }) =>
        node.fulfillmentStatus !== 'FULFILLED'
    ).length;

    // Get recent orders (last 3)
    const recentOrders = customer.orders.edges.slice(0, 3);

    const getStatusDisplay = (fulfillmentStatus: string) => {
        switch (fulfillmentStatus) {
            case 'FULFILLED':
                return { label: 'Delivered', color: 'green' };
            case 'PARTIAL':
                return { label: 'Shipped', color: 'blue' };
            case 'UNFULFILLED':
                return { label: 'Processing', color: 'yellow' };
            default:
                return { label: fulfillmentStatus, color: 'gray' };
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Header */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-stone-200">
                <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">
                    Welcome Back, {customer.firstName || 'Valued Customer'}!
                </h1>
                <p className="text-stone-600 text-lg">
                    Manage your orders, addresses, and account settings all in one place.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                            <Package className="text-rose-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">{totalOrders}</h3>
                    <p className="text-stone-600 text-sm">Total Orders</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Truck className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">{activeOrders}</h3>
                    <p className="text-stone-600 text-sm">Active Orders</p>
                </div>

                <Link href="/wishlist" className="bg-white rounded-xl shadow-sm p-6 border border-stone-200 hover:shadow-md transition-shadow block">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <Heart className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">-</h3>
                    <p className="text-stone-600 text-sm">Wishlist Items</p>
                </Link>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                            <MapPin className="text-amber-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">{customer.defaultAddress ? '1' : '0'}</h3>
                    <p className="text-stone-600 text-sm">Saved Addresses</p>
                </div>
            </div>

            {/* Recent Orders */}
            {recentOrders.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-stone-200">
                    <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                        <h2 className="text-2xl font-serif font-bold text-gray-800">Recent Orders</h2>
                        <Link
                            href="/account/orders"
                            className="text-rose-600 hover:text-rose-700 font-medium text-sm flex items-center gap-1"
                        >
                            View All Orders →
                        </Link>
                    </div>

                    <div className="divide-y divide-stone-200">
                        {recentOrders.map(({ node: order }) => {
                            const status = getStatusDisplay(order.fulfillmentStatus);
                            const itemCount = order.lineItems.edges.reduce((sum, { node }) => sum + node.quantity, 0);

                            return (
                                <div key={order.id} className="p-6 hover:bg-rose-50/50 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                                                <ShoppingBag className="text-rose-600" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800 mb-1">Order #{order.orderNumber}</h3>
                                                <p className="text-sm text-stone-600 flex items-center gap-2">
                                                    <Clock size={14} />
                                                    {new Date(order.processedAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-sm text-stone-600 mt-1">
                                                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-gray-800">
                                                    ₹{parseFloat(order.totalPrice.amount).toLocaleString('en-IN')}
                                                </p>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2
                                                    ${status.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                                                    ${status.color === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                                                    ${status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                `}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/account/orders/${order.id.split('/').pop()}`}
                                                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium text-sm whitespace-nowrap"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* No Orders State */}
            {recentOrders.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 border border-stone-200 text-center">
                    <Package className="mx-auto text-stone-300 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
                    <p className="text-stone-600 mb-6">Start shopping to see your orders here</p>
                    <Link
                        href="/shop"
                        className="inline-block px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/account/orders"
                    className="bg-white rounded-xl shadow-sm p-6 border border-stone-200 hover:shadow-md hover:border-rose-300 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
                        <Package className="text-rose-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Track Your Orders</h3>
                    <p className="text-sm text-stone-600">View order status and tracking information</p>
                </Link>

                <Link
                    href="/wishlist"
                    className="bg-white rounded-xl shadow-sm p-6 border border-stone-200 hover:shadow-md hover:border-rose-300 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                        <Heart className="text-purple-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">View Wishlist</h3>
                    <p className="text-sm text-stone-600">See your saved items and favorites</p>
                </Link>

                <Link
                    href="/account/profile"
                    className="bg-white rounded-xl shadow-sm p-6 border border-stone-200 hover:shadow-md hover:border-rose-300 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                        <MapPin className="text-amber-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Manage Profile</h3>
                    <p className="text-sm text-stone-600">Update your personal information</p>
                </Link>
            </div>
        </div>
    );
}
