import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/core/services/order.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.myOrders().subscribe({
      next: res => {
        this.orders = res as any[];
        this.loading = false;
      },
      error: () => {
        this.alertService.show('Failed to load orders', 'error');
        this.loading = false;
      }
    });
  }
}
