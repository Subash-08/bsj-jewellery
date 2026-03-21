import React from 'react';
import { ShieldCheck, Truck, CreditCard, RotateCcw } from 'lucide-react';
import { Section } from '@/components/layout/Section';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Hallmark Certified',
    description: '100% authentic and certified jewellery.'
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Complimentary shipping on orders above ₹10K.'
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Encrypted and safe checkout process.'
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Hassle-free 15-day return policy.'
  }
];

export default function WhyChooseUs() {
  return (
    <Section className="bg-[#FAF8F5]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-stone-100 group-hover:border-amber-200 transition-colors">
                  <Icon className="w-8 h-8 text-stone-800 stroke-[1.2] group-hover:text-amber-600 transition-colors" />
                </div>
                <h3 className="text-lg font-serif text-stone-900 mb-2">{feature.title}</h3>
                <p className="text-sm font-sans text-stone-600 leading-relaxed max-w-xs">{feature.description}</p>
              </div>
            );
          })}
        </div>
    </Section>
  );
}
