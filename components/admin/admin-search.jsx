'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export function AdminSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()

    function handleSubmit(e) {
        e.preventDefault()
        const term = e.target.search.value
        if (term.trim()) {
            router.push(`/admin/search?q=${encodeURIComponent(term)}`)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-1 max-w-sm ml-4">
            <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    name="search"
                    defaultValue={searchParams.get('q') || ''}
                    placeholder="Search orders, phone..."
                    className="w-full bg-background pl-8 h-9 md:w-[200px] lg:w-[300px] focus:w-full transition-all"
                />
            </div>
        </form>
    )
}
