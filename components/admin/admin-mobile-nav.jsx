'use client'

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AdminNav } from "./admin-nav"
import { AdminProfileSection } from "./admin-profile-section"

export function AdminMobileNav({ admin, settings, pendingCount }) {
    return (
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 flex flex-col h-full bg-background border-r border-border">
                    <SheetHeader className="h-[60px] border-b px-6 flex items-center justify-start text-left">
                        <SheetTitle className="font-black tracking-tighter uppercase text-zinc-900 dark:text-zinc-100">
                            {settings.siteName || 'Flux'}<span className="text-mongodb-green">.</span>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto py-2">
                        <AdminNav className="grid items-start px-4 text-sm font-medium" pendingCount={pendingCount} />
                    </div>
                    <div className="p-2 border-t mt-auto">
                        <AdminProfileSection admin={admin} />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
