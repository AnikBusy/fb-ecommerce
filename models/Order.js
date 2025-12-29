
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        enum: ['inside-dhaka', 'outside-dhaka'],
        required: true,
    },
    deliveryCharge: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number, // Price at time of order
            required: true,
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned', 'partial-returned'],
        default: 'pending',
    },
    courierName: { type: String, default: '' },
    trackingId: { type: String, default: '' },
    adminNote: { type: String, default: '' },
    orderNote: { type: String, default: '' },
    confirmedBy: { type: String, default: '' },
    shippedBy: { type: String, default: '' },
    deliveredBy: { type: String, default: '' },
    cancelledBy: { type: String, default: '' },
    returnedBy: { type: String, default: '' },
    lastUpdatedBy: { type: String, default: '' },
}, { timestamps: true });

if (mongoose.models.Order) {
    delete mongoose.models.Order;
}
export default mongoose.model('Order', OrderSchema);
