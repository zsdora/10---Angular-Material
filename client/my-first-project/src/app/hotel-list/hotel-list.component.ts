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
  template: `
    <app-header></app-header>
    <div class="content">
      <h2>Available Hotels</h2>
      <div class="hotel-grid">
        <mat-card *ngFor="let hotel of hotels" class="hotel-card">
          <mat-card-header>
            <mat-card-title>{{hotel.name}}</mat-card-title>
            <mat-card-subtitle>{{hotel.city}}</mat-card-subtitle>
          </mat-card-header>
          <div class="hotel-image">
            <mat-icon class="hotel-icon">apartment</mat-icon>
          </div>
          <mat-card-content>
            <p>{{hotel.description}}</p>
            <div class="amenities" *ngIf="hotel.amenities?.length">
              <span *ngFor="let amenity of hotel.amenities" class="amenity-tag">
                {{amenity}}
              </span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="viewDetails(hotel._id)">
              <mat-icon>info</mat-icon> Details
            </button>
            <button mat-button color="accent" (click)="bookHotel(hotel._id)">
              <mat-icon>book</mat-icon> Book Now
            </button>
          </mat-card-actions>
        </mat-card>
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
    .hotel-card {
      max-width: 400px;
      margin: auto;
    }
    .hotel-image {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      background-color: #f5f5f5;
      margin: 16px 0;
      border-radius: 4px;
    }
    .hotel-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #3f51b5;
    }
    .amenity-tag {
      background: #e0e0e0;
      padding: 4px 8px;
      border-radius: 16px;
      margin: 4px;
      display: inline-block;
      font-size: 12px;
    }
    mat-card-content {
      margin: 16px 0;
    }
    .amenities {
      margin-top: 8px;
    }
  `]
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];

  constructor(private hotelService: HotelService, private router: Router) {}

  ngOnInit() {
    this.hotelService.getHotels().subscribe({
      next: (hotels) => {
        console.log('Fetched hotels:', hotels);
        this.hotels = hotels;
      },
      error: (error) => console.error('Error fetching hotels:', error)
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
}
