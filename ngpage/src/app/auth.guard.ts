import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
      private router: Router,
      private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
	if (this.authService.getToken()) {
		// check if route is restricted by role
		if (route.data.roles && !this.authService.authorise(route.data.roles) ) {
			// role not authorised so redirect to home page
			// this.router.navigate(['/app']);
			alert("Access denied");
			return false;
		}
		
		// authorised so return true
		return true;
	}
	
	// not logged in so redirect to login page with the return url
	this.router.navigate(['/app/login'], { queryParams: { returnUrl: state.url }});
	return false;
  }
}
