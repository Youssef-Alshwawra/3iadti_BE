import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});
export default mongoose.model('Patient', patientSchema);