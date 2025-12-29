
import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'My Shop' },
    logoUrl: { type: String, default: '' },
    facebookPixelId: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    deliveryChargeInsideDhaka: { type: Number, default: 60 },
    deliveryChargeOutsideDhaka: { type: Number, default: 110 },
    steadfastApiKey: { type: String, default: '' },
    steadfastSecretKey: { type: String, default: '' },

    // Pathao
    pathaoClientId: { type: String, default: '' },
    pathaoSecret: { type: String, default: '' },

    // RedX
    redxAccessToken: { type: String, default: '' },

    // Paperfly
    paperflyUser: { type: String, default: '' },
    paperflyPassword: { type: String, default: '' },

}, { timestamps: true });

// We only need one settings document, so we can check if one exists or create a singleton
export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
