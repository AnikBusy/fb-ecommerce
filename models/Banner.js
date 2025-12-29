import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        enum: ['hero', 'promo'],
        default: 'hero',
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
