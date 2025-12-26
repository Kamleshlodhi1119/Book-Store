import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  isbn: string;
  imageUrl: string;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class BookService {

  private api = `${environment.apiBaseUrl}/books`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.api);
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.api}/${id}`);
  }

  search(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.api}/search?q=${query}`);
  }

  latest(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.api}/latest`);
  }

  topRated(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.api}/top-rated`);
  }
}
