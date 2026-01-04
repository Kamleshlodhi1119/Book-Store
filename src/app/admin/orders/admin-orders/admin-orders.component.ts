import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/core/services/alert.service'; // Added

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: any[] = [];
  api = environment.apiUrl + '/admin/orders';

  constructor(
    private http: HttpClient, 
    private alertService: AlertService // Injected
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.http.get<any[]>(this.api)
      .subscribe({
        next: (res) => this.orders = res,
        error: () => this.alertService.show('Failed to load orders', 'error')
      });
  }

  updateStatus(id: number, status: string) {
    // Added responseType: 'text' to handle string messages from backend
    this.http.put(`${this.api}/${id}/status?status=${status}`, {}, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.alertService.show(`Order status updated to ${status}`, 'success');
          this.load(); // Refresh list
        },
        error: (err) => {
          console.error(err);
          this.alertService.show('Failed to update order status', 'error');
        }
      });
  }
}