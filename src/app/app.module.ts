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


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    FooterComponent,
    CategoryComponent
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
    FormsModule,
    ToggleButtonModule,
    InputSwitchModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
