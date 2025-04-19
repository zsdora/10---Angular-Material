"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OfferSchema = new mongoose_1.default.Schema({
    hotel_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Hotel', required: true },
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
exports.Offer = mongoose_1.default.model('Offer', OfferSchema);
