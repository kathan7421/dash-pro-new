import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { BannersService } from './banners.service';
import { ToastrService } from 'ngx-toastr';
import { Banners } from './banners.model';
import { error } from 'jquery';


@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
  bannerForm! : FormGroup;
  uploadedImageUrl!: string;
  visible: boolean = false;
  isEditMode: boolean = false;
  base64textString: string | null = null;
  constructor(public dialogService: DialogService ,private fb: FormBuilder,private bannerService: BannersService,private toastr: ToastrService) { 
this.bannerForm = this.fb.group({
  title: ['', Validators.required],
  image: ['',Validators.required],
  button_text	: [''],
  priority: [''],
  slug: [''],
  description: ['', Validators.required],
});
}
ngOnInit(): void {
  }
  onFileChange(event: any): void {
    const files = event.target.files;
    const file = files[0];

    if (files && file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.base64textString = reader.result as string;
        this.bannerForm.patchValue({ image: this.base64textString });
        this.uploadedImageUrl = this.base64textString;
      };

      reader.readAsDataURL(file);
    }
  }
  
  onSubmit(): void {
    if(this.bannerForm.valid){
      const productValue: Banners = this.bannerForm.value;

      this.bannerService.addBanner(productValue).subscribe(
        response => {
          this.toastr.success('Banner Added Successfully','Success');
          this.visible = false;
        },
        error => {
          this.toastr.error('Some thing went wrong ','Error');

        }
      )
    }

  }
  showDialog() {    
    this.bannerForm.reset();
    this.visible = true;
    // this.productForm.get('category_id')!.setValue('0');
    this.isEditMode = false;
  }

}
