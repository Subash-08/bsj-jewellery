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

    return result;
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
