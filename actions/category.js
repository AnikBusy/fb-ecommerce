'use server'

import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const getCategories = cache(async () => {
    await dbConnect();
    try {
        const categories = await Category.find({})
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
});

export async function getCategoryBySlug(slug) {
    await dbConnect();
    try {
        const category = await Category.findOne({ slug }).lean();
        if (!category) return null;
        return JSON.parse(JSON.stringify(category));
    } catch (error) {
        console.error("Failed to fetch category:", error);
        return null;
    }
}

export async function createCategory(data) {
    await dbConnect();
    console.log("[Server Action] createCategory data:", data);
    try {
        const category = await Category.create(data);
        revalidatePath('/admin/categories');
        return { success: true, category: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error("Failed to create category:", error);
        return { success: false, error: error.message };
    }
}

export async function updateCategory(id, data) {
    await dbConnect();
    try {
        const category = await Category.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/admin/categories');
        return { success: true, category: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error("Failed to update category:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteCategory(id) {
    await dbConnect();
    try {
        await Category.findByIdAndDelete(id);
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete category:", error);
        return { success: false, error: error.message };
    }
}
