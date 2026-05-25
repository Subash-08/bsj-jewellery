import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Award,
  MessageCircle,
} from "lucide-react";
import NewsletterForm from "./NewsletterForm";

const TRUST_BADGES = [
  { icon: Award, label: "BIS Hallmark Certified" },
  { icon: Truck, label: "Free Shipping Above ₹999" },
  { icon: RotateCcw, label: "7-Day Easy Returns" },
  { icon: CreditCard, label: "Secure Razorpay Payments" },
  { icon: ShieldCheck, label: "Ships Across Tamil Nadu" },
];

const SHOP_LINKS = [
  { label: "Rings", href: "/silver-jewellery/rings" },
  { label: "Chains", href: "/silver-jewellery/chains" },
  { label: "Bracelets", href: "/silver-jewellery/bracelets" },
  { label: "Pendants", href: "/silver-jewellery/pendants" },
  { label: "Anklets", href: "/silver-jewellery/anklets" },
];

const CUSTOMER_CARE_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "Track Order", href: "/track-order" },
  { label: "FAQs", href: "/faqs" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Return & Refund Policy", href: "/return-refund-policy" },
];

const ABOUT_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-of-service" },
];

export default function Footer() {
  return (
    <footer className="bg-[#230532] text-white pt-16 pb-8 border-t border-white/20">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">

        {/* 1. TOP TRUST BAR */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 pb-16 border-b border-white/20">
          {TRUST_BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-sm">
                  <Icon className="w-6 h-6 text-amber-500 stroke-[1.5]" />
                </div>
                <span className="text-xs font-semibold text-white uppercase tracking-widest">{badge.label}</span>
              </div>
            );
          })}
        </div>

        {/* 2. MAIN FOOTER GRID */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="">
              <Image src="/logo.png" alt="Bakya Silver Jewellery — Tirunelveli Since 1997" width={120} height={120} className="w-auto h-12 object-contain" />
            </Link>
            <div>
              <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                Handcrafted BIS hallmarked silver jewellery from Tirunelveli, Tamil Nadu.
              </p>
              <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                Trusted by families since 1997.
              </p>
              <p className="text-xs text-white/50 mt-3 leading-relaxed max-w-sm">
                57A/12 ERKP Building, Koolakadai Bazaar<br />
                Tirunelveli Town, Tamil Nadu 627006
              </p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://www.instagram.com/bakya.jewels"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Bakya on Instagram"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-amber-500 hover:border-amber-500 transition-colors"
              >
                {/* Instagram icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Bakya on Facebook (coming soon)"
                title="Coming soon"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-amber-500 hover:border-amber-500 transition-colors"
              >
                {/* Facebook icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Bakya on WhatsApp (coming soon)"
                title="Coming soon"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-amber-500 hover:border-amber-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 — Shop */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-sm font-serif font-medium text-white uppercase tracking-widest">Shop</h3>
            <ul className="flex flex-col gap-4">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/80 hover:text-amber-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Customer Care */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-sm font-serif font-medium text-white uppercase tracking-widest">Customer Care</h3>
            <ul className="flex flex-col gap-4">
              {CUSTOMER_CARE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/80 hover:text-amber-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — About */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-sm font-serif font-medium text-white uppercase tracking-widest">About</h3>
            <ul className="flex flex-col gap-4">
              {ABOUT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/80 hover:text-amber-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5 — Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-sm font-serif font-medium text-white uppercase tracking-widest">Newsletter</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Subscribe to receive updates, exclusive offers, and silver care tips.
            </p>
            <NewsletterForm />
          </div>

        </div>

        {/* 3. BOTTOM BAR */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/70">
            Bakya by Bagyalakshmi Jewellers &copy; {new Date().getFullYear()}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-all duration-300">
            {/* Payment Placeholders */}
            <div className="h-6 w-10 bg-white/20 rounded flex items-center justify-center text-[8px] font-bold text-white/90">VISA</div>
            <div className="h-6 w-10 bg-white/20 rounded flex items-center justify-center text-[8px] font-bold text-white/90">MC</div>
            <div className="h-6 w-10 bg-white/20 rounded flex items-center justify-center text-[8px] font-bold text-white/90">UPI</div>
          </div>
        </div>

      </div>
    </footer>
  );
}
