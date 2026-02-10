"use client";

import Link from 'next/link';
import { Mail, ChevronDown } from 'lucide-react';

export default function TopBar() {
    return (
        <div className="bg-rose-50 border-b border-rose-100 py-1 text-center text-xs sm:text-sm font-medium text-gray-800 tracking-wide relative z-[51]">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="hidden sm:flex items-center gap-2">
                    <Mail size={12} className="text-rose-600" />
                    <span>support@bsjjewellery.com</span>
                </div>
                <p className="flex-1 text-center">
                    Pan India Free Shipping on Orders Above ₹10,000!
                    <span className="ml-2 font-bold text-rose-700">CODE: BSJNEW</span>
                </p>
                <div className="hidden sm:flex items-center gap-4">
                    <Link href="/track-order" className="hover:text-rose-600 transition-colors">
                        Track Order
                    </Link>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-rose-600">
                        <span>INR</span>
                        <ChevronDown size={12} />
                    </div>
                </div>
            </div>
        </div>
    );
}
