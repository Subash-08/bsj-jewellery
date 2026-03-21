import React from 'react';

export default function ProductSkeleton() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-pulse">
      <div className="h-10 bg-stone-100 rounded w-64 mx-auto mb-12"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="aspect-square w-full bg-stone-100 rounded-lg"></div>
            <div className="h-4 bg-stone-100 rounded w-3/4"></div>
            <div className="h-4 bg-stone-100 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
