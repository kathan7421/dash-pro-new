import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { OrderStatusCounts } from '../orders.model';

@Component({
  selector: 'app-order-status-chart',
  templateUrl: './order-status-chart.component.html',
  styleUrls: ['./order-status-chart.component.css']
})
export class OrderStatusChartComponent implements OnInit {
  data: any;
  options: any;

  constructor(private orderService: OrdersService) {}

  ngOnInit() {
    this.orderService.getOrderStatusCounts().subscribe((response: OrderStatusCounts) => {
      const counts = response.data;
      this.data = {
        labels: Object.keys(counts).map(key => this.getStatusLabel(key)),
        datasets: [
          {
            data: Object.values(counts),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF"
            ]
          }
        ]
      };
    });

    this.options = {
      responsive: true,
      maintainAspectRatio: false
    };
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case '1':
        return 'Pending';
      case '2':
        return 'Process';
      case '3':
        return 'Shipped';
      case '4':
        return 'Completed';
      case '5':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }
}
