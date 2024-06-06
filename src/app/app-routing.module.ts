import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './admin/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AuthGuard } from './authguard.service'; // Correct import path
import { CategoryComponent } from './admin/category/category.component';
import { ProductsComponent } from './admin/products/products.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { BannersComponent } from './admin/banners/banners.component';
import { DashboardResolver } from './admin/dashboard/dashboard-resolver.service';
import { NotFoundComponent } from './admin/not-found/not-found.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'Login' } },
  {
    path: 'admin', // Prefixing all admin routes with '/admin'
    canActivate: [AuthGuard], // Applying auth guard to all admin routes
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirect to dashboard if no child path is provided
      { path: 'dashboard', component: DashboardComponent,resolve: {
        counts: DashboardResolver
      } }, 
      { path: 'category', component: CategoryComponent }, 
      { path: 'product', component: ProductsComponent }, 
      {path: 'orders', component: OrdersComponent},
      {path: 'banners',component:BannersComponent}


      
      
      // Dashboard route
      // Add other child routes with breadcrumb data
      // Example: { path: 'users', component: UsersComponent, data: { breadcrumb: 'Users' } }
    ]
  },
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' }, // Redirect to admin dashboard if no path is provided
  { path: '**', component:NotFoundComponent } // Redirect to admin dashboard if route not found
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
