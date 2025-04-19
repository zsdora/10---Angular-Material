import mongoose, { Document, Model, Schema } from 'mongoose';

interface IRoom extends Document {
    hotel_id: mongoose.Types.ObjectId;
    price: number;
    amenities: string[];
    description?: string;
    photos: string[];
    room_type: number;
}

const RoomSchema: Schema<IRoom> = new mongoose.Schema({
    hotel_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    price: { type: Number, required: true },
    amenities: [{ type: String }],
    description: { type: String, required: false },
    photos: [{ type: String }],
    room_type: { type: Number, required: true }
});

export const Room: Model<IRoom> = mongoose.model<IRoom>('Room', RoomSchema);
