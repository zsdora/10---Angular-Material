export interface Hotel {
  _id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  amenities?: string[];
  rating?: number;
  imageUrl?: string;
}
