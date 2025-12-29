
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET() {
    await dbConnect();
    const categories = await Category.find({}).lean();
    const products = await Product.find({}).lean();

    // Check Cloudinary config status
    const cloudinaryConfigured = !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
        categories,
        products,
        env: {
            cloudinaryConfigured,
            nodeEnv: process.env.NODE_ENV
        }
    });
}
