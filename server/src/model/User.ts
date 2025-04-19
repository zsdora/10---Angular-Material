import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_FACTOR = 10;

interface IUser extends Document {
    email: string;
    name?: string;
    address?: string;
    nickname?: string;
    password: string;
    role: 'admin' | 'user';
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: false },
    address: { type: String, required: false },
    nickname: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user', required: true } // Szerepkör mező
});

// Ellenőrzi, hogy az email cím már létezik-e
UserSchema.pre<IUser>('save', function(next) {
    const user = this;
    
    // Csak akkor hashelje a jelszót, ha az megváltozott
    if (!user.isModified('password')) return next();
    
    bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt.hash(user.password, salt, (err, encrypted) => {
            if (err) {
                return next(err);
            }
            user.password = encrypted;
            next();
        });
    });
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);