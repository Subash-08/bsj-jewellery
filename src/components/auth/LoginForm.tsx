"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuth();
    const { cart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/account';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Pass cartId if available to associate with the new session
        const result = await login(email, password, cart?.id);

        if (result.success) {
            router.push(returnUrl);
        } else {
            if (result.errors && result.errors.length > 0) {
                setError(result.errors[0].message);
            } else {
                setError('Login failed. Please check your credentials.');
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Sign In</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
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

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800">
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                    Create account
                </Link>
            </div>
        </div>
    );
}
