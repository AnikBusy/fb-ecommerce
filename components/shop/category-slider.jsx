'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function CategorySlider({ categories, isSticky = false, activeSlug = "" }) {
    const [scrolled, setScrolled] = useState(false)
    const scrollRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [hasDragged, setHasDragged] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    useEffect(() => {
        if (!isSticky) return

        const handleScroll = () => {
            setScrolled(window.scrollY > 100)
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

    return (
        <section className={cn(
            "py-4 overflow-hidden",
            isSticky && "sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border/50",
            isSticky && scrolled ? "py-2" : "py-4"
        )}>

            {!scrolled && (
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
                        "flex overflow-x-auto overflow-y-hidden px-4 gap-4 md:gap-8 custom-scrollbar select-none",
                        isDragging ? "cursor-grabbing" : "cursor-grab",
                        scrolled ? "pb-2" : "pb-4"
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
                                    "flex-shrink-0 group flex flex-col items-center gap-3",
                                    scrolled ? "w-auto px-4 py-1.5 bg-secondary/50 rounded-full border border-transparent hover:border-primary/30" : "w-[68px] md:w-[90px]",
                                    isActive && scrolled && "bg-primary/10 border-primary/30"
                                )}
                            >
                                {!scrolled && (
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
                                    scrolled ? "text-[8px] md:text-[9px] text-foreground" : "text-[10px] md:text-[11px] text-foreground/70 group-hover:text-primary",
                                    isActive && (scrolled ? "text-primary" : "text-primary font-black")
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
