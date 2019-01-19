import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, User } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngpage';
  currentUser: User;

  constructor(
        private router: Router,
        private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x; 
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/app/home']);
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.authorities && this.currentUser.authorities.indexOf('ROLE_ADMIN') !== -1;
  }
}
