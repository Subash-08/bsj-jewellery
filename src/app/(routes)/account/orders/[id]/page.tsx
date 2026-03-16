"use client";

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, MapPin, CreditCard, Truck, CheckCircle, Clock, XCircle, RefreshCw, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthProvider';

interface TimelineStep {
    label: string;
    completed: boolean;
    current: boolean;
    icon: React.ElementType;
}

function buildTimeline(financialStatus: string, fulfillmentStatus: string): TimelineStep[] {
    const isCancelled = financialStatus === 'REFUNDED' || financialStatus === 'VOIDED';
    const isPaid = financialStatus === 'PAID' || financialStatus === 'PARTIALLY_PAID';
    const isShipped = fulfillmentStatus === 'PARTIAL' || fulfillmentStatus === 'FULFILLED';
    const isDelivered = fulfillmentStatus === 'FULFILLED';

    if (isCancelled) {
        return [
            { label: 'Order Placed', completed: true, current: false, icon: ShoppingBag },
            { label: 'Cancelled / Refunded', completed: true, current: true, icon: XCircle },
        ];
    }

    return [
        { label: 'Order Placed', completed: true, current: !isPaid && !isShipped && !isDelivered, icon: ShoppingBag },
        { label: 'Processing', completed: isPaid || isShipped || isDelivered, current: isPaid && !isShipped, icon: Clock },
        { label: 'Shipped', completed: isShipped || isDelivered, current: isShipped && !isDelivered, icon: Truck },
        { label: 'Delivered', completed: isDelivered, current: isDelivered, icon: CheckCircle },
    ];
}

function formatCurrency(amount: string | undefined, currency: string = 'INR') {
    if (!amount) return '₹0';
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
}

function getStatusBadge(financialStatus: string, fulfillmentStatus: string) {
    if (financialStatus === 'REFUNDED') {
        return { label: 'Refunded', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' };
    }
    switch (fulfillmentStatus) {
        case 'FULFILLED':
            return { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' };
        case 'PARTIAL':
            return { label: 'Shipped', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
        case 'UNFULFILLED':
            return { label: 'Processing', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' };
        default:
            return { label: 'Pending', bg: 'bg-stone-100', text: 'text-stone-600', dot: 'bg-stone-400' };
    }
}

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;
    const { customer, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-stone-400" size={32} />
            </div>
        );
    }

    if (!isAuthenticated || !customer) {
        return (
            <div className="bg-white rounded-2xl border border-stone-200/60 p-12 text-center">
                <h2 className="text-2xl font-serif text-stone-900 mb-3">Please Sign In</h2>
                <p className="text-stone-500 text-sm mb-6">You need to be logged in to view order details</p>
                <Link href="/login" className="inline-block px-8 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors">
                    Sign In
                </Link>
            </div>
        );
    }

    // Find order from customer data
    const orderEdge = customer.orders?.edges?.find(({ node }: any) => {
        const nodeIdSuffix = node.id.split('/').pop();
        return nodeIdSuffix === orderId || node.orderNumber?.toString() === orderId;
    });

    if (!orderEdge) {
        return (
            <div className="space-y-6">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm">
                    <ArrowLeft size={16} /> Back to Orders
                </button>
                <div className="bg-white rounded-2xl border border-stone-200/60 p-12 text-center">
                    <Package className="mx-auto text-stone-200 mb-4" size={56} strokeWidth={0.8} />
                    <h2 className="text-xl font-serif text-stone-900 mb-2">Order Not Found</h2>
                    <p className="text-stone-500 text-sm mb-6">We couldn't find order #{orderId}</p>
                    <Link href="/account/orders" className="inline-block px-8 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors">
                        View All Orders
                    </Link>
                </div>
            </div>
        );
    }

    const order = orderEdge.node;
    const timeline = buildTimeline(order.financialStatus, order.fulfillmentStatus);
    const statusBadge = getStatusBadge(order.financialStatus, order.fulfillmentStatus);
    const lineItems = order.lineItems?.edges || [];

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm"
            >
                <ArrowLeft size={16} />
                Back to Orders
            </button>

            {/* Order Header */}
            <div className="bg-white rounded-2xl border border-stone-200/60 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-serif font-light text-stone-900">
                                Order #{order.orderNumber}
                            </h1>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
                                {statusBadge.label}
                            </span>
                        </div>
                        <p className="text-stone-500 text-sm">
                            Placed on {new Date(order.processedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    <Link
                        href="/account/orders"
                        className="px-5 py-2.5 border border-stone-200 text-stone-600 text-xs uppercase tracking-widest font-bold hover:bg-stone-50 transition-colors self-start"
                    >
                        All Orders
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Timeline */}
                    <div className="bg-white rounded-2xl border border-stone-200/60 p-6">
                        <h2 className="text-lg font-serif text-stone-900 mb-6 flex items-center gap-2">
                            <Truck className="text-stone-400" size={18} />
                            Order Status
                        </h2>
                        <div className="flex items-center justify-between relative">
                            {/* Progress Bar Background */}
                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-stone-200"></div>
                            {/* Progress Bar Fill */}
                            {(() => {
                                const completedCount = timeline.filter(s => s.completed).length;
                                const percentage = timeline.length > 1 ? ((completedCount - 1) / (timeline.length - 1)) * 100 : 0;
                                return (
                                    <div
                                        className="absolute top-4 left-0 h-0.5 bg-stone-900 transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                );
                            })()}

                            {timeline.map((step, idx) => {
                                const Icon = step.icon;
                                return (
                                    <div key={idx} className="relative flex flex-col items-center z-10" style={{ width: `${100 / timeline.length}%` }}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                            step.completed
                                                ? 'bg-stone-900 border-stone-900 text-white'
                                                : 'bg-white border-stone-300 text-stone-400'
                                        } ${step.current ? 'ring-4 ring-stone-200' : ''}`}>
                                            <Icon size={14} />
                                        </div>
                                        <span className={`text-[11px] mt-2 text-center ${
                                            step.completed ? 'text-stone-900 font-medium' : 'text-stone-400'
                                        }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-2xl border border-stone-200/60 p-6">
                        <h2 className="text-lg font-serif text-stone-900 mb-4">
                            Items ({lineItems.length})
                        </h2>
                        <div className="space-y-3">
                            {lineItems.map(({ node: item }: any, idx: number) => {
                                const imageUrl = item.variant?.image?.url;
                                const price = item.variant?.price;

                                return (
                                    <div key={idx} className="flex gap-4 p-3 rounded-xl bg-stone-50/50">
                                        {/* Product Image */}
                                        <div className="w-16 h-16 rounded-lg bg-white border border-stone-200/60 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={item.title}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Package className="text-stone-300" size={20} />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-stone-900 text-sm truncate">{item.title}</h3>
                                            <p className="text-xs text-stone-500 mt-0.5">Qty: {item.quantity}</p>
                                        </div>
                                        {price && (
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-semibold text-stone-900 text-sm">
                                                    {formatCurrency(price.amount, price.currencyCode)}
                                                </p>
                                                {item.quantity > 1 && (
                                                    <p className="text-[11px] text-stone-400">
                                                        {formatCurrency((parseFloat(price.amount) * item.quantity).toString())} total
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Order Summary */}
                    <div className="bg-white rounded-2xl border border-stone-200/60 p-5">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-4">Order Summary</h2>
                        <div className="space-y-2.5 text-sm">
                            {order.subtotalPrice && (
                                <div className="flex justify-between text-stone-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(order.subtotalPrice.amount)}</span>
                                </div>
                            )}
                            {order.totalShippingPrice && (
                                <div className="flex justify-between text-stone-600">
                                    <span>Shipping</span>
                                    <span className={parseFloat(order.totalShippingPrice.amount) === 0 ? 'text-emerald-600 font-medium' : ''}>
                                        {parseFloat(order.totalShippingPrice.amount) === 0 ? 'FREE' : formatCurrency(order.totalShippingPrice.amount)}
                                    </span>
                                </div>
                            )}
                            {order.totalTax && (
                                <div className="flex justify-between text-stone-600">
                                    <span>Tax</span>
                                    <span>{formatCurrency(order.totalTax.amount)}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-stone-200 flex justify-between">
                                <span className="font-bold text-stone-900">Total</span>
                                <span className="font-bold text-stone-900 text-lg">
                                    {formatCurrency(order.totalPrice.amount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <div className="bg-white rounded-2xl border border-stone-200/60 p-5">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-3 flex items-center gap-2">
                                <MapPin size={14} /> Shipping Address
                            </h2>
                            <div className="text-sm text-stone-700 space-y-0.5">
                                <p className="font-medium text-stone-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p>{order.shippingAddress.address1}</p>
                                {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}</p>
                                <p>{order.shippingAddress.country}</p>
                                {order.shippingAddress.phone && <p className="text-stone-500 mt-1">{order.shippingAddress.phone}</p>}
                            </div>
                        </div>
                    )}

                    {/* Payment Status */}
                    <div className="bg-white rounded-2xl border border-stone-200/60 p-5">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-3 flex items-center gap-2">
                            <CreditCard size={14} /> Payment
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                                order.financialStatus === 'PAID' ? 'bg-emerald-500' :
                                order.financialStatus === 'REFUNDED' ? 'bg-red-500' : 'bg-amber-500'
                            }`}></span>
                            <span className="text-sm text-stone-700 capitalize">
                                {order.financialStatus?.toLowerCase().replace('_', ' ') || 'Pending'}
                            </span>
                        </div>
                    </div>

                    {/* Reorder Button */}
                    <Link
                        href="/collections"
                        className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-stone-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors rounded-xl"
                    >
                        <RefreshCw size={14} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
