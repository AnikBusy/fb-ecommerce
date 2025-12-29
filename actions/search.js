'use server'

import dbConnect from "@/lib/db"
import Order from "@/models/Order"
import IncompleteOrder from "@/models/IncompleteOrder"

export async function globalSearch(query) {
    await dbConnect()

    // Clean query for regex safely
    const safeInfo = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(safeInfo, 'i')

    try {
        const [orders, incompleteOrders] = await Promise.all([
            Order.find({
                $or: [
                    { customerName: regex },
                    { phone: regex },
                    { _id: query.match(/^[0-9a-fA-F]{24}$/) ? query : null },
                    { trackingId: regex },
                    { courierName: regex }
                ].filter(c => Object.values(c)[0] !== null)
            }).sort({ createdAt: -1 }).limit(20).lean(),

            IncompleteOrder.find({
                $or: [
                    { customerName: regex },
                    { phone: regex }
                ]
            }).sort({ updatedAt: -1 }).limit(10).lean()
        ])

        return {
            orders: JSON.parse(JSON.stringify(orders)),
            incomplete: JSON.parse(JSON.stringify(incompleteOrders))
        }
    } catch (error) {
        console.error("Search failed:", error)
        return { orders: [], incomplete: [] }
    }
}
