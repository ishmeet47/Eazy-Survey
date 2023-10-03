import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = ''; // To display error messages to the user

  constructor(private authService: AuthService, private router: Router) {}

  // This will be triggered by the form submission
  onSubmit(): void {
    this.login();
  }

  // The login method handles the actual authentication logic
  private login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response && response.token) {
          // Storing the JWT token locally. This can be stored in other mechanisms like cookies or session storage based on requirements.
          localStorage.setItem('token', response.token);

          if (response.userType === 'Admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (response.userType === 'User') {
            this.router.navigate(['/user-dashboard']);
          } else {
            this.errorMessage = 'Unexpected user type received'; // Default error message for unexpected UserType
          }
        } else {
          this.errorMessage = 'Invalid login response';
        }
      },
      error: (err) => {
        // Handle login errors here
        this.errorMessage = 'Invalid login credentials';
      },
    });
  }
}
