import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    // OTP fields for email verification
    emailVerificationOTP: {
        type: String,
        default: null
    },
    emailVerificationOTPExpires: {
        type: Date,
        default: null
    },
    // OTP fields for password reset
    passwordResetOTP: {
        type: String,
        default: null
    },
    passwordResetOTPExpires: {
        type: Date,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);