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
        required: true,
        default: ''
    },
}, {
    timestamps: true
});

// Force delete the old model to ensure schema updates
if (mongoose.models.Page) {
    delete mongoose.models.Page;
}

export default mongoose.model('Page', PageSchema);
