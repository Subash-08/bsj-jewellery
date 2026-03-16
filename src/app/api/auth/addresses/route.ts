import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultCustomerAddress,
} from '@/lib/shopify/client';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

    if (!accessToken) {
        return NextResponse.json({ errors: [{ message: 'Not authenticated' }] }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { action, addressId, address } = body;

        switch (action) {
            case 'create': {
                const result = await createCustomerAddress(accessToken, address);
                if (result.customerUserErrors?.length > 0) {
                    return NextResponse.json({ errors: result.customerUserErrors }, { status: 400 });
                }
                return NextResponse.json({ success: true, addressId: result.customerAddress?.id });
            }

            case 'update': {
                if (!addressId) {
                    return NextResponse.json({ errors: [{ message: 'Address ID required' }] }, { status: 400 });
                }
                const result = await updateCustomerAddress(accessToken, addressId, address);
                if (result.customerUserErrors?.length > 0) {
                    return NextResponse.json({ errors: result.customerUserErrors }, { status: 400 });
                }
                return NextResponse.json({ success: true });
            }

            case 'delete': {
                if (!addressId) {
                    return NextResponse.json({ errors: [{ message: 'Address ID required' }] }, { status: 400 });
                }
                const result = await deleteCustomerAddress(accessToken, addressId);
                if (result.customerUserErrors?.length > 0) {
                    return NextResponse.json({ errors: result.customerUserErrors }, { status: 400 });
                }
                return NextResponse.json({ success: true });
            }

            case 'setDefault': {
                if (!addressId) {
                    return NextResponse.json({ errors: [{ message: 'Address ID required' }] }, { status: 400 });
                }
                const result = await setDefaultCustomerAddress(accessToken, addressId);
                if (result.customerUserErrors?.length > 0) {
                    return NextResponse.json({ errors: result.customerUserErrors }, { status: 400 });
                }
                return NextResponse.json({ success: true });
            }

            default:
                return NextResponse.json({ errors: [{ message: 'Invalid action' }] }, { status: 400 });
        }
    } catch (error) {
        console.error('Address operation error:', error);
        return NextResponse.json({ errors: [{ message: 'Address operation failed' }] }, { status: 500 });
    }
}
