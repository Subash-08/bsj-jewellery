import { getProductByHandle } from '@/lib/shopify/client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import VariantSelector from '@/components/product/VariantSelector';
import AddToCart from '@/components/product/AddToCart';
import ProductSpecs from '@/components/product/ProductSpecs';

export const revalidate = 3600;

type Props = {
    params: Promise<{ handle: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const product = await getProductByHandle(params.handle);
    if (!product) return {};
    return {
        title: product.seo?.title || product.title,
        description: product.seo?.description || product.description,
    };
}

export default async function ProductPage(props: Props) {
    const params = await props.params;
    const product = await getProductByHandle(params.handle);

    if (!product) {
        notFound();
    }

    const {
        jewelryMetafields,
        variants,
        images
    } = product;

    // Use current URL search params if any to determine selected variant?
    // In server components, we don't have direct access to searchParams unless passed as prop
    // but Next.js page props include searchParams.
    // However, for this implementation, we will let the client components handle state based on default or user selection

    // Prepare specifications for the component
    const specifications = [
        { label: 'Metal Type', value: jewelryMetafields?.['Metal Type'] },
        { label: 'Stone Weight', value: jewelryMetafields?.['Stone Weight'] ? `${jewelryMetafields['Stone Weight']} carats` : null },
        { label: 'Purity', value: jewelryMetafields?.['Purity Percentage'] ? `${jewelryMetafields['Purity Percentage']}%` : null },
        { label: 'Category', value: jewelryMetafields?.['Jewellery Category'] },
        { label: 'Occasion', value: jewelryMetafields?.['Occasion'] },
        { label: 'Certification', value: jewelryMetafields?.['Certification Available'] ? 'Certified' : 'Not Certified' },
        { label: 'Country of Origin', value: jewelryMetafields?.['Country of Origin'] },
        { label: 'Stone Type', value: jewelryMetafields?.['Stone Type'] },
        { label: 'Stone Shape', value: jewelryMetafields?.['Stone Shape'] },
        { label: 'Stone Color', value: jewelryMetafields?.['Stone Color'] },
        // Add more fields as per metadata definitions
        { label: 'Gross Weight', value: jewelryMetafields?.['Gross Weight'] ? `${jewelryMetafields['Gross Weight']} g` : null },
        { label: 'Net Weight', value: jewelryMetafields?.['Net Weight'] ? `${jewelryMetafields['Net Weight']} g` : null },
    ].filter(spec => spec.value);

    // Prepare price breakdown
    const priceBreakdown = {
        metalRate: jewelryMetafields?.['Metal Rate'] ? String(jewelryMetafields['Metal Rate']) : undefined,
        makingCharges: jewelryMetafields?.['Making Charge Value'] ? String(jewelryMetafields['Making Charge Value']) : undefined,
        gst: jewelryMetafields?.['GST Percentage'] ? String(jewelryMetafields['GST Percentage']) : undefined,
        gstAmount: jewelryMetafields?.['GST Amount'] ? String(jewelryMetafields['GST Amount']) : undefined,
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                    {/* Left Column: Gallery */}
                    <div className="product-gallery">
                        <ProductGallery images={images} />
                    </div>

                    {/* Right Column: Info & Actions */}
                    <div className="product-info flex flex-col h-full">
                        <div className="sticky top-24">
                            <ProductInfo product={product} />

                            <VariantSelector
                                options={product.options}
                                variants={variants}
                            />

                            <div className="mt-8 border-t pt-6">
                                <AddToCart
                                    availableForSale={product.availableForSale}
                                    variantId={variants[0]?.id} // Logic to find selected variant ID should be here or handled in context
                                />
                                {/* Optional: "Need Help?" or "Check Availability" links */}
                            </div>

                            <ProductSpecs
                                specifications={specifications}
                                careInstructions={jewelryMetafields?.['Care Instructions']}
                                priceBreakdown={priceBreakdown}
                            />
                        </div>
                    </div>
                </div>

                {/* Related Products Section could be added here */}
            </div>
        </div>
    );
}