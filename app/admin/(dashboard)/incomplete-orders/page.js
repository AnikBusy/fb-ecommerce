'use client'

import { getIncompleteOrders, deleteIncompleteOrder } from "@/actions/incomplete-order"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { timeAgo, formatCurrency, toEnglishDigits } from "@/lib/utils"
import { Phone, Trash2, ArrowRight, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function IncompleteOrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadOrders()
    }, [])

    async function loadOrders() {
        const data = await getIncompleteOrders()
        setOrders(data)
        setLoading(false)
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this incomplete order?')) return
        const res = await deleteIncompleteOrder(id)
        if (res.success) {
            setOrders(orders.filter(o => o._id !== id))
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Incomplete Orders</h1>
                    <p className="text-muted-foreground">Orders that were started but not submitted.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Abandoned Checkouts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table className="min-w-[800px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Cart Items</TableHead>
                                    <TableHead>Total Potential</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="whitespace-nowrap">
                                            <div className="font-medium">{new Date(order.updatedAt).toLocaleDateString()}</div>
                                            <div className="text-xs text-muted-foreground">{timeAgo(order.updatedAt)}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="font-bold">{order.customerName || 'N/A'}</div>
                                                <div className="text-xs font-mono">{toEnglishDigits(order.phone)}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{order.address}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-2 max-w-[300px]">
                                                {order.products?.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                                        <div className="h-8 w-8 rounded flex-shrink-0 bg-muted overflow-hidden border border-border">
                                                            {item.product?.images?.[0] ? (
                                                                <img
                                                                    src={item.product.images[0]}
                                                                    alt={item.product.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center">
                                                                    <Zap className="h-4 w-4 text-muted-foreground opacity-20" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 truncate">
                                                            <span className="font-bold">{item.quantity}x</span> {item.product?.title || 'Unknown'}
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.products?.length === 0 && <span className="text-muted-foreground italic">No items</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{formatCurrency(order.totalAmount)}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {order.phone && (
                                                    <Button size="sm" variant="outline" asChild>
                                                        <a href={`tel:${order.phone}`}>
                                                            <Phone className="h-4 w-4 mr-2" />
                                                            Call
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button size="icon" variant="destructive" onClick={() => handleDelete(order._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {orders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No incomplete orders found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
