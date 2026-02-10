import { verifyShopifyWebhook } from '@/lib/security/hmac';
import { env } from '@/lib/env';

export async function validateRequest(req: Request, rawBody: string) {
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    return verifyShopifyWebhook(rawBody, hmac, env.NEXT_PRIVATE_WEBHOOK_SECRET);
}