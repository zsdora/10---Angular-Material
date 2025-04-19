"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hotel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const HotelSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: String, required: false },
    city: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: false },
    description: { type: String, required: false },
    amenities: [{ type: String }],
    photos: { type: String, required: false }
});
exports.Hotel = mongoose_1.default.model('Hotel', HotelSchema);
