import mongoose, { Document, Model, Schema } from 'mongoose';

interface IHotel extends Document {
    name: string;
    street: string;
    number: string;
    city: string;
    rating: number;
    description?: string;
    amenities: string[];
    photos: string;
}

const HotelSchema: Schema<IHotel> = new mongoose.Schema({
    name: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: String, required: false },
    city: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: false },
    description: { type: String, required: false },
    amenities: [{ type: String }],
    photos: { type: String, required: false }
});

export const Hotel: Model<IHotel> = mongoose.model<IHotel>('Hotel', HotelSchema);
