"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/shopify/product';
import { usePriceFormatter } from '@/hooks/usePriceFormatter';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useCart } from '@/context/CartProvider';
import { useWishlist } from '@/hooks/useWishlist';

function SimpleProductCard({ product }: { product: Product }) {
  const { format } = usePriceFormatter(product.priceRange.minVariantPrice.currencyCode);
  const price = product.priceRange.minVariantPrice.amount;
  const image = product.featuredImage;
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wish = isInWishlist(product.id);
  const [added, setAdded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { addCartItem, isLoading, setIsCartOpen } = useCart();

  const collection = product.collections?.edges?.find(
    (e: any) => e.node.handle !== "frontpage"
  )?.node?.handle || "all";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (added || !product.availableForSale) return;

    // Safely extract variantId (handles both Shopify standard edges AND flattened mock arrays)
    const variants = product.variants as any;
    const variantId = variants?.edges?.[0]?.node?.id || variants?.[0]?.id;
    if (!variantId) return;

    startTransition(async () => {
      try {
        await addCartItem(variantId, 1);
        setIsCartOpen(true); // Open cart drawer after adding
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } catch (err) {
        console.error('Add to cart failed', err);
      }
    });
  };

  const isAdding = isPending || isLoading;
  const variants = product.variants as any;
  const safeVariantId = variants?.edges?.[0]?.node?.id || variants?.[0]?.id;
  const isUnavailable = !product.availableForSale || !safeVariantId;

  return (
    <Link
      href={`/collections/${collection}/${product.handle}`}
      className="spc-card group"
    >
      {/* Image area */}
      <div className="spc-img-wrap">
        {image ? (
          <Image
            src={image.url}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="spc-img"
          />
        ) : (
          <div className="spc-img-placeholder" />
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
          className={`spc-wish ${wish ? 'spc-wish--active' : ''}`}
          aria-label="Wishlist"
        >
          <Heart size={13} className={wish ? "fill-rose-500 text-rose-500" : "text-stone-400"} />
        </button>

        {/* Add to cart — slides up on hover */}
        <button
          onClick={handleAddToCart}
          disabled={isUnavailable || isAdding || added}
          className={`spc-atc ${added ? 'spc-atc--added' : ''} ${isUnavailable ? 'opacity-70 cursor-not-allowed' : ''}`}
          aria-label="Add to cart"
        >
          {added ? (
            <>
              <Check size={13} strokeWidth={2.5} />
              <span>Added</span>
            </>
          ) : isAdding ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
              <span>Adding...</span>
            </>
          ) : isUnavailable ? (
            <span>Sold Out</span>
          ) : (
            <>
              <ShoppingBag size={13} strokeWidth={2} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="spc-info">
        <h3 className="spc-title">{product.title}</h3>
        <div className="spc-price-row">
          <p className="spc-price">{format(price)}</p>
        </div>
      </div>

      {/* Gold bottom border that animates on hover */}
      <span className="spc-border-line" />
    </Link>
  );
}

export default function SplitProductShowcase({
  title,
  description,
  products,
  imageSrc
}: {
  title: string;
  description: string;
  products: Product[];
  imageSrc: string;
}) {
  if (!products?.length) return null;

  return (
    <section className="sps-root my-20">
      <div className="sps-grid">

        {/* LEFT: Products */}
        <div className="sps-left">
          {/* Header */}
          <div className="sps-header">
            <p className="sps-eyebrow">Curated Collection</p>
            <h2 className="sps-title">{title}</h2>
            <div className="sps-title-rule" />
            <p className="sps-desc">{description}</p>
          </div>

          {/* Product grid */}
          <div className="sps-product-grid">
            {products.slice(0, 6).map((product) => (
              <SimpleProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* CTA */}
          <div className="sps-cta-wrap">
            <Link href="/collections" className="sps-cta">
              <span>Explore All</span>
              <span className="sps-cta-arrow">→</span>
            </Link>
          </div>
        </div>

        {/* RIGHT: Image */}
        <div className="sps-right">
          <div className="sps-img-frame">
            <Image
              src={imageSrc}
              alt="Jewellery Model"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="sps-right-img"
            />
            {/* Subtle gold corner accents */}
            <span className="sps-corner sps-corner--tl" />
            <span className="sps-corner sps-corner--br" />
          </div>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Section ── */
        .sps-root {
          background: #FAF8F5;
          padding: 0;
          overflow: hidden;
        }

        .sps-grid {
          display: grid;
          grid-template-columns: 1fr;
        }

@media (min-width: 1024px) {
  .sps-grid {
    grid-template-columns: 60% 40%; /* Increase left to 60%, decrease right image to 40% */
    min-height: 680px; /* Decrease this value to reduce the minimum height */
  }
}

        /* ── Left panel ── */
        .sps-left {
          padding: 3rem 1.5rem 3rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 640px) {
          .sps-left { padding: 3.5rem 2rem; }
        }

        @media (min-width: 1024px) {
          .sps-left { padding: 4rem 3rem 4rem 4rem; }
        }

        /* ── Header ── */
        .sps-header { display: flex; flex-direction: column; gap: 0.5rem; }

        .sps-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #C9A96E;
        }

        .sps-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 700;
          color: #1C1510;
          line-height: 1.1;
          letter-spacing: -0.02em;
          /* Allow full wrap — no truncation */
          white-space: normal;
          word-break: break-word;
        }

        .sps-title-rule {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, #C9A96E, transparent);
          margin: 0.35rem 0 0.1rem;
        }

        .sps-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          color: #9A8878;
          line-height: 1.65;
          max-width: 420px;
          font-weight: 300;
        }

        /* ── Product grid ── */
        .sps-product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .sps-product-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.25rem;
          }
        }

        /* ── Product card ── */
        .spc-card {
          position: relative;
          background: #FFFFFF;
          border: 1px solid #EDE8E0;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .spc-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          transform: translateY(-3px);
        }

        /* Gold bottom border slides in on hover */
        .spc-border-line {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          width: 0;
          background: linear-gradient(90deg, #C9A96E, #E8C97A);
          transition: width 0.35s ease;
          border-radius: 0 0 10px 10px;
        }

        .spc-card:hover .spc-border-line {
          width: 100%;
        }

        /* ── Card image ── */
        .spc-img-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #F5F0E8;
          overflow: hidden;
        }

        .spc-img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .spc-card:hover .spc-img {
          transform: scale(1.06);
        }

        .spc-img-placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #F0EBE2, #E8E1D6);
        }

        /* ── Wishlist button ── */
        .spc-wish {
          position: absolute;
          top: 8px; right: 8px;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.88);
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(4px);
          box-shadow: 0 1px 4px rgba(0,0,0,0.10);
          transition: background 0.2s, transform 0.2s;
          z-index: 2;
        }

        .spc-wish:hover { background: #fff; transform: scale(1.1); }
        .spc-wish--active { background: #fff4f4; }

        /* ── Add to Cart button — slides up from bottom on hover ── */
        .spc-atc {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 34px;
          background: rgba(28, 21, 16, 0.88);
          backdrop-filter: blur(4px);
          border: none;
          color: #FAF6F0;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transform: translateY(100%);
          transition: transform 0.28s cubic-bezier(0.34,1.2,0.64,1),
                      background 0.2s;
          z-index: 3;
        }

        .spc-card:hover .spc-atc {
          transform: translateY(0);
        }

        .spc-atc:hover {
          background: rgba(201,169,110,0.95);
          color: #1C1510;
        }

        .spc-atc--added {
          background: rgba(34,120,60,0.90) !important;
          color: #fff !important;
          transform: translateY(0) !important;
        }

        /* ── Card info ── */
        .spc-info {
          padding: 0.7rem 0.75rem 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          flex: 1;
        }

        .spc-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          color: #4A3F35;
          line-height: 1.35;
          /* Show full title — 2 lines max */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .spc-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .spc-price {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #000000ff;
          letter-spacing: 0.01em;
        }

        /* ── CTA ── */
        .sps-cta-wrap { display: flex; }

        .sps-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2C2218;
          text-decoration: none;
          border: 1.5px solid #C9A96E;
          padding: 0.7rem 2rem;
          border-radius: 4px;
          transition: background 0.25s, color 0.25s;
          position: relative;
          overflow: hidden;
        }

        .sps-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #1C1510;
          transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          z-index: 0;
        }

        .sps-cta:hover::before { transform: translateX(0); }
        .sps-cta:hover { color: #FAF6F0; border-color: #1C1510; }
        .sps-cta span { position: relative; z-index: 1; }

        .sps-cta-arrow {
          transition: transform 0.2s;
          position: relative; z-index: 1;
        }
        .sps-cta:hover .sps-cta-arrow { transform: translateX(4px); }

        /* ── Right image panel ── */
        .sps-right {
          position: relative;
          min-height: 360px;
          order: -1; /* image first on mobile */
        }

        @media (min-width: 1024px) {
          .sps-right { order: 0; min-height: unset; }
        }

        .sps-img-frame {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .sps-right-img {
          object-fit: cover;
          object-position: center top;
        }

        /* Gold corner accents */
        .sps-corner {
          position: absolute;
          width: 28px; height: 28px;
          border-color: #C9A96E;
          border-style: solid;
          z-index: 2;
          pointer-events: none;
        }

        .sps-corner--tl {
          top: 16px; left: 16px;
          border-width: 2px 0 0 2px;
        }

        .sps-corner--br {
          bottom: 16px; right: 16px;
          border-width: 0 2px 2px 0;
        }
      `}</style>
    </section>
  );
}