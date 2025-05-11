import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'],
})
export class AdminNavbarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('userGroups');
    this.router.navigate(['/login']);
  }
}
