import React from 'react';

export default function SectionSkeleton() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-pulse">
      <div className="h-8 bg-stone-100 rounded w-1/3 md:w-1/4 mx-auto mb-8"></div>
      <div className="h-64 md:h-96 bg-stone-100 rounded-xl w-full"></div>
    </section>
  );
}
