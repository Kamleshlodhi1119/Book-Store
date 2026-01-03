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
private api = 'http://localhost:8082/api/books';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.api);
  }

  getAllbyAdmin(): Observable<Book[]> {
    return this.http.get<Book[]>(this.api+" /byadmin");
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




  addRating(
    bookId: number,
    rating: number,
    comment: string,
    username: string
  ) {
    return this.http.post(
      `${this.api}/${bookId}/rating` +
      `?rating=${rating}&comment=${encodeURIComponent(comment)}&username=${username}`,
      {}
    );
  }
}