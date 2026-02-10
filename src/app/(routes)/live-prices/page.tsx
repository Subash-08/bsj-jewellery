"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function LivePricesPage() {
    const [prices, setPrices] = useState({
        gold24k: 6250,
        gold22k: 5730,
        gold18k: 4688,
        silver: 78.50,
    });

    // Simulate live price updates
    useEffect(() => {
        const interval = setInterval(() => {
            setPrices(prev => ({
                gold24k: prev.gold24k + (Math.random() - 0.5) * 10,
                gold22k: prev.gold22k + (Math.random() - 0.5) * 10,
                gold18k: prev.gold18k + (Math.random() - 0.5) * 10,
                silver: prev.silver + (Math.random() - 0.5) * 0.5,
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const priceItems = [
        { label: '24K Gold', price: prices.gold24k, unit: '₹/gram', trend: 'up' },
        { label: '22K Gold', price: prices.gold22k, unit: '₹/gram', trend: 'down' },
        { label: '18K Gold', price: prices.gold18k, unit: '₹/gram', trend: 'up' },
        { label: 'Silver', price: prices.silver, unit: '₹/gram', trend: 'up' },
    ];

    return (
        <main className="bg-white min-h-screen pt-32">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full mb-4">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            <span className="text-sm font-bold uppercase">Live Rates</span>
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Today's Gold & Silver Rates</h1>
                        <p className="text-gray-600">Updated in real-time | Last updated: {new Date().toLocaleTimeString()}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {priceItems.map((item) => (
                            <div key={item.label} className="bg-gradient-to-br from-stone-50 to-white border border-stone-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{item.label}</h3>
                                        <p className="text-sm text-gray-500">{item.unit}</p>
                                    </div>
                                    {item.trend === 'up' ? (
                                        <TrendingUp className="text-green-600" size={24} />
                                    ) : (
                                        <TrendingDown className="text-red-600" size={24} />
                                    )}
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    ₹{item.price.toFixed(2)}
                                </div>
                                <div className={`text-sm mt-2 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.trend === 'up' ? '+' : '-'}₹{(Math.random() * 10).toFixed(2)} today
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-rose-50 border border-rose-100 rounded-lg p-6">
                        <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Important Notes</h2>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-rose-600 mt-1">•</span>
                                <span>Prices are indicative and may vary based on market conditions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-600 mt-1">•</span>
                                <span>Making charges and GST are additional</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-600 mt-1">•</span>
                                <span>For exact pricing, please visit our store or contact us</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
