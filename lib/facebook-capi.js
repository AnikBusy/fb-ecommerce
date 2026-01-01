import { getSettings } from "@/actions/settings";

export async function sendPurchaseEvent(order) {
    const settings = await getSettings();
    const pixelId = settings.facebookPixelId;
    const accessToken = settings.facebookAccessToken;

    if (!pixelId || !accessToken) {
        console.warn('Facebook CAPI: Missing credentials in Settings');
        return;
    }

    try {
        const eventData = {
            data: [
                {
                    event_name: 'Purchase',
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: 'website',
                    user_data: {
                        ph: order.phone ? hashData(order.phone) : undefined,
                        // fbp and fbc should be extracted from cookies if available, 
                        // but for simplicity we'll rely on phone match for now.
                    },
                    custom_data: {
                        currency: 'BDT',
                        value: order.totalAmount,
                        order_id: order._id,
                        content_ids: order.products.map(p => p.product),
                        content_type: 'product',
                        num_items: order.products.reduce((acc, p) => acc + p.quantity, 0)
                    }
                }
            ]
        };

        const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });

        const data = await response.json();
        if (data.error) {
            console.error('Facebook CAPI Error:', data.error);
        } else {
            console.log('Facebook CAPI Success:', data);
        }
    } catch (error) {
        console.error('Facebook CAPI Request Failed:', error);
    }
}

// Simple SHA-256 hash function for user data
function hashData(data) {
    // In a real Node environment, use crypto. 
    // This is a placeholder or basic implementation if crypto is not available, 
    // but typically we should use built-in crypto module.
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
}
