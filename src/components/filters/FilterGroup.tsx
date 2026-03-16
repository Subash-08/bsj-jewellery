'use client';

import type { Filter } from '@/types/shopify/product';
import { cn } from '@/components/ui/Badge';

interface FilterGroupProps {
    paramKey: string;
    filter: Filter;
    activeValues: string[];
    updateFilter: (key: string, value: string, action: 'add' | 'remove') => void;
}

export default function FilterGroup({ paramKey, filter, activeValues, updateFilter }: FilterGroupProps) {
    // Derive paramKey internally if not provided or if a more specific key can be found
    let effectiveParamKey = paramKey;
    if (filter.values[0] && filter.values[0].input) {
        try {
            const inputObj = JSON.parse(filter.values[0].input);
            if (inputObj.productMetafield?.key) {
                effectiveParamKey = inputObj.productMetafield.key;
            } else if (inputObj.available !== undefined) {
                effectiveParamKey = 'available';
            } else if (inputObj.productType) {
                effectiveParamKey = 'productType';
            } else if (inputObj.variantOption?.name) {
                effectiveParamKey = `option_${inputObj.variantOption.name}`;
            }
        } catch (e) {
            // Fallback to provided paramKey or derived from label
        }
    }
    // If effectiveParamKey is still the prop paramKey and it's generic, try to derive from label
    if (effectiveParamKey === paramKey && !paramKey) { // Assuming paramKey might be empty if not explicitly set
        effectiveParamKey = filter.label.toLowerCase().replace(/\s+/g, '_');
    }


    return (
        <div className="filter-group">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{filter.label}</h3>
            <ul className="space-y-2.5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {filter.values.map((val) => {
                    let actualValue = val.label;
                    try {
                        const inputObj = JSON.parse(val.input);
                        if (inputObj.productMetafield?.value) {
                            actualValue = inputObj.productMetafield.value;
                        } else if (inputObj.available !== undefined) {
                            actualValue = String(inputObj.available);
                        } else if (inputObj.productType) {
                            actualValue = inputObj.productType;
                        } else if (inputObj.variantOption?.value) {
                            actualValue = inputObj.variantOption.value;
                        }
                    } catch (e) {
                        // Fallback to label
                    }

                    const isActive = activeValues.includes(actualValue);

                    return (
                        <li key={val.id}>
                            <label className="flex items-center group cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isActive}
                                    onChange={(e) => {
                                        updateFilter(effectiveParamKey, actualValue, e.target.checked ? 'add' : 'remove');
                                    }}
                                />
                                <div className={cn(
                                    "w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors",
                                    isActive
                                        ? "bg-rose-600 border-rose-600"
                                        : "border-gray-300 group-hover:border-rose-400 bg-white"
                                )}>
                                    {isActive && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check w-3.5 h-3.5 text-white"><path d="M20 6 9 17l-5-5"/></svg>}
                                </div>
                                <span className={cn(
                                    "text-sm flex-1 truncate",
                                    isActive ? "text-gray-900 font-medium" : "text-gray-600 group-hover:text-gray-900"
                                )}>
                                    {val.label}
                                </span>
                                <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full ml-2">
                                    {val.count}
                                </span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
