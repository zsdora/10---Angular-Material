import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header/header.component';

interface Hotel {
  name: string;
  address: string;
  city: string;
  photos: string[];
  amenities: string[];
}

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="content">
      <h2>Available Hotels</h2>
      <div class="hotel-grid">
        <!-- Existing hotel list content -->
      </div>
    </div>
  `,
  styles: [`
    .content {
      padding-top: 64px;
      margin: 20px;
    }
    .hotel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
    }
  `]
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  defaultImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

  ngOnInit(): void {
    // TODO: Replace with API call
    this.hotels = [
      {
        name: 'Ocean View Hotel',
        address: '123 Beach Road',
        city: 'Miami',
        photos: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'],
        amenities: ['Pool', 'Free WiFi', 'Spa']
      },
      {
        name: 'Mountain Resort',
        address: '456 Mountain Ave',
        city: 'Denver',
        photos: [],
        amenities: ['Restaurant', 'Hiking', 'Parking']
      }
    ];
  }

  bookHotel(hotel: Hotel) {
    // TODO: Implement booking functionality
    alert(`Booking hotel: ${hotel.name}`);
  }
}
