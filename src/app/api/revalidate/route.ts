import { NextRequest, NextResponse } from 'next/server';
import { revalidateCacheTag } from '@/lib/cache/revalidate';

export async function GET(req: NextRequest) {
    const secret = req.nextUrl.searchParams.get('secret');
    const tag = req.nextUrl.searchParams.get('tag');

    if (secret !== process.env.NEXT_PRIVATE_REVALIDATION_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!tag) {
        return NextResponse.json({ message: 'Missing tag param' }, { status: 400 });
    }

    revalidateCacheTag(tag);

    return NextResponse.json({ revalidated: true, now: Date.now() });
}
