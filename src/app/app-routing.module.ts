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
import { CountryComponent } from './admin/country/country.component';
import { GlobalnotfoundComponent } from './admin/globalnotfound/globalnotfound.component';
import { HomeComponent } from './frontend/home/home.component';

const routes: Routes = [
  {path: '',component:HomeComponent,data:{title:'Home'}},
  { path: 'admin/login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'admin/404', component: NotFoundComponent, data: { title: 'Admin 404 Not Found' } }, // Admin-specific 404 route
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, resolve: { counts: DashboardResolver }, data: { title: 'Dashboard' } },
      { path: 'category', component: CategoryComponent, data: { title: 'Category Management' } },
      { path: 'product', component: ProductsComponent, data: { title: 'Product Management' } },
      { path: 'orders', component: OrdersComponent, data: { title: 'Order Management' } },
      { path: 'banners', component: BannersComponent, data: { title: 'Banner Management' } },
      { path: 'country', component: CountryComponent, data: { title: 'Country Management' } },
      // Other admin routes...
      { path: '**', redirectTo: '404' }, // Redirect to admin 404 page for undefined routes
    ]
  },

  { path: '**', component: GlobalnotfoundComponent, data: { title: '404 Not Found' } }, // Global 404 route
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' }, // Redirect to admin dashboard if no path is provided
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
