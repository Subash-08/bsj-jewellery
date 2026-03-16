import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateCustomer } from '@/lib/shopify/client';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!accessToken) {
        return NextResponse.json({ errors: [{ message: 'Not authenticated' }] }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { firstName, lastName, phone } = body;

        const result = await updateCustomer(accessToken, { firstName, lastName, phone });

        if (result.customerUserErrors?.length > 0) {
            return NextResponse.json({ errors: result.customerUserErrors }, { status: 400 });
        }

        return NextResponse.json({ success: true, customer: result.customer });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ errors: [{ message: 'Failed to update profile' }] }, { status: 500 });
    }
}
