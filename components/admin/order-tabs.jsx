'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function OrderTabs({ counts = {} }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentStatus = searchParams.get('status') || 'pending'

    const handleTabChange = (value) => {
        if (value === 'pending') {
            router.push('/admin/orders?status=pending')
        } else if (value === 'all') {
            router.push('/admin/orders?status=all')
        } else {
            router.push(`/admin/orders?status=${value}`)
        }
    }

    const tabs = [
        { value: 'all', label: 'All', color: 'bg-zinc-500' },
        { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
        { value: 'confirmed', label: 'Ready to ship', color: 'bg-blue-500' },
        { value: 'shipped', label: 'Shipped', color: 'bg-purple-500' },
        { value: 'delivered', label: 'Delivered', color: 'bg-green-500' },
        { value: 'returned', label: 'Returned', color: 'bg-orange-500' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
    ]

    return (
        <Tabs value={currentStatus} onValueChange={handleTabChange} className="w-full">
            <TabsList className="flex h-14 w-full items-center justify-start gap-2 bg-transparent p-0 overflow-x-auto no-scrollbar flex-nowrap pb-2">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                            "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-widest transition-all data-[state=active]:border-transparent data-[state=active]:text-white shadow-sm h-10 flex-shrink-0",
                            tab.value === 'all' && "data-[state=active]:bg-zinc-600",
                            tab.value === 'pending' && "data-[state=active]:bg-yellow-500 data-[state=active]:shadow-yellow-500/20",
                            tab.value === 'confirmed' && "data-[state=active]:bg-blue-600 data-[state=active]:shadow-blue-500/20",
                            tab.value === 'shipped' && "data-[state=active]:bg-purple-600 data-[state=active]:shadow-purple-500/20",
                            tab.value === 'delivered' && "data-[state=active]:bg-green-600 data-[state=active]:shadow-green-500/20",
                            tab.value === 'returned' && "data-[state=active]:bg-orange-600 data-[state=active]:shadow-orange-500/20",
                            tab.value === 'cancelled' && "data-[state=active]:bg-red-600 data-[state=active]:shadow-red-500/20"
                        )}
                    >
                        <span>{tab.label}</span>
                        {(counts[tab.value] || 0) > 0 && (
                            <span className={cn(
                                "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black shadow-sm transition-colors",
                                currentStatus === tab.value
                                    ? "bg-white/20 text-white"
                                    : "bg-muted text-muted-foreground"
                            )}>
                                {counts[tab.value] > 999 ? '999+' : counts[tab.value]}
                            </span>
                        )}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}
