import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/core/services/alert.service';
import { AdminOrder } from 'src/app/core/models/admin-orders.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: AdminOrder[] = [];
  api = `${environment.apiBaseUrl}/admin/orders`;
  loading = false;

  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;

    this.http.get<AdminOrder[]>(this.api).subscribe({
      next: res => {
        this.orders = res;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.alertService.show('Failed to load admin orders', 'error');
        this.loading = false;
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.http.put(
      `${this.api}/${id}/status?status=${status}`,
      {},
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        this.alertService.show(`Order marked as ${status}`, 'success');
        this.load();
      },
      error: err => {
        console.error(err);
        this.alertService.show('Failed to update order', 'error');
      }
    });
  }
}
