import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../modules/user.module';
import { Group } from '../modules/group.module'; // Assuming you have a Group model
import { map, tap } from 'rxjs/operators';
import { AlertService } from './alert.service'; // Adjust the import path accordingly

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = 'http://localhost:5225';

  constructor(private http: HttpClient, private alertService: AlertService) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/user/getusers`);
  }

  addUser(
    username: string,
    password: string,
    groupId?: number
  ): Observable<void> {
    const userPayload = {
      username: username,
      password: password, // Hash this server-side
      groupId: groupId,
    };
    return this.http.post<void>(`${this.baseUrl}/user/adduser`, userPayload).pipe(
      tap(() => {
        this.alertService.success('User added successfully!');
      })
    );
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/deleteuser/${userId}`).pipe(
      tap(() => {
        this.alertService.success('User deleted successfully!');
      })
    );
  }

  // Update a user's details
  updateUser(user: User): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/user/updateuser/${user.id}`,
      user).pipe(
        tap(() => {
          this.alertService.success('User updated successfully!');
        })
      );
  }

  // Create a new user
  createUser(payload: {
    username: string;
    password: string;
    groupIds: number[];
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/user/create`, payload).pipe(
      tap(() => {
        this.alertService.success('User created successfully!');
      })
    );
  }

  // Create a new user group
  createGroup(groupName: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/group/creategroup`, {
      groupName: groupName,
    }).pipe(
      tap(() => {
        this.alertService.success('User group created successfully!');
      })
    );
  }

  deleteGroupById(groupId: number): Observable<any> {
    const deleteUrl = `${this.baseUrl}/group/deletegroup/${groupId}`; // Adjust the endpoint based on your backend's structure
    return this.http.delete(deleteUrl).pipe(
      tap(() => {
        this.alertService.success('User group deleted successfully!');
      })
    );
  }

  getGroups(): Observable<Group[]> {
    return this.http
      .get<{ $id: string; $values: Group[] }>(`${this.baseUrl}/group/getgroups`)
      .pipe(
        map((response) =>
          response.$values.map((group) => {
            const userGroups = group.userGroups || { $id: '', $values: [] };
            const surveysAssigned = group.surveysAssigned || {
              $id: '',
              $values: [],
            };

            return new Group(
              group.$id,
              group.id,
              group.name,
              {
                $id: userGroups.$id,
                $values: userGroups.$values,
              },
              {
                $id: surveysAssigned.$id,
                $values: surveysAssigned.$values,
              },
              group.lastUpdatedOn,
              group.lastUpdatedBy
            );
          })
        )
      );
  }

  addUserToGroups(payload: {
    userId: number;
    groupIds: number[];
  }): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/user/addusertogroups`,
      payload
    );
  }
}
