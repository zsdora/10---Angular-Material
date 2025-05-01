"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
    hotel_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    room_type: {
        type: String, // Changed from Number to String
        required: true,
        enum: ['Single', 'Double', 'Suite', 'Deluxe'] // Added room type options
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Booked', 'Maintenance', 'Cleaning'],
        default: 'Available'
    },
    amenities: [{ type: String }],
    description: { type: String, required: false },
    photos: [{ type: String }]
}, {
    timestamps: true // Added timestamps
});
exports.Room = mongoose_1.default.model('Room', RoomSchema);
