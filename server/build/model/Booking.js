"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel_id: {
        _id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Hotel', required: true },
        name: { type: String, required: true },
        city: { type: String, required: true }
    },
    room_id: {
        _id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Room', required: true },
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
exports.Booking = mongoose_1.default.model('Booking', bookingSchema);
