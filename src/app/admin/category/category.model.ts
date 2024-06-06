// src/app/models/category.model.ts

export interface Category {
    id: number;
    name: string;
  }
  
  export interface CategoryResponse {
    data: Category[];
    message: string;
  }