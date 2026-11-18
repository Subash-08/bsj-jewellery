import type { Metafield, JewelryMetafields } from '@/types/metafield';

export function parseMetafields(metafields: Metafield[]): JewelryMetafields {
    const result: JewelryMetafields = {};

    metafields.forEach((metafield) => {
        const key = metafield.key;
        const value = parseMetafieldValue(metafield);

        if (value !== null && value !== undefined) {
            result[key as keyof JewelryMetafields] = value;
        }
    });

    // Map the current Shopify keys to the display names used by the existing
    // storefront. Keep the original keys too, so no product data is lost.
    const values = result as Record<string, string | number | boolean | undefined>;
    values['Purity Percentage'] = values.metal_purity ?? values.anklet_purity ?? values['Purity Percentage'];
    values['Net Weight'] = parseWeight(values.net_weight) ?? values['Net Weight'];
    values['Metal Type'] = values.metal_type ?? values['Metal Type'];
    values['Jewellery Category'] = values.jewellery_category ?? values['Jewellery Category'];
    values['Sub Category'] = values.sub_category ?? values['Sub Category'];
    values['Gender'] = values.gender ?? values['Gender'];
    values['Occasion'] = values.occasion ?? values['Occasion'];
    values['Design Style'] = values.design_style ?? values['Design Style'];
    values['Size / Length'] = values.ringsize
        ?? values.chain_size
        ?? values.anklet_size_and_fit_details
        ?? values['Size / Length'];

    return result;
}

function parseWeight(value: string | number | boolean | undefined): number | undefined {
    if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
    if (typeof value !== 'string') return undefined;

    const match = value.match(/\d+(?:\.\d+)?/);
    if (!match) return undefined;

    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function parseMetafieldValue(metafield: Metafield): any {
    const { value, type } = metafield;

    if (value === null || value === undefined) return null;

    switch (type) {
        case 'boolean':
        case 'boolean_value':
            return value === 'true' || value === true;

        case 'number_integer':
        case 'integer':
            const intVal = parseInt(value as string, 10);
            return isNaN(intVal) ? null : intVal;

        case 'number_decimal':
        case 'decimal':
            const floatVal = parseFloat(value as string);
            return isNaN(floatVal) ? null : floatVal;

        case 'money':
            const moneyVal = parseFloat(value as string);
            return isNaN(moneyVal) ? null : moneyVal;

        case 'dimension':
        case 'single_line_text_field':
        case 'multi_line_text_field':
            return value.toString().trim() || null;

        case 'json':
            try {
                return JSON.parse(value as string);
            } catch {
                return value;
            }

        default:
            return value;
    }
}

export function getMetafieldValue<T>(
    metafields: Metafield[],
    key: string,
    defaultValue: T
): T {
    const metafield = metafields.find((m) => m.key === key);

    if (!metafield) return defaultValue;

    const value = parseMetafieldValue(metafield);
    return (value !== null && value !== undefined ? value : defaultValue) as T;
}

// Filter products by metafield value
export function filterByMetafield<T extends { metafields: Metafield[] }>(
    items: T[],
    key: string,
    value: any
): T[] {
    return items.filter(item =>
        getMetafieldValue(item.metafields, key, null) === value
    );
}

// Group products by metafield
export function groupByMetafield<T extends { metafields: Metafield[] }>(
    items: T[],
    key: string
): Record<string, T[]> {
    const groups: Record<string, T[]> = {};

    items.forEach(item => {
        const value = getMetafieldValue(item.metafields, key, 'Uncategorized');
        if (!groups[value]) groups[value] = [];
        groups[value].push(item);
    });

    return groups;
}

// Get unique values for filters
export function getUniqueMetafieldValues<T extends { metafields: Metafield[] }>(
    items: T[],
    key: string
): string[] {
    const values = new Set<string>();

    items.forEach(item => {
        const value = getMetafieldValue(item.metafields, key, '');
        if (value) values.add(String(value));
    });

    return Array.from(values).sort();
}
