'use server'

import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import { revalidatePath } from "next/cache";

export async function createNotification(data) {
    await dbConnect();
    try {
        const notification = await Notification.create(data);
        revalidatePath('/', 'layout'); // Invalidate layout to refresh potentially global UI
        return { success: true, notification: JSON.parse(JSON.stringify(notification)) };
    } catch (error) {
        console.error("Failed to create notification:", error);
        return { success: false, error: error.message };
    }
}

export async function getNotifications() {
    await dbConnect();
    try {
        const notifications = await Notification.find({})
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();
        return JSON.parse(JSON.stringify(notifications));
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return [];
    }
}

export async function markAsRead(id) {
    await dbConnect();
    try {
        await Notification.findByIdAndUpdate(id, { isRead: true });
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function markAllAsRead() {
    await dbConnect();
    try {
        await Notification.updateMany({ isRead: false }, { isRead: true });
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
