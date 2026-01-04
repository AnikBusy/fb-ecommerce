'use client'

import Link from "next/link"
import { Phone, MessageCircle } from "lucide-react"
import { AddToCartButton } from "@/components/shop/add-to-cart-button"

export function ProductBottomBar({ product }) {
    if (!product) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border p-3 md:hidden pb-safe">
            <div className="flex items-center gap-2 max-w-md mx-auto h-12">
                {/* Communication Icons - Compact */}
                <div className="flex gap-2 shrink-0">
                    <Link
                        href="tel:+1234567890"
                        className="w-12 h-12 flex flex-col items-center justify-center gap-0.5 bg-secondary/50 text-foreground rounded-xl hover:bg-secondary transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        <span className="text-[8px] font-bold uppercase">Call</span>
                    </Link>
                    <Link
                        href="https://wa.me/yourwhatsappnumber"
                        target="_blank"
                        className="w-12 h-12 flex flex-col items-center justify-center gap-0.5 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-[8px] font-bold uppercase">Chat</span>
                    </Link>
                </div>

                {/* divider */}
                <div className="w-[1px] h-8 bg-border/50 hidden"></div>

                {/* Action Buttons - Expanded */}
                <div className="flex-1 grid grid-cols-2 gap-2 h-full">
                    <AddToCartButton
                        product={product}
                        className="w-full h-full rounded-xl text-xs font-bold shadow-none"
                    />
                    <AddToCartButton
                        product={product}
                        variant="order"
                        className="w-full h-full rounded-xl text-xs font-bold shadow-none"
                    />
                </div>
            </div>
        </div>
    )
}
