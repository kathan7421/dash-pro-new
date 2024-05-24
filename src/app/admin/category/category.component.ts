// category.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category-service.service';
import { AuthService } from 'src/app/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormGroup ,Validators,FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  categoryForm!: FormGroup;
  constructor(private categoryService: CategoryService ,private authService: AuthService,private toastr: ToastrService,private fb: FormBuilder,) { }
  loading: boolean = true;
  
  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    });
    this.loadCategories();
  }
  
  onSubmit(): void {
    if (this.categoryForm.valid) {
      // Call the service to add the category
      this.categoryService.addCategory(this.categoryForm.value).subscribe(
        response => {
          this.toastr.success('Status Changed Successfully');
          console.log('Category added successfully:', response);
         
          // Reset the form after successful submission
          this.categoryForm.reset();
          // Optionally, reload the categories list
          // this.loadCategories();
        },
        error => {
          console.error('Error adding category:', error);
        }
      );
    } else {
      // Mark all fields as touched to display validation errors
      this.markAllAsTouched();
    }
  }

  markAllAsTouched(): void {
    Object.values(this.categoryForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  loadCategories(): void {
    if (this.authService.isLoggedIn()) {
        this.categoryService.getCategories().subscribe(
            response => {
                console.log('API Response:', response); // Debugging line
                this.categories = response.data;
                console.log('Categories:', this.categories); // Debugging line
            },
            error => {
                console.error('Error fetching categories:', error);
            }
        );
    } else {
        console.error('User not logged in.');
    }
}

  getImageUrl(imagePath: string): string {
    return `http://localhost/apilaravelpractice/storage/app/public/images/${imagePath}`;
  }
  updateCategoryStatus(categoryId: number, status: boolean): void {
    const newStatus = status ? 1 : 0;
    this.categoryService.updateCategoryStatus(categoryId, newStatus).subscribe(
      response => {
        console.log('Category status updated successfully:', response);
        const message = newStatus === 1 ? 'You have made the status Active' : 'You have made the status Inactive';
        this.toastr.success(message, 'Status Changed Successfully');
  
        // Update the status locally
        const category = this.categories.find(cat => cat.id === categoryId);
        if (category) {
          category.status = newStatus;
        }
      },
      error => {
        console.log('Error updating category status:', error);
      }
    );
  }

  onToggleChange(categoryId: number, status: boolean): void {
    this.updateCategoryStatus(categoryId, status);
  }
  deleteCategory(categoryId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(categoryId).subscribe(
          response => {
            console.log('Category deleted successfully:', response);
            this.loadCategories();
            Swal.fire('Deleted!', 'The category has been deleted.', 'success');
          },
          error => {
            console.log('Error deleting category:', error);
            Swal.fire('Error', 'Error deleting category', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The category is safe :)', 'info');
      }
    });
  }
  
}
