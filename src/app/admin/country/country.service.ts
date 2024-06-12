import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country,ChangeStatusResponse, DeleteResponse } from './country.model'; // Importing your Country model
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = `${environment.apibaseUrl}country`;
  
  constructor(private http: HttpClient) { }

  getCountries(): Observable<{ data: Country[] }> {
    return this.http.get<{ data: Country[] }>(this.apiUrl);
  }
  getCountryById(countryId: number): Observable<{ data: Country }> {
    return this.http.get<{ data: Country }>(`${this.apiUrl}/${countryId}`);
  }

  addCountry(countryData: Country): Observable<Country> {
    return this.http.post<Country>(`${this.apiUrl}/add`, countryData);
  }

  updateCountry(countryId: number, updatedData: Country): Observable<Country> {
    return this.http.post<Country>(`${this.apiUrl}/update/${countryId}`, updatedData);
  }
  updateCountryStatus(countryId: number, newStatus: number): Observable<Country> {
    return this.http.post<Country>(`${this.apiUrl}/changestatus/${countryId}`,{status:newStatus});
  }
  deleteCountry(countryId: number) : Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${countryId}`);
  }
}
