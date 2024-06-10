import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductserviceService } from './productservice.service';
import { Product,ProductListResponse,ChangeStatusResponse, editProductResponse, AddProduct,Catrgories } from './product.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth-service.service';
import { Category ,CategoryResponse} from '../category/category.model';
import Swal from 'sweetalert2';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  product!: Product;
  categories: Category[] = [];
  isEditMode: boolean = false;
  loading: boolean = true;
  selectedCategoryId!: any;
  productForm!: FormGroup;
  temp: any;
  isStatusChecked!: boolean;
  visible: boolean = false;
  uploadedImageUrl!: string;
  categoriesnew!: SelectItem[]
  base64textString: string | null = null;
  constructor( public dialogService: DialogService ,private fb: FormBuilder, private productService: ProductserviceService,private toastr: ToastrService,private authService: AuthService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      qty: ['', Validators.required],
      image: [''],
      product_no: [''],
      category_id: ['', Validators.required],  // Hardcoded for now, adjust as necessary
      slug: [''] 
    });
  }
loadCategories(): void {
  this.productService.getAllCategories().subscribe(
    (response: CategoryResponse) => {
      console.log("category",response);
      this.categoriesnew = response.data.map(category => ({
          label: category.name,
          value: category.id
      }));
    },
    error => {
      console.error('Error fetching categories:', error);
    }
  );
}
 onFileChange(event: any): void {
    const files = event.target.files;
    const file = files[0];
  
    if (files && file) {
      const reader = new FileReader();
    reader.onload = () => {
        this.base64textString = reader.result as string;
        this.productForm.patchValue({ image: this.base64textString });
        this.uploadedImageUrl = this.base64textString;
      };
      reader.readAsDataURL(file);
    }
  }
setEditMode(isEdit: boolean) {
  this.isEditMode = isEdit;
}
openEditDialog(productId: number): void {
  this.setEditMode(true);
  this.productForm.reset();
  this.productService.getProductById(productId).subscribe(
    (response: any) => {
      console.log(response.data);
      this.product = response.data; // Set the product object
      this.productForm.patchValue({
        name: response.data.name,
        description: response.data.description,
        price: response.data.price,
        qty: response.data.qty,
        category_id: response.data.category_id,
        slug: response.data.slug,
        // Do not patch the image value here
      });
      this.selectedCategoryId = response.data.category_id;
      this.temp = this.categoriesnew.find(e => e.value == this.selectedCategoryId);
      
      // Explicitly check if productForm and image control are not null before accessing value
      const imageControl = this.productForm.get('image');
      if (imageControl !== null && imageControl.value) {
        // If a new image is selected, update the uploadedImageUrl
        this.uploadedImageUrl = imageControl.value;
      } else {
        // If no new image is selected, set uploadedImageUrl to the existing image URL
        this.uploadedImageUrl = response.data.image;
      }
      this.visible = true;
    },
    error => {
      console.error('Error fetching product details:', error);
    }
  );
}
onSubmit(): void {
  if (this.productForm.valid) {
    const productValue: Product = this.productForm.value;
    // Convert the image to base64 if necessary
    if (this.base64textString && this.productForm.value.image != null) {
      productValue.image = this.base64textString!; // Set the base64 string to the image property
    }
    else {
      this.productForm.value['image'] = null;
    }
    if (this.isEditMode && this.product) {
      productValue.category_id = this.temp.value;
      const productId = this.product.id;
      this.productService.updateProduct(productId, productValue).subscribe(
        response => {
          console.log('Product updated successfully', response);
          // this.productForm.reset();
          this.toastr.success('Product updated successfully', 'Success');
          this.visible = false;
          this.loadProducts();
          this.productForm.reset(); // Reload products after updating
        },
        error => {
          console.error('Error updating product', error);
          this.toastr.error('Error updating product', 'Error');
        }
      );
    } else {
      // Add new product
      let obj: AddProduct = {
        name: productValue.name,
        price: productValue.price,
        description: productValue.description,
        image: productValue.image!,
        qty: productValue.qty,
        slug: productValue.slug,
        product_no: productValue.product_no,
        category_id: this.temp.value + ''
      };

      this.productService.addProduct(obj).subscribe(
        response => {
          console.log('Product added successfully', response);
          this.toastr.success('Product added successfully', 'Success');
          this.visible = false;
          this.loadProducts(); // Reload products after adding
        },
        error => {
          console.error('Error adding product', error);
          this.toastr.error('Error adding product', 'Error');
        }
      );
    }
  } else {
    // If form is invalid or base64 string is missing, mark all fields as touched to display validation messages
    this.productForm.markAllAsTouched();
  }
}
deleteProduct(productId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe(
          response => {
            console.log('Product deleted successfully:', response);
            this.loadProducts();
            Swal.fire('Deleted!', 'The Product has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting Product:', error);
            // Handle error, such as displaying an error message
            Swal.fire('Error!', 'Failed to delete the Product.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The Product is safe :)', 'info');
      }
    });
  }
  // Assuming Product interface has been defined
  changeProductStatus(productId: number, checked: boolean): void {
    const newStatus = checked ? 1 : 0;
    this.productService.changeProductStatus(productId, newStatus).subscribe(
        (response: ChangeStatusResponse) => {
          const message = newStatus === 1 ? 'You have made the status Active' : 'You have made the status Inactive';
            console.log('Product status changed successfully:', response);
            this.toastr.success(message,'Category updated successfully');
            // Handle success, such as refreshing the list of products
        },
        error => {
            console.error('Error changing product status:', error);
            // Handle error, such as displaying an error message
        }
    );
}
 loadProducts(): void {
    // debugger;
    this.productService.getAllproduct().subscribe(
      (response : any) => {
        console.log('API Response:', response);
        response.category_id = this.loadCategories.name;
        console.table('categorryName',response);
        this.products = response.data.map((product: any) => ({
          ...product,
          category_name: this.getCategoryNameById(product.category_id)
        }));
        this.loading = false;
        console.log(response);
        // Debugging line
        // this.products = response.data; // Assuming data is the array of products
        // console.log('Products:', this.products); // Debugging line
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }
  getCategoryNameById(category_id: number): string {
    const category = this.categoriesnew.find((cat: any) => cat.value === Number(category_id));
    console.log(category);
    return category ? category.label! : 'Unknown';
  }
  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }
  showDialog() {    
    this.productForm.reset();
    this.visible = true;
    this.productForm.get('category_id')!.setValue('0');
    this.isEditMode = false;
  }
}
