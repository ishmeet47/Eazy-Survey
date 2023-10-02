import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtModule } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check for authentication
    if (this.authService.isAuthenticated()) {
      // Get the expected UserType (role) for this route
      const expectedRole = route.data['expectedRole'];

      // Decode the token to get the UserType claim
      const token = localStorage.getItem('token');

      if (!token) {
        this.router.navigate(['/login']);
        return false;
      }

      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      // Check if the current user has the expected role
      if (expectedRole && userRole === expectedRole) {
        return true;
      } else {
        // If user doesn't have the expected role, redirect them accordingly
        if (userRole === 'User') {
          this.router.navigate(['/user-dashboard']);
        } else if (userRole === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/login']); // Or another default route
        }
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
