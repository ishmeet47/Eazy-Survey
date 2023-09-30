import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = 'https://yourbackendapiurl/api/users';

  constructor(private http: HttpClient) { }

  // Create a new user
  createUser(username: string, password: string): Observable<any> {
    const userData = {
      username: username,
      password: password // NOTE: In a real-world scenario, ensure this is hashed at the server side.
    };

    return this.http.post(this.baseUrl, userData);
  }
}
