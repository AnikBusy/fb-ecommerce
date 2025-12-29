'use server'

import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { createNotification } from "./notification";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-change-this";
const key = new TextEncoder().encode(SECRET_KEY);

export async function createOrder(data) {
    await dbConnect();
    try {
        const order = await Order.create(data);

        // Create Admin Notification
        await createNotification({
            title: 'New Order Received',
            message: `A new order has been placed by ${data.customerName || 'a customer'}.`,
            type: 'order_new',
            link: `/admin/orders`, // In a real app, this might link to a specific order
        });

        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        console.error("Failed to create order:", error);
        return { success: false, error: error.message };
    }
}


export async function getOrders(options = {}) {
    await dbConnect();
    try {
        const { status = 'all', page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;

        let query = {};
        if (status !== 'all') {
            if (status === 'returned') {
                query.status = { $in: ['returned', 'partial-returned'] };
            } else {
                query.status = status;
            }
        }

        const totalCount = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        const orders = await Order.find(query)
            .populate('products.product')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Calculate history for each customer (using all orders for accuracy)
        const allOrders = await Order.find(query).select('phone status').lean();
        const ordersWithHistory = orders.map((order) => {
            if (!order.phone) return { ...order, history: null };

            const historyOrders = allOrders.filter(o => o.phone === order.phone && String(o._id) !== String(order._id));
            const history = {
                total: historyOrders.length,
                delivered: historyOrders.filter(o => o.status === 'delivered').length,
                cancelled: historyOrders.filter(o => o.status === 'cancelled').length,
                returned: historyOrders.filter(o => o.status === 'returned').length,
            };

            return { ...order, history };
        });

        return {
            orders: JSON.parse(JSON.stringify(ordersWithHistory)),
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit
            }
        };
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return { orders: [], pagination: { totalCount: 0, totalPages: 0, currentPage: 1, limit: 10 } };
    }
}

export async function getOrderById(id) {
    await dbConnect();
    try {
        const order = await Order.findById(id).populate('products.product').lean();
        if (!order) return null;

        // Calculate history for this specific customer
        if (order.phone) {
            const historyOrders = await Order.find({ phone: order.phone, _id: { $ne: order._id } }).select('status').lean();
            order.history = {
                total: historyOrders.length,
                delivered: historyOrders.filter(o => o.status === 'delivered').length,
                cancelled: historyOrders.filter(o => o.status === 'cancelled').length,
                returned: historyOrders.filter(o => o.status === 'returned').length,
            };
        }

        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.error("Failed to fetch order:", error);
        return null;
    }
}

export async function updateOrderStatus(id, status) {
    await dbConnect();
    try {
        const updateData = { status };

        // Track who performed the action
        const token = (await cookies()).get("admin_token")?.value;
        console.log("Token found:", !!token);
        let adminName = '';
        if (token) {
            try {
                const { payload } = await jwtVerify(token, key);
                console.log("JWT Payload:", payload);
                if (payload && payload.username) {
                    adminName = payload.username;
                }
            } catch (e) {
                console.error("Token verification failed during order status update:", e);
            }
        }
        console.log("Admin Name detected:", adminName);

        if (adminName) {
            if (status === 'confirmed') updateData.confirmedBy = adminName;
            if (status === 'shipped') updateData.shippedBy = adminName;
            if (status === 'delivered') updateData.deliveredBy = adminName;
            if (status === 'cancelled') updateData.cancelledBy = adminName;
            if (status === 'returned' || status === 'partial-returned') updateData.returnedBy = adminName;
            updateData.lastUpdatedBy = adminName;
        }

        const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
        revalidatePath('/admin/orders');
        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        console.error("Failed to update order status:", error);
        return { success: false, error: error.message };
    }
}

export async function updateOrderDetails(id, data) {
    await dbConnect();
    try {
        const currentOrder = await Order.findById(id);
        if (!currentOrder) return { success: false, error: "Order not found" };

        const updateData = { ...data };

        // Auto-mark as shipped if courier info is added and order is currently pending/confirmed
        if (data.courierName && ['pending', 'confirmed'].includes(currentOrder.status)) {
            updateData.status = 'shipped';
        }

        // Capture who is updating the order
        const token = (await cookies()).get("admin_token")?.value;
        if (token) {
            try {
                const { payload } = await jwtVerify(token, key);
                if (payload && payload.username) {
                    updateData.lastUpdatedBy = payload.username;
                    // If shipping, also set shippedBy
                    if (updateData.status === 'shipped') {
                        updateData.shippedBy = payload.username;
                    }
                }
            } catch (e) { }
        }

        const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
        revalidatePath('/admin/orders');
        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        console.error("Failed to update order details:", error);
        return { success: false, error: error.message };
    }
}

export async function updateFullOrder(id, data) {
    await dbConnect()
    try {
        // Calculate new total
        let itemsTotal = 0
        if (data.products) {
            itemsTotal = data.products.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        }

        // Ensure discount doesn't exceed total
        const discount = Number(data.discount) || 0
        const deliveryCharge = Number(data.deliveryCharge) || 0
        const finalTotal = itemsTotal + deliveryCharge - discount

        const updateData = {
            ...data,
            totalAmount: finalTotal
        }

        const token = (await cookies()).get("admin_token")?.value;
        if (token) {
            try {
                const { payload } = await jwtVerify(token, key);
                if (payload && payload.username) {
                    updateData.lastUpdatedBy = payload.username;
                }
            } catch (e) { }
        }

        await Order.findByIdAndUpdate(id, updateData)
        revalidatePath('/admin/orders')
        revalidatePath(`/admin/orders/invoice/${id}`)
        return { success: true }
    } catch (error) {
        console.error("Failed to update full order:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteOrder(id) {
    await dbConnect()
    try {
        await Order.findByIdAndDelete(id)
        revalidatePath('/admin/orders')
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function bulkAssignOrders(orderIds, courierName) {
    await dbConnect()
    try {
        // Track who is performing bulk shipment - move this OUTSIDE the loop
        const token = (await cookies()).get("admin_token")?.value;
        let adminName = '';
        if (token) {
            try {
                const { payload } = await jwtVerify(token, key);
                adminName = payload?.username || '';
            } catch (e) { }
        }

        const updates = orderIds.map(id => {
            // Generate a simple unique tracking ID if one doesn't exist or we just overwrite it for the bulk shipment
            // Format: TRK-{TIMESTAMP}-{RANDOM}
            const trackingId = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`

            return Order.findByIdAndUpdate(id, {
                courierName: courierName,
                status: 'shipped',
                trackingId: trackingId,
                shippedBy: adminName,
                lastUpdatedBy: adminName
            })
        })

        await Promise.all(updates)
        revalidatePath('/admin/orders')
        return { success: true }
    } catch (error) {
        console.error("Bulk assign error:", error)
        return { success: false, error: error.message }
    }
}

export async function getPendingOrderCount() {
    await dbConnect();
    try {
        const count = await Order.countDocuments({ status: 'pending' });
        return count;
    } catch (error) {
        console.error("Failed to fetch pending order count:", error);
        return 0;
    }
}

export async function getOrderCounts() {
    await dbConnect();
    try {
        const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled'];
        const counts = {};

        await Promise.all(statuses.map(async (status) => {
            counts[status] = await Order.countDocuments({ status });
        }));

        // For 'all', sum them up or just count all
        counts['all'] = await Order.countDocuments({});

        return counts;
    } catch (error) {
        console.error("Failed to fetch order counts:", error);
        return {};
    }
}

