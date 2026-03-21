import React from 'react';

export function Section({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <section className={`py-16 md:py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
