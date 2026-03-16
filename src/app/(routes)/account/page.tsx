"use client";

import Link from 'next/link';
import { Package, MapPin, Heart, ShoppingBag, Truck, Clock, ArrowRight, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

export default function AccountDashboard() {
    const { customer, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-32 bg-white/60 rounded-2xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-28 bg-white/60 rounded-xl"></div>
                    <div className="h-28 bg-white/60 rounded-xl"></div>
                    <div className="h-28 bg-white/60 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !customer) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-12 border border-stone-200/60 text-center">
                <h2 className="text-2xl font-serif text-stone-900 mb-3">Please Sign In</h2>
                <p className="text-stone-500 text-sm mb-6">You need to be logged in to view your account</p>
                <Link
                    href="/login"
                    className="inline-block px-8 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    const orders = customer.orders?.edges || [];
    const totalOrders = orders.length;
    const activeOrders = orders.filter(({ node }: any) =>
        node.fulfillmentStatus !== 'FULFILLED'
    ).length;
    const recentOrders = orders.slice(0, 3);
    const addressCount = customer.addresses?.edges?.length || (customer.defaultAddress ? 1 : 0);

    const getStatusDisplay = (fulfillmentStatus: string) => {
        switch (fulfillmentStatus) {
            case 'FULFILLED':
                return { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' };
            case 'PARTIAL':
                return { label: 'Shipped', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
            case 'UNFULFILLED':
                return { label: 'Processing', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
            default:
                return { label: fulfillmentStatus || 'Pending', bg: 'bg-stone-100', text: 'text-stone-600', dot: 'bg-stone-400' };
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-2xl p-8 md:p-10 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full -ml-10 -mb-10"></div>
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <Crown size={18} className="text-amber-400" />
                        <span className="text-amber-400/80 text-xs uppercase tracking-[0.2em] font-medium">BSJ Member</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-light mb-2">
                        Welcome back, <span className="font-normal">{customer.firstName || 'Valued Customer'}</span>
                    </h1>
                    <p className="text-stone-400 text-sm max-w-md">
                        Manage your orders, addresses, and preferences from your personal dashboard.
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/account/orders" className="group bg-white rounded-xl p-5 border border-stone-200/60 hover:border-stone-300 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors">
                            <Package size={20} className="text-stone-600 group-hover:text-white" />
                        </div>
                        <ArrowRight size={16} className="text-stone-300 group-hover:text-stone-600 transition-colors" />
                    </div>
                    <p className="text-2xl font-bold text-stone-900">{totalOrders}</p>
                    <p className="text-stone-500 text-xs uppercase tracking-wider mt-0.5">Total Orders</p>
                </Link>

                <div className="bg-white rounded-xl p-5 border border-stone-200/60">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Truck size={20} className="text-amber-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-stone-900">{activeOrders}</p>
                    <p className="text-stone-500 text-xs uppercase tracking-wider mt-0.5">Active Orders</p>
                </div>

                <Link href="/account/addresses" className="group bg-white rounded-xl p-5 border border-stone-200/60 hover:border-stone-300 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors">
                            <MapPin size={20} className="text-stone-600 group-hover:text-white" />
                        </div>
                        <ArrowRight size={16} className="text-stone-300 group-hover:text-stone-600 transition-colors" />
                    </div>
                    <p className="text-2xl font-bold text-stone-900">{addressCount}</p>
                    <p className="text-stone-500 text-xs uppercase tracking-wider mt-0.5">Saved Addresses</p>
                </Link>
            </div>

            {/* Recent Orders */}
            {recentOrders.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden">
                    <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
                        <h2 className="text-lg font-serif text-stone-900">Recent Orders</h2>
                        <Link
                            href="/account/orders"
                            className="text-stone-500 hover:text-stone-900 text-xs uppercase tracking-widest font-medium flex items-center gap-1 transition-colors"
                        >
                            View All <ArrowRight size={12} />
                        </Link>
                    </div>

                    <div className="divide-y divide-stone-100">
                        {recentOrders.map(({ node: order }: any) => {
                            const status = getStatusDisplay(order.fulfillmentStatus);
                            const itemCount = order.lineItems.edges.reduce((sum: number, { node }: any) => sum + node.quantity, 0);
                            const firstItemImage = order.lineItems.edges[0]?.node?.variant?.image?.url;

                            return (
                                <Link
                                    key={order.id}
                                    href={`/account/orders/${order.id.split('/').pop()}`}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/50 transition-colors group"
                                >
                                    {/* Product thumbnail or icon */}
                                    <div className="w-14 h-14 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {firstItemImage ? (
                                            <img src={firstItemImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <ShoppingBag className="text-stone-400" size={20} />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-medium text-stone-900 text-sm">Order #{order.orderNumber}</h3>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${status.bg} ${status.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                                {status.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-stone-500 flex items-center gap-1">
                                            <Clock size={11} />
                                            {new Date(order.processedAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                            <span className="mx-1">·</span>
                                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-stone-900 text-sm">
                                            ₹{parseFloat(order.totalPrice.amount).toLocaleString('en-IN')}
                                        </p>
                                        <ArrowRight size={14} className="text-stone-300 group-hover:text-stone-600 transition-colors ml-auto mt-1" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty Orders State */}
            {recentOrders.length === 0 && (
                <div className="bg-white rounded-2xl border border-stone-200/60 p-12 text-center">
                    <Package className="mx-auto text-stone-200 mb-4" size={56} strokeWidth={0.8} />
                    <h3 className="text-xl font-serif text-stone-800 mb-2">No Orders Yet</h3>
                    <p className="text-stone-500 text-sm mb-6 max-w-sm mx-auto">Begin your jewellery journey — explore our curated collections</p>
                    <Link
                        href="/collections"
                        className="inline-block px-8 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/account/orders"
                    className="bg-white rounded-xl p-5 border border-stone-200/60 hover:border-stone-300 hover:shadow-md transition-all group"
                >
                    <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-3 group-hover:bg-stone-900 transition-colors">
                        <Package className="text-stone-600 group-hover:text-white transition-colors" size={18} />
                    </div>
                    <h3 className="font-medium text-stone-900 text-sm mb-1">Track Orders</h3>
                    <p className="text-xs text-stone-500">View order status and details</p>
                </Link>

                <Link
                    href="/wishlist"
                    className="bg-white rounded-xl p-5 border border-stone-200/60 hover:border-stone-300 hover:shadow-md transition-all group"
                >
                    <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-3 group-hover:bg-stone-900 transition-colors">
                        <Heart className="text-stone-600 group-hover:text-white transition-colors" size={18} />
                    </div>
                    <h3 className="font-medium text-stone-900 text-sm mb-1">Wishlist</h3>
                    <p className="text-xs text-stone-500">Your saved favourites</p>
                </Link>

                <Link
                    href="/account/profile"
                    className="bg-white rounded-xl p-5 border border-stone-200/60 hover:border-stone-300 hover:shadow-md transition-all group"
                >
                    <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-3 group-hover:bg-stone-900 transition-colors">
                        <MapPin className="text-stone-600 group-hover:text-white transition-colors" size={18} />
                    </div>
                    <h3 className="font-medium text-stone-900 text-sm mb-1">Manage Profile</h3>
                    <p className="text-xs text-stone-500">Update your information</p>
                </Link>
            </div>
        </div>
    );
}
