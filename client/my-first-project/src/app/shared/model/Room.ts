export interface Room {
  _id: string;
  hotel_id: string;
  price: number;
  amenities: string[];
  description?: string;
  photos: string[];
  room_type: number;
}
