import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'; 
import { Book } from 'src/app/core/models/book';

@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrls: ['./admin-books.component.css']
})
export class AdminBooksComponent implements OnInit {

  books: Book[] = [];
  api = 'http://localhost:8082/api/admin/books';

  showModal = false;
  isEdit = false;

  book: Partial<Book> = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.http.get<Book[]>('http://localhost:8082/api/books')
      .subscribe(res => this.books = res);
  }

  openAdd(): void {
    this.isEdit = false;
    this.book = {};
    this.showModal = true;
  }

  openEdit(b: Book): void {
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
      this.showModal = false;
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
      // id: null,
      title: '',
      authorName: '',
      price: 0,
      stockQuantity: 0,
      description: '',
      imageUrl: '' 
    };
  }
}
