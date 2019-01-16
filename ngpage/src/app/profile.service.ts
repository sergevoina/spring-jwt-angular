import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient) {}
  
  getProfile(): Observable<any> {
  	return this.httpClient.get("/rest/profile");
  }

  saveProfile(profile: any): Observable<any> {
  	return this.httpClient.put("/rest/profile", profile);
  }
}
