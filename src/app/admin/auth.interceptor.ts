import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const storedUser = localStorage.getItem('currentUser');

        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const token = user.token;
                const authToken = token.startsWith('Bearer ') ? token.slice(7) : token;

                console.log('AuthInterceptor: Adding Authorization header', authToken);

                const cloned = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${authToken}`)
                });

                return next.handle(cloned);
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                return next.handle(req);
            }
        } else {
            console.error('User data not found in localStorage.');
            return next.handle(req);
        }
    }
}
