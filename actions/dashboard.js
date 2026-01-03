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

    // Use aggregation for optimized stats fetching
    const [stats] = await Order.aggregate([
        {
            $facet: {
                overall: [
                    {
                        $group: {
                            _id: null,
                            totalOrders: { $sum: 1 },
                            totalRevenue: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $ne: ["$status", "cancelled"] }, { $ne: ["$status", "returned"] }] },
                                        "$totalAmount",
                                        0
                                    ]
                                }
                            }
                        }
                    }
                ],
                today: [
                    { $match: { createdAt: { $gte: startOfDay } } },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            revenue: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $ne: ["$status", "cancelled"] }, { $ne: ["$status", "returned"] }] },
                                        "$totalAmount",
                                        0
                                    ]
                                }
                            }
                        }
                    }
                ],
                thisMonth: [
                    { $match: { createdAt: { $gte: startOfMonth } } },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            revenue: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $ne: ["$status", "cancelled"] }, { $ne: ["$status", "returned"] }] },
                                        "$totalAmount",
                                        0
                                    ]
                                }
                            }
                        }
                    }
                ],
                statusCounts: [
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    }
                ],
                monthlyGraph: [
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(now.getFullYear(), 0, 1) // Start of current year
                            }
                        }
                    },
                    {
                        $group: {
                            _id: { $month: "$createdAt" },
                            orders: { $sum: 1 },
                            revenue: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $ne: ["$status", "cancelled"] }, { $ne: ["$status", "returned"] }] },
                                        "$totalAmount",
                                        0
                                    ]
                                }
                            }
                        }
                    },
                    { $sort: { "_id": 1 } }
                ]
            }
        }
    ]);

    // Format status counts
    const statusMap = {
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        returned: 0
    };
    stats.statusCounts.forEach(s => {
        if (statusMap.hasOwnProperty(s._id)) {
            statusMap[s._id] = s.count;
        }
    });

    // Format monthly graph data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map((name, index) => {
        const monthStats = stats.monthlyGraph.find(m => m._id === index + 1);
        return {
            name,
            orders: monthStats ? monthStats.orders : 0,
            revenue: monthStats ? monthStats.revenue : 0
        };
    });

    // Fetch recent orders separately (easier than facet for this)
    const recentOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const overall = stats.overall[0] || { totalOrders: 0, totalRevenue: 0 };
    const today = stats.today[0] || { count: 0, revenue: 0 };
    const thisMonth = stats.thisMonth[0] || { count: 0, revenue: 0 };

    return {
        totalOrders: overall.totalOrders,
        totalRevenue: overall.totalRevenue,
        todayRevenue: today.revenue,
        todayOrdersCount: today.count,
        monthRevenue: thisMonth.revenue,
        monthOrdersCount: thisMonth.count,
        statusCounts: statusMap,
        recentOrders: JSON.parse(JSON.stringify(recentOrders)),
        monthlyOrdersGraph: monthlyData
    };
}
