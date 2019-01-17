import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from '../auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private cred = {username:'admin', password:'admin'};
  
  constructor(private authService: AuthService) { }

  ngOnInit() {
 
  }
   
  login(): void {
    window.sessionStorage.removeItem('token');
  	this.authService.login(this.cred).subscribe(data => {
  	    console.log(data);
  		window.sessionStorage.setItem('token', JSON.stringify(data));
  	});
  }
}
