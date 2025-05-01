import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../model/Room';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/app/rooms`, {
        withCredentials: true
    });
  }

  deleteRoom(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/app/rooms/${id}`, {
      withCredentials: true
    });
  }

  getRoomsByHotel(hotelId: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/app/hotels/${hotelId}/rooms`, {
      withCredentials: true
    });
  }

  createRoom(room: any): Observable<any> {
    console.log('Creating room with data:', room);
    return this.http.post<Room>(`${this.apiUrl}/app/rooms`, room, {
      withCredentials: true
    });
  }

  updateRoom(id: string, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/app/rooms/${id}`, room, {
      withCredentials: true
    });
  }
}
