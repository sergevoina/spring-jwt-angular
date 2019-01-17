import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {}
  
  login(cred) {
    const headers = {
      'Authorization': 'Basic ' + btoa('springjwt-client:springjwt-secret'),
      'Content-type': 'application/x-www-form-urlencoded'
    }
    
    const body = new HttpParams()
      .set('username', cred.username)
      .set('password', cred.password)
      .set('grant_type', 'password');    
    
    return this.httpClient.post('/oauth/token', body.toString(), {headers});
  }
  
  getToken(): string {
    let token = window.sessionStorage.getItem('token');
    if(token) {
      return JSON.parse(token).access_token;
    }
 	return null;
  }  
}
