'use server'

import dbConnect from "@/lib/db";
import Banner from "@/models/Banner";
import { revalidatePath } from "next/cache";

export async function getBanners(query = {}) {
    await dbConnect();
    try {
        const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(banners));
    } catch (error) {
        console.error("Failed to fetch banners:", error);
        return [];
    }
}

export async function createBanner(data) {
    await dbConnect();
    try {
        const banner = await Banner.create(data);
        revalidatePath('/admin/banners');
        revalidatePath('/');
        return { success: true, banner: JSON.parse(JSON.stringify(banner)) };
    } catch (error) {
        console.error("Failed to create banner:", error);
        return { success: false, error: error.message };
    }
}

export async function updateBanner(id, data) {
    await dbConnect();
    try {
        const banner = await Banner.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/admin/banners');
        revalidatePath('/');
        return { success: true, banner: JSON.parse(JSON.stringify(banner)) };
    } catch (error) {
        console.error("Failed to update banner:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteBanner(id) {
    await dbConnect();
    try {
        await Banner.findByIdAndDelete(id);
        revalidatePath('/admin/banners');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete banner:", error);
        return { success: false, error: error.message };
    }
}

export async function updateBannerOrder(id, order) {
    await dbConnect();
    try {
        await Banner.findByIdAndUpdate(id, { order });
        revalidatePath('/admin/banners');
        return { success: true };
    } catch (error) {
        console.error("Failed to update banner order:", error);
        return { success: false, error: error.message };
    }
}
