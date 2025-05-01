import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IRoom extends Document {
    hotel_id: mongoose.Types.ObjectId;
    room_type: string;  // Changed from number to string
    price: number;
    status: string;     // Added status field
    amenities: string[];
    description?: string;
    photos: string[];
}

const RoomSchema: Schema<IRoom> = new mongoose.Schema({
    hotel_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hotel', 
        required: true 
    },
    room_type: { 
        type: String,   // Changed from Number to String
        required: true,
        enum: ['Single', 'Double', 'Suite', 'Deluxe']  // Added room type options
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 
    },
    status: {          // Added status field
        type: String,
        required: true,
        enum: ['Available', 'Booked', 'Maintenance', 'Cleaning'],
        default: 'Available'
    },
    amenities: [{ type: String }],
    description: { type: String, required: false },
    photos: [{ type: String }]
}, {
    timestamps: true   // Added timestamps
});

export const Room: Model<IRoom> = mongoose.model<IRoom>('Room', RoomSchema);