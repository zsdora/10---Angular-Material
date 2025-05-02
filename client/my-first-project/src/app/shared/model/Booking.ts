export interface Booking {
  _id: string;
  user_id: string;
  hotel_id: {
    _id: string;
    name: string;
    city: string;
  };
  room_id: {
    _id: string;
    room_type: string;
    price: number;
  }
  check_in: Date;
  check_out: Date;
  status: 'confirmed' | 'cancelled';
  total_price: number;
}
