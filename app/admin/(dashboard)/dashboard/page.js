import { getDashboardStats } from "@/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Package, Users, Activity } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { MonthlyOrdersChart } from "@/components/admin/monthly-orders-chart"

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your store's performance.</p>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.todayOrdersCount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Orders submitted today</p>
                    </CardContent>
                </Card>
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Order Status</CardTitle>
                        <CardDescription className="text-[10px]">Current state of all orders</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <span className="w-20 text-[10px] uppercase font-bold text-zinc-500">Delivered</span>
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: `${(stats.statusCounts.delivered / stats.totalOrders) * 100}%` }} />
                                </div>
                                <span className="w-10 text-right text-xs font-bold">{stats.statusCounts.delivered}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-[10px] uppercase font-bold text-zinc-500">Shipped</span>
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${(stats.statusCounts.shipped / stats.totalOrders) * 100}%` }} />
                                </div>
                                <span className="w-10 text-right text-xs font-bold">{stats.statusCounts.shipped}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-[10px] uppercase font-bold text-zinc-500">Ready</span>
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: `${(stats.statusCounts.confirmed / stats.totalOrders) * 100}%` }} />
                                </div>
                                <span className="w-10 text-right text-xs font-bold">{stats.statusCounts.confirmed}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-[10px] uppercase font-bold text-zinc-500">Pending</span>
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500" style={{ width: `${(stats.statusCounts.pending / stats.totalOrders) * 100}%` }} />
                                </div>
                                <span className="w-10 text-right text-xs font-bold">{stats.statusCounts.pending}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-20 text-[10px] uppercase font-bold text-zinc-500">Rejected</span>
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500/50" style={{ width: `${((stats.statusCounts.cancelled + stats.statusCounts.returned) / stats.totalOrders) * 100}%` }} />
                                </div>
                                <span className="w-10 text-right text-xs font-bold">{stats.statusCounts.cancelled + stats.statusCounts.returned}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Recent Orders */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Monthly Orders</CardTitle>
                        <CardDescription>Order trends for the current period</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="flex items-baseline gap-4 mb-6 ml-4">
                            <div className="text-2xl font-bold">{stats.monthOrdersCount} <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Orders</span></div>
                            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                            <div className="text-2xl font-bold text-primary">{formatCurrency(stats.monthRevenue)} <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sales</span></div>
                        </div>
                        <MonthlyOrdersChart data={stats.monthlyOrdersGraph} height={250} />
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader className="px-4 md:px-6">
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest 5 transactions from your store.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 md:p-6">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.recentOrders.map((order) => (
                                        <TableRow key={order._id}>
                                            <TableCell>
                                                <div className="font-medium whitespace-nowrap">{order.customerName}</div>
                                                <div className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                                                {order.orderNote && (
                                                    <div className="mt-1 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-[10px] text-amber-700 dark:text-amber-300 font-bold border border-amber-100 dark:border-amber-800 line-clamp-1 max-w-[150px]">
                                                        Note: {order.orderNote}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn(
                                                    "text-xs capitalize",
                                                    order.status === 'pending' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
                                                    order.status === 'confirmed' && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
                                                    order.status === 'shipped' && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
                                                    order.status === 'delivered' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
                                                    order.status === 'cancelled' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                                                )}>
                                                    {order.status === 'confirmed' ? 'Ready to Ship' : order.status}
                                                </Badge>
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
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(order.totalAmount)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
