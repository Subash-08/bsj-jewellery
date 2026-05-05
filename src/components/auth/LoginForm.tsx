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
        <div className="w-full max-w-[420px]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
                .font-playfair { font-family: 'Playfair Display', serif; }
            `}</style>

            {/* Header */}
            <p className="font-montserrat text-[13px] text-[#6b6b6b] mb-2 tracking-wide">
                Login / Sign Up
            </p>
            <h2 className="font-playfair text-[28px] md:text-[34px] font-semibold text-[#18181b] leading-tight mb-8">
                Unlock Exclusive Jewellery Collections
            </h2>

            {/* Error */}
            {error && (
                <div className="mb-5 p-3 bg-red-50 text-red-600 font-montserrat text-[13px] rounded-md border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block font-jakarta text-[13px] font-semibold text-[#18181b] mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@gmail.com"
                        className="w-full px-4 py-3 border border-stone-300 rounded-[4px] font-montserrat text-[14px] text-[#18181b] focus:outline-none focus:border-[#230532] transition-colors placeholder:text-stone-300"
                    />
                </div>

                {/* Password */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="password" className="block font-jakarta text-[13px] font-semibold text-[#18181b]">
                            Password
                        </label>
                        <Link href="/forgot-password" className="font-montserrat text-[12px] text-[#230532] hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-stone-300 rounded-[4px] font-montserrat text-[14px] text-[#18181b] focus:outline-none focus:border-[#230532] transition-colors placeholder:text-stone-300"
                    />
                </div>

                {/* Privacy note */}
                <p className="font-montserrat text-[12px] text-[#6b6b6b] text-center">
                    We respect your privacy. No spam, ever.
                </p>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#230532] text-white py-3.5 rounded-[4px] font-jakarta text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
                >
                    {isLoading ? 'Signing in...' : 'Continue'}
                </button>
            </form>

            {/* Divider */}
            <div className="mt-6 text-center">
                <p className="font-montserrat text-[13px] text-[#6b6b6b] mb-3">Or</p>
                <p className="font-montserrat text-[13px] text-[#18181b]">
                    <a href="#" className="text-[#230532] hover:underline font-medium">Continue with Google</a>
                    {' | '}
                    <a href="#" className="text-[#230532] hover:underline font-medium">Continue with Apple</a>
                </p>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
                <p className="font-montserrat text-[13px] text-[#6b6b6b]">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-[#230532] font-semibold hover:underline">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}
