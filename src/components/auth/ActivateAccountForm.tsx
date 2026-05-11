"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export default function ActivateAccountForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { refreshSession } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activationUrl: window.location.href, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.errors?.[0]?.message || 'Failed to activate account.');
            } else {
                await refreshSession();
                router.push('/account');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[420px]">
            <p className="font-montserrat text-[13px] text-[#6b6b6b] mb-2 tracking-wide">
                Account Activation
            </p>
            <h2 className="font-playfair text-[28px] md:text-[34px] font-semibold text-[#18181b] leading-tight mb-8">
                Set Your Password
            </h2>

            {error && (
                <div className="mb-5 p-3 bg-red-50 text-red-600 font-montserrat text-[13px] rounded-md border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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

                <div>
                    <label htmlFor="confirmPassword" className="block font-jakarta text-[13px] font-semibold text-[#18181b] mb-2">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-stone-300 rounded-[4px] font-montserrat text-[14px] text-[#18181b] focus:outline-none focus:border-[#230532] transition-colors placeholder:text-stone-300"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#230532] text-white py-3.5 rounded-[4px] font-jakarta text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed tracking-wide mt-4"
                >
                    {isLoading ? 'Activating...' : 'Activate Account'}
                </button>
            </form>
        </div>
    );
}
