import { createHmac, timingSafeEqual } from 'crypto';

export async function verifyShopifyWebhook(
    rawBody: string,
    hmacHeader: string | null,
    secret: string
): Promise<boolean> {
    if (!hmacHeader) {
        return false;
    }

    const generatedHash = createHmac('sha256', secret)
        .update(rawBody, 'utf8')
        .digest('base64');

    const generatedBuffer = Buffer.from(generatedHash, 'utf8');
    const hmacBuffer = Buffer.from(hmacHeader, 'utf8');

    if (generatedBuffer.length !== hmacBuffer.length) {
        return false;
    }

    return timingSafeEqual(generatedBuffer, hmacBuffer);
}