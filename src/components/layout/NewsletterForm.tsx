"use client";

import { ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  // TODO: Connect to Klaviyo/Mailchimp email provider
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = (e.currentTarget.elements[0] as HTMLInputElement).value;
    window.location.href = `mailto:bagyalakshmijewellers97@gmail.com?subject=Newsletter Signup&body=Please add me to your newsletter: ${encodeURIComponent(input)}`;
  }

  return (
    <form className="flex flex-col gap-3 mt-2" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="email"
          placeholder="Your email address"
          className="w-full bg-white/10 border border-white/20 text-white text-sm px-4 py-3 outline-none focus:border-amber-500 transition-colors placeholder:text-white/50"
          required
        />
        <button
          type="submit"
          className="absolute right-0 top-0 bottom-0 px-4 text-white/70 hover:text-amber-500 transition-colors flex items-center justify-center"
          aria-label="Subscribe"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
