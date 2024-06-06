// category.component.ts
import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category-service.service';
import { AuthService } from 'src/app/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormGroup ,Validators,FormBuilder} from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  editingCategory: any;
  display: boolean = false;
  categoryForm!: FormGroup;
  categoryeditForm!: FormGroup;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  category: any;
  constructor(private categoryService: CategoryService ,private authService: AuthService,private toastr: ToastrService,private fb: FormBuilder,  public dialogService: DialogService  // Reference to the dialog
     ) { }
  loading: boolean = true;
  
  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    });
    this.categoryeditForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['']  // You may or may not need to include validators for image editing
    });
    this.loadCategories();
  }
  
  onSubmit(): void {
    if (this.categoryForm.valid) {
      const formData = new FormData();
      formData.append('name', this.categoryForm.get('name')!.value);
      formData.append('description', this.categoryForm.get('description')!.value);
      formData.append('image', this.categoryForm.get('image')!.value);

      this.categoryService.addCategory(formData).subscribe(
        response => {
          this.toastr.success('Category added successfully');
          console.log('Category added successfully:', response);

          this.categoryForm.reset();
          this.loadCategories();
        },
        error => {
          console.error('Error adding category:', error);
        }
      );
    } else {
      this.markAllAsTouched();
    }
  }
  oneditSubmit() {
    if (this.categoryeditForm?.valid) {
      const formData = new FormData();
      formData.append('name', this.categoryeditForm.get('name')!.value);
      formData.append('description', this.categoryeditForm.get('description')!.value);
      formData.append('image', this.categoryeditForm.get('image')!.value);
  
      if (this.editingCategory) {
        const categoryId = this.editingCategory.id; // Assuming category id is stored in the 'id' property
        this.categoryService.updateCategory(categoryId, formData).subscribe(
          response => {
            this.toastr.success('Category updated successfully');
            console.log('Category updated successfully:', response);
            this.hideDialog();
            this.loadCategories();
          },
          error => {
            console.error('Error updating category:', error);
            this.toastr.error('Error updating category');
          }
        );
      } else {
        console.error('Editing category not found.');
        this.toastr.error('Editing category not found.');
      }
    } else {
      this.markAllAsTouched();
    }
  }
  

  showDialog(category?: any) {
    if (category) {
      this.editingCategory = category;
      this.categoryeditForm.patchValue({
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image // Assuming you have the image path in the category object
      });
    } else {
      this.editingCategory = null;
      this.categoryeditForm.reset();
    }
    this.display = true;
  }

  hideDialog() {
    this.display = false;
  }
  
  markAllAsTouched(): void {
    Object.values(this.categoryForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.categoryForm.patchValue({
        image: file
      });
    }
  }
  onFileChangeEdit(event: any): void {
    if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.categoryeditForm.patchValue({
            image: file
        });
        // Generate a preview URL for the selected image
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreviewUrl = reader.result;
        };
        reader.readAsDataURL(file);
    }
}
getPreviewImage(): string | ArrayBuffer | null {
  if (this.imagePreviewUrl) {
      return this.imagePreviewUrl;
  } else if (this.editingCategory && this.editingCategory.image) {
      return this.editingCategory.image;
  }
  return null;
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

  // getImageUrl(imagePath: string): string {
  //   return `http://localhost/apilaravelpractice/storage/app/public/images/${imagePath}`;
  // }
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