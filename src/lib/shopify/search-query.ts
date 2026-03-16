export function buildSearchQuery(rawQuery: string): string {
    const sanitized = rawQuery
        .replace(/[^a-zA-Z0-9\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100);

    if (!sanitized) return '';

    const terms = sanitized.split(' ');
    if (terms.length === 1) {
        return `(title:${sanitized} OR tag:${sanitized} OR ${sanitized})`;
    }
    // Quote multi-word phrases so Shopify treats them as phrase matches
    return `(title:"${sanitized}" OR tag:"${sanitized}" OR ${sanitized})`;
}

export function sanitizeSearchInput(rawQuery: string): string {
    return rawQuery
        .replace(/[^a-zA-Z0-9\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100);
}
