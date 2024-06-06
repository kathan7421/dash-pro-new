import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, AddProductResponse ,ProductListResponse,DeleteResponse,ChangeStatusResponse, editProductResponse, AddProduct} from './product.model';
import { Category ,CategoryResponse} from '../category/category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductserviceService {
  private apiUrl = 'http://127.0.0.1:8000/api/product';
  private apiUrl1 = 'http://127.0.0.1:8000/api';


  constructor(private http: HttpClient) { }


  addProduct(newProductData: AddProduct): Observable<AddProductResponse> {
    return this.http.post<AddProductResponse>(`${this.apiUrl}/add`, newProductData);
  }

  getAllproduct(): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(this.apiUrl);
  }
  getAllCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl1}/category`);
  }
  deleteProduct(productId: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${productId}`);
  }

  changeProductStatus(productId: number, newStatus: number): Observable<ChangeStatusResponse> {
    return this.http.post<ChangeStatusResponse>(`${this.apiUrl}/changestatus/${productId}`, { status: newStatus });
  }
  updateProduct(productId: number, product: Product): Observable<AddProductResponse> {
    return this.http.post<AddProductResponse>(`${this.apiUrl}/update/${productId}`, product);
  }
  getProductById(productId: number): Observable<editProductResponse> {
    return this.http.get<editProductResponse>(`${this.apiUrl}/${productId}`);
  }
  

 
}
