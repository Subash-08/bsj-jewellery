import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCustomer, createCustomerAccessToken } from '@/lib/shopify/client';
import { env } from '@/lib/env';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, firstName, lastName } = registerSchema.parse(body);

        // 1. Create Customer on Shopify
        const { customer, customerUserErrors } = await createCustomer({
            email,
            password,
            firstName,
            lastName,
        });

        if (customerUserErrors?.length > 0) {
            return NextResponse.json(
                { errors: customerUserErrors },
                { status: 400 }
            );
        }

        if (!customer) {
            return NextResponse.json(
                { errors: [{ message: 'Registration failed. Please try again.' }] },
                { status: 400 }
            );
        }

        // 2. Auto-login after successful registration (Optional but good UX)
        const { customerAccessToken, customerUserErrors: loginErrors } = await createCustomerAccessToken(email, password);

        if (loginErrors?.length > 0 || !customerAccessToken?.accessToken) {
            // Registration successful but auto-login failed. Ask user to login manually.
            return NextResponse.json({ success: true, requireLogin: true });
        }

        // 3. Set Cookie if login success
        const response = NextResponse.json({ success: true, customer });

        response.cookies.set(env.AUTH_COOKIE_NAME, customerAccessToken.accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: env.AUTH_COOKIE_MAX_AGE,
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Registration error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json(
            { errors: [{ message: 'An unexpected error occurred' }] },
            { status: 500 }
        );
    }
}
