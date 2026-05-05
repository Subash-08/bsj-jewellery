"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function RegisterForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { register, isLoading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = await register({ firstName, lastName, email, password });

        if (result.success) {
            if (result.requireLogin) {
                router.push('/login?message=registered');
            } else {
                router.push('/account');
            }
        } else {
            if (result.errors && result.errors.length > 0) {
                setError(result.errors[0].message);
            } else {
                setError('Registration failed. Please try again.');
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
                Create Account
            </p>
            <h2 className="font-playfair text-[28px] md:text-[34px] font-semibold text-[#18181b] leading-tight mb-8">
                Join Our Jewellery Community
            </h2>

            {/* Error */}
            {error && (
                <div className="mb-5 p-3 bg-red-50 text-red-600 font-montserrat text-[13px] rounded-md border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block font-jakarta text-[13px] font-semibold text-[#18181b] mb-2">
                            First name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First name"
                            className="w-full px-4 py-3 border border-stone-300 rounded-[4px] font-montserrat text-[14px] text-[#18181b] focus:outline-none focus:border-[#230532] transition-colors placeholder:text-stone-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block font-jakarta text-[13px] font-semibold text-[#18181b] mb-2">
                            Last name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last name"
                            className="w-full px-4 py-3 border border-stone-300 rounded-[4px] font-montserrat text-[14px] text-[#18181b] focus:outline-none focus:border-[#230532] transition-colors placeholder:text-stone-300"
                        />
                    </div>
                </div>

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
                    <label htmlFor="password" className="block font-jakarta text-[13px] font-semibold text-[#18181b] mb-2">
                        Password
                    </label>
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
                    By creating an account, you agree to our privacy policy.
                </p>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#230532] text-white py-3.5 rounded-[4px] font-jakarta text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
                >
                    {isLoading ? 'Creating account...' : 'Create Account'}
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

            {/* Login Link */}
            <div className="mt-8 text-center">
                <p className="font-montserrat text-[13px] text-[#6b6b6b]">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#230532] font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
