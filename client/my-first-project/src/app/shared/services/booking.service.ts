import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../model/Booking';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/app/bookings`, {
        withCredentials: true
    });
  }

  createBooking(bookingData: Partial<Booking>): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/app/bookings`, bookingData, {
      withCredentials: true
    });
  }

  cancelBooking(bookingId: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/app/bookings/${bookingId}/cancel`, {}, {
        withCredentials: true
    });
}

  getBookingById(bookingId: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/app/bookings/${bookingId}`, {
      withCredentials: true
    });
  }
}
