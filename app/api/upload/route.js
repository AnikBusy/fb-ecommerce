
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
        return NextResponse.json({ success: false, error: "No file uploaded" });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const path = join(process.cwd(), 'public/uploads', filename);

    try {
        await writeFile(path, buffer);
        return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, error: "Upload failed" });
    }
}
