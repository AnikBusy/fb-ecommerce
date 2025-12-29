'use server'

import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Admin from "@/models/Admin";

export async function getDashboardStats() {
    await dbConnect();

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch all orders to process metrics
    // Optimization: In a real large-scale app, use aggregation pipelines.
    const orders = await Order.find({}).lean();

    // 1. Today's Sales
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= startOfDay);
    const todayRevenue = todayOrders
        .filter(o => o.status !== 'cancelled' && o.status !== 'returned')
        .reduce((sum, o) => sum + o.totalAmount, 0);

    // 2. Monthly Sales
    const monthOrders = orders.filter(o => new Date(o.createdAt) >= startOfMonth);
    const monthRevenue = monthOrders
        .filter(o => o.status !== 'cancelled' && o.status !== 'returned')
        .reduce((sum, o) => sum + o.totalAmount, 0);

    // 3. Status Counts
    const statusCounts = {
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        returned: orders.filter(o => o.status === 'returned').length,
    };

    // 4. Recent Orders (Last 5)
    // We fetch this efficiently from DB
    const recentOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    // 5. Monthly Orders Graph (Jan-Dec)
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize with 0
    const monthlyData = months.map(name => ({ name, orders: 0, revenue: 0 }));

    orders.forEach(order => {
        const d = new Date(order.createdAt);
        if (d.getFullYear() === currentYear) {
            const mIdx = d.getMonth();
            monthlyData[mIdx].orders += 1;

            // Add revenue if not cancelled/returned
            if (order.status !== 'cancelled' && order.status !== 'returned') {
                monthlyData[mIdx].revenue += order.totalAmount;
            }
        }
    });

    return {
        totalOrders: orders.length,
        totalRevenue: orders
            .filter(o => o.status !== 'cancelled' && o.status !== 'returned')
            .reduce((sum, o) => sum + o.totalAmount, 0),
        todayRevenue,
        todayOrdersCount: todayOrders.length,
        monthRevenue,
        monthOrdersCount: monthOrders.length,
        statusCounts,
        recentOrders: JSON.parse(JSON.stringify(recentOrders)),
        monthlyOrdersGraph: monthlyData
    };
}
