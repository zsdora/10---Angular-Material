import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Booking } from '../model/Booking';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';


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

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.error.message || 'An error occurred'));
}

  createBooking(booking: Partial<Booking>): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/app/bookings`, booking, {
        withCredentials: true
    });
  }

  cancelBooking(bookingId: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/app/bookings/${bookingId}/cancel`, {}, {
        withCredentials: true
    }).pipe(
        tap(response => console.log('Cancel booking response:', response)),
        catchError(this.handleError)
    );
}


  getBookingById(bookingId: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/app/bookings/${bookingId}`, {
      withCredentials: true
    });
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/app/bookings/all`, {
        withCredentials: true
    });
  }
}

