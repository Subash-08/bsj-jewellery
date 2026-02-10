"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ResetPasswordForm({ id, token }: { id: string; token: string }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 5) {
            setError("Password must be at least 5 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, token, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Optionally check requireLogin, potentially redirect to login
                router.push('/login?message=resetComplete');
            } else {
                if (data.errors && data.errors.length > 0) {
                    setError(data.errors[0].message);
                } else {
                    setError('Failed to reset password.');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Set New Password</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}
