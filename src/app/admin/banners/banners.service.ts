import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Banners } from './banners.model';


@Injectable({
  providedIn: 'root'
})
export class BannersService {
  private apiUrl = 'http://127.0.0.1:8000/api/banner';


  constructor(private http:HttpClient) { }

  addBanner(newBannerData:Banners): Observable <Banners> {
    return this.http.post<Banners>(`${this.apiUrl}/add`,newBannerData);
  }
  
}
