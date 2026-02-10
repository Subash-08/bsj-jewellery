"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming this utility exists, otherwise I'll use clsx directly or create it
import type { ProductImage } from '@/types/shopify/product';

interface ProductGalleryProps {
    images: ProductImage[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    if (!images.length) return null;

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 md:h-[600px] scrollbar-hide py-2 md:py-0">
                {images.map((image, index) => (
                    <button
                        key={image.id || index}
                        onClick={() => setSelectedImage(image)}
                        className={cn(
                            "relative w-20 h-20 md:w-full md:h-24 flex-shrink-0 border-2 rounded-md overflow-hidden transition-all duration-300",
                            selectedImage.url === image.url
                                ? "border-yellow-600 ring-1 ring-yellow-600/20"
                                : "border-transparent hover:border-gray-300"
                        )}
                    >
                        <Image
                            src={image.url}
                            alt={image.altText || `Product Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="100px"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative aspect-square md:aspect-[4/5] bg-gray-50 rounded-lg overflow-hidden group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage.url}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full relative"
                    >
                        <Image
                            src={selectedImage.url}
                            alt={selectedImage.altText || "Product Image"}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Zoom Hint (Optional) */}
                {/* <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
           Zoom Icon
        </div> */}
            </div>
        </div>
    );
}
