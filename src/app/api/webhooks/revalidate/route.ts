import { revalidateCacheTag } from '@/lib/cache/revalidate';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
    const tag = req.nextUrl.searchParams.get('tag');
    const secret = req.nextUrl.searchParams.get('secret');

    if (secret !== env.NEXT_PRIVATE_REVALIDATION_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!tag) {
        return NextResponse.json({ message: 'Missing tag' }, { status: 400 });
    }

    revalidateCacheTag(tag);

    return NextResponse.json({ revalidated: true, now: Date.now() });
}