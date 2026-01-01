'use server'

import dbConnect from "@/lib/db"
import IncompleteOrder from "@/models/IncompleteOrder"
import Product from "@/models/Product" // Ensure Product model is registered

export async function saveIncompleteOrder(data, id = null) {
    await dbConnect()
    try {
        let order;
        if (id) {
            order = await IncompleteOrder.findByIdAndUpdate(id, data, { new: true })
        } else {
            order = await IncompleteOrder.create(data)
        }
        return { success: true, id: order._id.toString() }
    } catch (error) {
        console.error("Failed to save incomplete order:", error)
        return { success: false }
    }
}

export async function getIncompleteOrders() {
    await dbConnect()
    try {
        // Populate products
        const orders = await IncompleteOrder.find({})
            .populate('products.product')
            .sort({ updatedAt: -1 })
            .lean()

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
