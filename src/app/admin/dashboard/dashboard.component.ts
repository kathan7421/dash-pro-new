import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    
    let obj: any = localStorage.getItem('currentUser');
    let temp = JSON.parse(obj);
    this.currentUser = temp.name;
    console.log(this.currentUser);
  }
  // this.currentUser = this.authService.currentUserValue;

  logout() {
    this.authService.logout();
  }
}
