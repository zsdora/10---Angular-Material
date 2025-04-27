import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/app/login`,
      { email, password },
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  register(user: User) {
    return this.http.post(`${this.apiUrl}/app/register`,
      user,
      {
        withCredentials: true,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/app/logout`, {},
      {
        withCredentials: true,
        responseType: 'text'
      }
    );
  }

  checkAuth() {
    return this.http.get<boolean>(`${this.apiUrl}/app/checkAuth`,
      {
        withCredentials: true
      }
    );
  }

  getUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/app/users`, {
      withCredentials: true
    });
  }

  getCurrentUser() {
    return this.http.get<User>(`${this.apiUrl}/app/users/profile`, {
        withCredentials: true,
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    });
}

  getUserBookings() {
    return this.http.get<any[]>(`${this.apiUrl}/app/users/bookings`, {
      withCredentials: true
    });
  }

  updateProfile(profileData: any) {
    return this.http.put(`${this.apiUrl}/app/users/profile`, profileData, {
      withCredentials: true
    });
  }

  changePassword(passwordData: any) {
    return this.http.put(`${this.apiUrl}/app/users/password`, passwordData, {
      withCredentials: true
    });
  }

  updateNotifications(notificationSettings: any) {
    return this.http.put(`${this.apiUrl}/app/users/notifications`, notificationSettings, {
      withCredentials: true
    });
  }

}
