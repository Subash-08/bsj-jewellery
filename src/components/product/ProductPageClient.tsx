"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Heart, Shield, Truck, RotateCcw, Lock, Star,
    ChevronDown, Award, Sparkles, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePriceFormatter } from '@/hooks/usePriceFormatter';
import { WishlistButton } from '@/components/ui/WishlistButton';
import ProductGallery from './ProductGallery';
import VariantSelector from './VariantSelector';
import QuantitySelector from './QuantitySelector';
import AddToCart from './AddToCart';
import BuyNowButton from './BuyNowButton';
import StickyBuyBar from './StickyBuyBar';
import type { Product, ProductVariant } from '@/types/shopify/product';

// ─── Types ───────────────────────────────────────────────────────────────
interface SpecItem {
    label: string;
    value: string | number | null | undefined;
}

interface PriceBreakdown {
    metalRate?: string;
    makingCharges?: string;
    gst?: string;
    gstAmount?: string;
}

interface BreadcrumbData {
    collectionTitle: string;
    collectionHandle: string;
    shortTitle: string;
}

interface ProductPageClientProps {
    product: Product;
    specifications: SpecItem[];
    priceBreakdown: PriceBreakdown;
    breadcrumb: BreadcrumbData;
    relatedProducts: Product[];
}

// ─── Description Parsing Fallback ────────────────────────────────────────
function parseHighlightsFromDescription(description: string): {
    purity: string | null;
    weight: string | null;
    length: string | null;
    metal: string | null;
} {
    try {
        const purityMatch = description.match(/(\d+\.?\d*)%\s*[Pp]urity/);
        const weightMatch = description.match(/Weight:\s*([\d.]+)\s*gram/i);
        const lengthMatch = description.match(/Length:\s*([\d.]+)\s*inch/i);
        const metalMatch = description.match(/Material:\s*([^-\n]+)/i);
        return {
            purity: purityMatch ? `${purityMatch[1]}%` : null,
            weight: weightMatch ? `${weightMatch[1]}g` : null,
            length: lengthMatch ? `${lengthMatch[1]} inch` : null,
            metal: metalMatch ? metalMatch[1].trim() : null,
        };
    } catch {
        return { purity: null, weight: null, length: null, metal: null };
    }
}

// ─── Component ───────────────────────────────────────────────────────────
export default function ProductPageClient({
    product,
    specifications,
    priceBreakdown,
    breadcrumb,
    relatedProducts,
}: ProductPageClientProps) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
        product.variants[0]?.id
    );
    const [quantity, setQuantity] = useState(1);
    const addToCartRef = useRef<HTMLDivElement>(null);

    const { format } = usePriceFormatter(product.priceRange.minVariantPrice.currencyCode);

    const selectedVariant: ProductVariant | undefined = product.variants.find(
        (v) => v.id === selectedVariantId
    );

    const minPriceAmt = product?.priceRange?.minVariantPrice?.amount;
    const price = selectedVariant
        ? format(selectedVariant.price.amount)
        : (minPriceAmt ? format(minPriceAmt) : '');

    const compareAtPrice = selectedVariant?.compareAtPrice?.amount
        ? format(selectedVariant.compareAtPrice.amount)
        : null;

    const savings = selectedVariant?.compareAtPrice?.amount && selectedVariant?.price?.amount
        ? Math.round(
            ((parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)) /
                parseFloat(selectedVariant.compareAtPrice.amount)) *
            100
        )
        : null;

    const meta = product.jewelryMetafields || {};
    const parsed = parseHighlightsFromDescription(product.description || '');

    // Build highlights — metafield priority, fallback to parsed
    const highlights = [
        {
            label: 'Purity',
            value: meta['Purity Percentage']
                ? `${meta['Purity Percentage']}%`
                : meta['Purity'] || parsed.purity,
            icon: Award,
        },
        {
            label: 'Weight',
            value: meta['Gross Weight']
                ? `${meta['Gross Weight']}g`
                : parsed.weight,
            icon: Sparkles,
        },
        {
            label: 'Length',
            value: meta['Chain Length(inches)']
                || meta['Bracelet Length(inches)']
                || meta['Ankle Length']
                || meta['Necklace Length']
                || parsed.length,
            icon: Clock,
        },
    ].filter((h) => h.value);

    const hideVariantSelector = product.options.length === 0
        || (product.options.length === 1 && product.options[0].values.length <= 1);

    const dispatchTime = meta['Dispatch Time'] as string | undefined;
    const careInstructions = meta['Care Instructions'] as string | undefined;

    // Short title for breadcrumb
    const shortTitle = breadcrumb.shortTitle || product.title.replace(/\s*\|\s*BSJ Jewellery/i, '').slice(0, 60);

    return (
        <div className="bg-[#FAF8F5] mt-14 sm:mt-24">
            <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">

                {/* ══════════════════════════════════════════════════════════
                    SECTION: BREADCRUMB
                ══════════════════════════════════════════════════════════ */}
                <nav className="pt-4 pb-2 border-b border-stone-100" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-2 text-xs text-stone-400 tracking-wide">
                        <li>
                            <Link href="/" className="hover:text-amber-700 transition-colors">Home</Link>
                        </li>
                        <li className="select-none">/</li>
                        {breadcrumb.collectionHandle ? (
                            <>
                                <li>
                                    <Link
                                        href={`/collections/${breadcrumb.collectionHandle}`}
                                        className="hover:text-amber-700 transition-colors"
                                    >
                                        {breadcrumb.collectionTitle}
                                    </Link>
                                </li>
                                <li className="select-none">/</li>
                            </>
                        ) : product.productType ? (
                            <>
                                <li className="text-stone-400">{product.productType}</li>
                                <li className="select-none">/</li>
                            </>
                        ) : null}
                        <li className="text-stone-600 font-medium truncate max-w-[200px] sm:max-w-none">
                            {shortTitle}
                        </li>
                    </ol>
                </nav>

                {/* ══════════════════════════════════════════════════════════
                    SECTION: HERO — Sticky Gallery + Scrollable Details
                ══════════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6 py-2 md:py-4 items-start">

                    {/* ── LEFT: Sticky Gallery ─────────────────────────────── */}
                    <div className="lg:col-span-6 lg:sticky lg:top-[calc(var(--navbar-height,80px)+16px)] lg:self-start h-fit">
                        <ProductGallery images={product.images} />
                    </div>

                    {/* ── RIGHT: Scrollable Product Details ────────────────── */}
                    <div className="lg:col-span-6 space-y-2">

                        {/* Collection tag + Availability badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {product?.productType && (
                                <span className="text-[10px] uppercase tracking-widest font-semibold text-stone-400 bg-stone-100 px-2 py-1 rounded-sm">
                                    {product.productType}
                                </span>
                            )}
                            {product?.availableForSale ? (
                                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-sm">
                                    In Stock
                                </span>
                            ) : (
                                <span className="text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-sm">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Product Title */}
                        <h1 className="font-serif text-3xl lg:text-3xl font-bold text-stone-900 leading-tight tracking-tight">
                            {product.title}
                        </h1>

                        {/* Price Row */}
                        <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="font-serif text-3xl font-bold text-amber-700">
                                {price}
                            </span>
                            {compareAtPrice && (
                                <>
                                    <del className="text-lg text-stone-400">{compareAtPrice}</del>
                                    {savings && savings > 0 && (
                                        <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-sm tracking-wider">
                                            Save {savings}%
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Highlight Strip */}
                        {highlights.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {highlights.map((h) => (
                                    <div
                                        key={h.label}
                                        className="bg-white border border-stone-100 rounded-sm p-3 text-center shadow-sm"
                                    >
                                        <h.icon size={18} className="text-amber-600 mx-auto mb-1.5" strokeWidth={1.5} />
                                        <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">{h.label}</p>
                                        <p className="text-sm font-bold text-stone-900 mt-0.5">{String(h.value)}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Variant Selector */}
                        {!hideVariantSelector && (
                            <VariantSelector
                                options={product.options}
                                variants={product.variants}
                                onVariantChange={setSelectedVariantId}
                                defaultVariantId={product.variants[0]?.id}
                            />
                        )}

                        {/* Quantity Selector */}
                        {/* <QuantitySelector
                            quantity={quantity}
                            onChange={setQuantity}
                            max={10}
                        /> */}

                        {/* CTA Buttons */}
                        <div className="space-y-3" ref={addToCartRef}>
                            <AddToCart
                                availableForSale={product.availableForSale}
                                variantId={selectedVariantId}
                                quantity={quantity}
                            />
                            <BuyNowButton
                                variantId={selectedVariantId}
                                quantity={quantity}
                                availableForSale={product.availableForSale}
                            />
                        </div>


                        {/* ── Description (moved from tabs → inline) ──────── */}
                        {(product.descriptionHtml || product.description) && (
                            <div className="mt-6 max-w-xl border-t border-stone-100 pt-6">
                                <h2 className="font-serif text-base font-semibold text-stone-800 mb-3 tracking-tight">
                                    About This Piece
                                </h2>
                                <div
                                    className="prose prose-sm text-stone-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                                />
                            </div>
                        )}

                        {/* ── Trust Badge Strip ───────────────────────────── */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                            {[
                                { icon: Shield, label: 'Hallmark Certified' },
                                { icon: Truck, label: 'Free Shipping ₹10K+' },
                                { icon: RotateCcw, label: 'Easy Returns' },
                                { icon: Lock, label: 'Secure Payment' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2 text-stone-500">
                                    <Icon size={14} className="text-amber-600 shrink-0" strokeWidth={1.5} />
                                    <span className="text-[10px] uppercase tracking-wider font-semibold leading-tight">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Delivery Estimate */}
                        <div className="bg-white border border-stone-100 rounded-sm p-3 flex items-center gap-3 shadow-sm">
                            <Truck size={15} className="text-amber-600 shrink-0" />
                            <p className="text-xs text-stone-600">
                                {dispatchTime
                                    ? `Dispatch in ${dispatchTime}`
                                    : 'Estimated delivery in 3–5 business days'}
                            </p>
                        </div>

                    </div>{/* end RIGHT column */}
                </div>{/* end HERO grid */}

                {/* ══════════════════════════════════════════════════════════
                    SECTION: DETAILS — Specifications + Care & Shipping
                ══════════════════════════════════════════════════════════ */}
                <div className="py-12 md:py-16 border-t border-stone-100 space-y-12">

                    {/* ── A. Specifications ─────────────────────────────────── */}
                    {specifications.length > 0 && (
                        <div>
                            <h2 className="font-serif text-xl font-semibold text-stone-900 mb-6">
                                Specifications
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0 max-w-3xl">
                                {specifications.map((spec, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center py-3 border-b border-stone-100"
                                    >
                                        <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
                                            {spec.label}
                                        </span>
                                        <span className="text-sm font-medium text-stone-900 text-right">
                                            {spec.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── B. Care & Shipping Accordions ─────────────────────── */}
                    <div>
                        <h2 className="font-serif text-xl font-semibold text-stone-900 mb-6">
                            Care &amp; Shipping
                        </h2>
                        <div className="max-w-2xl space-y-3">
                            <AccordionSection title="Jewellery Care" defaultOpen>
                                <p className="text-sm text-stone-600 leading-relaxed">
                                    {careInstructions ||
                                        'Store your silver jewellery in a cool, dry place. Avoid contact with perfumes, lotions, and chemicals. Polish regularly with a soft cloth to maintain its shine. Remove before swimming or bathing.'}
                                </p>
                            </AccordionSection>

                            <AccordionSection title="Shipping & Returns">
                                <div className="text-sm text-stone-600 leading-relaxed space-y-2">
                                    <p>Free shipping on all orders above ₹10,000. Standard delivery takes 5–7 business days.</p>
                                    <p>30-day return policy on unworn items in original packaging. Customised items are not eligible for return.</p>
                                </div>
                            </AccordionSection>

                            {/* Price Breakdown — only if metalRate exists */}
                            {priceBreakdown.metalRate && (
                                <AccordionSection title="Price Breakdown">
                                    <ul className="space-y-3 text-sm">
                                        {priceBreakdown.metalRate && (
                                            <li className="flex justify-between">
                                                <span className="text-stone-500">Metal Price</span>
                                                <span className="font-medium text-stone-900">₹{priceBreakdown.metalRate}/gram</span>
                                            </li>
                                        )}
                                        {priceBreakdown.makingCharges && (
                                            <li className="flex justify-between">
                                                <span className="text-stone-500">Making Charges</span>
                                                <span className="font-medium text-stone-900">₹{priceBreakdown.makingCharges}</span>
                                            </li>
                                        )}
                                        {priceBreakdown.gst && (
                                            <li className="flex justify-between">
                                                <span className="text-stone-500">GST ({priceBreakdown.gst}%)</span>
                                                <span className="font-medium text-stone-900">
                                                    {priceBreakdown.gstAmount ? `₹${priceBreakdown.gstAmount}` : '—'}
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                </AccordionSection>
                            )}
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    SECTION: TRUST — Why Choose BSJ
                ══════════════════════════════════════════════════════════ */}
                <div className="py-12 md:py-16 border-t border-stone-100">
                    <h2 className="font-serif text-xl font-semibold text-stone-900 mb-8 text-center">Why Choose BSJ</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Shield,
                                title: 'BIS Hallmark Certified',
                                subtitle: 'Every piece verified for purity',
                            },
                            {
                                icon: Award,
                                title: 'Purity Guaranteed',
                                subtitle: '925 Sterling Silver & Fine Gold',
                            },
                            {
                                icon: Sparkles,
                                title: 'Free Lifetime Polishing',
                                subtitle: 'Keep your jewellery shining forever',
                            },
                            {
                                icon: RotateCcw,
                                title: '30-Day Easy Returns',
                                subtitle: 'Hassle-free return on all orders',
                            },
                        ].map(({ icon: Icon, title, subtitle }) => (
                            <div
                                key={title}
                                className="bg-white border border-stone-100 rounded-sm p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                            >
                                <Icon size={28} className="text-amber-600 mx-auto mb-3" strokeWidth={1.5} />
                                <h3 className="font-semibold text-stone-900 text-sm mb-1">{title}</h3>
                                <p className="text-xs text-stone-500">{subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    SECTION: REVIEWS — Placeholder (ready for integration)
                ══════════════════════════════════════════════════════════ */}
                <div className="py-12 md:py-16 border-t border-stone-100">
                    <h2 className="font-serif text-xl font-semibold text-stone-900 mb-8 text-center">Customer Reviews</h2>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} size={24} className="text-stone-200" strokeWidth={1.5} />
                            ))}
                        </div>
                        <p className="text-sm text-stone-400 mb-2">No reviews yet</p>
                        <p className="text-xs text-stone-400">Be the first to review this product</p>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    SECTION: RELATED PRODUCTS
                ══════════════════════════════════════════════════════════ */}
                <div className="py-12 md:py-16 border-t border-stone-100">
                    <h2 className="font-serif text-xl font-semibold text-stone-900 mb-8 text-center">You May Also Like</h2>
                    {relatedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((rp) => (
                                <Link
                                    key={rp.id}
                                    href={`/products/${rp.handle}`}
                                    className="group bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="relative aspect-[3/4] bg-stone-50">
                                        {rp.images[0] ? (
                                            <Image
                                                src={rp.images[0].url}
                                                alt={rp.images[0].altText || rp.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-stone-300 text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                                            {rp.title}
                                        </h3>
                                        <p className="text-sm font-serif font-bold text-amber-700 mt-1">
                                            {format(rp.priceRange.minVariantPrice.amount)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-sm text-stone-400 mb-4">Explore our curated collections</p>
                            <Link
                                href="/collections"
                                className="inline-block px-6 py-3 border border-stone-300 text-stone-700 text-xs uppercase tracking-[0.2em] font-bold hover:border-amber-400 hover:text-amber-700 transition-colors rounded-sm"
                            >
                                View All Collections
                            </Link>
                        </div>
                    )}
                </div>

            </div>{/* end max-w-7xl */}

            {/* ══════════════════════════════════════════════════════════
                SECTION: STICKY BUY BAR (mobile)
            ══════════════════════════════════════════════════════════ */}
            <StickyBuyBar
                price={price}
                variantId={selectedVariantId}
                quantity={quantity}
                availableForSale={product.availableForSale}
                addToCartRef={addToCartRef}
            />
        </div>
    );
}

// ─── Accordion Section ───────────────────────────────────────────────────
function AccordionSection({
    title,
    children,
    defaultOpen = false,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-stone-100 rounded-sm bg-white shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-5 py-4 text-left group"
            >
                <span className="text-sm font-semibold text-stone-900 group-hover:text-amber-700 transition-colors tracking-tight">
                    {title}
                </span>
                <ChevronDown
                    size={16}
                    className={cn(
                        "text-stone-400 transition-transform duration-300",
                        isOpen && "rotate-180"
                    )}
                />
            </button>
            {isOpen && (
                <div className="px-5 pb-5 pt-1">{children}</div>
            )}
        </div>
    );
}
