import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header/header.component';

interface Booking {
  id: string;
  hotelName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="content">
      <h2>Your Bookings</h2>
      <div class="bookings-container">
        <p *ngIf="bookings.length === 0">No bookings found.</p>
        <!-- Add booking list content here -->
      </div>
    </div>
  `,
  styles: [`
    .content {
      padding-top: 64px;
      margin: 20px;
    }
    .bookings-container {
      padding: 20px;
    }
  `]
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];

  ngOnInit(): void {
    // TODO: Replace with API call
    this.bookings = [
      {
        id: '1',
        hotelName: 'Ocean View Hotel',
        checkIn: new Date('2024-05-01'),
        checkOut: new Date('2024-05-05'),
        guests: 2,
        totalPrice: 800,
        status: 'confirmed'
      }
    ];
  }

  cancelBooking(bookingId: string) {
    // TODO: Implement cancellation logic
    console.log(`Cancelling booking: ${bookingId}`);
  }
}
