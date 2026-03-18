"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Gem, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/shopify/product";

interface ProductGalleryProps {
    images: ProductImage[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

    const mainImageRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);

    const selectedImage = images[selectedIndex];

    /* -----------------------------------------
       KEYBOARD NAVIGATION
    ------------------------------------------*/
    useEffect(() => {
        if (!isFullscreen) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsFullscreen(false);
            if (e.key === "ArrowLeft")
                setSelectedIndex((i) => (i > 0 ? i - 1 : images.length - 1));
            if (e.key === "ArrowRight")
                setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : 0));
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isFullscreen, images.length]);

    /* -----------------------------------------
       ZOOM EFFECT
    ------------------------------------------*/
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!mainImageRef.current) return;

            const rect = mainImageRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            setZoomPosition({ x, y });
        },
        []
    );

    /* -----------------------------------------
       MOBILE SWIPE
    ------------------------------------------*/
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const delta = touchStartX.current - e.changedTouches[0].clientX;

        if (Math.abs(delta) > 50) {
            if (delta > 0) {
                setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : 0));
            } else {
                setSelectedIndex((i) => (i > 0 ? i - 1 : images.length - 1));
            }
        }
    };

    /* -----------------------------------------
       EMPTY STATE
    ------------------------------------------*/
    if (!images.length) {
        return (
            <div className="aspect-[4/5] max-h-[550px] w-full bg-[#FAF8F5] rounded-xl flex items-center justify-center shadow-sm border border-stone-100">
                <Gem size={48} className="text-stone-300" strokeWidth={1} />
            </div>
        );
    }

    /* -----------------------------------------
       FULLSCREEN MODAL
    ------------------------------------------*/
    const fullscreenModal =
        isFullscreen && typeof document !== "undefined"
            ? createPortal(
                <div
                    className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsFullscreen(false);
                    }}
                >
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition p-2"
                    >
                        <X size={28} />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() =>
                                    setSelectedIndex((i) => (i > 0 ? i - 1 : images.length - 1))
                                }
                                className="absolute left-6 text-white/70 hover:text-white"
                            >
                                <ChevronLeft size={40} />
                            </button>

                            <button
                                onClick={() =>
                                    setSelectedIndex((i) => (i < images.length - 1 ? i + 1 : 0))
                                }
                                className="absolute right-6 text-white/70 hover:text-white"
                            >
                                <ChevronRight size={40} />
                            </button>
                        </>
                    )}

                    <div className="relative max-h-[550px] max-w-[90vw]">
                        <Image
                            src={selectedImage.url}
                            alt={selectedImage.altText || "Product Image"}
                            width={selectedImage.width || 1200}
                            height={selectedImage.height || 1600}
                            className="object-contain max-h-[550px]"
                            priority
                        />
                    </div>

                    {/* Thumbnail strip */}
                    <div className="absolute bottom-6 flex gap-3">
                        {images.map((img, idx) => (
                            <button
                                key={img.id || idx}
                                onClick={() => setSelectedIndex(idx)}
                                className={cn(
                                    "w-14 h-14 rounded-md overflow-hidden border transition",
                                    idx === selectedIndex
                                        ? "border-amber-500"
                                        : "border-white/20 opacity-60 hover:opacity-100"
                                )}
                            >
                                <Image
                                    src={img.url}
                                    alt={img.altText || ""}
                                    width={56}
                                    height={56}
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )
            : null;

    /* -----------------------------------------
       MAIN GALLERY
    ------------------------------------------*/
    return (
        <>
            <div className="flex flex-col-reverse lg:flex-row gap-6">
                {/* Thumbnails */}
                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible scrollbar-hide">
                    {images.map((image, index) => (
                        <button
                            key={image.id || index}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "relative w-16 h-16 lg:w-20 lg:h-20 rounded-md overflow-hidden border transition-all",
                                selectedIndex === index
                                    ? "border-amber-600 shadow-md"
                                    : "border-stone-200 hover:border-amber-300"
                            )}
                        >
                            <Image
                                src={image.url}
                                alt={image.altText || ""}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>

                {/* Main image */}
                <div
                    ref={mainImageRef}
                    className="relative flex-1 aspect-[4/5] max-h-[500px] bg-[#FAF8F5] rounded-md overflow-hidden shadow-sm border border-stone-100 group cursor-zoom-in"
                    onClick={() => setIsFullscreen(true)}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <Image
                        src={selectedImage.url}
                        alt={selectedImage.altText || "Product Image"}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500 ease-out",
                            isZoomed && "scale-150"
                        )}
                        style={
                            isZoomed
                                ? {
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                }
                                : undefined
                        }
                        priority={selectedIndex === 0}
                        sizes="(max-width:768px) 100vw, 50vw"
                    />

                    {/* Zoom indicator */}
                    <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                        <ZoomIn size={16} className="text-stone-700" />
                    </div>

                    {/* Mobile counter */}
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full lg:hidden">
                        {selectedIndex + 1} / {images.length}
                    </div>
                </div>
            </div>

            {fullscreenModal}
        </>
    );
}