'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown, LayoutGrid } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function CategorySidebar({ categories, className, onSelect }) {
    const pathname = usePathname()
    const [expanded, setExpanded] = useState({})

    const toggleExpand = (id, e) => {
        e.preventDefault()
        e.stopPropagation()
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const handleSelect = () => {
        if (onSelect) onSelect()
    }

    // Organize categories into parents and children
    const parentCategories = categories.filter(c => !c.parent)
    const getChildren = (parentId) => categories.filter(c => c.parent?._id === parentId || c.parent === parentId)

    return (
        <div className={cn("w-full h-full flex flex-col", className)}>
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Discover</span>
                        <span className="block text-xs font-black uppercase tracking-tight text-foreground">Categories</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
                {/* Full Collection Link */}
                <div className="mb-2">
                    <Link
                        href="/shop"
                        onClick={handleSelect}
                        className={cn(
                            "group flex items-center justify-between rounded-xl transition-all duration-300",
                            pathname === '/shop' ? "bg-accent shadow-sm" : "hover:bg-accent"
                        )}
                    >
                        <div className={cn(
                            "flex-1 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all",
                            "text-muted-foreground group-hover:text-primary",
                            pathname === '/shop' && "text-primary"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-1.5 h-1.5 rounded-full bg-border transition-all duration-300",
                                    "group-hover:bg-primary group-hover:scale-125 shadow-sm group-hover:shadow-primary/40",
                                    pathname === '/shop' && "bg-primary scale-125 shadow-primary/40"
                                )}></div>
                                Full Collection
                            </div>
                        </div>
                    </Link>
                </div>
                {parentCategories.map(category => {
                    const children = getChildren(category._id)
                    const hasChildren = children.length > 0
                    const isExpanded = expanded[category._id]
                    const isActive = pathname === `/category/${category.slug}`

                    return (
                        <div key={category._id} className="space-y-1">
                            <div
                                className={cn(
                                    "group flex items-center justify-between rounded-xl transition-all duration-300",
                                    (isExpanded || isActive) ? "bg-accent shadow-sm" : "hover:bg-accent"
                                )}
                            >
                                <Link
                                    href={`/category/${category.slug}`}
                                    onClick={handleSelect}
                                    className={cn(
                                        "flex-1 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all",
                                        "text-muted-foreground group-hover:text-primary",
                                        (isExpanded || isActive) && "text-primary"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full bg-border transition-all duration-300",
                                            "group-hover:bg-primary group-hover:scale-125 shadow-sm group-hover:shadow-primary/40",
                                            (isExpanded || isActive) && "bg-primary scale-125 shadow-primary/40"
                                        )}></div>
                                        {category.name}
                                    </div>
                                </Link>

                                {hasChildren && (
                                    <button
                                        onClick={(e) => toggleExpand(category._id, e)}
                                        className={cn(
                                            "p-3 text-muted-foreground hover:text-primary transition-all duration-300",
                                            isExpanded && "rotate-180 text-primary"
                                        )}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {hasChildren && isExpanded && (
                                <div className="ml-6 border-l-2 border-border space-y-0.5 animate-in slide-in-from-top-2 duration-300">
                                    {children.map(child => {
                                        const isChildActive = pathname === `/category/${child.slug}`
                                        return (
                                            <Link
                                                key={child._id}
                                                href={`/category/${child.slug}`}
                                                onClick={handleSelect}
                                                className={cn(
                                                    "group flex items-center gap-3 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all",
                                                    isChildActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-2 h-px transition-all",
                                                    isChildActive ? "w-4 bg-primary" : "bg-border group-hover:w-4 group-hover:bg-primary"
                                                )}></div>
                                                {child.name}
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="p-4 rounded-2xl bg-accent border border-border">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">Member Perks</p>
                    <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase">Unlock curated <span className="text-primary">Clusters</span></p>
                </div>
            </div>
        </div>
    )
}
