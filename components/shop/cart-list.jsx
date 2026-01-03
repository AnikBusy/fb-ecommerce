'use client'

import { useCart } from "@/providers/cart-provider"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { QuickOrderForm } from "./quick-order-form"
import { formatCurrency } from "@/lib/utils"

export function CartList() {
    const { cart, removeFromCart, updateQuantity } = useCart()

    if (!cart || cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-8">
                <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <ShoppingBag className="w-16 h-16 text-primary opacity-50" />
                </div>
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-foreground">Empty Cart</h2>
                    <p className="text-muted-foreground text-sm max-w-md italic">Your cart is currently empty. Start adding items to begin your order.</p>
                </div>
                <Link href="/shop">
                    <Button className="rounded-full px-8 h-14 text-[10px] uppercase tracking-widest font-black bg-primary text-primary-foreground hover:bg-primary/90">
                        Browse Products
                    </Button>
                </Link>
            </div>
        )
    }

    const total = cart.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0)

    return (
        <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
                {cart.map((item, index) => (
                    <div key={item._id || `cart-item-${index}`} className="bg-card border border-border shadow-sm border rounded-3xl p-6 flex gap-6 relative group">
                        {/* Product Image */}
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-secondary flex-shrink-0">
                            {item.images?.[0] ? (
                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-black text-2xl opacity-20">FLUX</div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-foreground">{item.title}</h3>
                                <p className="text-sm text-muted-foreground font-medium mt-1">{item.category?.name}</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-2xl font-black text-foreground italic">{formatCurrency(item.discountPrice || item.price)}</p>
                                    {item.discountPrice > 0 && (
                                        <p className="text-sm text-muted-foreground line-through opacity-40">{formatCurrency(item.price)}</p>
                                    )}
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                        className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-all active:scale-90"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="text-lg font-black text-foreground w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-all active:scale-90"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={() => removeFromCart(item._id)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full border border-red-500/20 bg-red-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500 active:scale-90"
                        >
                            <Trash2 className="w-4 h-4 text-red-500 hover:text-white" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-card border border-border shadow-sm border rounded-3xl p-8 space-y-8 sticky top-24">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-6">Order Summary</h2>

                        <div className="space-y-4 pb-6 border-b">
                            <div className="flex justify-between text-muted-foreground text-sm">
                                <span>Items ({cart.length})</span>
                                <span className="font-bold">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline pt-6">
                            <span className="text-sm font-black uppercase tracking-wider text-foreground/60">Total</span>
                            <span className="text-4xl font-black text-foreground italic">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    <QuickOrderForm cart={cart} total={total} />
                </div>
            </div>
        </div>
    )
}
