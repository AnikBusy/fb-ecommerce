import { globalSearch } from "@/actions/search"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, timeAgo } from "@/lib/utils"
import Link from "next/link"

export default async function SearchPage({ searchParams }) {
    const query = await searchParams
    const q = query.q || ''
    const { orders, incomplete } = await globalSearch(q)

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Search results for "{q}"</h1>

            {orders.length === 0 && incomplete.length === 0 && (
                <div className="text-muted-foreground p-8 text-center border rounded-lg bg-muted/20">
                    No results found.
                </div>
            )}

            {orders.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        Orders
                        <Badge variant="secondary">{orders.length}</Badge>
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {orders.map((order) => (
                            <Link key={order._id} href={`/admin/orders/edit/${order._id}`}>
                                <Card className="hover:bg-muted/50 transition-colors h-full">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-sm font-mono">#{order._id.slice(-6)}</CardTitle>
                                            <Badge>{order.status}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-1">
                                        <div className="font-semibold">{order.customerName}</div>
                                        <div className="text-muted-foreground">{order.phone}</div>
                                        <div className="flex justify-between mt-2 pt-2 border-t">
                                            <span>{formatCurrency(order.totalAmount)}</span>
                                            <span className="text-xs text-muted-foreground">{timeAgo(order.createdAt)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {incomplete.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        Incomplete Orders
                        <Badge variant="outline">{incomplete.length}</Badge>
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {incomplete.map((inc) => (
                            <div key={inc._id} className="block">
                                <Card className="bg-muted/20 h-full">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-sm font-medium">Auto-Saved</CardTitle>
                                            <span className="text-xs text-muted-foreground">{timeAgo(inc.updatedAt)}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="text-sm space-y-1">
                                        <div className="font-semibold">{inc.customerName || 'No Name'}</div>
                                        <div className="text-muted-foreground">{inc.phone || 'No Phone'}</div>
                                        {inc.phone && (
                                            <a href={`tel:${inc.phone}`} className="text-xs text-blue-500 hover:underline block mt-1">
                                                Click to Call
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
