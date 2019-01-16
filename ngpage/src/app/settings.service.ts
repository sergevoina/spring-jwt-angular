import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private httpClient: HttpClient) {}
  
  getSettings(): Observable<any> {
  	return this.httpClient.get("/rest/settings");
  }
  
  saveSettings(settings: any): Observable<any> {
  	return this.httpClient.put("/rest/settings", settings);
  }
}
