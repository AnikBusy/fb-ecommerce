'use client'

import { useState } from "react"
import { updateOrderDetails } from "@/actions/order"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Truck, Sparkles } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function OrderDetailsDialog({ order }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        courierName: order.courierName || 'Steadfast',
        trackingId: order.trackingId || '',
        adminNote: order.adminNote || '',
    })
    const [isOther, setIsOther] = useState(!['Steadfast', 'Pathao', 'RedX', 'Paperfly', ''].includes(order.courierName || ''))

    const generateTrackingId = () => {
        const id = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        setFormData({ ...formData, trackingId: id })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await updateOrderDetails(order._id, formData)
            if (res.success) {
                toast.success("Courier details updated successfully!")
                router.refresh()
                setOpen(false)
            } else {
                toast.error("Failed to update: " + res.error)
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong while saving.")
        } finally {
            setLoading(false)
        }
    }

    const handleCourierChange = (value) => {
        if (value === 'Other') {
            setIsOther(true)
            setFormData({ ...formData, courierName: '' })
        } else {
            setIsOther(false)
            setFormData({ ...formData, courierName: value })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 hover:bg-zinc-900 hover:text-white border-zinc-200">
                    <Truck className="h-4 w-4" />
                    Courier
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Courier & Tracking Info</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Courier Service</Label>
                        <Select onValueChange={handleCourierChange} defaultValue={isOther ? 'Other' : (formData.courierName || 'Steadfast')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Courier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Steadfast">Steadfast</SelectItem>
                                <SelectItem value="Pathao">Pathao</SelectItem>
                                <SelectItem value="RedX">RedX</SelectItem>
                                <SelectItem value="Paperfly">Paperfly</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {isOther && (
                            <Input
                                placeholder="Enter Courier Name"
                                value={formData.courierName}
                                onChange={e => setFormData({ ...formData, courierName: e.target.value })}
                                className="mt-2"
                            />
                        )}
                    </div>
                    <div className="grid gap-2">
                        <div className="flex justify-between items-center">
                            <Label>Tracking ID / Consignment ID</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={generateTrackingId}
                                className="h-6 text-[10px] gap-1 text-mongodb-green hover:text-mongodb-green hover:bg-mongodb-green/10 uppercase font-black tracking-widest"
                            >
                                <Sparkles className="h-3 w-3" />
                                Auto-Generate
                            </Button>
                        </div>
                        <Input
                            placeholder="e.g. 1234AB"
                            value={formData.trackingId}
                            onChange={e => setFormData({ ...formData, trackingId: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Private Admin Note</Label>
                        <Input
                            placeholder="Internal notes..."
                            value={formData.adminNote}
                            onChange={e => setFormData({ ...formData, adminNote: e.target.value })}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Saving Details...' : 'Save Details'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
