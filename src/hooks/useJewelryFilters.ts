import { useMemo } from 'react';
import type { Product } from '@/types/shopify/product';
import { getMetafieldValue } from '@/lib/utils/metafield-parser';

export interface JewelryFilters {
    metalType?: string[];
    jewelryCategory?: string;
    stoneType?: string[];
    occasion?: string[];
    gender?: string;
    priceRange?: { min: number; max: number };
    purity?: string[];
    available?: boolean;
}

export function useFilteredJewelry(
    products: Product[],
    filters: JewelryFilters
): Product[] {
    return useMemo(() => {
        return products.filter(product => {
            const metafields = product.metafields;

            // Filter by metal type
            if (filters.metalType?.length) {
                const metal = getMetafieldValue(metafields, 'Metal Type', '');
                if (!filters.metalType.includes(metal)) return false;
            }

            // Filter by jewelry category
            if (filters.jewelryCategory) {
                const category = getMetafieldValue(metafields, 'Jewellery Category', '');
                if (category !== filters.jewelryCategory) return false;
            }

            // Filter by stone type
            if (filters.stoneType?.length) {
                const stone = getMetafieldValue(metafields, 'Stone Type', '');
                if (!filters.stoneType.includes(stone)) return false;
            }

            // Filter by occasion
            if (filters.occasion?.length) {
                const productOccasion = getMetafieldValue(metafields, 'Occasion', '');
                if (!filters.occasion.includes(productOccasion)) return false;
            }

            // Filter by gender
            if (filters.gender) {
                const productGender = getMetafieldValue(metafields, 'Gender', '');
                if (productGender !== filters.gender) return false;
            }

            // Filter by price
            if (filters.priceRange) {
                const price = parseFloat(product.priceRange.minVariantPrice.amount);
                if (price < filters.priceRange.min || price > filters.priceRange.max) {
                    return false;
                }
            }

            // Filter by purity
            if (filters.purity?.length) {
                const purity = getMetafieldValue(metafields, 'Purity Percentage', '');
                if (!filters.purity.includes(purity)) return false;
            }

            // Filter by availability
            if (filters.available !== undefined) {
                const hasAvailableVariant = product.variants.some(v => v.availableForSale);
                if (hasAvailableVariant !== filters.available) return false;
            }

            return true;
        });
    }, [products, filters]);
}

export function useJewelryFilterOptions(products: Product[]) {
    return useMemo(() => {
        const options = {
            metalTypes: new Set<string>(),
            categories: new Set<string>(),
            stoneTypes: new Set<string>(),
            occasions: new Set<string>(),
            genders: new Set<string>(),
            purities: new Set<string>(),
        };

        products.forEach(product => {
            const metafields = product.metafields;

            const metalType = getMetafieldValue(metafields, 'Metal Type', '');
            const category = getMetafieldValue(metafields, 'Jewellery Category', '');
            const stoneType = getMetafieldValue(metafields, 'Stone Type', '');
            const occasion = getMetafieldValue(metafields, 'Occasion', '');
            const gender = getMetafieldValue(metafields, 'Gender', '');
            const purity = getMetafieldValue(metafields, 'Purity Percentage', '');

            if (metalType) options.metalTypes.add(metalType);
            if (category) options.categories.add(category);
            if (stoneType) options.stoneTypes.add(stoneType);
            if (occasion) options.occasions.add(occasion);
            if (gender) options.genders.add(gender);
            if (purity) options.purities.add(purity);
        });

        return {
            metalTypes: Array.from(options.metalTypes).sort(),
            categories: Array.from(options.categories).sort(),
            stoneTypes: Array.from(options.stoneTypes).sort(),
            occasions: Array.from(options.occasions).sort(),
            genders: Array.from(options.genders).sort(),
            purities: Array.from(options.purities).sort(),
        };
    }, [products]);
}
