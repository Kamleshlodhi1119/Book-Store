import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/core/services/order.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Order } from 'src/app/core/models/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [];
  loading = true;
  loadFailed = false;

  constructor(
    private orderService: OrderService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.loadFailed = false;
    this.orderService.myOrders().subscribe({
      next: res => {
        this.orders = res;
        this.loading = false;
      },
      error: () => {
        this.loadFailed = true;
        this.alertService.show('Failed to load orders', 'error');
        this.loading = false;
      }
    });
  }

  trackOrderById(_index: number, order: Order): number {
    return order.id;
  }
}
