import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${this.apiUrl}/app/users`, {
      withCredentials: true
    });
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/app/users/${id}`, {
      withCredentials: true
    });
  }
}
