"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Package, Search, Clock, Truck, CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

const statusFilters = ['All', 'Processing', 'Shipped', 'Delivered'];

export default function OrdersPage() {
    const { customer, isAuthenticated, isLoading } = useAuth();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-16 bg-white/60 rounded-xl"></div>
                <div className="h-12 bg-white/60 rounded-xl"></div>
                <div className="h-40 bg-white/60 rounded-xl"></div>
                <div className="h-40 bg-white/60 rounded-xl"></div>
            </div>
        );
    }

    if (!isAuthenticated || !customer) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-12 border border-stone-200/60 text-center">
                <h2 className="text-2xl font-serif text-stone-900 mb-3">Please Sign In</h2>
                <p className="text-stone-500 text-sm mb-6">You need to be logged in to view your orders</p>
                <Link
                    href="/login"
                    className="inline-block px-8 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    const getStatusDisplay = (fulfillmentStatus: string) => {
        switch (fulfillmentStatus) {
            case 'FULFILLED':
                return { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', icon: CheckCircle };
            case 'PARTIAL':
                return { label: 'Shipped', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', icon: Truck };
            case 'UNFULFILLED':
                return { label: 'Processing', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', icon: Clock };
            default:
                return { label: fulfillmentStatus || 'Pending', bg: 'bg-stone-100', text: 'text-stone-600', dot: 'bg-stone-400', icon: Package };
        }
    };

    const orders = customer.orders?.edges || [];

    const filteredOrders = orders.filter(({ node: order }: any) => {
        const status = getStatusDisplay(order.fulfillmentStatus);
        const matchesFilter = selectedFilter === 'All' || status.label === selectedFilter;
        const matchesSearch = order.orderNumber.toString().includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-light text-stone-900">My Orders</h1>
                <p className="text-stone-500 text-sm mt-1">View and track all your orders</p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setSelectedFilter(filter)}
                            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${selectedFilter === filter
                                ? 'bg-stone-900 text-white shadow-sm'
                                : 'bg-white text-stone-600 border border-stone-200/60 hover:border-stone-300'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by order #"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-stone-200/60 bg-white rounded-lg focus:ring-2 focus:ring-stone-300 focus:border-stone-400 text-sm"
                    />
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200/60 p-12 text-center">
                    <Package className="mx-auto text-stone-200 mb-4" size={56} strokeWidth={0.8} />
                    <h3 className="text-xl font-serif text-stone-800 mb-2">No Orders Found</h3>
                    <p className="text-stone-500 text-sm mb-6">
                        {searchQuery ? 'Try adjusting your search' : 'You haven\'t placed any orders yet'}
                    </p>
                    <Link
                        href="/collections"
                        className="inline-block px-8 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredOrders.map(({ node: order }: any) => {
                        const status = getStatusDisplay(order.fulfillmentStatus);
                        const itemCount = order.lineItems.edges.reduce((sum: number, { node }: any) => sum + node.quantity, 0);
                        const itemImages = order.lineItems.edges
                            .map(({ node }: any) => node.variant?.image?.url)
                            .filter(Boolean)
                            .slice(0, 3);

                        return (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id.split('/').pop()}`}
                                className="block bg-white rounded-xl border border-stone-200/60 overflow-hidden hover:border-stone-300 hover:shadow-md transition-all group"
                            >
                                <div className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            {/* Image Stack */}
                                            <div className="flex -space-x-2 flex-shrink-0">
                                                {itemImages.length > 0 ? (
                                                    itemImages.map((url: string, i: number) => (
                                                        <div key={i} className="w-12 h-12 rounded-lg border-2 border-white bg-stone-100 overflow-hidden shadow-sm">
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center">
                                                        <ShoppingBag className="text-stone-400" size={18} />
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h3 className="font-medium text-stone-900 text-sm">Order #{order.orderNumber}</h3>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${status.bg} ${status.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-stone-500 flex items-center gap-1">
                                                    {new Date(order.processedAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                    <span className="mx-1">·</span>
                                                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <p className="text-lg font-semibold text-stone-900">
                                                ₹{parseFloat(order.totalPrice.amount).toLocaleString('en-IN')}
                                            </p>
                                            <ArrowRight size={16} className="text-stone-300 group-hover:text-stone-600 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
