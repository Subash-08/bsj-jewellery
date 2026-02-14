"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Package, Filter, Search, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useCustomer } from '@/hooks/useCustomer';

const statusFilters = ['All', 'Processing', 'Shipped', 'Delivered'];

export default function OrdersPage() {
    const { customer, loading, isLoggedIn } = useCustomer();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-12 border border-stone-200 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
                    <p className="mt-4 text-stone-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn || !customer) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-12 border border-stone-200 text-center">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Please Sign In</h2>
                    <p className="text-stone-600 mb-6">You need to be logged in to view your orders</p>
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

    const getStatusDisplay = (fulfillmentStatus: string) => {
        switch (fulfillmentStatus) {
            case 'FULFILLED':
                return { label: 'Delivered', color: 'green', icon: CheckCircle };
            case 'PARTIAL':
                return { label: 'Shipped', color: 'blue', icon: Truck };
            case 'UNFULFILLED':
                return { label: 'Processing', color: 'yellow', icon: Clock };
            default:
                return { label: fulfillmentStatus, color: 'gray', icon: Package };
        }
    };

    const orders = customer.orders.edges;

    const filteredOrders = orders.filter(({ node: order }) => {
        const status = getStatusDisplay(order.fulfillmentStatus);
        const matchesFilter = selectedFilter === 'All' || status.label === selectedFilter;
        const matchesSearch = order.orderNumber.toString().includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">My Orders</h1>
                <p className="text-stone-600">View and track all your orders</p>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    {/* Status Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter size={20} className="text-stone-600" />
                        {statusFilters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedFilter === filter
                                        ? 'bg-rose-600 text-white shadow-md'
                                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by order number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                        />
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 border border-stone-200 text-center">
                    <Package className="mx-auto text-stone-300 mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
                    <p className="text-stone-600 mb-6">
                        {searchQuery ? 'Try adjusting your search' : 'You haven\'t placed any orders yet'}
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(({ node: order }) => {
                        const status = getStatusDisplay(order.fulfillmentStatus);
                        const StatusIcon = status.icon;
                        const itemCount = order.lineItems.edges.reduce((sum, { node }) => sum + node.quantity, 0);

                        return (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-rose-50 to-white p-4 border-b border-stone-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <StatusIcon className={`
                                                    ${status.color === 'green' ? 'text-green-600' : ''}
                                                    ${status.color === 'blue' ? 'text-blue-600' : ''}
                                                    ${status.color === 'yellow' ? 'text-yellow-600' : ''}
                                                `} size={20} />
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">Order #{order.orderNumber}</h3>
                                                    <p className="text-sm text-stone-600">
                                                        Placed on {new Date(order.processedAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                ${status.color === 'green' ? 'bg-green-100 text-green-700' : ''}
                                                ${status.color === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                                                ${status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' : ''}
                                            `}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-4">
                                    <div className="space-y-3 mb-4">
                                        {order.lineItems.edges.map(({ node: item }, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center">
                                                    <Package className="text-stone-400" size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                                                    <p className="text-sm text-stone-600">Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-stone-200">
                                        <div>
                                            <p className="text-sm text-stone-600">Total Amount</p>
                                            <p className="text-2xl font-bold text-rose-600">
                                                ₹{parseFloat(order.totalPrice.amount).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/account/orders/${order.id.split('/').pop()}`}
                                            className="px-6 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium text-center"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
