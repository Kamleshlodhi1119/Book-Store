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
  api = environment.apiUrl + '/admin/books';

  showModal = false;
  isEdit = false;

  book = {
    id: null as number | null,
    title: '',
    authorName: '',
    price: 0,
    stockQuantity: 0,
    description: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.http.get<any[]>(environment.apiUrl + '/books')
      .subscribe(res => this.books = res);
  }

  // OPEN ADD POPUP
  openAdd(): void {
    this.isEdit = false;
    this.resetForm();
    this.showModal = true;
  }

  // OPEN EDIT POPUP
  openEdit(b: any): void {
    this.isEdit = true;
    this.book = { ...b };
    this.showModal = true;
  }

  save(): void {
    if (!this.book.title || !this.book.authorName) return;

    const req = this.isEdit
      ? this.http.put(`${this.api}/${this.book.id}`, this.book)
      : this.http.post(this.api, this.book);

    req.subscribe(() => {
      this.closeModal();
      this.load();
    });
  }

  toggleStatus(id: number, active: boolean): void {
    this.http.put(`${this.api}/${id}/status?active=${!active}`, {})
      .subscribe(() => this.load());
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.book = {
      id: null,
      title: '',
      authorName: '',
      price: 0,
      stockQuantity: 0,
      description: ''
    };
  }
}
