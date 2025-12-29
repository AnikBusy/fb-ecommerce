'use client'

import { updateOrderStatus } from "@/actions/order"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function OrderStatusSelect({ orderId, currentStatus }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleValueChange(value) {
        setLoading(true)
        const res = await updateOrderStatus(orderId, value)
        if (res.success) {
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="flex justify-end items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <Select defaultValue={currentStatus} onValueChange={handleValueChange} disabled={loading}>
                <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {/* Initial Stages */}
                    {(currentStatus === 'pending' || currentStatus === 'confirmed' || currentStatus === 'cancelled') && (
                        <>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Ready to ship</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </>
                    )}

                    {/* Shipped Stage - Cannot go back to pending/confirmed */}
                    {(currentStatus === 'shipped' || currentStatus === 'delivered' || currentStatus === 'returned' || currentStatus === 'partial-returned') && (
                        <>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="returned">Returned</SelectItem>
                            <SelectItem value="partial-returned">Partial Return</SelectItem>
                        </>
                    )}

                    {/* Fallback to show current if it doesn't match groups (active safety) */}
                    {!['pending', 'confirmed', 'shipped', 'delivered', 'returned', 'partial-returned', 'cancelled'].includes(currentStatus) && (
                        <SelectItem value={currentStatus}>{currentStatus}</SelectItem>
                    )}
                </SelectContent>
            </Select>
        </div>
    )
}
