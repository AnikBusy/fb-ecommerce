
import { getOrders, getOrderCounts } from "@/actions/order"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderStatusSelect } from "@/components/admin/order-status-select"
import { OrderDetailsDialog } from "@/components/admin/order-details-dialog"
import { Badge } from "@/components/ui/badge"
import { OrderTabs } from "@/components/admin/order-tabs"
// import { FraudCheck } from "@/components/admin/fraud-check" // Moved to OrderTable
import { Button } from "@/components/ui/button"
// import { ExternalLink, Printer } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { OrderTable } from "@/components/admin/order-table"

export default async function OrdersPage({ searchParams }) {
    const params = await searchParams
    const statusFilter = params.status || 'pending'
    const currentPage = parseInt(params.page) || 1

    const [{ orders, pagination }, counts] = await Promise.all([
        getOrders({ status: statusFilter, page: currentPage, limit: 10 }),
        getOrderCounts()
    ])

    return (
        <div className="grid gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
                    <p className="text-sm text-muted-foreground">Manage and track your customer orders</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/orders/create">
                        <Button>Create Order</Button>
                    </Link>
                </div>
            </div>

            <OrderTabs counts={counts} />

            <Card>
                <CardHeader className="px-4 md:px-6">
                    <CardTitle className="capitalize">
                        {statusFilter === 'confirmed' ? 'Ready to ship' : statusFilter} Orders ({orders.length})
                    </CardTitle>
                    <CardDescription>Review and manage your orders.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 md:p-6">
                    <div className="overflow-x-auto">
                        <OrderTable orders={orders} pagination={pagination} />
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
