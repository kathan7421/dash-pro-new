// src/app/models/product.model.ts
export interface Product {
    id:number;
    name: string;
    description: string;
    price: string;
    qty: string;
    category_id: Catrgories;
    slug: string;
    status: number;
    product_no:any;
    image?: string;
    // updated_at: string;
    // created_at: string;
    // id: number;
  }
  export interface AddProduct {
    
    name: string;
    description: string;
    price: string;
    qty: string;
    category_id: string;
    slug: string;
    product_no:string;
    status?: number;
    image: string;
    // updated_at: string;
    // created_at: string;
    // id: number;
  }
  export interface Catrgories {
    label: string;
    value: number;
  }
  export interface AddProductResponse {
    product: Product;
    message: string;
  }
  export interface editProductResponse {
    data: Product;
    message: string;
  }
  export interface ProductListResponse {
    products: Product[];
    // Add any other properties you expect in the response
  }
  export interface DeleteResponse {
    message: string;
  }
  
  export interface ChangeStatusResponse {
    message: string;
  }