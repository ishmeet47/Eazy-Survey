import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit, OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;

  username: string = '';
  password: string = '';
  errorMessage: string = ''; // To display error messages to the user

  passwordVisibility: boolean = false; // To toggle password visibility

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');

    if (token) {
      if (userType === 'Admin') {
        this.handleRedirectWithShareId(userType);
        // this.router.navigate(['/admin-dashboard']);
        return;
      } else if (userType === 'User') {
        this.handleRedirectWithShareId(userType);
        // this.router.navigate(['/user-dashboard']);
        return;
      }
    } else {
      this.login();
    }
  }

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

  private login(): void {
    if (!localStorage.getItem('token')) {
      // User is not logged in
      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            if (response.groupIds && response.groupIds.$values) {
              localStorage.setItem(
                'userGroups',
                JSON.stringify(response.groupIds.$values)
              );
            }
            this.handleRedirectWithShareId(response.userType); // Handle redirect after login
          } else {
            this.errorMessage = 'Invalid login response';
          }
        },
        error: (err) => {
          this.errorMessage = 'Invalid login credentials';
        },
      });
    } else {
      // User is already logged in
      this.handleRedirectWithShareId(localStorage.getItem('user_type'));
    }
  }

  private handleRedirectWithShareId(userType: any): void {
    var shareId = this.route.snapshot.queryParams['shareId'];
    shareId = parseInt(shareId);
    console.log(typeof shareId);
    if (shareId) {
      if (userType === 'Admin') {
        this.router.navigate(['/admin/dashboard']);
      } else if (userType === 'User') {
        // Make API call to get group IDs associated with the shareId
        this.authService.getGroupsByShareId(shareId).subscribe(
          (groupsFromShare) => {
            const groupIdsFromShare = groupsFromShare.map((group) => group.id);
            const userGroups: number[] = JSON.parse(
              localStorage.getItem('userGroups') || '[]'
            );
            const commonGroups = groupIdsFromShare.filter((id) =>
              userGroups.includes(id)
            );

            if (commonGroups.length > 0) {
              this.router.navigate(['/dashboard'], {
                queryParams: { shareId: shareId },
              });
            } else {
              this.router.navigate(['/dashboard']);
            }
          },
          (error) => {
            console.error('Error fetching groups by shareId:', error);
            this.router.navigate(['dashboard']);
          }
        );
      } else {
        this.errorMessage = 'Unexpected user type received'; // Default error message for unexpected UserType
      }
    } else {
      if (userType === 'Admin') {
        this.router.navigate(['/admin/dashboard']);
      } else if (userType === 'User') {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Unexpected user type received'; // Default error message for unexpected UserType
      }
    }
  }
}
