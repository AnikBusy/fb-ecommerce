'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProductImageGallery({ images, title }) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const validImages = images?.filter(img => img) || []

    if (validImages.length === 0) {
        return (
            <div className="aspect-[4/5] shop-card-bg rounded-[2.5rem] overflow-hidden shadow-sm border flex items-center justify-center">
                <div className="shop-muted font-black text-8xl italic select-none opacity-20 tracking-tighter uppercase">Flux</div>
            </div>
        )
    }

    const nextImage = () => {
        setSelectedIndex((prev) => (prev + 1) % validImages.length)
    }

    const prevImage = () => {
        setSelectedIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/5] shop-card-bg rounded-xl overflow-hidden shadow-sm border relative group">
                <div className="absolute inset-0 bg-mongodb-green/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <img
                    src={validImages[selectedIndex]}
                    alt={`${title} - Image ${selectedIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-500"
                />

                {/* Navigation Arrows - Only show if more than 1 image */}
                {validImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-mongodb-green hover:border-mongodb-green active:scale-90"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-mongodb-green hover:border-mongodb-green active:scale-90"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                            <span className="text-xs font-black text-white tracking-wider">
                                {selectedIndex + 1} / {validImages.length}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail Grid - Only show if more than 1 image */}
            {validImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {validImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "aspect-square rounded-lg overflow-hidden border-2 transition-all active:scale-95",
                                selectedIndex === index
                                    ? "border-mongodb-green shadow-lg shadow-mongodb-green/20"
                                    : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <img
                                src={image}
                                alt={`${title} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
