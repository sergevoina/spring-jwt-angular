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

// {
//   "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDgxNDIwNDksInVzZXJfbmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJqdGkiOiIwZGI3YWNmMi0yN2MwLTQ5ZWUtYjJmMy02NWRjM2M0NDI5YmEiLCJjbGllbnRfaWQiOiJzcHJpbmdqd3QtY2xpZW50Iiwic2NvcGUiOlsicmVhZCIsIndyaXRlIl19.9Q9_s3iHPpz_kbo8WOfSfvWHqCG0ExdVmdxU66laTkY",
//   "token_type":"bearer",
//   "refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJhdGkiOiIwZGI3YWNmMi0yN2MwLTQ5ZWUtYjJmMy02NWRjM2M0NDI5YmEiLCJleHAiOjE1NDgxNjM1ODIsImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU4iXSwianRpIjoiODE3Njk4ZTgtMmQ3YS00Y2IzLTkwMGYtNjU3ODU5NzgzOTAwIiwiY2xpZW50X2lkIjoic3ByaW5nand0LWNsaWVudCJ9.Y9GgJUY5ikqEMd7ch8Cm2aGhuVAf4-pWInG5lnTUzW0",
//   "expires_in":19,
//   "scope":"read write",
//   "jti":"0db7acf2-27c0-49ee-b2f3-65dc3c4429ba"
// }
//
// jwt_decode(access_token)
// { authorities: ["ROLE_USER"], client_id: "springjwt-client", exp: 1547917414, 
// jti: "51352f16-ed4a-4fdf-b53c-49ca4d4a1b67",  scope: ["read", "write", "trust"], user_name: "user", }

export class OauthResp {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	jti: string;
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

	// Observable<ICurrentUser>
	login(username, password): Observable<User> {
		const body = new HttpParams()
			.set('username', username)
			.set('password', password)
			.set('grant_type', 'password');
		
		return this.oauth(body.toString());
	}
	
	refreshToken(): Observable<User> {
		const user = JSON.parse(sessionStorage.getItem('currentUser'));
	
		const body = new HttpParams()
			.set('username', user.username)
			.set('refresh_token', user.refreshToken)
			.set('grant_type', 'refresh_token');

		return this.oauth(body.toString());
	}
	
	logout(): void {
		sessionStorage.removeItem('currentUser');
		this.currentUserSubject.next(null);
	}
	
	private oauth(body: string): Observable<User> {
		const headers = {
			'Authorization': 'Basic ' + btoa('springjwt-client:springjwt-secret'),
			'Content-type': 'application/x-www-form-urlencoded'
		}

		return this.httpClient
			.post<OauthResp>('/oauth/token', body, {headers})
			.pipe(
				map(oauthResp => {
					try{
						let user = this.createUser(oauthResp);
						
						sessionStorage.setItem('currentUser', JSON.stringify(user));
						this.currentUserSubject.next(user);
						
						return user;
					} catch(error) {
						sessionStorage.removeItem('currentUser');
						this.currentUserSubject.next(null);
						
						return null;
					}
			}));
	}
	
	private createUser(oauthResp: OauthResp ): User {
		const accessToken = jwt_decode(oauthResp.access_token);
	
		return { 
			username: accessToken.user_name, 
			password:null, 
			authorities: accessToken.authorities, 
			accessToken: oauthResp.access_token, 
			expires: accessToken.exp, 
			refreshToken: oauthResp.refresh_token
		};
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
