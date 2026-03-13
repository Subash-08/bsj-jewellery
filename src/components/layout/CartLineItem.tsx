'use client';

import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import type { CartLine } from '@/types/shopify/cart';

interface CartLineItemProps {
    line: CartLine;
    onQuantityChange: (lineId: string, currentQuantity: number, change: number) => void;
    onRemove: (lineId: string) => void;
}

export function CartLineItem({ line, onQuantityChange, onRemove }: CartLineItemProps) {
    return (
        <div className="flex gap-3 p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors group">
            {/* Product Image */}
            <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0 border border-stone-200">
                {line.merchandise.product.featuredImage ? (
                    <img
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.featuredImage.altText || line.merchandise.product.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-100">
                        <ShoppingBag className="text-stone-300" size={24} />
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-800 truncate mb-1">
                    {line.merchandise.product.title}
                </h4>
                {line.merchandise.title !== 'Default Title' && (
                    <p className="text-xs text-stone-500 mb-2">{line.merchandise.title}</p>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-stone-300 rounded-md bg-white">
                        <button
                            onClick={() => onQuantityChange(line.id, line.quantity, -1)}
                            className="p-1 hover:bg-stone-100 transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <Minus size={14} className="text-stone-600" />
                        </button>
                        <span className="px-3 text-sm font-medium text-gray-800 min-w-[30px] text-center">
                            {line.quantity}
                        </span>
                        <button
                            onClick={() => onQuantityChange(line.id, line.quantity, 1)}
                            className="p-1 hover:bg-stone-100 transition-colors"
                            aria-label="Increase quantity"
                        >
                            <Plus size={14} className="text-stone-600" />
                        </button>
                    </div>

                    {/* Remove Button */}
                    <button
                        onClick={() => onRemove(line.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 lg:opacity-100" // Ensure visible on mobile
                        aria-label="Remove item"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0">
                <p className="font-semibold text-sm text-gray-800">
                    ₹{parseFloat(line.cost.totalAmount.amount).toLocaleString('en-IN')}
                </p>
                {line.quantity > 1 && (
                    <p className="text-xs text-stone-500">
                        ₹{(parseFloat(line.cost.totalAmount.amount) / line.quantity).toLocaleString('en-IN')} each
                    </p>
                )}
            </div>
        </div>
    );
}
