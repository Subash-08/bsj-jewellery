import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { activateCustomerByUrl } from '@/lib/shopify/client';
import { env } from '@/lib/env';

const activateSchema = z.object({
    activationUrl: z.string().url(),
    password: z.string().min(5),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { activationUrl, password } = activateSchema.parse(body);

        const result = await activateCustomerByUrl(activationUrl, password);

        if (result.customerUserErrors?.length > 0) {
            return NextResponse.json(
                { errors: result.customerUserErrors },
                { status: 400 }
            );
        }

        if (!result.customerAccessToken?.accessToken) {
            return NextResponse.json(
                { errors: [{ message: 'Activation succeeded but login failed.' }] },
                { status: 400 }
            );
        }

        const response = NextResponse.json({ success: true, customer: result.customer });

        response.cookies.set(env.AUTH_COOKIE_NAME, result.customerAccessToken.accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: env.AUTH_COOKIE_MAX_AGE,
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Activation error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json(
            { errors: [{ message: 'An unexpected error occurred' }] },
            { status: 500 }
        );
    }
}
