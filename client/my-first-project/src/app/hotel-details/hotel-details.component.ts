import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { HotelService } from '../shared/services/hotel.service';
import { Hotel } from '../shared/model/Hotel';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent
  ],
  template: `
    <app-header></app-header>
    <div class="content" *ngIf="hotel">
      <mat-card class="hotel-detail-card">
        <mat-card-header>
          <mat-card-title>{{hotel.name}}</mat-card-title>
          <mat-card-subtitle>{{hotel.city}}</mat-card-subtitle>
        </mat-card-header>

        <div class="hotel-image">
          <img *ngIf="hotel.imageUrl" [src]="hotel.imageUrl" [alt]="hotel.name">
          <mat-icon *ngIf="!hotel.imageUrl" class="hotel-icon">apartment</mat-icon>
        </div>

        <mat-card-content>
          <h3>Description</h3>
          <p>{{hotel.description}}</p>

          <h3>Amenities</h3>
          <div class="amenities" *ngIf="hotel.amenities?.length">
            <span *ngFor="let amenity of hotel.amenities" class="amenity-tag">
              {{amenity}}
            </span>
          </div>

          <div class="hotel-info">
            <p><strong>Address:</strong> {{hotel.address}}</p>
            <p *ngIf="hotel.rating"><strong>Rating:</strong> {{hotel.rating}} / 5</p>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon> Back
          </button>
          <button mat-raised-button color="accent" (click)="bookHotel()">
            <mat-icon>book</mat-icon> Book Now
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .content {
      padding: 20px;
      max-width: 800px;
      margin: 64px auto;
    }
    .hotel-detail-card {
      padding: 20px;
    }
    .hotel-image {
      height: 300px;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 16px 0;
      border-radius: 4px;
      overflow: hidden;
    }
    .hotel-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .hotel-icon {
      font-size: 96px;
      width: 96px;
      height: 96px;
      color: #3f51b5;
    }
    .amenity-tag {
      background: #e0e0e0;
      padding: 6px 12px;
      border-radius: 16px;
      margin: 4px;
      display: inline-block;
    }
    .hotel-info {
      margin-top: 20px;
    }
    mat-card-actions {
      padding: 16px;
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class HotelDetailsComponent implements OnInit {
  hotel: Hotel | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.hotelService.getHotelById(id).subscribe({
        next: (hotel) => this.hotel = hotel,
        error: (error) => console.error('Error fetching hotel:', error)
      });
    }
  }

  goBack() {
    this.router.navigate(['/hotels']);
  }

  bookHotel() {
    // TODO: Implement booking functionality
    console.log('Booking hotel:', this.hotel?._id);
  }
}
