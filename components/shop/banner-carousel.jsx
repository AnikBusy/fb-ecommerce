'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export function BannerCarousel({ banners }) {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (banners.length <= 1) return
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [banners.length])

    return (
        <div className="h-full w-full relative group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={banners[current]._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <Link href={banners[current].link || '#'} className="relative h-full w-full block">
                        <img
                            src={banners[current].imageUrl}
                            className="w-full h-full object-cover"
                            alt={banners[current].title || "Banner"}
                        />
                    </Link>
                </motion.div>
            </AnimatePresence>

            {/* Dots */}
            {banners.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrent(i);
                            }}
                            className={`h-1.5 transition-all duration-300 cursor-pointer rounded-full ${i === current
                                ? "w-12 bg-mongodb-green shadow-[0_0_10px_rgba(0,237,100,0.5)]"
                                : "w-6 bg-white/30 hover:bg-white/60 hover:w-8"
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
