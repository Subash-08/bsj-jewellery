import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resetCustomer, createCustomerAccessToken } from '@/lib/shopify/client';
import { env } from '@/lib/env';

const resetSchema = z.object({
    id: z.string().min(1), // Customer ID from token or context? No, Shopify reset flows usually involve a token in URL
    password: z.string().min(5),
    token: z.string().min(1), // Reset token
});

// Shopify reset flow: User clicks link in email -> /reset-password/[id]/[token] or similar?
// Standard Shopify reset link: https://store.com/account/reset/12345/token
// We need to support this structure. The logic:
// 1. User arrives at /reset-password/[token] (we might just take token or id+token)
// 2. User enters new password
// 3. Submit to this API
// Wait, storefront API mutation `customerReset` requires `id` and `input: { resetToken, password }`.
// So the URL provided by Shopify in the email template needs to contain the Customer ID and the Reset Token.
// The default Shopify template usually links to `/account/reset/${id}/${token}`.
// We should structure our page to match or handle this.
// Assuming we get ID and Token from the frontend.

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, token, password } = resetSchema.parse(body);

        const { customer, customerUserErrors } = await resetCustomer(id, {
            resetToken: token,
            password
        });

        if (customerUserErrors?.length > 0) {
            return NextResponse.json(
                { errors: customerUserErrors },
                { status: 400 }
            );
        }

        if (!customer) {
            return NextResponse.json(
                { errors: [{ message: 'Reset failed.' }] },
                { status: 400 }
            );
        }

        // Auto-login after reset
        const { customerAccessToken, customerUserErrors: loginErrors } = await createCustomerAccessToken(customer.email, password); // We don't have email here easily? Ah, resetCustomer returns customer.

        if (loginErrors?.length > 0 || !customerAccessToken?.accessToken) {
            return NextResponse.json({ success: true, requireLogin: true });
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
        console.error('Reset error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json(
            { errors: [{ message: 'An unexpected error occurred' }] },
            { status: 500 }
        );
    }
}
