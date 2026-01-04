'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, Phone, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNavbar() {
    const pathname = usePathname()

    // Logic: Only show on Homepage
    if (pathname !== '/') return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border md:hidden block pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                <Link
                    href="https://wa.me/yourwhatsappnumber"
                    target="_blank"
                    className="flex flex-col items-center justify-center gap-1 w-16 text-muted-foreground hover:text-green-500 transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Whats App</span>
                </Link>

                <Link
                    href="/"
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 w-16 transition-colors",
                        pathname === '/' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Home className="w-5 h-5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
                </Link>

                <Link
                    href="/shop"
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 w-16 transition-colors",
                        pathname === '/shop' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Shop</span>
                </Link>

                <Link
                    href="tel:+1234567890"
                    className="flex flex-col items-center justify-center gap-1 w-16 text-muted-foreground hover:text-blue-500 transition-colors"
                >
                    <Phone className="w-5 h-5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Call</span>
                </Link>
            </div>
        </div>
    )
}
