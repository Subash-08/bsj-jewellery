import React from 'react';

export function Section({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) {
  return (
    <section id={id} className={`py-16 md:py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
