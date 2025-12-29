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
                            className="w-full h-full object-cover brightness-[0.5] contrast-[1.05]"
                            alt={banners[current].title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-center">
                            <div className="max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] px-4 md:px-0 w-full">
                                <div className="max-w-4xl space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px w-12 bg-mongodb-green"></div>
                                        <span className="text-mongodb-green text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">Global Reserve</span>
                                    </div>
                                    <h2 className="text-white text-5xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-bottom duration-1000">
                                        {banners[current].title}
                                    </h2>
                                    <div className="flex items-center gap-4 pt-6">
                                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none border-l border-white/20 pl-4">EST. 2024 / PREMIUM SELECTION</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </AnimatePresence>

            {/* Dots */}
            {banners.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-1 transition-all duration-300 ${i === current ? "w-12 bg-mongodb-green" : "w-6 bg-foreground/20 hover:bg-foreground/40"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
