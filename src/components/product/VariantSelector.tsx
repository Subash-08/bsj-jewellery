"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
    options: {
        id: string;
        name: string;
        values: string[];
    }[];
    variants: any[];
    onVariantChange?: (variantId: string) => void;
    defaultVariantId?: string;
}

export default function VariantSelector({ options, variants, onVariantChange, defaultVariantId }: VariantSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Helper to check if a combination is available
    // This is a simplified version; robust logic would check the variant map

    const handleSelection = (optionName: string, value: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set(optionName, value);

        // Find the matching variant ID
        const matchedVariant = variants.find((variant) => {
            return variant.selectedOptions.every((opt: any) => {
                if (opt.name === optionName) return opt.value === value;
                return opt.value === newParams.get(opt.name);
            });
        });

        if (matchedVariant && onVariantChange) {
            onVariantChange(matchedVariant.id);
        }

        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    };

    // Emit initial default variant on mount if not already in URL
    // Actually, handling this mostly in ProductPageClient makes sense, so we just call it when internal state updates.

    if (!options.length) return null;

    return (
        <div className="space-y-6 my-6">
            {options.map((option) => (
                <div key={option.id} className="space-y-3">
                    <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                        {option.name}: <span className="text-stone-900 font-normal normal-case tracking-normal ml-1">{searchParams.get(option.name) || option.values[0]}</span>
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {option.values.map((value) => {
                            const isActive = searchParams.get(option.name) === value;

                            return (
                                <button
                                    key={value}
                                    onClick={() => handleSelection(option.name, value)}
                                    className={cn(
                                        "px-4 py-2 border rounded-sm text-sm transition-all duration-200",
                                        isActive
                                            ? "border-amber-700 bg-amber-50 text-amber-800 font-medium"
                                            : "border-stone-200 hover:border-amber-300 text-stone-700 hover:bg-stone-50"
                                    )}
                                >
                                    {value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
