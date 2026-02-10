"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/recover', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                if (data.errors && data.errors.length > 0) {
                    // Generally good security practice not to reveal if email exists, 
                    // but Shopify implementation might return "user not found".
                    // We can just show a generic message or the specific one based on requirement.
                    // For now showing the specific error if safe, or a generic one.
                    setError(data.errors[0].message);
                } else {
                    setError('Failed to send recovery email.');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-100 text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Check your email</h2>
                <p className="text-gray-600 mb-6">
                    We've sent password reset instructions to <strong>{email}</strong>.
                </p>
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Back to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Reset Password</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
                        placeholder="your@email.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isLoading ? 'Sending...' : 'Send Instructions'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
