import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card_at_clinic', 'bank_transfer'],
        default: 'cash'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentDate: {
        type: Date,
        default: null
    },
    refundReason: {
        type: String,
        default: null
    },
    refundDate: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

export default mongoose.model('Payment', paymentSchema);