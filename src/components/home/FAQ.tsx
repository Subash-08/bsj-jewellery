"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Section } from '@/components/layout/Section';

const FAQS = [
  {
    question: "What is your shipping time?",
    answer: "We process all orders within 24 hours. Standard shipping takes 3-5 business days across India. Expedited shipping options are available at checkout."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a hassle-free 15-day return policy for all unworn jewellery with original tags attached. Custom pieces are non-refundable."
  },
  {
    question: "Is the jewellery authentic?",
    answer: "Yes, every piece of BSJ Jewellery is Hallmark certified. Our pure silver pieces come with a certificate of authenticity."
  },
  {
    question: "Are my payments safe?",
    answer: "Absolutely. We use industry-standard encryption protocols. Your payment information is never stored on our servers."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section className="bg-white">
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
