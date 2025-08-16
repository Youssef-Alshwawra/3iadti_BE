import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    dayOfWeek: {
        type: Number, // 0-6 (Sunday-Saturday)
        required: true
    },
    slots: [{
        startTime: String,
        endTime: String,
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Schedule', scheduleSchema);