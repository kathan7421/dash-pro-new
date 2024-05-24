// category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://127.0.0.1:8000/api/category';

  constructor(private http: HttpClient) { }

  // Add a method to get the authorization token
  // private getToken(): string | null {
  //   return localStorage.getItem('token');
  // }

  getCategories(): Observable<any> {
    const token = this.getToken();
    // console.log('Retrieved token:', token); // Debugging line
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.get<any>(this.apiUrl, { headers });
  }
  private getToken(): string | null {
    const storedUser = localStorage.getItem('currentUser');
    // console.log("Retrieved storedUser:", storedUser); // Debugging line

    if (!storedUser) {
        console.error('User data not found in localStorage.');
        return null;
    }

    try {
        const user = JSON.parse(storedUser);
        const token = user.token;
        // console.log("Extracted token:", token); // Debugging line

        if (!token) {
            console.error('Token not found in user data.');
            return null;
        }

        // Remove 'Bearer ' prefix if present
        return token.startsWith('Bearer ') ? token.slice(7) : token;
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return null;
    }
}



  updateCategoryStatus(categoryId: number, status: number): Observable<any> {
    const token = this.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    const updateUrl = `${this.apiUrl}/changestatus/${categoryId}`;
    return this.http.post<any>(updateUrl, { status }, { headers });
  }
  deleteCategory(categoryId: number): Observable<any> {
    const token = this.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.delete<any>(`${this.apiUrl}/${categoryId}`, { headers });
  }
  addCategory(newCategoryData: any): Observable<any> {
    const token = this.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.post<any>(`${this.apiUrl}/add`, newCategoryData, { headers });
  }
}
