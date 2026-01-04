'use client'

import { motion } from "framer-motion"
import Link from 'next/link'

import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Zap } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function ProductCard({ product }) {
    const discount = product.discountPrice > 0
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg rounded-xl bg-card border border-border/50"
        >
            {/* Image Container */}
            <Link href={`/product/${product.slug}`} className="relative aspect-[1/1] overflow-hidden bg-secondary/10 p-3">
                {product.images && product.images[0] ? (
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-300">
                        <ShoppingBag className="w-8 h-8 stroke-[0.5]" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {discount > 0 && (
                        <div className="bg-primary text-primary-foreground font-bold px-1.5 py-0.5 rounded text-[7px] tracking-wider uppercase shadow-sm">
                            -{discount}%
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Info - Compact */}
            <div className="p-3 flex flex-col flex-1 gap-1">
                <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-xs md:text-sm leading-tight text-foreground/90 group-hover:text-primary transition-colors line-clamp-1">
                        {product.title}
                    </h3>
                </Link>

                <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-sm md:text-base font-bold text-primary">{formatCurrency(product.discountPrice || product.price)}</span>
                    {product.discountPrice > 0 && (
                        <span className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/50">{formatCurrency(product.price)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

