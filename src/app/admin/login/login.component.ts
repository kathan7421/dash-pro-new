import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.loginForm.invalid) {
      this.loading = false;
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password)
      .subscribe(
        response => {
          if (response.user && response.user.token) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.toastr.success('Login successful', 'Welcome');
            this.authService.currentUserValue = response;
            this.router.navigate(['/dashboard']);
          } else {
            this.toastr.error('Oops! Something went wrong.', 'Error');
          }
          this.loading = false;
        },
        error => {
          const errorMessage = error.error.error || 'An error occurred during login';
          this.toastr.error(errorMessage, 'Error');
          this.loading = false;
        }
      );
  }
}
