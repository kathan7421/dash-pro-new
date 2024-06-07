import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category-service.service';
import { AuthService } from 'src/app/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { SelectItem } from 'primeng/api';

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
  isEditMode: boolean = false;
  categoriesnew!: SelectItem[];
  visible: boolean = false;
  uploadedImageUrl!: string;
  base64textString: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['']
    });
    this.loadCategories();
  }

  showDialog(category?: any) {
    this.categoryForm.reset();
    this.visible = true;
    this.isEditMode = false;
    this.imagePreviewUrl = null;
    if (category) {
      this.editingCategory = category;
      this.categoryForm.patchValue({
        name: category.name,
        description: category.description
      });
      this.imagePreviewUrl = category.image; // Display old image if available
      this.isEditMode = true;
    } else {
      this.editingCategory = null;
      this.categoryForm.reset();
    }
    this.display = true;
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    const file = files[0];

    if (files && file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.base64textString = reader.result as string;
        this.categoryForm.patchValue({ image: this.base64textString });
        this.uploadedImageUrl = this.base64textString;
      };

      reader.readAsDataURL(file);
    }
  }

  getPreviewImage(): string | ArrayBuffer | null {
    if (!this.base64textString && this.imagePreviewUrl) {
      return this.imagePreviewUrl; // Display old image if not updating
    } else if (this.imagePreviewUrl && this.base64textString) {
      return this.base64textString; // Display new image if updating
    }
    return null;
  }
  
  onSubmit(): void {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value;
      if (this.isEditMode) {
        if (!this.base64textString) {
          // No new image uploaded, so keep the existing image
          formData.image = this.editingCategory.image;
        }
        this.updateCategory(this.editingCategory.id, formData);
      } else {
        this.addCategory(formData);
      }
    } else {
      this.markAllAsTouched();
    }
  }
  
  setEditMode(isEdit: boolean) {
    this.isEditMode = isEdit;
  }
  openEditDialog(categoryId: number): void {
    this.setEditMode(true);
    this.categoryService.getCategoryById(categoryId).subscribe(
      (response: any) => {
        this.editingCategory = response.data;
        this.categoryForm.patchValue(response.data);
        // Check if a new image is uploaded; if not, display the old image
        if (!this.base64textString) {
          this.uploadedImageUrl = response.data.image;
        }
        this.visible = true;
      },
      error => {
        console.error('Error fetching category details:', error);
      }
    );
  }
  
  hideDialog() {
    this.display = false;
    this.visible = false;
  }

  addCategory(newCategoryData: any): void {
    this.categoryService.addCategory(newCategoryData).subscribe(
      response => {
        this.toastr.success('Category added successfully');
        this.categoryForm.reset();
        this.loadCategories();
        this.hideDialog();
      },
      error => {
        console.error('Error adding category:', error);
        this.toastr.error('Error adding category');
      }
    );
  }

  updateCategory(categoryId: number, updatedData: any): void {
    this.categoryService.updateCategory(categoryId, updatedData).subscribe(
      response => {
        this.toastr.success('Category updated successfully');
        this.hideDialog();
        this.loadCategories();
      },
      error => {
        console.error('Error updating category:', error);
        this.toastr.error('Error updating category');
      }
    );
  }

  loadCategories(): void {
    if (this.authService.isLoggedIn()) {
      this.categoryService.getCategories().subscribe(
        response => {
          this.categories = response.data;
        },
        error => {
          console.error('Error fetching categories:', error);
        }
      );
    } else {
      console.error('User not logged in.');
    }
  }
  markAllAsTouched(): void {
    Object.values(this.categoryForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  updateCategoryStatus(categoryId: number, status: boolean): void {
    const newStatus = status ? 1 : 0;
    this.categoryService.updateCategoryStatus(categoryId, newStatus).subscribe(
      response => {
        const message = newStatus === 1 ? 'You have made the status Active' : 'You have made the status Inactive';
        this.toastr.success(message, 'Status Changed Successfully');

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
