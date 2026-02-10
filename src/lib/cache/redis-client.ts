import { createClient } from 'redis';
import { env } from '@/lib/env';

// Using server-only to prevent client-side usage
import 'server-only';

const globalForRedis = global as unknown as { redis: ReturnType<typeof createClient> };

export const redis =
    globalForRedis.redis ||
    createClient({
        url: env.KV_URL || 'redis://localhost:6379',
    });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

if (!redis.isOpen) {
    redis.connect().catch((error) => {
        console.warn('Redis connection failed:', error);
    });
}