'use client'

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AdminNav } from "./admin-nav"
import { AdminProfileSection } from "./admin-profile-section"

export function AdminMobileNav({ admin, settings, pendingCount }) {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return (
        <div className="lg:hidden">
            <Button variant="ghost" size="icon" disabled>
                <Menu className="h-6 w-6" />
            </Button>
        </div>
    )

    return (
        <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 flex flex-col h-full bg-background border-r border-border">
                    <SheetHeader className="h-[60px] border-b px-6 flex items-center justify-start text-left shrink-0">
                        <SheetTitle className="text-zinc-900 dark:text-zinc-100 font-bold uppercase tracking-tight">
                            {settings.siteName || 'Flux'}<span className="text-primary">.</span>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto py-2">
                        <AdminNav
                            className="grid items-start px-4 text-sm font-medium"
                            pendingCount={pendingCount}
                            onItemClick={() => setOpen(false)}
                        />
                    </div>
                    <div className="p-2 border-t mt-auto">
                        <AdminProfileSection admin={admin} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
