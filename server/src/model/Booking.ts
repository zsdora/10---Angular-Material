import mongoose, { Document, Model, Schema } from 'mongoose';

interface IBooking extends Document {
    user_id: mongoose.Types.ObjectId;
    hotel_id: mongoose.Types.ObjectId;
    room_id: mongoose.Types.ObjectId;
    check_in: Date;
    check_out: Date;
    price: number;
    status: string;
}

const BookingSchema: Schema<IBooking> = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    check_in: { type: Date, required: true },
    check_out: { type: Date, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: 'aktív', required: true }
});

export const Booking: Model<IBooking> = mongoose.model<IBooking>('Booking', BookingSchema);
