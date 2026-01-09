import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Book {
  id: number;
  title: string;
  authorName: string;
  price: number;
  isbn: string;
  imageUrl: string;
  stockQuantity: number;
  ratings?: any[];
  averageRating?: number;
}

@Injectable({ providedIn: 'root' })
export class BookService {

  private api = 'https://bookstore-h5qp.onrender.com/api/books';
  private authorApi = 'https://bookstore-h5qp.onrender.com/api/authors';

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

addRating(bookId: number, rating: number, comment: string, username: string) {
  const token = localStorage.getItem('token');
  
  return this.http.post(`${this.api}/${bookId}/rating`, 
    { rating, comment, username }, // 'username' is now just a placeholder
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
}


deleteRating(bookId: number): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.delete(`${this.api}/${bookId}/rating`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

getRatingsForBook(bookId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.api}/${bookId}/ratings`);
}
  filterBooks(params: any) {
    return this.http.get<Book[]>(`${this.api}/filter`, { params });
  }

  getAuthors(): Observable<any[]> {
    return this.http.get<any[]>(this.authorApi);
  }
}
