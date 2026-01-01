'use client'

import { useCart } from "@/providers/cart-provider"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { useState, useEffect } from "react"

export function CartSheet() {
    const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, cartTotal } = useCart()

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col bg-card border-l border-border text-foreground p-0 shadow-2xl">
                <SheetHeader className="p-4 border-b border-border bg-secondary/20">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-lg font-black uppercase tracking-tighter text-foreground">Cart Manifest</SheetTitle>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar bg-background">
                    {cart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/30 shadow-inner">
                                <ShoppingBag className="w-8 h-8 stroke-[1px]" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Empty Cache</p>
                                <p className="text-xs font-bold text-muted-foreground italic">Your cart is empty.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cart.map(item => (
                                <div key={item.product._id} className="flex gap-4 group">
                                    <div className="h-16 w-16 flex-shrink-0 bg-secondary/50 rounded-xl overflow-hidden border border-border group-hover:border-mongodb-green/50 transition-all shadow-sm">
                                        {item.product.images && item.product.images[0] && (
                                            <img src={item.product.images[0]} className="h-full w-full object-cover transition-all group-hover:scale-110" alt={item.product.title} />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <h4 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-mongodb-green transition-colors">{item.product?.title || 'Unknown Item'}</h4>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-black text-foreground italic">{formatCurrency(item.product?.discountPrice || item.product?.price || 0)}</span>
                                            {item.product?.discountPrice > 0 && (
                                                <span className="text-muted-foreground/50 line-through text-[9px] font-bold">{formatCurrency(item.product?.price)}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center bg-secondary/50 rounded-full border border-border p-0.5 shadow-sm">
                                                <button className="h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-mongodb-green hover:bg-background transition-all" onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                                                    <Minus className="h-2.5 w-2.5" />
                                                </button>
                                                <QuantityInput
                                                    value={item.quantity}
                                                    onUpdate={(val) => updateQuantity(item.product._id, val)}
                                                />
                                                <button className="h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-mongodb-green hover:bg-background transition-all" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                                                    <Plus className="h-2.5 w-2.5" />
                                                </button>
                                            </div>
                                            <button className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-red-600 transition-colors" onClick={() => removeFromCart(item.product._id)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 bg-card border-t border-border space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Subtotal</span>
                            <span className="text-2xl font-black text-foreground italic tracking-tighter drop-shadow-sm">{formatCurrency(cartTotal)}</span>
                        </div>
                        <Button className="w-full h-14 bg-mongodb-green hover:bg-[#00FF6C] text-mongodb-dark rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 border-none" asChild onClick={() => setIsOpen(false)}>
                            <Link href="/checkout">Checkout</Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}

function QuantityInput({ value, onUpdate }) {
    const [localValue, setLocalValue] = useState(value)

    useEffect(() => {
        setLocalValue(value)
    }, [value])

    const handleBlur = () => {
        const val = parseInt(localValue)
        if (!isNaN(val) && val > 0) {
            onUpdate(val)
        } else {
            setLocalValue(value) // Reset to prop value if invalid
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur()
        }
    }

    return (
        <input
            type="number"
            min="1"
            className="w-8 bg-transparent text-center text-[10px] font-black text-foreground border-none focus:outline-none focus:ring-0 p-0 [&::-webkit-inner-spin-button]:appearance-none"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
        />
    )
}
