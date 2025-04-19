"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
    hotel_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    price: { type: Number, required: true },
    amenities: [{ type: String }],
    description: { type: String, required: false },
    photos: [{ type: String }],
    room_type: { type: Number, required: true }
});
exports.Room = mongoose_1.default.model('Room', RoomSchema);
