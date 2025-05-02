import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BookingService } from '../shared/services/booking.service';

interface Booking {
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
  };
  check_in: Date;
  check_out: Date;
  status: string;
}

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    console.log('Attempting to load bookings...'); // Add debug log
    this.bookingService.getUserBookings().subscribe({
      next: (bookings) => {
        console.log('Received bookings:', bookings);
        this.bookings = bookings;
      },
      error: (error) => {
        if (error.status === 401) {
          console.error('Not authenticated - please log in');
          // Redirect to login page or show login dialog
        } else {
          console.error('Error details:', {
            status: error.status,
            message: error.message,
            url: error.url,
            error: error.error
          });
        }
      }
    });
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
        this.bookingService.cancelBooking(bookingId).subscribe({
            next: (updatedBooking) => {
                console.log('Booking cancelled:', updatedBooking);
                // Update the booking in the list immediately
                this.bookings = this.bookings.map(booking =>
                    booking._id === bookingId
                        ? { ...booking, status: 'cancelled' }
                        : booking
                );
                alert('Booking cancelled successfully');
            },
            error: (error) => {
                console.error('Error cancelling booking:', error);
                alert(error.error?.message || 'Failed to cancel booking. Please try again.');
            }
        });
    }
}
}
