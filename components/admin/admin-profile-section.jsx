'use client'

import { logout } from "@/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"

export function AdminProfileSection({ admin }) {
    if (!admin) return null;

    return (
        <div className="flex flex-col gap-4 p-2 w-full">
            <div className="flex items-center gap-3 px-2 py-1">
                <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800">
                    <AvatarImage src={admin.image} alt={admin.username} className="object-cover" />
                    <AvatarFallback className="bg-mongodb-green/10 text-mongodb-green">
                        {admin.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-black truncate text-foreground leading-none mb-1 shadow-sm">
                        {admin.username}
                    </span>
                    <span className="text-[9px] text-muted-foreground truncate uppercase tracking-[0.2em] font-bold opacity-80">
                        Administrator
                    </span>
                </div>
            </div>
            <form action={logout} className="w-full">
                <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 group">
                    <div className="h-8 w-8 rounded-lg bg-red-100/50 dark:bg-red-900/20 flex items-center justify-center transition-colors group-hover:bg-red-100 dark:group-hover:bg-red-900/30">
                        <LogOut className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </div>
                    <span>Logout</span>
                </button>
            </form>
        </div>
    )
}
