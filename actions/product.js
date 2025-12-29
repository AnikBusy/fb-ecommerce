'use server'

import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

export async function getProducts(query = {}) {
    await dbConnect();
    try {
        const products = await Product.find(query).populate('category').sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export async function getProduct(slug) {
    await dbConnect();
    try {
        const product = await Product.findOne({ slug }).populate('category').lean();
        if (!product) return null;
        return JSON.parse(JSON.stringify(product));
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return null;
    }
}

export async function createProduct(data) {
    await dbConnect();
    try {
        const product = await Product.create(data);
        revalidatePath('/admin/products');
        return { success: true, product: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error("Failed to create product:", error);
        return { success: false, error: error.message };
    }
}

export async function updateProduct(id, data) {
    await dbConnect();
    try {
        const product = await Product.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/admin/products');
        return { success: true, product: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error("Failed to update product:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteProduct(id) {
    await dbConnect();
    try {
        await Product.findByIdAndDelete(id);
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete product:", error);
        return { success: false, error: error.message };
    }
}
