"use client";

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, MapPin, CreditCard, Download, Truck, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

// Mock order details (in real app, fetch based on ID)
const orderDetails = {
    id: 'ORD-2024-001',
    date: '2024-02-08',
    status: 'Delivered',
    deliveryDate: '2024-02-10',
    items: [
        {
            name: 'Gold Necklace Set',
            image: '/placeholder.jpg',
            quantity: 1,
            price: 35000,
            variant: '22K Gold, 25g'
        },
        {
            name: 'Diamond Earrings',
            image: '/placeholder.jpg',
            quantity: 1,
            price: 10000,
            variant: '18K Gold, 0.5ct'
        }
    ],
    subtotal: 45000,
    shipping: 0,
    tax: 0,
    total: 45000,
    shippingAddress: {
        name: 'John Doe',
        phone: '+91 98765 43210',
        address: '123, MG Road, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
    },
    paymentMethod: 'Credit Card',
    trackingNumber: 'TRK123456789',
    timeline: [
        { status: 'Order Placed', date: '2024-02-08 10:30 AM', completed: true },
        { status: 'Order Confirmed', date: '2024-02-08 11:00 AM', completed: true },
        { status: 'Shipped', date: '2024-02-09 09:00 AM', completed: true },
        { status: 'Out for Delivery', date: '2024-02-10 08:00 AM', completed: true },
        { status: 'Delivered', date: '2024-02-10 02:30 PM', completed: true }
    ]
};

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-stone-600 hover:text-rose-600 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back to Orders</span>
            </button>

            {/* Order Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
                            Order {orderId}
                        </h1>
                        <p className="text-stone-600">
                            Placed on {new Date(orderDetails.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-white border-2 border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors font-medium flex items-center gap-2">
                        <Download size={20} />
                        Download Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Timeline */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Truck className="text-rose-600" />
                            Order Tracking
                        </h2>
                        <div className="space-y-4">
                            {orderDetails.timeline.map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-stone-300'
                                            }`}>
                                            {step.completed && <CheckCircle className="text-white" size={20} />}
                                        </div>
                                        {idx < orderDetails.timeline.length - 1 && (
                                            <div className={`w-0.5 h-12 ${step.completed ? 'bg-green-500' : 'bg-stone-300'}`} />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-8">
                                        <h3 className="font-semibold text-gray-800">{step.status}</h3>
                                        <p className="text-sm text-stone-600">{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Order Items</h2>
                        <div className="space-y-4">
                            {orderDetails.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 bg-rose-50 rounded-lg">
                                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center border border-stone-200">
                                        <Package className="text-stone-400" size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-stone-600 mt-1">{item.variant}</p>
                                        <p className="text-sm text-stone-600 mt-1">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800">
                                            ₹{item.price.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                        <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-stone-600">
                                <span>Subtotal</span>
                                <span>₹{orderDetails.subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-stone-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">FREE</span>
                            </div>
                            <div className="flex justify-between text-stone-600">
                                <span>Tax</span>
                                <span>₹{orderDetails.tax.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="pt-3 border-t border-stone-200 flex justify-between">
                                <span className="font-bold text-gray-800">Total</span>
                                <span className="font-bold text-rose-600 text-xl">
                                    ₹{orderDetails.total.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                        <h2 className="text-xl font-serif font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin className="text-rose-600" size={20} />
                            Shipping Address
                        </h2>
                        <div className="text-stone-700 space-y-1">
                            <p className="font-semibold">{orderDetails.shippingAddress.name}</p>
                            <p>{orderDetails.shippingAddress.phone}</p>
                            <p>{orderDetails.shippingAddress.address}</p>
                            <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
                            <p>{orderDetails.shippingAddress.pincode}</p>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-stone-200">
                        <h2 className="text-xl font-serif font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <CreditCard className="text-rose-600" size={20} />
                            Payment Method
                        </h2>
                        <p className="text-stone-700">{orderDetails.paymentMethod}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
