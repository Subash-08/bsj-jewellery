"use client";

import { useEffect, useState } from 'react';

export interface ShopifyCustomer {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    defaultAddress: {
        id: string;
        firstName: string;
        lastName: string;
        address1: string;
        address2: string | null;
        city: string;
        province: string;
        zip: string;
        country: string;
        phone: string | null;
    } | null;
    addresses: {
        edges: Array<{
            node: {
                id: string;
                firstName: string;
                lastName: string;
                address1: string;
                address2: string | null;
                city: string;
                province: string;
                zip: string;
                country: string;
                phone: string | null;
            };
        }>;
    };
    orders: {
        edges: Array<{
            node: {
                id: string;
                orderNumber: number;
                processedAt: string;
                financialStatus: string;
                fulfillmentStatus: string;
                totalPrice: {
                    amount: string;
                    currencyCode: string;
                };
                subtotalPrice?: {
                    amount: string;
                    currencyCode: string;
                };
                totalShippingPrice?: {
                    amount: string;
                    currencyCode: string;
                };
                totalTax?: {
                    amount: string;
                    currencyCode: string;
                };
                shippingAddress?: {
                    firstName: string;
                    lastName: string;
                    address1: string;
                    address2: string | null;
                    city: string;
                    province: string;
                    zip: string;
                    country: string;
                    phone: string | null;
                };
                lineItems: {
                    edges: Array<{
                        node: {
                            title: string;
                            quantity: number;
                            variant?: {
                                image?: {
                                    url: string;
                                    altText: string | null;
                                };
                                price?: {
                                    amount: string;
                                    currencyCode: string;
                                };
                            };
                        };
                    }>;
                };
            };
        }>;
    };
}

export interface CustomerData {
    isLoggedIn: boolean;
    customer: ShopifyCustomer | null;
}

export function useCustomer() {
    const [customerData, setCustomerData] = useState<CustomerData>({
        isLoggedIn: false,
        customer: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCustomer() {
            try {
                const response = await fetch('/api/auth/customer');
                const data = await response.json();

                if (response.ok) {
                    setCustomerData(data);
                } else {
                    setCustomerData({ isLoggedIn: false, customer: null });
                }
            } catch (err) {
                setError('Failed to fetch customer data');
                setCustomerData({ isLoggedIn: false, customer: null });
            } finally {
                setLoading(false);
            }
        }

        fetchCustomer();
    }, []);

    return { ...customerData, loading, error };
}
