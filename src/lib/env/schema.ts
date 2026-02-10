import { z } from 'zod';

export const envSchema = z.object({
    // Server-side
    SHOPIFY_STORE_DOMAIN: z.string().min(1),
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().min(1),
    SHOPIFY_API_VERSION: z.string().default('2024-01'),
    NEXT_PRIVATE_REVALIDATION_SECRET: z.string().min(1),
    NEXT_PRIVATE_WEBHOOK_SECRET: z.string().min(1),
    ENCRYPTION_KEY: z.string().length(32, "Encryption key must be 32 chars"),
    KV_URL: z.string().url().optional(),
    KV_REST_API_URL: z.string().url().optional(),
    KV_REST_API_TOKEN: z.string().optional(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Client-side
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),

    // Auth
    AUTH_COOKIE_NAME: z.string().default('customer_token'),
    AUTH_COOKIE_MAX_AGE: z.coerce.number().default(60 * 60 * 24 * 7), // 7 days
});

export type Env = z.infer<typeof envSchema>;