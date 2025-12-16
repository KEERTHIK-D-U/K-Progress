import mongoose, { Document, Schema } from 'mongoose';

export interface ILongTermTask extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    title: string;
    description?: string;
    startDate?: Date;
    completedAt: Date;
    learning: string;
}

const LongTermTaskSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date },
    completedAt: { type: Date, default: Date.now },
    learning: { type: String, required: true }
}, {
    collection: 'longTermTask' // Explicit collection name as requested
});

export const LongTermTask = mongoose.model<ILongTermTask>('LongTermTask', LongTermTaskSchema);
