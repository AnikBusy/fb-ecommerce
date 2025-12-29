
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
    },
    stock: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
    },
    images: [{
        type: String, // URLs
    }],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isBestSelling: {
        type: Boolean,
        default: false,
    },
    isPromotional: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
