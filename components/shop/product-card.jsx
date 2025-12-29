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
            className="group relative flex flex-col shop-card-bg overflow-hidden transition-all duration-500 hover:shadow-2xl border border-border/80 hover:border-mongodb-green/30 shadow-sm rounded-2xl"
        >
            {/* Image Container */}
            <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-secondary/50">
                {product.images && product.images[0] ? (
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover transition-all duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-zinc-300">
                        <ShoppingBag className="w-16 h-16 stroke-[0.5]" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                    {discount > 0 && (
                        <div className="bg-mongodb-green text-mongodb-dark font-black px-4 py-1.5 rounded-full text-[9px] tracking-widest uppercase shadow-xl">
                            {discount}% OFF
                        </div>
                    )}
                    {product.isNew && (
                        <div className="bg-foreground text-background font-black px-4 py-1.5 rounded-full text-[9px] tracking-widest uppercase shadow-xl">
                            NEW
                        </div>
                    )}
                </div>

                {/* Hover Overlay Actions */}
                <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-black group-hover:text-mongodb-green transition-colors uppercase tracking-[0.3em] opacity-60">
                        {product.category?.name || 'Collection'}
                    </span>
                </div>

                <Link href={`/product/${product.slug}`} className="mb-6">
                    <h3 className="font-bold shop-text leading-tight group-hover:text-mongodb-green transition-colors text-lg md:text-xl line-clamp-2">
                        {product.title}
                    </h3>
                </Link>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-black shop-text italic tracking-tighter">{formatCurrency(product.discountPrice || product.price)}</span>
                        {product.discountPrice > 0 && (
                            <span className="text-xs shop-muted line-through tracking-widest">{formatCurrency(product.price)}</span>
                        )}
                    </div>

                    <AddToCartButton product={product} size="icon" className="rounded-full bg-mongodb-green/10 text-mongodb-green border border-mongodb-green/20 hover:bg-mongodb-green hover:text-mongodb-dark transition-all duration-300 shadow-sm" />
                </div>
            </div>
        </motion.div>
    )
}

