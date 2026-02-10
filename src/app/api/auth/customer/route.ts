import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/shopify/client';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!accessToken) {
        return NextResponse.json({ isLoggedIn: false, customer: null }, { status: 401 });
    }

    try {
        const customer = await getCustomer(accessToken);

        if (!customer) {
            // Token exists but is invalid/expired -> Clear cookie (Ghost session)
            cookieStore.delete(env.AUTH_COOKIE_NAME);
            return NextResponse.json({ isLoggedIn: false, customer: null }, { status: 401 });
        }

        return NextResponse.json({ isLoggedIn: true, customer });
    } catch (error) {
        console.error('Error fetching customer:', error);
        return NextResponse.json(
            { errors: [{ message: 'Failed to fetch customer session' }] },
            { status: 500 }
        );
    }
}
