import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {

  private api = `${environment.apiBaseUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<string> {
    return this.http.get(this.api, { responseType: 'text' });
  }

  add(data: { bookId: number; quantity: number }): Observable<string> {
    return this.http.post(`${this.api}/add`, data, { responseType: 'text' });
  }

  update(data: any): Observable<string> {
    return this.http.put(`${this.api}/update`, data, { responseType: 'text' });
  }

  remove(bookId: number): Observable<string> {
    return this.http.delete(`${this.api}/remove/${bookId}`, { responseType: 'text' });
  }

  clear(): Observable<string> {
    return this.http.delete(`${this.api}/clear`, { responseType: 'text' });
  }
}
