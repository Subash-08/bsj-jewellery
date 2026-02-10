import type { Product } from '@/types/shopify/product';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Get display value for a metafield
export function getMetafieldDisplay(product: Product, key: string): string {
    const value = product.jewelryMetafields?.[key as keyof typeof product.jewelryMetafields];

    if (value === undefined || value === null) return '';

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if (typeof value === 'number') {
        // Handle special cases
        if (key === 'Stone Weight') return `${value} carats`;
        if (key === 'Chain Thickness(mm)') return `${value} mm`;
        if (key === 'Chain Length(inches)') return `${value} inches`;
        if (key === 'Bracelet Length(inches)') return `${value} inches`;
        return value.toString();
    }

    return String(value);
}

// Check if product has specific feature
export function hasFeature(product: Product, feature: string): boolean {
    const features = {
        'certified': product.jewelryMetafields?.['Certification Available'],
        'customizable': product.jewelryMetafields?.['Customization Available'],
        'exchange': product.jewelryMetafields?.['Exchange Available'],
        'return': product.jewelryMetafields?.['Return Eligible'],
        'allergy-safe': product.jewelryMetafields?.['Allergy Safe'],
        'skin-friendly': product.jewelryMetafields?.['Skin Friendly'],
        'daily-wear': product.jewelryMetafields?.['Suitable for daily wear'],
        'ready-stock': product.jewelryMetafields?.['Ready Stock'],
    };

    return !!features[feature as keyof typeof features];
}

// Get product badges based on metafields
export function getProductBadges(product: Product): string[] {
    const badges: string[] = [];

    // Highlight badge from metafield
    if (product.jewelryMetafields?.['Highlight Badge']) {
        badges.push(product.jewelryMetafields['Highlight Badge']);
    }

    // Add badges based on features
    if (hasFeature(product, 'certified')) badges.push('Certified');
    if (hasFeature(product, 'ready-stock')) badges.push('Ready Stock');
    if (hasFeature(product, 'exchange')) badges.push('Exchange Available');
    if (hasFeature(product, 'allergy-safe')) badges.push('Hypoallergenic');

    // Light weight category
    if (product.jewelryMetafields?.['Light Weight Category']) {
        badges.push('Light Weight');
    }

    return badges;
}
