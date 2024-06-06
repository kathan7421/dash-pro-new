import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Counts } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://127.0.0.1:8000/api/getcount';

  constructor(private http: HttpClient) {}

  getCounts(): Observable<Counts> {
    return this.http.get<Counts>(this.apiUrl);
  }
}
