import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    },
    type: {
        type: String,
        enum: ['order_new', 'order_status', 'info'],
        default: 'info',
    },
    link: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
