'use server'

import dbConnect from "@/lib/db"
import IncompleteOrder from "@/models/IncompleteOrder"
import Product from "@/models/Product" // Ensure Product model is registered

export async function saveIncompleteOrder(data, id = null) {
    const start = Date.now();
    console.log(`saveIncompleteOrder started${id ? ' for id: ' + id : ''}`);
    await dbConnect()
    try {
        let order;
        if (id) {
            order = await IncompleteOrder.findByIdAndUpdate(id, data, { new: true })
            console.log(`saveIncompleteOrder updated existing in ${Date.now() - start}ms`);
        } else {
            order = await IncompleteOrder.create(data)
            console.log(`saveIncompleteOrder created new in ${Date.now() - start}ms`);
        }
        return { success: true, id: order._id.toString() }
    } catch (error) {
        console.error("Failed to save incomplete order:", error)
        return { success: false }
    }
}

export async function getIncompleteOrders() {
    const start = Date.now();
    console.log("getIncompleteOrders started");
    await dbConnect()
    try {
        // Optimization: Limit to latest 100 items and project necessary fields
        const orders = await IncompleteOrder.find({})
            .select('customerName phone address products area totalAmount updatedAt')
            .populate({
                path: 'products.product',
                select: 'title price discountPrice images'
            })
            .sort({ updatedAt: -1 })
            .limit(100)
            .lean()

        console.log(`getIncompleteOrders finished in ${Date.now() - start}ms`);
        return JSON.parse(JSON.stringify(orders))
    } catch (error) {
        console.error("Failed to fetch incomplete orders:", error)
        return []
    }
}

export async function deleteIncompleteOrder(id) {
    await dbConnect()
    try {
        await IncompleteOrder.findByIdAndDelete(id)
        return { success: true }
    } catch (error) {
        console.error("Failed to delete incomplete order:", error)
        return { success: false }
    }
}
