export interface Hotel {
  _id?: string;
  name: string;
  city: string;
  street: string;
  number: string;
  address?: string;  // Added for backward compatibility
  description?: string;
  amenities: string[];
  rating?: number;
  photos: string;
  imageUrl?: string;  // Added for backward compatibility
}
