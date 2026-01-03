import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: ''
    },
}, {
    timestamps: true
});

// Force delete the old model to ensure schema updates
export default mongoose.models.Page || mongoose.model('Page', PageSchema);
