import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from '../model/Hotel';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getHotels(): Observable<Hotel[]> {
    // Note: The /app prefix is added by the router in index.ts
    return this.http.get<Hotel[]>(`${this.apiUrl}/app/hotels`, {
      withCredentials: true
    });
  }

  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/app/hotels/${id}`, {
      withCredentials: true
    });
  }
}
