import { Injectable } from '@angular/core';  
import {  
    HttpEvent,  
    HttpInterceptor,  
    HttpHandler,  
    HttpRequest,  
    HttpHeaders  
} from '@angular/common/http';  
import { Observable } from 'rxjs';


import { AuthService } from './auth.service';

@Injectable()  
export class AuthInterceptor implements HttpInterceptor {  
  
  	constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
 	  let token = this.authService.getToken();
 	  if(token) {
  	      req = req.clone({
 	        setHeaders: {
 	          Authorization: `Bearer ${token}`
 	        }
 	      });
 	    }

        // Pass on the cloned request instead of the original request.  
        return next.handle(req);  
    }  
}  
