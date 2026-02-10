import { revalidateTag } from 'next/cache';

export function revalidateCacheTag(tag: string) {
    // @ts-expect-error Next.js type mismatch
    revalidateTag(tag);
}

export function revalidateStore() {
    // Revalidate top-level
    // @ts-expect-error Next.js type mismatch
    revalidateTag('collections');
    // @ts-expect-error Next.js type mismatch
    revalidateTag('products');
}