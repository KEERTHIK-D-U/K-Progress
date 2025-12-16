import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'traditional' | 'modern';
    title: string;
    description: string;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
    category?: string;

    // Modern AI Fields
    duration?: {
        value: number;
        unit: 'days' | 'months';
    };
    startDate?: Date;
    targetDate?: Date;
    reminderEnabled: boolean;
    motivationalEnabled: boolean;
    contactPreference?: {
        email: boolean;
        whatsapp: boolean;
    };
    milestones?: {
        title: string;
        completed: boolean;
        completedAt?: Date;
    }[];

    // Progress
    progress: number;
    streak: number;
    lastUpdated?: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'paused';
    completedAt?: Date;

    logs?: {
        date: Date;
        text: string;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}

const TodoSchema = new Schema<ITodo>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['traditional', 'modern'], required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    category: { type: String },

    duration: {
        value: Number,
        unit: { type: String, enum: ['days', 'months'] }
    },
    startDate: { type: Date },
    targetDate: { type: Date },
    reminderEnabled: { type: Boolean, default: false },
    motivationalEnabled: { type: Boolean, default: false },
    contactPreference: {
        email: { type: Boolean, default: false },
        whatsapp: { type: Boolean, default: false }
    },
    milestones: [{
        title: String,
        completed: { type: Boolean, default: false },
        completedAt: Date
    }],

    logs: [{
        date: { type: Date, default: Date.now },
        text: String
    }],

    progress: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastUpdated: { type: Date },
    status: { type: String, enum: ['pending', 'in-progress', 'completed', 'paused'], default: 'pending' },
    completedAt: { type: Date }
}, { timestamps: true });

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
