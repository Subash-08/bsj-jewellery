"use client";

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to service
        console.error(error);
    }, [error]);

    return (
        <main style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Something went wrong!</h1>
            <button onClick={() => reset()}>Try again</button>
        </main>
    );
}