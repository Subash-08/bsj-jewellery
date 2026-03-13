'use client';

import type { Filter } from '@/types/shopify/product';

interface FilterGroupProps {
    paramKey: string;
    filter: Filter;
    activeValues: string[];
    updateFilter: (key: string, value: string, action: 'add' | 'remove') => void;
}

export default function FilterGroup({ paramKey, filter, activeValues, updateFilter }: FilterGroupProps) {
    return (
        <div className="filter-group">
            <h3 className="font-semibold text-gray-900 mb-3">{filter.label}</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {filter.values.map((val) => {
                    // We need to extract the raw value from the Shopify input JSON
                    let actualValue = val.label;
                    try {
                        const inputObj = JSON.parse(val.input);
                        if (inputObj.productMetafield?.value) {
                            actualValue = inputObj.productMetafield.value;
                        }
                    } catch (e) {
                        // Fallback to label
                    }

                    const isActive = activeValues.includes(actualValue);

                    return (
                        <label 
                            key={val.id} 
                            className="flex items-center space-x-3 cursor-pointer group"
                        >
                            <div className="relative flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => {
                                            updateFilter(paramKey, actualValue, e.target.checked ? 'add' : 'remove');
                                        }}
                                        className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-600"
                                    />
                                </div>
                            </div>
                            <span className="text-sm flex-1 text-gray-700 group-hover:text-gray-900 truncate">
                                {val.label}
                            </span>
                            <span className="text-xs text-gray-400">
                                ({val.count})
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
