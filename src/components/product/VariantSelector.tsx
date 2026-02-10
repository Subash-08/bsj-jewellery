"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
    options: {
        id: string;
        name: string;
        values: string[];
    }[];
    variants: any[]; // Using any[] for now or ProductVariant[]
}

export default function VariantSelector({ options, variants }: VariantSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Helper to check if a combination is available
    // This is a simplified version; robust logic would check the variant map

    const handleSelection = (optionName: string, value: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set(optionName, value);

        // In a real implementation, we'd also find the matching variant ID to update the URL
        // For now, we update the option param which ensures state persistence
        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    };

    if (!options.length) return null;

    return (
        <div className="space-y-6 my-8">
            {options.map((option) => (
                <div key={option.id} className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                        {option.name}: <span className="text-gray-500 font-normal">{searchParams.get(option.name)}</span>
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {option.values.map((value) => {
                            const isActive = searchParams.get(option.name) === value;

                            return (
                                <button
                                    key={value}
                                    onClick={() => handleSelection(option.name, value)}
                                    className={cn(
                                        "px-4 py-2 border rounded-full text-sm transition-all duration-200",
                                        isActive
                                            ? "border-yellow-700 bg-yellow-50 text-yellow-800 font-medium ring-1 ring-yellow-700/30"
                                            : "border-gray-200 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
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
