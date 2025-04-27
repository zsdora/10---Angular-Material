import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_FACTOR = 10;

interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    name?: string;
    address?: string;
    nickname?: string;
    password: string;
    role: 'admin' | 'user';
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true 
    },
    name: { type: String, required: false },
    address: { type: String, required: false },
    nickname: { type: String, required: false },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'user'], 
        default: 'user', 
        required: true 
    }
}, {
    _id: true,
    collection: 'User' // Force collection name to be 'User'
});

UserSchema.index({ email: 1 }, { unique: true });

// Ellenőrzi, hogy az email cím már létezik-e
UserSchema.pre<IUser>('save', async function(next) {
    try {
        const user = this;
        if (!user.isModified('password')) return next();
        
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        return next(error as Error);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);