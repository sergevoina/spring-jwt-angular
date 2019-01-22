import { Injectable } from '@angular/core';	
import {	
	HttpEvent,	
	HttpInterceptor,	
	HttpHandler,	
	HttpRequest,	
	HttpHeaders,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, take, filter, finalize } from 'rxjs/operators';

import { AuthService, User } from './auth.service';

@Injectable()	
export class AuthInterceptor implements HttpInterceptor {	
	isRefreshingToken: boolean = false;
	tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	
	constructor(private authService: AuthService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if(req.url.endsWith("/oauth/token")) {
			return next.handle(req);
		}
		
		return next.handle(this.addAuthorizationHeader(req, this.authService.getToken()))
			.pipe(catchError(err => {
				if (err.status === 401) {
					return this.handle401Error(req, next);
				} 
				
				// all other errors are re-thrown up to the calling service 
				// so an alert error message can be displayed to the user.
				return throwError(err);
			}));
	}
	
	private addAuthorizationHeader(req: HttpRequest<any>, token: string) : HttpRequest<any> {
		if(token) {
			return req.clone({ setHeaders: { Authorization: `Bearer ${token}`}});
		}
		return req;
	}
	
 	private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if(!this.isRefreshingToken) {
			this.isRefreshingToken = true;
			
			// Reset here so that the following requests wait until the token
			// comes back from the refreshToken call.
			this.tokenSubject.next(null);
			
 			this.authService.refreshToken()
				.subscribe( 
					user => {
						this.isRefreshingToken = false;
						this.tokenSubject.next(user.accessToken);
					},
					error => {
						this.authService.logout();
						location.reload(true);
					});
		}

		return this.tokenSubject
			.pipe(
				filter(token => token != null),
				take(1),
				switchMap(token => {
					return next.handle(this.addAuthorizationHeader(request, token));
				})
			);
 	}
}
