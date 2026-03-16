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
    addresses?: any;
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

interface AuthProviderProps {
    children: React.ReactNode;
    initialCustomer?: Customer | null;
}

export function AuthProvider({ children, initialCustomer }: AuthProviderProps) {
    const [customer, setCustomer] = useState<Customer | null>(initialCustomer ?? null);
    const [isLoading, setIsLoading] = useState(!initialCustomer);
    const router = useRouter();

    const fetchCustomer = async () => {
        try {
            const res = await fetch("/api/auth/customer");
            if (res.ok) {
                const data = await res.json();
                setCustomer(data.customer);
            } else {
                if (res.status !== 401) {
                    console.error("Failed to fetch customer session:", res.status);
                }
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
        // Skip fetch if initialCustomer was provided server-side
        if (initialCustomer !== undefined && initialCustomer !== null) {
            return;
        }
        fetchCustomer();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                await fetchCustomer();
                return { success: true };
            } else {
                setIsLoading(false);
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
            router.push("/");
            router.refresh();
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
                    setIsLoading(false);
                    return { success: true, requireLogin: true };
                }
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
