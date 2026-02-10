import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCustomerAccessToken, updateCartBuyerIdentity } from '@/lib/shopify/client';
import { env } from '@/lib/env';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
    cartId: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, cartId } = loginSchema.parse(body);

        const { customerAccessToken, customerUserErrors } = await createCustomerAccessToken(email, password);

        if (customerUserErrors?.length > 0) {
            return NextResponse.json(
                { errors: customerUserErrors },
                { status: 400 }
            );
        }

        if (!customerAccessToken?.accessToken) {
            return NextResponse.json(
                { errors: [{ message: 'Invalid credentials' }] },
                { status: 401 }
            );
        }

        // Associate Cart if cartId is provided
        if (cartId) {
            try {
                await updateCartBuyerIdentity(cartId, customerAccessToken.accessToken);
            } catch (cartError) {
                console.warn('Failed to associate cart with customer:', cartError);
                // Continue login process even if cart association fails
            }
        }

        const response = NextResponse.json({ success: true });

        response.cookies.set(env.AUTH_COOKIE_NAME, customerAccessToken.accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: env.AUTH_COOKIE_MAX_AGE,
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json(
            { errors: [{ message: 'An unexpected error occurred' }] },
            { status: 500 }
        );
    }
}
