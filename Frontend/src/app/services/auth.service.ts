import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLES_KEY = 'user_roles';  // Name of the key you want to use for the roles in local storage

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string, roles: string[] }>('YOUR_API_ENDPOINT_HERE', { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.ROLES_KEY, JSON.stringify(response.roles));  // Store the roles in local storage upon successful login
        })
      );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token != null;
  }

  getUserRoles(): string[] {
    const roles = localStorage.getItem(this.ROLES_KEY);
    return roles ? JSON.parse(roles) : [];  // Parse the roles from local storage and return them
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLES_KEY);  // Remove the roles from local storage when user logs out
  }
}
