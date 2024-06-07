import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://127.0.0.1:8000/api/category';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateCategoryStatus(categoryId: number, status: number): Observable<any> {
    const updateUrl = `${this.apiUrl}/changestatus/${categoryId}`;
    return this.http.post<any>(updateUrl, { status });
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${categoryId}`);
  }

  addCategory(newCategoryData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, newCategoryData);
  }

  updateCategory(categoryId: number, updatedData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update/${categoryId}`, updatedData);
  }
  getCategoryById(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${categoryId}`);
  }
}
