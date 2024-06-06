import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service.service';
import { ActivatedRoute } from '@angular/router';
import { Counts } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  counts!: Counts;
  categories: number = 0;
  data: any;
  options: any;
  constructor(private authService: AuthService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    
    let obj: any = localStorage.getItem('currentUser');
    let temp = JSON.parse(obj);
    this.currentUser = temp.name;
    console.log(this.currentUser);

    this.route.data.subscribe((data: any) => {
      this.counts = data; // Assign the entire object to this.counts
      this.categories = this.counts.counts.data.categories
     
    });

    //chart
    this.data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }
      ]
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false
    };
  }
    
  
  // this.currentUser = this.authService.currentUserValue;

  logout() {
    this.authService.logout();
  }
}
