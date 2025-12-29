'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CategorySidebar({ categories, className }) {
    const [expanded, setExpanded] = useState({})

    const toggleExpand = (id, e) => {
        e.preventDefault()
        e.stopPropagation()
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
    }

    // Organize categories into parents and children
    const parentCategories = categories.filter(c => !c.parent)
    const getChildren = (parentId) => categories.filter(c => c.parent?._id === parentId || c.parent === parentId)

    return (
        <div className={cn("w-full h-full bg-white dark:bg-zinc-950 flex flex-col", className)}>
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-mongodb-green/10 flex items-center justify-center text-mongodb-green">
                        <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Discover</span>
                        <span className="block text-xs font-black uppercase tracking-tight text-zinc-950 dark:text-white">Categories</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
                {parentCategories.map(category => {
                    const children = getChildren(category._id)
                    const hasChildren = children.length > 0
                    const isExpanded = expanded[category._id]

                    return (
                        <div key={category._id} className="space-y-1">
                            <div
                                className={cn(
                                    "group flex items-center justify-between rounded-xl transition-all duration-300",
                                    isExpanded ? "bg-zinc-50 dark:bg-zinc-900 shadow-sm" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                )}
                            >
                                <Link
                                    href={`/category/${category.slug}`}
                                    className={cn(
                                        "flex-1 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all",
                                        "text-zinc-600 dark:text-zinc-400 group-hover:text-mongodb-green",
                                        isExpanded && "text-mongodb-green"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 transition-all duration-300",
                                            "group-hover:bg-mongodb-green group-hover:scale-125 shadow-[0_0_10px_rgba(0,237,100,0)] group-hover:shadow-[0_0_10px_rgba(0,237,100,0.4)]",
                                            isExpanded && "bg-mongodb-green scale-125 shadow-[0_0_10px_rgba(0,237,100,0.4)]"
                                        )}></div>
                                        {category.name}
                                    </div>
                                </Link>

                                {hasChildren && (
                                    <button
                                        onClick={(e) => toggleExpand(category._id, e)}
                                        className={cn(
                                            "p-3 text-zinc-300 hover:text-mongodb-green transition-all duration-300",
                                            isExpanded && "rotate-180 text-mongodb-green"
                                        )}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {hasChildren && isExpanded && (
                                <div className="ml-6 border-l-2 border-zinc-100 dark:border-zinc-800 space-y-0.5 animate-in slide-in-from-top-2 duration-300">
                                    {children.map(child => (
                                        <Link
                                            key={child._id}
                                            href={`/category/${child.slug}`}
                                            className="group flex items-center gap-3 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-mongodb-green transition-all"
                                        >
                                            <div className="w-2 h-px bg-zinc-200 dark:bg-zinc-800 group-hover:w-4 group-hover:bg-mongodb-green transition-all"></div>
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">Member Perks</p>
                    <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 leading-relaxed uppercase">Unlock curated <span className="text-mongodb-green">Clusters</span></p>
                </div>
            </div>
        </div>
    )
}
