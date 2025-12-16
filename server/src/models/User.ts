import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    preferences: {
        reminderTime: { type: String, default: '09:00' },
        whatsappEnabled: { type: Boolean, default: false },
        emailEnabled: { type: Boolean, default: true },
        theme: { type: String, default: 'light' }
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema, 'userCredential');
