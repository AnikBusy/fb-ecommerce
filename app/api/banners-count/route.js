import dbConnect from "@/lib/db";
import Banner from "@/models/Banner";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    try {
        const count = await Banner.countDocuments();
        return NextResponse.json({ success: true, count });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
