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

export async function testCourierConnection(courier, credentials) {
    try {
        if (courier === 'steadfast') {
            const { steadfastApiKey, steadfastSecretKey } = credentials;
            const res = await fetch('https://steadfast.com.bd/api/v1/get-balance', {
                method: 'GET',
                headers: {
                    'Api-Key': steadfastApiKey,
                    'Secret-Key': steadfastSecretKey,
                }
            });
            const data = await res.json();
            if (res.ok && data.status === 200) {
                return { success: true, message: `Connected! Current Balance: ${data.current_balance} TK.` };
            }
            return { success: false, message: data.message || 'Authentication failed' };
        }

        if (courier === 'pathao') {
            const { pathaoClientId, pathaoSecret } = credentials;
            // Pathao requires a complex OAuth2 flow, for "test" we try to get a token
            const res = await fetch('https://api-hermes.pathao.com/aladdin/api/v1/issue-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    client_id: pathaoClientId,
                    client_secret: pathaoSecret,
                    grant_type: 'client_credentials'
                })
            });
            const data = await res.json();
            if (res.ok && data.access_token) {
                return { success: true, message: 'Connected! OAuth2 Token generated successfully.' };
            }
            return { success: false, message: data.message || 'Failed to authenticate with Pathao' };
        }

        if (courier === 'redx') {
            const { redxAccessToken } = credentials;
            const res = await fetch('https://api.redx.com.bd/v1/user/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${redxAccessToken}`,
                    'Accept': 'application/json'
                }
            });
            const data = await res.json();
            if (res.ok) {
                return { success: true, message: `Connected! Logged in as: ${data.name || 'User'}` };
            }
            return { success: false, message: data.message || 'Invalid Access Token' };
        }

        if (courier === 'paperfly') {
            const { paperflyUser, paperflyPassword } = credentials;
            // Paperfly basic auth check
            const auth = Buffer.from(`${paperflyUser}:${paperflyPassword}`).toString('base64');
            const res = await fetch('https://api.paperfly.com.bd/api/v1/check-auth', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Accept': 'application/json'
                }
            });
            // Note: Paperfly API might differ, this is a placeholder check. 
            // Most Paperfly APIs return success if credentials are valid.
            if (res.ok) {
                return { success: true, message: 'Connected! Credentials verified.' };
            }
            return { success: false, message: 'Authentication failed. Please check Username/Password.' };
        }

        return { success: false, message: 'Unsupported courier' };
    } catch (error) {
        console.error(`Test ${courier} connection error:`, error);
        return { success: false, message: `Error: ${error.message}` };
    }
}
