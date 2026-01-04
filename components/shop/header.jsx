'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from "@/providers/cart-provider"
import { useSettings } from "@/providers/settings-provider"
import { ShoppingBag, Home, ShoppingCart, Menu, Search, ArrowLeft, X } from "lucide-react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState, useEffect } from 'react'
import { cn } from "@/lib/utils"
import { CartSheet } from "./cart-sheet"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { CategorySidebar } from "./category-sidebar"

export function Header({ categories }) {
    const { cart, setIsOpen } = useCart()
    const settings = useSettings()
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20)
    })

    const cartCount = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const pathname = usePathname()
    const isHome = pathname === '/'

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                // Complex Header Logic:
                // 1. Home + Scrolled = Primary Tint
                // 2. Scrolled OR Standard Page = Standard White
                // 3. Home/Shop/Product (Top) = Transparent
                (isScrolled && isHome)
                    ? "h-16 bg-primary/15 backdrop-blur-md shadow-sm border-b border-primary/20"
                    : (isScrolled || (!isHome && pathname !== '/shop' && !pathname.startsWith('/product/') && pathname !== '/checkout' && !pathname.startsWith('/category/')))
                        ? "h-16 bg-background/95 backdrop-blur-md shadow-sm"
                        : "h-24 bg-transparent absolute"
            )}
        >
            {/* Extended Gradient Background for Home Page */}
            {!isScrolled && isHome && (
                <div className="absolute top-0 left-0 right-0 h-[220px] bg-gradient-to-b from-primary/20 via-primary/10 to-transparent -z-10 pointer-events-none transition-all duration-500" />
            )}

            <div className="max-w-[1440px] mx-auto lg:w-[85%] xl:w-[80%] h-full px-4 md:px-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Logo/Back Arrow Section */}
                    <div className="flex">
                        {/* Mobile: Back Arrow on Special Pages */}
                        <div className="lg:hidden">
                            {(pathname === '/shop' || pathname.startsWith('/product/') || pathname === '/checkout' || pathname.startsWith('/category/')) && (
                                <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary transition-colors group">
                                    <ArrowLeft className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                                </Link>
                            )}
                        </div>

                        {/* Desktop: Logo Always Visible */}
                        <div className="hidden lg:flex">
                            <Link href="/" className="flex items-center gap-2 group">
                                {settings?.logoUrl ? (
                                    <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                                ) : (
                                    <span className="text-xl md:text-2xl font-black tracking-tighter uppercase transition-colors duration-300 text-foreground">
                                        {settings?.siteName?.toUpperCase() || 'MY SHOP'}<span className="text-primary">.</span>
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search Bar - Center/Floating */}
                <div className="flex-1 max-w-xl flex justify-end md:justify-center">
                    {(pathname === '/shop' || pathname.startsWith('/product/') || pathname === '/checkout' || pathname.startsWith('/category/')) ? (
                        <>
                            {/* Desktop: Always show full search bar */}
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                const term = e.target.search.value
                                if (term) {
                                    window.location.href = `/shop?search=${term}`
                                }
                            }} className="hidden md:block relative group w-full">
                                <input
                                    name="search"
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full bg-secondary/50 border-none rounded-full py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </form>

                            {/* Mobile: Expandable Search */}
                            <div className={cn(
                                "md:hidden relative flex items-center transition-all duration-300 ease-in-out",
                                isSearchOpen ? "w-full" : "w-10 justify-end"
                            )}>
                                {isSearchOpen ? (
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        const term = e.target.search.value
                                        if (term) {
                                            window.location.href = `/shop?search=${term}`
                                        }
                                    }} className="w-full relative group">
                                        <input
                                            autoFocus
                                            name="search"
                                            type="text"
                                            placeholder="Search..."
                                            onBlur={() => !Boolean(document.querySelector('input[name="search"]')?.value) && setIsSearchOpen(false)}
                                            className="w-full bg-secondary/50 border-none rounded-full py-2.5 pl-10 pr-10 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        />
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <button
                                            type="button"
                                            onClick={() => setIsSearchOpen(false)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5"
                                        >
                                            <X className="w-3 h-3 text-muted-foreground" />
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
                                    >
                                        <Search className="w-5 h-5 text-foreground" />
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Standard Search for Other Pages (Home) */
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            const term = e.target.search.value
                            if (term) {
                                window.location.href = `/shop?search=${term}`
                            }
                        }} className="relative group w-full">
                            <input
                                name="search"
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-secondary/50 border-none rounded-full py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </form>
                    )}
                </div>

                {/* Icons - Visible on all devices */}
                <div className="flex items-center gap-1 md:gap-4 flex-shrink-0">
                    <ActiveLink href="/" icon={Home} label="Home" isScrolled={isScrolled} isExact={true} className="hidden sm:flex" />
                    <ActiveLink href="/shop" icon={ShoppingBag} label="Shop" isScrolled={isScrolled} className="hidden sm:flex" />

                    <button
                        onClick={() => setIsOpen(true)}
                        className={cn(
                            "relative flex items-center justify-center transition-colors rounded-full",
                            "w-10 h-10 md:w-auto md:h-auto md:px-3 md:py-2", // Circle on mobile, Pill on desktop
                            "bg-secondary/50 hover:bg-secondary text-foreground"
                        )}>
                        <ShoppingCart className="w-5 h-5 md:mr-2" />
                        <span className="hidden md:inline text-sm font-bold uppercase tracking-wider">Cart</span>

                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </motion.header>
    )
}

function ActiveLink({ href, icon: Icon, label, isScrolled, isExact = false, className }) {
    const pathname = usePathname()
    const isActive = isExact ? pathname === href : pathname.startsWith(href)

    return (
        <Link href={href} className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full transition-colors",
            // Base styles
            isScrolled ? "text-foreground" : "text-foreground",
            // Hover states
            isScrolled ? "hover:bg-secondary hover:text-primary" : "hover:bg-secondary/50",
            // Active states
            isActive && "bg-secondary text-primary",
            className
        )}>
            <Icon className="w-5 h-5 md:w-5 md:h-5" />
            <span className="hidden md:inline text-sm font-bold uppercase tracking-wider">{label}</span>
        </Link>
    )
}
