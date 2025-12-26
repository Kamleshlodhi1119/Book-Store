import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private api = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  place(): Observable<{ orderId: number }> {
    return this.http.post<{ orderId: number }>(`${this.api}/place`, {});
  }


myOrders(): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.api}/my`);
}


  getById(id: number): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
  }
}
