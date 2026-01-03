'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CategorySlider({ categories }) {
    return (
        <section className="py-2 md:py-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4 md:mb-8 px-2">
                <h2 className="md:text-xl text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                    <span className="h-1 w-8 bg-primary rounded-full"></span>
                    Popular Categories
                </h2>
                <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="relative">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
                    {categories.slice(0, 6).map((cat) => (
                        <Link
                            key={cat._id}
                            href={`/category/${cat.slug}`}
                            className="group flex flex-col items-center gap-4"
                        >
                            <div className="relative w-full aspect-square rounded-full overflow-hidden border border-border shadow-md p-1 bg-card group-hover:border-primary group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_20px_40px_rgba(255,255,255,0.05)] transition-all duration-500 flex items-center justify-center">
                                {cat.image ? (
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover rounded-full transition-all duration-700 scale-100 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase text-secondary-foreground/20 tracking-tighter">Flux</div>
                                )}
                                {/* Inner glow on hover */}
                                <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"></div>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/80 group-hover:text-primary transition-colors duration-300">
                                    {cat.name}
                                </span>
                                <div className="h-[3px] w-0 bg-primary group-hover:w-8 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
