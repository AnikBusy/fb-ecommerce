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

        addToCart(product)

        if (variant === "order") {
            router.push('/checkout')
        } else {
            setIsOpen(true)
        }

        setLoading(false)
    }

    if (size === "icon") {
        return (
            <Button
                size="icon"
                onClick={handleAction}
                disabled={loading}
                className={cn("h-12 w-12", className)}
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
                    "bg-mongodb-green text-mongodb-dark hover:bg-[#00FF6C] font-black uppercase tracking-widest text-xs h-14 transition-all active:scale-95 group border-none shadow-[0_10px_30px_rgba(0,237,100,0.2)] hover:shadow-[0_15px_40px_rgba(0,237,100,0.4)]",
                    className
                )}
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-mongodb-dark" />}
                Place Order
            </Button>
        )
    }

    return (
        <Button
            variant="outline"
            onClick={handleAction}
            disabled={loading}
            className={cn(
                "border-zinc-800 text-white hover:bg-zinc-800 hover:text-white font-black uppercase tracking-widest text-[10px] h-14 transition-all active:scale-95",
                className
            )}
        >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
            Add to Cart
        </Button>
    )
}

