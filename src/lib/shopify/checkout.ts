import { env } from '@/lib/env';

export class CheckoutConfigurationError extends Error {
    readonly code = 'CHECKOUT_DOMAIN_MISCONFIGURED';

    constructor() {
        super(
            'Shopify checkout is using the storefront domain. Configure a separate Shopify checkout domain.'
        );
        this.name = 'CheckoutConfigurationError';
    }
}

function normalizeHostname(hostname: string): string {
    return hostname.trim().toLowerCase().replace(/^www\./, '');
}

function configuredCheckoutHostname(): string | undefined {
    const value = env.SHOPIFY_CHECKOUT_DOMAIN?.trim();
    if (!value) return undefined;

    // Accept either a hostname or an HTTPS URL in deployment configuration.
    const url = value.includes('://') ? new URL(value) : new URL(`https://${value}`);
    return url.hostname;
}

/**
 * Validates Shopify's checkout URL and moves it to the explicitly configured
 * checkout host when one is present. A checkout URL that points back to the
 * Next.js storefront would otherwise render the application's 404 page.
 */
export function resolveCheckoutUrl(checkoutUrl: string, requestHostname: string): string {
    const url = new URL(checkoutUrl);
    if (url.protocol !== 'https:' || !url.pathname.startsWith('/cart/c/')) {
        throw new Error('Shopify returned an invalid checkout URL.');
    }

    const checkoutHostname = configuredCheckoutHostname();
    if (checkoutHostname) {
        url.hostname = checkoutHostname;
        url.port = '';
        return url.toString();
    }

    if (normalizeHostname(url.hostname) === normalizeHostname(requestHostname)) {
        throw new CheckoutConfigurationError();
    }

    return url.toString();
}

export function getBuyerIp(headers: Headers): string | undefined {
    const forwardedFor = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const candidate = forwardedFor || headers.get('x-real-ip')?.trim();

    // Header values are forwarded to Shopify only when they resemble an IPv4
    // or IPv6 address. This prevents arbitrary header injection.
    return candidate && /^[0-9a-f:.]+$/i.test(candidate) ? candidate : undefined;
}

export function getRequestHostname(headers: Headers, fallbackHostname: string): string {
    const forwardedHost = headers.get('x-forwarded-host')?.split(',')[0]?.trim();
    if (!forwardedHost) return fallbackHostname;

    try {
        return new URL(`https://${forwardedHost}`).hostname;
    } catch {
        return fallbackHostname;
    }
}
