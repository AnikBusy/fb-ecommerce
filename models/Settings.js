
import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'My Shop' },
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    googleAnalyticsId: { type: String, default: '' },
    facebookPixelId: { type: String, default: '' },
    facebookAccessToken: { type: String, default: '' },
    isPixelActive: { type: Boolean, default: false },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    tiktokUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    deliveryChargeInsideDhaka: { type: Number, default: 60 },
    deliveryChargeOutsideDhaka: { type: Number, default: 110 },
    steadfastApiKey: { type: String, default: '' },
    steadfastSecretKey: { type: String, default: '' },
    steadfastEnabled: { type: Boolean, default: false },

    // Pathao
    pathaoClientId: { type: String, default: '' },
    pathaoSecret: { type: String, default: '' },
    pathaoEnabled: { type: Boolean, default: false },

    // RedX
    redxAccessToken: { type: String, default: '' },
    redxEnabled: { type: Boolean, default: false },

    // Paperfly
    paperflyUser: { type: String, default: '' },
    paperflyPassword: { type: String, default: '' },
    paperflyEnabled: { type: Boolean, default: false },

}, { timestamps: true });

// We only need one settings document, so we can check if one exists or create a singleton
export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
