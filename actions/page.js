'use server'

import dbConnect from "@/lib/db";
import Page from "@/models/Page";
import { revalidatePath } from "next/cache";

export async function getPages() {
    await dbConnect();
    try {
        const pages = await Page.find({}).sort({ slug: 1 }).lean();
        return JSON.parse(JSON.stringify(pages));
    } catch (error) {
        console.error("Failed to fetch pages:", error);
        return [];
    }
}

export async function getPageBySlug(slug) {
    await dbConnect();
    try {
        let page = await Page.findOne({ slug }).lean();

        // If page doesn't exist, create it with defaults
        if (!page) {
            const defaultTitles = {
                privacy: 'Privacy Policy',
                terms: 'Terms & Conditions',
                contact: 'Contact Us'
            };

            const defaultContent = {
                privacy: 'This is the privacy policy page. Add your privacy policy content here.',
                terms: 'This is the terms and conditions page. Add your terms content here.',
                contact: 'Contact us at: info@fluxstore.com'
            };

            page = await Page.create({
                slug,
                title: defaultTitles[slug] || slug,
                content: defaultContent[slug] || 'Content coming soon.'
            });
        }

        return JSON.parse(JSON.stringify(page));
    } catch (error) {
        console.error("Failed to fetch page:", error);
        return null;
    }
}

export async function createPage(data) {
    await dbConnect();
    try {
        // Generate slug from title if not provided
        if (!data.slug && data.title) {
            data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        }

        const page = await Page.create(data);
        revalidatePath('/admin/pages');
        return { success: true, page: JSON.parse(JSON.stringify(page)) };
    } catch (error) {
        console.error("Failed to create page:", error);
        return { success: false, error: error.message };
    }
}

export async function updatePage(slug, data) {
    await dbConnect();
    try {
        const page = await Page.findOneAndUpdate(
            { slug },
            data,
            { new: true, upsert: true }
        );
        revalidatePath(`/${slug}`);
        revalidatePath('/admin/pages');
        return { success: true, page: JSON.parse(JSON.stringify(page)) };
    } catch (error) {
        console.error("Failed to update page:", error);
        return { success: false, error: error.message };
    }
}

export async function deletePage(slug) {
    await dbConnect();
    try {
        // Prevent deletion of default pages
        const defaultPages = ['privacy', 'terms', 'contact'];
        if (defaultPages.includes(slug)) {
            return { success: false, error: 'Cannot delete default pages' };
        }

        await Page.findOneAndDelete({ slug });
        revalidatePath('/admin/pages');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete page:", error);
        return { success: false, error: error.message };
    }
}
