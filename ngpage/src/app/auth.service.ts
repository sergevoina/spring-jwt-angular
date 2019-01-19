import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as jwt_decode from "jwt-decode";


export class User {
    username: string;
    password: string;
    authorities: string[];
    accessToken: string;
    expires: number;
    refreshToken: string; 
}

export class OauthResp {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	jti: string;
	
	// jwt_decode(access_token)
    // { authorities: ["ROLE_USER"], client_id: "springjwt-client", exp: 1547917414, 
    // jti: "51352f16-ed4a-4fdf-b53c-49ca4d4a1b67",  scope: ["read", "write", "trust"], user_name: "user", }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username, password): Observable<boolean> {
    const headers = {
      'Authorization': 'Basic ' + btoa('springjwt-client:springjwt-secret'),
      'Content-type': 'application/x-www-form-urlencoded'
    }
    
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password');
      
    let user: User = { username:username, password:null, authorities: [], accessToken: "", expires: 0, refreshToken: ""};
    
    return this.httpClient.post<OauthResp>('/oauth/token', body.toString(), {headers}).pipe(map(data => {
      
      try{
        const token = jwt_decode(data.access_token);
        
        // { authorities: ["ROLE_USER"], client_id: "springjwt-client", exp: 1547917414, 
        // jti: "51352f16-ed4a-4fdf-b53c-49ca4d4a1b67",  scope: ["read", "write", "trust"], user_name: "user", }
        // console.log(token);
        
        user.accessToken = data.access_token;
        user.refreshToken = data.refresh_token;
        user.authorities = token.authorities;
        user.expires = token.exp;
        
    		sessionStorage.setItem('currentUser', JSON.stringify(user));
    		this.currentUserSubject.next(user);
    		
    		return true;
      }
      catch(error){
         sessionStorage.removeItem('currentUser');
         this.currentUserSubject.next(null);
      
        return false;
      }
    		
    		
    }));
  }
  
  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  
  getToken(): string {
    try {
      let user = sessionStorage.getItem('currentUser');
      if(user) {
        return JSON.parse(user).accessToken;
      }
    } catch(error) {
    	
    }
 	return null;
  }
  
  authorise(allowedRoles: string[]): boolean {
    
    if(this.currentUserSubject.value && this.currentUserSubject.value.authorities) {
    	  if(! allowedRoles) {
    	  	return true;
    	  } 
		
      // intersection - at least one role match    	  
    	  return allowedRoles.filter(value => -1 !== this.currentUserSubject.value.authorities.indexOf(value)).length > 0;
    }

  	return false;
  }
}
