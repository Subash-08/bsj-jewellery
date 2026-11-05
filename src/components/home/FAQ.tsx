"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Section } from '@/components/layout/Section';

const FAQS = [
  {
    question: 'Where can I find purity and product details?',
    answer: 'Each product page shows the available product details, such as purity, weight, size and care information. Contact Bakya before purchase if you need help with a specific item.',
  },
  {
    question: 'Does Bakya ship silver jewellery outside Tirunelveli?',
    answer: 'Available shipping options, charges and delivery estimates are shown at checkout. Please review the Shipping Policy for the current terms.',
  },
  {
    question: 'What is the return policy for silver jewellery at Bakya?',
    answer: 'Return eligibility and the process are described in the Return and Refund Policy. Please review that policy before placing an order.',
  },
  {
    question: 'How do I care for my silver jewellery?',
    answer: 'Store your silver jewellery in a dry pouch away from moisture and perfumes. Clean with a soft silver polishing cloth to restore shine. Avoid exposing to household chemicals or soaking in water.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-600 uppercase tracking-widest text-xs font-bold mb-4 block">Information</span>
          <div className="flex justify-center items-center gap-3 md:gap-4">
            <span className="text-[#230532] text-[23px] leading-none">✦</span>
            <h2 className="text-[#230532] text-[36px] font-playfair font-bold mt-[-1px]">Frequently Asked Questions</h2>
            <span className="text-[#230532] text-[23px] leading-none">✦</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border-b border-stone-200">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 rounded-sm"
                  aria-expanded={isOpen}
                >
                  <span className={`font-serif text-lg md:text-xl transition-colors ${isOpen ? 'text-amber-600' : 'text-stone-800'}`}>
                    {faq.question}
                  </span>
                  <div className={`ml-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : 'text-stone-400'}`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-stone-600 font-sans leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
