import mongoose from "mongoose";
const medicalRecordSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    prescription: {
        type: String
    },
    visitDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});
export default mongoose.model('MedicalRecord', medicalRecordSchema);