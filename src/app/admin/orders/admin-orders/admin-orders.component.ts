import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: any[] = [];
  api = environment.apiUrl + '/api/admin/orders';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>(this.api).subscribe(res => this.orders = res);
  }

  updateStatus(id: number, status: string) {
    this.http.put(`${this.api}/${id}/status?status=${status}`, {})
      .subscribe();
  }
}