import { Injectable } from '@angular/core';  
import {  
    HttpEvent,  
    HttpInterceptor,  
    HttpHandler,  
    HttpRequest,  
    HttpHeaders  
} from '@angular/common/http';  
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
@Injectable()  
export class AuthInterceptor implements HttpInterceptor {  
  
  	constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      // checks if the user is logged in by getting the access token from the authService.
 	  let token = this.authService.getToken();
 	  if(token) {
 	    // add the access token to the Authorization header
  	    req = req.clone({
 	      setHeaders: {
 	        Authorization: `Bearer ${token}`
 	      }
 	    });
 	  }

      // Intercepts http responses from the api to check if there were any errors. 
      return next.handle(req).pipe(catchError(err => {
        // Check for a 401 Unauthorized response 
        if ([401].indexOf(err.status) !== -1) {
          // Auto logout if 401 Unauthorized response returned from api
          this.authService.logout();
          location.reload(true);
        }
        
        // all other errors are re-thrown up to the calling service 
        // so an alert error message can be displayed to the user.
        const error = err.error.message || err.statusText;
        return throwError(error);
      }));
    }
}  
