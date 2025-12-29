'use server'

import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { revalidatePath } from "next/cache";

export async function getSettings() {
    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({});
    }

    // Ensure default values for new fields on existing records
    const defaultSettings = {};

    const finalSettings = { ...defaultSettings, ...JSON.parse(JSON.stringify(settings)) };
    return finalSettings;
}

export async function updateSettings(data) {
    try {
        await dbConnect();

        // Ensure there's only one settings document
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(data);
        } else {
            Object.assign(settings, data);
        }

        await settings.save();
        revalidatePath('/', 'layout');
        return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
    } catch (error) {
        console.error("Update settings error:", error);
        return { success: false, error: error.message };
    }
}
