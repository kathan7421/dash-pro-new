import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map ,catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl: string;

  constructor(private http: HttpClient,private router:Router) {
    this.apiUrl = 'http://127.0.0.1:8000/api'; 
    const currentUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(currentUser ? JSON.parse(currentUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

//   public get currentUserValue(): any {
//     return this.currentUserSubject.value;
//   }

currentUserValue: any;

  login(email: string, password: string) { // Change parameter name to email
 
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password })

  }

  register(name: string, email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password })
      .pipe(
        map(user => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
          return user;
        }),
        catchError(error => {
          console.error('Registration error: ', error);
          throw error; // You can handle the error as needed
        })
      );
    }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }
  getToken(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      console.log('Retrieved token:', user.token); // Debugging line
      return user.token;
    }
    return null;
  }
}
