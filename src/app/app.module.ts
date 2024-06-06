import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { LoginComponent } from './admin/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './admin/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryComponent } from './admin/category/category.component';
// import { ToggleButtonModule } from 'primeng/togglebutton'; 
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {InputSwitchModule} from 'primeng/inputswitch';
// import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { DialogModule } from 'primeng/dialog';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './admin/auth.interceptor';
import { ProductsComponent } from './admin/products/products.component';
import { FileUploadModule } from 'primeng/fileupload';
import { OrdersComponent } from './admin/orders/orders.component';
import { UsersComponent } from './admin/users/users.component';
import { BannersComponent } from './admin/banners/banners.component';
import {ChartModule} from 'primeng/chart';
import { OrderStatusChartComponent } from './admin/orders/order-status-chart/order-status-chart.component';
import { NotFoundComponent } from './admin/not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    FooterComponent,
    CategoryComponent,
    ProductsComponent,
    OrdersComponent,
    UsersComponent,
    BannersComponent,
    OrderStatusChartComponent,
    NotFoundComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot() ,
    HttpClientModule,
    BrowserAnimationsModule,
    TableModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    InputTextModule,
    ProgressBarModule,
    ButtonModule,
    ToastModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    ToggleButtonModule,
    InputSwitchModule,
    DialogModule,
    FileUploadModule,
    ChartModule
  ],

  providers: [
    MessageService,
    DialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
