import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../modules/user.module';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = 'http://localhost:5225';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

addUser(username: string): Observable<void> {
    return this.http.post<void>('/api/users', { username });
}

deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${userId}`);
}

  // Create a new user
  createUser(username: string, password: string): Observable<any> {
    const userData = {
      username: username,
      password: password // NOTE: In a real-world scenario, ensure this is hashed at the server side.
    };

    return this.http.post<any>(`${this.baseUrl}/user/create`, userData);
  }
}
