"use client";

import { useCart } from '@/hooks/useCart';

export default function CartPage() {
    const { cart } = useCart();

    if (!cart) {
        return <div>Empty Cart</div>;
    }

    return (
        <main>
            <h1>Your Cart</h1>
            <pre>{JSON.stringify(cart, null, 2)}</pre>
        </main>
    );
}