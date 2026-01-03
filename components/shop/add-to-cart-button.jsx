'use client'

import { Button } from "@/components/ui/button"
import { ShoppingCart, Zap, Loader2 } from "lucide-react"
import { useCart } from "@/providers/cart-provider"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function AddToCartButton({ product, variant = "default", size = "default", className }) {
    const { addToCart, setIsOpen } = useCart()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleAction = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setLoading(true)

        if (variant === "order") {
            addToCart(product, 1, false)
            router.push('/checkout')
        } else {
            addToCart(product)
        }

        setLoading(false)
    }

    if (size === "icon") {
        return (
            <Button
                size="icon"
                onClick={handleAction}
                disabled={loading}
                className={cn("h-10 w-10")}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
            </Button>
        )
    }

    if (variant === "order") {
        return (
            <Button
                onClick={handleAction}
                disabled={loading}
                className={cn(
                    "bg-primary text-primary-foreground hover:bg-primary/95 font-black uppercase tracking-widest text-[11px] h-14 md:h-16 transition-all active:scale-95 group border-none shadow-[0_10px_30px_rgba(0,0,0,0.1)]",
                    className
                )}
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-primary-foreground" />}
                Buy Now
            </Button>
        )
    }

    return (
        <Button
            variant="outline"
            onClick={handleAction}
            disabled={loading}
            className={cn(
                "border-zinc-200 dark:border-zinc-800 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 font-black uppercase tracking-widest text-[11px] h-14 md:h-16 transition-all active:scale-95",
                className
            )}
        >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
            Add to Cart
        </Button>
    )
}

