import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {

  private api = `${environment.apiBaseUrl}/wishlist`;

  constructor(private http: HttpClient) {}

get() {
  return this.http.get<any[]>(this.api);
}


  add(bookId: number): Observable<string> {
    return this.http.post<string>(`${this.api}/add/${bookId}`, {});
  }

  remove(bookId: number): Observable<string> {
    return this.http.delete<string>(`${this.api}/remove/${bookId}`);
  }
}
