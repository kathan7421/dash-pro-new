import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orders,OrderStatusCounts } from './orders.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  success!: boolean;
  data!: { [key: string]: number};

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://127.0.0.1:8000/api';

  getOrderStatusCounts(): Observable<OrderStatusCounts>{
    return this.http.get<OrderStatusCounts>(`${this.apiUrl}/order-status-counts`);
  }
}
