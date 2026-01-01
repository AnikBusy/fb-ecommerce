'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from "@/providers/cart-provider"
import { useSettings } from "@/providers/settings-provider"
import { ShoppingBag, Home, ShoppingCart, Menu } from "lucide-react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from 'react'
import { cn } from "@/lib/utils"
import { CartSheet } from "./cart-sheet"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { CategorySidebar } from "./category-sidebar"

export function Header({ categories }) {
    const { cart, setIsOpen } = useCart()
    const settings = useSettings()
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20)
    })

    const cartCount = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "h-16 bg-background/95 backdrop-blur-md border-b-[2px] border-border shadow-md"
                    : "h-20 bg-transparent"
            )}
        >
            <div className="max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] h-full px-4 md:px-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    {/* Mobile Menu Toggle - REMOVED */}

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        {settings?.logoUrl ? (
                            <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase transition-colors duration-300 text-foreground">
                                {settings?.siteName?.toUpperCase() || 'MY SHOP'}<span className="text-mongodb-green">.</span>
                            </span>
                        )}
                    </Link>
                </div>

                {/* Icons - Visible on all devices */}
                <div className="flex items-center gap-2 md:gap-6">
                    <ActiveLink href="/" icon={Home} label="Home" isScrolled={isScrolled} isExact={true} />
                    <ActiveLink href="/shop" icon={ShoppingBag} label="Shop" isScrolled={isScrolled} />

                    <button
                        onClick={() => setIsOpen(true)}
                        className={cn(
                            "relative flex items-center gap-2 px-3 py-2 rounded-full transition-colors",
                            isScrolled
                                ? "text-foreground hover:bg-secondary hover:text-mongodb-green"
                                : "text-foreground hover:bg-secondary/50"
                        )}>
                        <ShoppingCart className="w-5 h-5 md:w-5 md:h-5" />
                        <span className="hidden md:inline text-sm font-bold uppercase tracking-wider">Cart</span>

                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-mongodb-green text-white">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    {/* Render CartSheet to ensure it exists in the DOM but without a visible trigger here */}
                    <CartSheet />
                </div>
            </div>
        </motion.header>
    )
}

function ActiveLink({ href, icon: Icon, label, isScrolled, isExact = false }) {
    const pathname = usePathname()
    const isActive = isExact ? pathname === href : pathname.startsWith(href)

    return (
        <Link href={href} className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full transition-colors",
            // Base styles
            isScrolled ? "text-foreground" : "text-foreground",
            // Hover states
            isScrolled ? "hover:bg-secondary hover:text-mongodb-green" : "hover:bg-secondary/50",
            // Active states
            isActive && "bg-secondary text-mongodb-green"
        )}>
            <Icon className="w-5 h-5 md:w-5 md:h-5" />
            <span className="hidden md:inline text-sm font-bold uppercase tracking-wider">{label}</span>
        </Link>
    )
}
