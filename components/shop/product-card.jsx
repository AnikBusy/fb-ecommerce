'use client'

import { motion } from "framer-motion"
import Link from 'next/link'
import { AddToCartButton } from "./add-to-cart-button"
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
            className="group relative flex flex-col highlight overflow-hidden transition-all duration-500 hover:shadow-2xl border border-border/80 hover:border-primary/30 shadow-sm rounded-2xl"
        >
            {/* Image Container */}
            <Link href={`/product/${product.slug}`} className="relative aspect-[1/1] overflow-hidden bg-secondary/30">
                {product.images && product.images[0] ? (
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-300">
                        <ShoppingBag className="w-10 h-10 stroke-[0.5]" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {discount > 0 && (
                        <div className="bg-primary text-primary-foreground font-black px-2 py-0.5 rounded-full text-[8px] tracking-tight uppercase shadow-sm">
                            {discount}% OFF
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-3 md:p-4 flex flex-col flex-1">
                <Link href={`/product/${product.slug}`} className="mb-2">
                    <h3 className="font-bold leading-tight group-hover:text-primary transition-colors text-sm md:text-base line-clamp-2 min-h-[2.5rem]">
                        {product.title}
                    </h3>
                </Link>

                <div className="mt-auto flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-base md:text-lg font-black italic tracking-tighter">{formatCurrency(product.discountPrice || product.price)}</span>
                        {product.discountPrice > 0 && (
                            <span className="text-[10px] text-muted-foreground line-through tracking-tight">{formatCurrency(product.price)}</span>
                        )}
                    </div>

                    <AddToCartButton product={product} size="icon" className="h-8 w-8 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm shrink-0" />
                </div>
            </div>
        </motion.div>
    )
}

