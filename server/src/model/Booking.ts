import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBooking extends mongoose.Document {
    user_id: mongoose.Types.ObjectId;
    hotel_id: {
        _id: mongoose.Types.ObjectId;
        name: string;
        city: string;
    };
    room_id: {
        _id: mongoose.Types.ObjectId;
        room_type: string;
        price: number;
    };
    check_in: Date;
    check_out: Date;
    status: 'pending' | 'confirmed' | 'cancelled';
    total_price: number;
}

const bookingSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    hotel_id: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
        name: { type: String, required: true },
        city: { type: String, required: true }
    },
    room_id: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
        room_type: { type: String, required: true },
        price: { type: Number, required: true }
    },
    check_in: { type: Date, required: true },
    check_out: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled'], 
        default: 'pending' 
    },
    total_price: { type: Number, required: true }
});

export const Booking = mongoose.model('Booking', bookingSchema);

