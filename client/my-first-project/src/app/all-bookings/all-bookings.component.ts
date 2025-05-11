import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { BookingService } from '../shared/services/booking.service';
import { Booking } from '../shared/model/Booking';

@Component({
  selector: 'app-all-bookings',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatTableModule,
    MatIconModule,
    MatButtonModule
    ],
  templateUrl: './all-bookings.component.html',
  styleUrls: ['./all-bookings.component.scss']
})
export class AllBookingsComponent implements OnInit {
  displayedColumns: string[] = ['check_in', 'check_out', 'guest', 'hotel', 'price', 'status', 'actions'];
  dataSource = new MatTableDataSource<Booking>([]);

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.loadBookings();
  }

  // Fetch all bookings
  loadBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.dataSource.data = bookings;
        console.log('Loaded bookings:', bookings);
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
      }
    });
  }

  // Cancel booking and refresh the list
  cancelBooking(bookingId: string) {
    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        this.loadBookings(); // Reload bookings after cancellation
      },
      error: (error) => {
        console.error('Error cancelling booking:', error);
      }
    });
  }
}
