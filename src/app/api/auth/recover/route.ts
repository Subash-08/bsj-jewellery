import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { recoverCustomer } from '@/lib/shopify/client';

const recoverSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = recoverSchema.parse(body);

        const { customerUserErrors } = await recoverCustomer(email);

        if (customerUserErrors?.length > 0) {
            return NextResponse.json(
                { errors: customerUserErrors },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Recover error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        return NextResponse.json(
            { errors: [{ message: 'An unexpected error occurred' }] },
            { status: 500 }
        );
    }
}
