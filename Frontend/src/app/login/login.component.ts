import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('loginForm') loginForm!: NgForm;


  username: string = '';
  password: string = '';
  errorMessage: string = ''; // To display error messages to the user

  passwordVisibility: boolean = false; // To toggle password visibility

  constructor(private authService: AuthService, private router: Router) { }


  ngAfterViewInit() {
    console.log(this.loginForm); // This should log the NgForm instance
  }
  // This will be triggered by the form submission
  onSubmit(): void {
    if (this.loginForm?.valid) {
      this.username = this.loginForm.value.username;
      this.password = this.loginForm.value.password;

      this.login(); // You can now call your login method here
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisibility = !this.passwordVisibility;
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
