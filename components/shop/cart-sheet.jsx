'use client'

import { useCart } from "@/providers/cart-provider"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

export function CartSheet() {
    const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, cartTotal } = useCart()

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col bg-card border-l border-border text-foreground p-0 shadow-2xl">
                <SheetHeader className="p-8 border-b border-border bg-secondary/20">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl font-black uppercase tracking-tighter text-foreground">Cart Manifest</SheetTitle>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-8 py-6 no-scrollbar bg-background">
                    {cart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/30 shadow-inner">
                                <ShoppingBag className="w-12 h-12 stroke-[1px]" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/40">Empty Cache</p>
                                <p className="text-sm font-bold text-muted-foreground italic">No items found in your current session.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {cart.map(item => (
                                <div key={item.product._id} className="flex gap-6 group">
                                    <div className="h-20 w-20 flex-shrink-0 bg-secondary/50 rounded-2xl overflow-hidden border border-border group-hover:border-mongodb-green/50 transition-all shadow-sm">
                                        {item.product.images && item.product.images[0] && (
                                            <img src={item.product.images[0]} className="h-full w-full object-cover transition-all group-hover:scale-110" alt={item.product.title} />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h4 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-mongodb-green transition-colors">{item.product?.title || 'Unknown Item'}</h4>
                                        <div className="flex items-center gap-4">
                                            <span className="text-base font-black text-foreground italic">{formatCurrency(item.product?.discountPrice || item.product?.price || 0)}</span>
                                            {item.product?.discountPrice > 0 && (
                                                <span className="text-muted-foreground/50 line-through text-[10px] font-bold">{formatCurrency(item.product?.price)}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center bg-secondary/50 rounded-full border border-border p-1 shadow-sm">
                                                <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-mongodb-green hover:bg-background transition-all" onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="text-[11px] font-black w-8 text-center text-foreground">{item.quantity}</span>
                                                <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-mongodb-green hover:bg-background transition-all" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-red-600 transition-colors" onClick={() => removeFromCart(item.product._id)}>
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
                    <div className="p-8 bg-card border-t border-border space-y-8 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                        <div className="flex justify-between items-end">
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">Subtotal Manifest</span>
                            <span className="text-4xl font-black text-foreground italic tracking-tighter drop-shadow-sm">{formatCurrency(cartTotal)}</span>
                        </div>
                        <Button className="w-full h-20 bg-mongodb-green hover:bg-[#00FF6C] text-mongodb-dark rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 border-none" asChild onClick={() => setIsOpen(false)}>
                            <Link href="/checkout">Execute Checkout</Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
