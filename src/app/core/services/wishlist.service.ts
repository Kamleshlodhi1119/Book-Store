import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { WishlistItem } from '../models/wishlist-item';

@Injectable({ providedIn: 'root' })
export class WishlistService {

  private api = `${environment.apiBaseUrl}/wishlist`;

  constructor(private http: HttpClient) {}

  get(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(this.api);
  }

  add(bookId: number): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(`${this.api}/add/${bookId}`, {});
  }

  remove(bookId: number): Observable<any> {
    return this.http.delete(`${this.api}/remove/${bookId}`);
  }
}
