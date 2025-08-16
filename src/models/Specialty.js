import mongoose from 'mongoose';

const specialtySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    icon: String
}, {
    timestamps: true
});

export default mongoose.model('Specialty', specialtySchema);