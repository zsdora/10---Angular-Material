import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { HotelService } from '../shared/services/hotel.service';
import { Hotel } from '../shared/model/Hotel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    HeaderComponent
  ],
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss'],
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  errorLoadingImage = false;
  private verifiedImages: Map<string, boolean> = new Map();


  constructor(private hotelService: HotelService, private router: Router) {}

  async ngOnInit() {
    this.hotelService.getAllHotels().subscribe(hotels => {
      this.hotels = hotels;
      // Add debug logging
      this.hotels?.forEach(async (hotel) => {
        if (hotel.photos) {
          const path = this.getImagePath(hotel.photos);
          try {
            const response = await fetch(path);
            this.verifiedImages.set(path, response.ok);
          } catch {
            this.verifiedImages.set(path, false);
          }
        }
      });
    });

    console.log('Checking image path...');
  fetch('/assets/images/1.jpg')
    .then(response => {
      console.log('Image fetch response:', response.status, response.statusText);
    })
    .catch(error => {
      console.error('Image fetch error:', error);
    });
  }

  viewDetails(hotelId: string | undefined): void {
    if (hotelId) {
      this.router.navigate(['/hotels', hotelId]);
    }
  }

  bookHotel(hotelId: string | undefined): void {
    if (hotelId) {
      this.router.navigate(['/booking', hotelId]);
    }
  }

  getImagePath(photoData: any): string {
    if (!photoData) return '';

    let filename = '';
    if (typeof photoData === 'string') {
      filename = photoData;
    } else if (photoData.filename) {
      filename = photoData.filename;
    }

    if (!filename) return '';

    return `assets/images/${filename.trim()}`;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    this.verifiedImages.set(imgElement.src, false);
    this.errorLoadingImage = true;
  }

  isImageVerified(path: string): boolean {
    return this.verifiedImages.get(path) || false;
  }
}
