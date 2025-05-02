import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { HotelService } from '../shared/services/hotel.service';
import { RoomService } from '../shared/services/room.service';
import { BookingService } from '../shared/services/booking.service';
import { Hotel } from '../shared/model/Hotel';
import { Room } from '../shared/model/Room';
import { Booking } from '../shared/model/Booking';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    HeaderComponent
  ],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss']
})
export class HotelDetailsComponent implements OnInit {
  hotel: Hotel | null = null;
  showFallbackIcon = false;
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  minDate = new Date();
  availableRooms: Room[] = [];
  numberOfNights = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private roomService: RoomService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
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

  onImageError(event: Event): void {
    this.showFallbackIcon = true;
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.style.display = 'none';
    }
  }

  get minCheckOutDate(): Date {
    if (this.checkInDate) {
      const date = new Date(this.checkInDate);
      date.setDate(date.getDate() + 1);
      return date;
    }
    return this.minDate;
  }

  searchAvailableRooms() {
    if (!this.checkInDate || !this.checkOutDate || !this.hotel?._id) {
      this.snackBar.open('Please select both check-in and check-out dates', 'Close', { duration: 3000 });
      return;
    }

    this.numberOfNights = Math.ceil(
      (this.checkOutDate.getTime() - this.checkInDate.getTime()) / (1000 * 3600 * 24)
    );

    this.roomService.getAvailableRooms(
      this.hotel._id, // Now safe because we checked for null above
      this.checkInDate,
      this.checkOutDate
    ).subscribe({
      next: (rooms: Room[]) => {
        this.availableRooms = rooms;
      },
      error: (error: Error) => {
        console.error('Error fetching available rooms:', error);
        this.snackBar.open('Error fetching available rooms', 'Close', { duration: 3000 });
      }
    });
  }

  bookRoom(room: Room) {
    if (!this.hotel?._id || !this.checkInDate || !this.checkOutDate) {
        this.snackBar.open('Missing required booking information', 'Close', { duration: 3000 });
        return;
    }

    const booking: Partial<Booking> = {
        hotel_id: {
            _id: this.hotel._id,
            name: this.hotel.name,
            city: this.hotel.city
        },
        room_id: {
            _id: room._id,
            room_type: room.room_type, // Now passing string directly
            price: room.price
        },
        check_in: this.checkInDate,
        check_out: this.checkOutDate,
        status: 'confirmed',
        total_price: room.price * this.numberOfNights
    };

    console.log('Sending booking request:', booking);

    this.bookingService.createBooking(booking).subscribe({
        next: (response: Booking) => {
            console.log('Booking created:', response);
            this.snackBar.open('Booking successful!', 'Close', { duration: 3000 });
            this.router.navigate(['/bookings']);
        },
        error: (error) => {
            console.error('Error details:', error);
            const errorMessage = error.error?.message || 'Error creating booking';
            this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
        }
    });
}

}
