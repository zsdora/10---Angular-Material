import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss'
})
export class HotelListComponent implements OnInit {
  hotels: any[] = [];
  defaultImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

  ngOnInit(): void {
    // TODO: csere API hívásra!
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

  bookHotel(hotel: any) {
    // Itt lehet majd foglaló oldalra navigálni vagy modalt nyitni
    alert(`Booking hotel: ${hotel.name}`);
  }
}
