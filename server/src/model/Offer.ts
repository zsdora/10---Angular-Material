import mongoose, { Document, Model, Schema } from 'mongoose';

interface IOffer extends Document {
    hotel_id: mongoose.Types.ObjectId;
    room_type: number;
    from: Date;
    to: Date;
    price: number;
    description?: string;
    photos?: string;
    amenities?: string;
    is_active: boolean;
    available_rooms: number;
}

const OfferSchema: Schema<IOffer> = new mongoose.Schema({
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    room_type: { type: Number, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    photos: { type: String, required: false },
    amenities: { type: String, required: false },
    is_active: { type: Boolean, default: true },
    available_rooms: { type: Number, required: true }
});

export const Offer: Model<IOffer> = mongoose.model<IOffer>('Offer', OfferSchema);
