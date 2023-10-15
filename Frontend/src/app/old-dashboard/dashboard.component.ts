import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public isAuthenticated!: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  showSurvey!: number | null;

  ngOnInit(): void {
    const userRoles = this.authService.getUserType(); // This is just an example method. You'll need to define how you get user roles in your application.
    this.isAdmin = userRoles.includes('Admin'); // change this
    this.isAuthenticated = this.authService.isAuthenticated();

    if (this.route.snapshot.queryParams['shareId']) {
      this.showSurvey = this.route.snapshot.queryParams['shareId'];
    }
  }

  isAdmin: boolean = false; // You can initialize it to false or true based on your logic
  // Declare the properties
  newUsername: string = '';
  newPassword: string = '';

  // createUser() {
  //   this.userService.createUser(this.newUsername, this.newPassword).subscribe(response => {
  //     console.log('User created:', response);
  //     // Handle success, show messages, etc.
  //   }, error => {
  //     console.error('Error creating user:', error);
  //     // Handle errors, show error messages, etc.
  //   });
  // }
}