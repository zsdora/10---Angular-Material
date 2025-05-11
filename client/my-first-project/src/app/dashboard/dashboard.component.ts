import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { AuthService } from '../shared/services/auth.service';
import { BookingService } from '../shared/services/booking.service';
import { HotelService } from '../shared/services/hotel.service';
import { User } from '../shared/model/User';
import { catchError, forkJoin, map, of } from 'rxjs';

interface DashboardStats {
  hotels?: number;
  bookings?: number;
  users?: number;
  myBookings?: number;
  nextBooking?: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    HeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Store current user info
  user?: User;
  stats: DashboardStats = {};

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  // Load current user details
  private loadUserInfo(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.loadStats();
      },
      error: (error) => {
        console.error('Error loading user info:', error);
      }
    });
  }

  private loadStats(): void {
    if (this.user?.role === 'admin') {
      this.loadAdminStats();
    } else {
      this.loadUserStats();
    }
  }

  private loadAdminStats(): void {
    forkJoin({
      hotels: this.hotelService.getAllHotels().pipe(map(hotels => hotels.length)),
      bookings: this.bookingService.getAllBookings().pipe(map(bookings => bookings.length)),
      users: this.authService.getUsers().pipe(map(users => users.length))
    }).pipe(
      catchError(error => {
        console.error('Error loading admin stats:', error);
        return of({ hotels: 0, bookings: 0, users: 0 });
      })
    ).subscribe(stats => {
      this.stats = stats;
    });
  }

  private loadUserStats(): void {
    this.bookingService.getUserBookings().pipe(
      map(bookings => {
        const activeBookings = bookings.filter(b => b.status !== 'cancelled');
        const futureBookings = activeBookings.filter(b => new Date(b.check_in) > new Date());
        const nextBooking = futureBookings.length > 0
          ? new Date(Math.min(...futureBookings.map(b => new Date(b.check_in).getTime())))
          : undefined;

        return {
          myBookings: activeBookings.length,
          nextBooking: nextBooking
        };
      }),
      catchError(error => {
        console.error('Error loading user stats:', error);
        return of({ myBookings: 0 });
      })
    ).subscribe(stats => {
      this.stats = stats;
    });
  }
}
