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
    const userRoles = this.authService.getUserType();
    this.isAdmin = userRoles.includes('Admin'); // change this
    this.isAuthenticated = this.authService.isAuthenticated();

    if (this.route.snapshot.queryParams['shareId']) {
      this.showSurvey = this.route.snapshot.queryParams['shareId'];
    }
  }

  isAdmin: boolean = false;
  // Declare the properties
  newUsername: string = '';
  newPassword: string = '';
}
