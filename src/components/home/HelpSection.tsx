"use client";
import { Phone, MessageCircle } from "lucide-react";

export default function HelpSection() {
  return (
    <section className="w-full bg-[#DFD1E8] mt-20 max-w-[95%] mx-auto py-14 md:py-16 text-center px-4">
      <p className="text-[#230532] font-sans text-[15px] md:text-base font-medium mb-3">
        Need Help!
      </p>
      <div className="flex justify-center items-center gap-3 md:gap-4 mb-4">
        <span className="text-[#230532] text-xl md:text-2xl">✦</span>
        <h2 className="text-[#230532] text-2xl md:text-[34px] font-serif font-bold tracking-wide">
          Find Your Perfect Match — We're Here to Help
        </h2>
        <span className="text-[#230532] text-xl md:text-2xl">✦</span>
      </div>
      <p className="text-[#230532] font-sans text-[13px] md:text-[15px] max-w-[600px] mx-auto mb-3 opacity-90 leading-relaxed font-medium">
        Not sure what to choose? Our experts are ready to guide you in finding the perfect piece for every occasion.
      </p>
      <p className="text-[#230532] font-sans text-[13px] md:text-[15px] opacity-90 font-medium">
        Speak directly with our support team
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 mt-8">
        <a href="tel:+1234567890" className="flex items-center gap-2.5 px-7 py-2.5 border border-[#230532] rounded text-[#230532] font-sans font-bold hover:bg-[#230532] hover:text-white transition-colors w-full sm:w-auto justify-center text-[15px]">
          <Phone size={18} fill="currentColor" className="opacity-80" />
          <span>Call Us</span>
        </a>
        <a href="mailto:support@bakya.com" className="flex items-center gap-2.5 px-7 py-2.5 border border-[#230532] rounded text-[#230532] font-sans font-bold hover:bg-[#230532] hover:text-white transition-colors w-full sm:w-auto justify-center text-[15px]">
          <span>Chat with Us</span>
          <MessageCircle size={18} fill="currentColor" className="opacity-80" />
        </a>
      </div>
    </section>
  );
}
