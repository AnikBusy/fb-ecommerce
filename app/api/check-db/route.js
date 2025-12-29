
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET() {
    await dbConnect();
    const categories = await Category.find({}).lean();
    const products = await Product.find({}).lean();
    return NextResponse.json({ categories, products });
}
