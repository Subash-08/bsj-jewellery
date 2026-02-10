import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Verify HMAC here (skeleton)
    const topic = req.headers.get('x-shopify-topic');

    console.log(`Received webhook: ${topic}`);

    // Handle topic specific logic

    return NextResponse.json({ status: 200 });
}