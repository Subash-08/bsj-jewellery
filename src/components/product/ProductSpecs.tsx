"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Inline ChevronDown Icon
const ChevronDown = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

interface SpecItem {
    label: string;
    value: string | number | null | undefined;
}

interface ProductSpecsProps {
    specifications: SpecItem[];
    careInstructions?: string;
    priceBreakdown?: {
        metalRate?: string;
        makingCharges?: string;
        gst?: string;
        gstAmount?: string;
    };
}

export default function ProductSpecs({ specifications, careInstructions, priceBreakdown }: ProductSpecsProps) {
    const [openSection, setOpenSection] = useState<string | null>('specifications');

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const AccordionItem = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
        <div className="border-b border-gray-200 last:border-0">
            <button
                onClick={() => toggleSection(id)}
                className="flex items-center justify-between w-full py-4 text-left group"
            >
                <span className="text-sm font-medium text-gray-900 group-hover:text-yellow-700 transition-colors">
                    {title}
                </span>
                <ChevronDown
                    className={cn(
                        "w-4 h-4 text-gray-500 transition-transform duration-300",
                        openSection === id ? "rotate-180" : ""
                    )}
                />
            </button>
            <AnimatePresence>
                {openSection === id && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-sm text-gray-600 leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="mt-10 border-t border-gray-200">
            {specifications.length > 0 && (
                <AccordionItem id="specifications" title="Product Specifications">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                        {specifications.map((spec, idx) => (
                            <div key={idx} className="flex justify-between sm:justify-start sm:gap-4">
                                <span className="text-gray-500 min-w-[120px]">{spec.label}</span>
                                <span className="font-medium text-gray-900">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </AccordionItem>
            )}

            {careInstructions && (
                <AccordionItem id="care" title="Care Instructions">
                    <p>{careInstructions}</p>
                </AccordionItem>
            )}

            {(priceBreakdown?.metalRate || priceBreakdown?.makingCharges) && (
                <AccordionItem id="price" title="Price Breakdown">
                    <ul className="space-y-2">
                        {priceBreakdown.metalRate && (
                            <li className="flex justify-between">
                                <span>Metal Rate</span>
                                <span>₹{priceBreakdown.metalRate}/gram</span>
                            </li>
                        )}
                        {priceBreakdown.makingCharges && (
                            <li className="flex justify-between">
                                <span>Making Charges</span>
                                <span>₹{priceBreakdown.makingCharges}</span>
                            </li>
                        )}
                        {priceBreakdown.gst && (
                            <li className="flex justify-between">
                                <span>GST ({priceBreakdown.gst}%)</span>
                                <span>{priceBreakdown.gstAmount ? `₹${priceBreakdown.gstAmount}` : '-'}</span>
                            </li>
                        )}
                    </ul>
                </AccordionItem>
            )}

            <AccordionItem id="shipping" title="Shipping & Returns">
                <p>
                    Free shipping on all orders above ₹5000. We offer a 7-day return policy for unused items in original packaging.
                    Customized items are not eligible for return.
                </p>
            </AccordionItem>
        </div>
    );
}
