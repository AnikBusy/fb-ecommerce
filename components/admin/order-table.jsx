'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { OrderStatusSelect } from "@/components/admin/order-status-select"
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog"
import { FraudCheck } from "@/components/admin/fraud-check"
import { ExternalLink, Printer, Truck, ArrowUpRight, Map } from "lucide-react"
import Link from "next/link"
import { cn, formatCurrency, toEnglishDigits, timeAgo } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { bulkAssignOrders } from '@/actions/order'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from "lucide-react"

export function OrderTable({ orders, pagination }) {
    const [selectedOrders, setSelectedOrders] = useState([])
    const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
    const [bulkCourier, setBulkCourier] = useState('')
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedOrders(orders.map(o => o._id))
        } else {
            setSelectedOrders([])
        }
    }

    const handleSelectOrder = (id, checked) => {
        if (checked) {
            setSelectedOrders(prev => [...prev, id])
        } else {
            setSelectedOrders(prev => prev.filter(oid => oid !== id))
        }
    }

    const handleBulkAssign = async () => {
        if (!bulkCourier) return
        setLoading(true)
        const result = await bulkAssignOrders(selectedOrders, bulkCourier)
        if (result.success) {
            setSelectedOrders([])
            setIsBulkDialogOpen(false)
            setBulkCourier('')
            router.refresh()
        }
        setLoading(false)
    }

    const getTrackingUrl = (courier, id) => {
        if (!id) return null
        const c = courier?.toLowerCase() || ''
        if (c.includes('steadfast')) return `https://steadfast.com.bd/t/${id}`
        if (c.includes('pathao')) return `https://pathao.com/courier/tracking?consignment_id=${id}`
        if (c.includes('redx')) return `https://redx.com.bd/tracking/${id}`
        if (c.includes('paperfly')) return `https://www.paperfly.com.bd/tracking-result.php?tracking_id=${id}`
        return null
    }

    return (
        <div className="space-y-4">
            {/* Bulk Action Bar */}
            {selectedOrders.length > 0 && (
                <div className="bg-mongodb-green/10 border border-mongodb-green/20 p-4 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-mongodb-green text-mongodb-dark font-bold hover:bg-mongodb-green">
                            {selectedOrders.length} Selected
                        </Badge>
                        <span className="text-sm text-zinc-600 font-medium">items selected</span>
                    </div>

                    {/* Only show Assign Courier if orders are NOT already shipped/delivered */}
                    {orders.filter(o => selectedOrders.includes(o._id) && ['pending', 'confirmed'].includes(o.status)).length > 0 ? (
                        <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="bg-mongodb-green text-mongodb-dark hover:bg-[#00D85A] font-bold shadow-sm transition-colors">
                                    <Truck className="mr-2 h-4 w-4" />
                                    Assign Courier
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Bulk courier assignment</DialogTitle>
                                    <DialogDescription>
                                        Assign <strong>{selectedOrders.length} orders</strong> to a courier. This will mark them as <strong>Shipped</strong>.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Select value={bulkCourier} onValueChange={setBulkCourier}>
                                        <SelectTrigger className="glass focus:ring-mongodb-green">
                                            <SelectValue placeholder="Select Courier Service" />
                                        </SelectTrigger>
                                        <SelectContent className="glass">
                                            <SelectItem value="Steadfast">Steadfast</SelectItem>
                                            <SelectItem value="Pathao">Pathao</SelectItem>
                                            <SelectItem value="RedX">RedX</SelectItem>
                                            <SelectItem value="Paperfly">Paperfly</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleBulkAssign} disabled={!bulkCourier || loading} className="bg-zinc-900 text-white hover:bg-zinc-800">
                                        {loading ? 'Processing...' : 'Confirm Assignment'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <div className="text-sm text-muted-foreground italic mr-2">
                            Actions unavailable for shipped orders
                        </div>
                    )}
                </div>
            )}

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">
                                <Checkbox
                                    checked={orders.length > 0 && selectedOrders.length === orders.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="w-16">ID</TableHead>
                            <TableHead className="w-20 hidden md:table-cell">Date</TableHead>
                            <TableHead className="w-48">Customer</TableHead>
                            <TableHead className="w-32 hidden xl:table-cell">Products</TableHead>
                            <TableHead className="w-20">Total</TableHead>
                            <TableHead className="w-24">Status</TableHead>
                            <TableHead className="text-right w-20">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => {
                            const trackingUrl = getTrackingUrl(order.courierName, order.trackingId)
                            const isSelected = selectedOrders.includes(order._id)

                            return (
                                <TableRow key={order._id} data-state={isSelected ? "selected" : undefined}>
                                    <TableCell>
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={(checked) => handleSelectOrder(order._id, checked)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-mono text-[10px] font-bold">
                                        #{order._id.substring(order._id.length - 4)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            {mounted && (
                                                <span className="text-[10px] text-muted-foreground">{timeAgo(order.createdAt)}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 max-w-[250px]">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className="font-bold whitespace-nowrap truncate" title={order.customerName}>{order.customerName}</div>
                                                <FraudCheck history={order.history} phone={order.phone} />
                                            </div>
                                            <div className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">{toEnglishDigits(order.phone)}</div>
                                            <div className="text-xs text-muted-foreground truncate" title={order.address}>{order.address}</div>
                                            <div className="text-[10px] text-muted-foreground capitalize">{order.area?.replace('-', ' ')}</div>
                                            {order.orderNote && (
                                                <div className="mt-1 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-[10px] text-amber-700 dark:text-amber-300 font-bold border border-amber-100 dark:border-amber-800 line-clamp-1">
                                                    Note: {order.orderNote}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden xl:table-cell">
                                        <div className="flex flex-col items-center gap-2 py-2">
                                            {order.products?.slice(0, 1).map((item, idx) => (
                                                <div key={idx} className="flex flex-col items-center gap-1.5 text-center">
                                                    {/* Product Image */}
                                                    {item.product?.images?.[0] && (
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted border">
                                                            <img
                                                                src={item.product.images[0]}
                                                                alt={item.product.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    {/* Quantity */}
                                                    <div className="text-xs font-bold">{item.quantity}x</div>
                                                    {/* Product Title (truncated) */}
                                                    <div className="text-xs line-clamp-2 max-w-[140px]">
                                                        {item.product?.title || 'Unknown'}
                                                    </div>
                                                </div>
                                            ))}
                                            {(order.products?.length || 0) > 1 && (
                                                <div className="text-[10px] text-muted-foreground italic">
                                                    +{(order.products?.length || 0) - 1} more
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">{formatCurrency(order.totalAmount)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "capitalize",
                                            order.status === 'pending' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
                                            order.status === 'confirmed' && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
                                            order.status === 'shipped' && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
                                            order.status === 'delivered' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
                                            order.status === 'cancelled' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                                        )}>
                                            {order.status === 'confirmed' ? 'Ready to ship' : order.status}
                                        </Badge>

                                        {/* Admin Tracking Info */}
                                        <div className="text-[10px] text-muted-foreground mt-1 font-medium italic leading-tight space-y-0.5">
                                            {order.confirmedBy && (
                                                <div className="text-zinc-500">Confirmed by {order.confirmedBy}</div>
                                            )}
                                            {order.shippedBy && (
                                                <div className="text-purple-600 dark:text-purple-400">Shipped by {order.shippedBy}</div>
                                            )}
                                            {order.deliveredBy && (
                                                <div className="text-green-600 dark:text-green-400">Delivered by {order.deliveredBy}</div>
                                            )}
                                            {order.cancelledBy && (
                                                <div className="text-red-600 dark:text-red-400">Cancelled by {order.cancelledBy}</div>
                                            )}
                                            {order.returnedBy && (
                                                <div className="text-orange-600">Returned by {order.returnedBy}</div>
                                            )}

                                            {/* Fallback for general edits if no status-specific admin is recorded yet */}
                                            {!order.confirmedBy && !order.shippedBy && !order.deliveredBy && !order.cancelledBy && !order.returnedBy && order.lastUpdatedBy && (
                                                <div className="text-zinc-400">Modified by {order.lastUpdatedBy}</div>
                                            )}
                                        </div>

                                        {order.courierName && (
                                            <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                                <Truck className="w-3 h-3" /> {order.courierName}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center gap-1">
                                            {trackingUrl && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" title="Track Order" className="h-7 w-7 hover:bg-blue-100 hover:text-blue-700">
                                                            <Map className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
                                                        <DialogHeader className="p-4 border-b bg-muted/20">
                                                            <DialogTitle className="flex items-center gap-2">
                                                                <Truck className="w-5 h-5 text-muted-foreground" />
                                                                Tracking: #{order.trackingId || order._id}
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <div className="flex-1 bg-white relative">
                                                            <iframe
                                                                src={trackingUrl}
                                                                className="w-full h-full border-0"
                                                                title="Tracking Information"
                                                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                                            />
                                                            {/* Fallback/External Link option in case iframe is blocked */}
                                                            <div className="absolute bottom-4 right-4">
                                                                <a href={trackingUrl} target="_blank" rel="noreferrer">
                                                                    <Button size="sm" className="shadow-lg gap-2 cursor-pointer pointer-events-auto relative z-50">
                                                                        <ExternalLink className="w-4 h-4" />
                                                                        Open in New Tab
                                                                    </Button>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                            <Link href={`/admin/orders/edit/${order._id}`}>
                                                <Button variant="ghost" size="icon" title="Edit Order" className="h-7 w-7 hover:bg-amber-100 hover:text-amber-700">
                                                    <span className="sr-only">Edit</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/orders/invoice/${order._id}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="Print Invoice" className="h-7 w-7 hover:bg-purple-100 hover:text-purple-700">
                                                    <Printer className="h-3.5 w-3.5" />
                                                </Button>
                                            </Link>
                                            <OrderDetailsDialog order={order} />
                                            <OrderStatusSelect orderId={order._id} currentStatus={order.status} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                    No orders found in this category
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to <span className="font-medium">{Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)}</span> of <span className="font-medium">{pagination.totalCount}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.currentPage <= 1}
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            className="bg-white dark:bg-zinc-900"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <div className="flex items-center gap-1 mx-2">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={pagination.currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handlePageChange(page)}
                                    className={cn(
                                        "h-8 w-8 p-0",
                                        pagination.currentPage === page ? "bg-mongodb-green text-mongodb-dark hover:bg-mongodb-green/90" : "bg-white dark:bg-zinc-900"
                                    )}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.currentPage >= pagination.totalPages}
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            className="bg-white dark:bg-zinc-900"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
