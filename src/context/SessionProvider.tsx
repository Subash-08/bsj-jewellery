"use client";

import React, { createContext, useContext } from 'react';

const SessionContext = createContext<any>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    // Logic to track session, country, headers
    return (
        <SessionContext.Provider value={{ country: 'US', currency: 'USD' }}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => useContext(SessionContext);