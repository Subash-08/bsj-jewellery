"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/shopify/product";
import { usePriceFormatter } from "@/hooks/usePriceFormatter";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

/* ─────────────────────────────────────────────
   PRODUCT CARD (fixed spacing + clean UI)
───────────────────────────────────────────── */
function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { format } = usePriceFormatter(
    product.priceRange.minVariantPrice.currencyCode
  );

  const price = product.priceRange.minVariantPrice.amount;
  const standardImage = product.featuredImage;

  const hoverImage =
    (product as any).images?.edges?.[1]?.node ||
    (product as any).images?.[1] ||
    standardImage;

  const collection =
    product.collections?.edges?.find(
      (e: any) => e.node.handle !== "frontpage"
    )?.node?.handle || "all";

  const [hover, setHover] = useState(false);
  const [wish, setWish] = useState(false);

  return (
    <Link
      href={`/collections/${collection}/${product.handle}`}
      className="block"
      style={{
        animation: "fadeUp 0.4s ease both",
        animationDelay: `${index * 60}ms`,
      }}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "#fff",
          border: "1px solid #F0ECE6",
          transition: "all .25s ease",
          boxShadow: hover
            ? "0 8px 30px rgba(0,0,0,0.08)"
            : "0 2px 6px rgba(0,0,0,0.03)",
        }}
      >
        {/* IMAGE */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1/1",
            background: "#F3F3F3",
          }}
        >
          <Image
            src={standardImage?.url}
            alt={product.title}
            fill
            className="object-contain p-4"
            style={{
              opacity:
                hover &&
                  hoverImage &&
                  hoverImage.url !== standardImage?.url
                  ? 0
                  : 1,
              transition: "opacity .4s",
            }}
          />

          {hoverImage &&
            hoverImage.url !== standardImage?.url && (
              <Image
                src={hoverImage.url}
                alt=""
                fill
                className="object-contain p-4"
                style={{
                  opacity: hover ? 1 : 0,
                  transition: "opacity .4s",
                }}
              />
            )}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setWish(!wish);
            }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "1px solid #EAEAEA",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart
              size={12}
              strokeWidth={1.5}
              style={{
                fill: wish ? "#C9A96E" : "none",
                color: wish ? "#C9A96E" : "#888",
              }}
            />
          </button>

          {/* Cart */}
          <button
            onClick={(e) => e.preventDefault()}
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "1px solid #EAEAEA",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: hover ? 1 : 0,
              transform: hover
                ? "translateY(0)"
                : "translateY(6px)",
              transition: "all .25s",
            }}
          >
            <ShoppingCart size={12} strokeWidth={1.5} />
          </button>
        </div>

        {/* TEXT */}
        <div style={{ padding: "0.7rem 0.7rem 0.8rem" }}>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#2B2B2B",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "0.25rem",
            }}
          >
            {product.title}
          </p>

          <p
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#1C1510",
            }}
          >
            {format(price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   MAIN GRID (fixed layout)
───────────────────────────────────────────── */
export default function ProductGrid({
  title,
  description,
  products,
  lifestyleImage,
}: {
  title: string;
  description?: string;
  products: Product[];
  lifestyleImage?: { url: string; alt?: string };
}) {
  if (!products?.length) return null;

  return (
    <>
      <section
        style={{
          background: "#F5F5F5",
          padding: "3rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: lifestyleImage
              ? "1fr 420px"
              : "1fr",
            gap: "4rem",
          }}
        >
          {/* LEFT */}
          <div>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: "2.2rem",
                fontWeight: 600,
                marginBottom: "0.6rem",
              }}
            >
              {title}
            </h2>

            {description && (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#777",
                  maxWidth: 420,
                  marginBottom: "1.5rem",
                }}
              >
                {description}
              </p>
            )}

            {/* GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "1.2rem",
                marginBottom: "1.5rem",
              }}
            >
              {products.slice(0, 6).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>

            {/* BUTTON */}
            <div style={{ textAlign: "center" }}>
              <Link
                href="/collections"
                style={{
                  border: "1px solid #222",
                  padding: "0.7rem 2.8rem",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  display: "inline-block",
                  transition: ".2s",
                }}
              >
                View All
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          {lifestyleImage && (
            <div
              style={{
                position: "sticky",
                top: "80px",
                aspectRatio: "3/4",
                overflow: "hidden",
              }}
            >
              <Image
                src={lifestyleImage.url}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          from {opacity:0; transform:translateY(10px);}
          to {opacity:1; transform:translateY(0);}
        }

        @media (max-width: 900px){
          section > div{
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 600px){
          div[style*="repeat(3,1fr)"]{
            grid-template-columns: repeat(2,1fr) !important;
          }
        }
      `}</style>
    </>
  );
}