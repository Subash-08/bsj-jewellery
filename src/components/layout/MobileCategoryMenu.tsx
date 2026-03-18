"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavCategory } from "@/types/shopify/collection";

interface Props {
    categories: NavCategory[];
}

export default function MobileCategoryMenu({ categories }: Props) {
    const [openMain, setOpenMain] = useState(false);
    const [openCat, setOpenCat] = useState<string | null>(null);

    return (
        <div className="border-b border-[#f1ece3]">
            {/* TOP-LEVEL TOGGLE */}
            <button
                onClick={() => setOpenMain((prev) => !prev)}
                className="w-full flex justify-between items-center py-3 text-sm font-medium text-gray-800"
            >
                Shop By Category
                <ChevronDown
                    size={16}
                    className={cn(
                        "text-gray-400 transition-transform duration-200",
                        openMain && "rotate-180"
                    )}
                />
            </button>

            {/* CATEGORY LIST */}
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300",
                    openMain ? "max-h-screen pb-3" : "max-h-0"
                )}
            >
                <div className="space-y-1">
                    {categories.map((cat) => {
                        // filterGroups defined PER cat so cat is in scope
                        const filterGroups = [
                            { label: "Sub Category", items: cat.subCategories, param: "sub_category" },
                            { label: "Gender", items: cat.gender, param: "gender" },
                            { label: "Occasion", items: cat.occasion, param: "occasion" },
                            { label: "Collection", items: cat.collection, param: "collection_name" },
                            { label: "Design Style", items: cat.design, param: "design_style" },
                        ];

                        const isOpen = openCat === cat.id;

                        return (
                            <div key={cat.id} className="border-b border-[#f5f2ec]">
                                {/* CATEGORY ROW */}
                                <button
                                    onClick={() =>
                                        setOpenCat((prev) => (prev === cat.id ? null : cat.id))
                                    }
                                    className="w-full flex justify-between items-center px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                        {cat.name}
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        className={cn(
                                            "text-gray-400 transition-transform duration-200",
                                            isOpen && "rotate-180"
                                        )}
                                    />
                                </button>

                                {/* SUB-MENU */}
                                <div
                                    className={cn(
                                        "overflow-hidden transition-all duration-300",
                                        isOpen ? "max-h-screen" : "max-h-0"
                                    )}
                                >
                                    <div className="pl-5 pr-2 pb-3 space-y-4">
                                        {/* View all link */}
                                        <Link
                                            href={`/collections/${cat.handle}`}
                                            className="inline-block text-xs font-semibold text-amber-600 uppercase tracking-wider mt-2 hover:underline"
                                        >
                                            View all {cat.name}
                                        </Link>

                                        {filterGroups.map(({ label, items, param }) =>
                                            items && items.length > 0 ? (
                                                <div key={label}>
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
                                                        {label}
                                                    </p>
                                                    <div className="space-y-1">
                                                        {items.map((item) => (
                                                            <Link
                                                                key={item}
                                                                href={`/collections/${cat.handle}?${param}=${encodeURIComponent(item)}`}
                                                                className="block py-1 text-sm text-gray-600 hover:text-amber-600 transition-colors"
                                                            >
                                                                {item}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}