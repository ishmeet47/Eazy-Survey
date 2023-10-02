import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_TYPE_KEY = 'user_type';
  private baseUrl = 'http://localhost:5225';  // Your API's base URL, adjust if different
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string): Observable<{ token: string, userType: string }> {
    return this.http.post<{ token: string, userType: string }>(`${this.baseUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_TYPE_KEY, response.userType);
          this.loggedIn.next(true);
        })
      );
  }

  isAuthenticated(): boolean {
    return this.loggedIn.value;
  }

  getUserType(): string {
    return localStorage.getItem(this.USER_TYPE_KEY) ?? '';
  }


  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_TYPE_KEY);
    this.loggedIn.next(false);
  }
}
