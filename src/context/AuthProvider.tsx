"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Customer {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    defaultAddress?: any;
    orders?: any;
}

interface AuthContextType {
    customer: Customer | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, cartId?: string) => Promise<{ success: boolean; errors?: any[] }>;
    logout: () => Promise<void>;
    register: (data: any) => Promise<{ success: boolean; errors?: any[]; requireLogin?: boolean }>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchCustomer = async () => {
        try {
            const res = await fetch("/api/auth/customer");
            if (res.ok) {
                const data = await res.json();
                setCustomer(data.customer);
            } else {
                setCustomer(null);
            }
        } catch (error) {
            console.error("Failed to fetch customer session:", error);
            setCustomer(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, []);

    const login = async (email: string, password: string, cartId?: string) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, cartId }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Refresh customer data
                await fetchCustomer();
                return { success: true };
            } else {
                setIsLoading(false); // Stop loading if failed
                return { success: false, errors: data.errors };
            }
        } catch (error) {
            setIsLoading(false);
            return { success: false, errors: [{ message: "Network error" }] };
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setCustomer(null);
            router.push("/"); // Redirect to home or login
            router.refresh(); // Refresh server components
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (formData: any) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                if (data.requireLogin) {
                    // Registration valid, but auto-login failed or not attempted
                    setIsLoading(false);
                    return { success: true, requireLogin: true };
                }
                // Auto-login successful
                await fetchCustomer();
                return { success: true };
            } else {
                setIsLoading(false);
                return { success: false, errors: data.errors };
            }
        } catch (error) {
            setIsLoading(false);
            return { success: false, errors: [{ message: "Registration failed" }] };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                customer,
                isAuthenticated: !!customer,
                isLoading,
                login,
                logout,
                register,
                refreshSession: fetchCustomer,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
