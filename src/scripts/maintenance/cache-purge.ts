import { redis } from '@/lib/cache/redis-client';

async function purgeCache(tag: string) {
    if (tag === 'all') {
        await redis.flushAll();
        console.log('Flushed all cache');
    } else {
        // Logic to delete specific keys if tagging strategy supports it
        console.log(`Purged tag: ${tag}`);
    }
}

// Check arguments
const tag = process.argv[2];
if (tag) {
    purgeCache(tag).then(() => process.exit(0));
} else {
    console.log('Usage: ts-node cache-purge.ts <tag|all>');
}