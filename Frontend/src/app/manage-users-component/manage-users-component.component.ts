import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../modules/user.module';

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users-component.component.html'
})
export class ManageUsersComponent implements OnInit {
    users: User[] = [];
    newUsername: string;

    constructor(private userService: UserService) {
      this.newUsername = '';

    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userService.getUsers().subscribe(users => {
            this.users = users;
        });
    }

    addUser(): void {
        this.userService.addUser(this.newUsername).subscribe(() => {
            this.newUsername = '';
            this.loadUsers();
        });
    }

    deleteUser(userId: number | undefined): void {
      if (typeof userId !== 'number') {
          console.error('Invalid user ID:', userId);
          return;
      }
      this.userService.deleteUser(userId).subscribe(() => {
          this.loadUsers();
      });
  }

}
