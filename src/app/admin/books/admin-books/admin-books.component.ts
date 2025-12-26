import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrls: ['./admin-books.component.css']
})
export class AdminBooksComponent implements OnInit {

  books: any[] = [];
  api = environment.apiUrl + '/api/admin/books';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.http.get<any[]>(environment.apiUrl + '/api/books')
      .subscribe(res => this.books = res);
  }

  toggleStatus(id: number, active: boolean) {
    this.http.put(`${this.api}/${id}/status?active=${!active}`, {})
      .subscribe(() => this.load());
  }
}
