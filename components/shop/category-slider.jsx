'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function CategorySlider({ categories, isSticky = false, activeSlug = "", variant = "default" }) {
    const [scrolled, setScrolled] = useState(false)
    const scrollRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [hasDragged, setHasDragged] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    useEffect(() => {
        if (!isSticky) return

        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isSticky])

    const handleMouseDown = (e) => {
        setIsDragging(true)
        setHasDragged(false)
        setStartX(e.pageX - scrollRef.current.offsetLeft)
        setScrollLeft(scrollRef.current.scrollLeft)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        // Delay resetting hasDragged to allow onClick to check it
        setTimeout(() => setHasDragged(false), 50)
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return

        const x = e.pageX - scrollRef.current.offsetLeft
        const walk = (x - startX) * 2 // Scroll speed
        if (Math.abs(walk) > 5) {
            setHasDragged(true)
        }

        e.preventDefault()
        scrollRef.current.scrollLeft = scrollLeft - walk
    }

    const isTextVariant = variant === 'text';

    return (
        <section className={cn(
            "overflow-hidden transition-all duration-300",
            isSticky && "sticky top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border/50", // Adjusted top-20 to sit below header or at top if header scroll away (but layout suggests header is sticky?)
            // If header is hidden on scroll, top-0 is better. If header stays, top-16/20.
            // User said "header should not stick on top". So header scrolls away. Thus Sticky Slider should potentially be top-0.
            // But let's assume standard behavior first. If Header is static (absolute/scrolls away), then Sticky Slider needs top-0 when it hits top.
            isSticky && "top-16",
            isTextVariant ? "py-3" : (isSticky && scrolled ? "py-2" : "py-4")
        )}>

            {!scrolled && !isTextVariant && (
                <div className="h-4"></div>
            )}

            <div className="relative group/slider">
                <div
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={cn(
                        "flex overflow-x-auto overflow-y-hidden px-4 gap-3 md:gap-4 select-none items-center scrollbar-hide [&::-webkit-scrollbar]:hidden", // hidden scrollbar
                        isDragging ? "cursor-grabbing" : "cursor-grab",
                        (scrolled || isTextVariant) ? "pb-0" : "pb-4"
                    )}>
                    {categories.map((cat) => {
                        const isActive = cat.slug === activeSlug;
                        return (
                            <Link
                                key={cat._id}
                                href={`/category/${cat.slug}`}
                                onClick={(e) => {
                                    if (hasDragged) {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }
                                }}
                                className={cn(
                                    "flex-shrink-0 group flex flex-col items-center gap-2 transition-all",
                                    // Text Variant Styling
                                    isTextVariant || scrolled
                                        ? cn(
                                            "w-auto px-4 py-2 rounded-full border transition-all",
                                            isActive
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-secondary/50 text-foreground border-transparent hover:bg-secondary hover:border-primary/20"
                                        )
                                        : "w-[68px] md:w-[90px]",
                                )}
                            >
                                {!scrolled && !isTextVariant && (
                                    <div className={cn(
                                        "relative w-full aspect-square rounded-2xl overflow-hidden border border-border shadow-sm bg-card group-hover:border-primary/50 group-hover:shadow-md flex items-center justify-center",
                                        isActive && "border-primary shadow-md"
                                    )}>
                                        {cat.image ? (
                                            <img
                                                src={cat.image}
                                                alt={cat.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[8px] font-black uppercase text-secondary-foreground/20">Flux</div>
                                        )}
                                        <div className={cn(
                                            "absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300",
                                            isActive && "bg-primary/5"
                                        )}></div>
                                    </div>
                                )}
                                <span className={cn(
                                    "font-bold uppercase tracking-tight text-center transition-colors line-clamp-1",
                                    (scrolled || isTextVariant) ? "text-[11px] md:text-xs" : "text-[11px] md:text-sm text-foreground/70 group-hover:text-primary", // Increased font size
                                    !isTextVariant && isActive && !scrolled && "text-primary font-black"
                                )}>
                                    {cat.name}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
