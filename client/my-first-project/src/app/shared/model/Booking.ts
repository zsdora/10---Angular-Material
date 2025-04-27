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
    room_type: number;
    price: number;
  };
  check_in: Date;
  check_out: Date;
  status: string;
}
