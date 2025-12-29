import mongoose from 'mongoose';

const IncompleteOrderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    area: {
        type: String,
        enum: ['inside-dhaka', 'outside-dhaka'],
        default: 'inside-dhaka'
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
            type: Number,
            required: true,
        }
    }],
    totalAmount: {
        type: Number,
        default: 0
    },
    deliveryCharge: {
        type: Number,
        default: 0
    },
    orderNote: {
        type: String,
        default: ''
    },
}, { timestamps: true });

export default mongoose.models.IncompleteOrder || mongoose.model('IncompleteOrder', IncompleteOrderSchema);
