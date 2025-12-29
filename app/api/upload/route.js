
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
        return NextResponse.json({ success: false, error: "No file uploaded" });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary is configured, use it
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        console.log(`[Upload API] Attempting Cloudinary upload: ${file.name}`);
        try {
            const uploadPromise = new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    resource_type: 'auto',
                    folder: 'anikbusy-ecommerce'
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(buffer);
            });

            const result = await uploadPromise;
            console.log(`[Upload API] Cloudinary upload successful: ${result.secure_url}`);
            return NextResponse.json({ success: true, url: result.secure_url });
        } catch (error) {
            console.error("[Upload API] Cloudinary error:", error);
            return NextResponse.json({ success: false, error: "Cloudinary upload failed" });
        }
    }

    // Fallback to local storage for development
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const uploadDir = join(process.cwd(), 'public/uploads');
    const path = join(uploadDir, filename);

    console.log(`[Upload API] Falling back to local upload: ${file.name} to ${path}`);

    try {
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }
        await writeFile(path, buffer);
        console.log(`[Upload API] Local upload successful: /uploads/${filename}`);
        return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    } catch (error) {
        console.error("[Upload API] Local upload error:", error);
        return NextResponse.json({ success: false, error: "Upload failed" });
    }
}
