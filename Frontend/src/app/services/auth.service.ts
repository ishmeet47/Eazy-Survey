import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { Group, GroupResponse } from '../interfaces/SurveyGroup';
import { LoginResponse } from '../modules/login.module';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_TYPE_KEY = 'user_type';

  ///
  private readonly USER_ID = 'user_id';
  ///

  private baseUrl = 'http://localhost:5225'; // Your API's base URL, adjust if different
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private readonly USER_GROUP_KEY = 'userGroups';

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, { username, password })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_TYPE_KEY, response.userType);
          if (response.groupIds && response.groupIds.$values) {
            localStorage.setItem(
              'userGroups',
              JSON.stringify(response.groupIds.$values)
            );
          }
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

  // getGroupsByShareId(shareId: number): Observable<string[]> {
  //   return this.http.get<string[]>(`${this.baseUrl}/group/getgroupsbysurvey/${shareId}`);
  // }

  getGroupsByShareId(shareId: number): Observable<Group[]> {
    return this.http
      .get<GroupResponse>(`${this.baseUrl}/group/getgroupsbysurvey/${shareId}`)
      .pipe(
        tap((response) => console.log('API response:', response)),
        map((response) => response.$values) // Extract the array of groups from the response
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_TYPE_KEY);
    localStorage.removeItem(this.USER_GROUP_KEY);
    this.loggedIn.next(false);
  }
}
