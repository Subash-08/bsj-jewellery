import { env } from '@/lib/env';
import {
    ShopifyError,
    ShopifyNetworkError,
    ShopifyRateLimitError,
} from './errors';

const DOMAIN = env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = env.SHOPIFY_API_VERSION;
const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

export async function shopifyFetch<T>({
    cache = 'force-cache',
    headers,
    query,
    tags,
    variables,
}: {
    cache?: RequestCache;
    headers?: HeadersInit;
    query: string;
    tags?: string[];
    variables?: Record<string, unknown>;
}): Promise<{ status: number; body: T } | never> {
    const method = 'POST';

    try {
        const result = await fetchWithRetry(
            ENDPOINT,
            {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
                    ...headers,
                },
                body: JSON.stringify({
                    ...(query && { query }),
                    ...(variables && { variables }),
                }),
                cache,
                ...(tags && { next: { tags } }),
            }
        );

        const body = await result.json();

        if (body.errors) {
            throw body.errors[0];
        }

        return {
            status: result.status,
            // 👇 CRITICAL FIX: We unwrap the 'data' property here
            body: body.data,
        };
    } catch (e) {
        if (e instanceof ShopifyError) {
            throw e;
        }

        throw new ShopifyNetworkError(
            `Shopify fetch error: ${e instanceof Error
                ? e.message
                : JSON.stringify(e, null, 2)
            }`
        );
    }
}

const MAX_RETRIES = 3;

async function fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 0
): Promise<Response> {
    try {
        const response = await fetch(url, options);

        if (response.status === 429) {
            throw new ShopifyRateLimitError();
        }

        if (!response.ok) {
            throw new ShopifyNetworkError(`Fetch failed with status ${response.status}`);
        }

        return response;
    } catch (error) {
        if (retries < MAX_RETRIES) {
            const waitTime = Math.pow(2, retries) * 1000;
            console.warn(`Retry attempt ${retries + 1} after ${waitTime}ms`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            return fetchWithRetry(url, options, retries + 1);
        }
        throw error;
    }
}