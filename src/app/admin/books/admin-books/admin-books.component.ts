import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/core/services/alert.service'; // Added

export interface Book {
  id: number;
  title: string;
  authorName: string;
  description: string;
  price: number;
  stockQuantity: number;
  isbn?: string;
  imageUrl?: string | null;
  averageRating?: number;
  active: boolean;
  imageTimestamp?: number; // for cache-busting
}

@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrls: ['./admin-books.component.css']
})
export class AdminBooksComponent implements OnInit {

  books: Book[] = [];

  api = 'http://localhost:8082/api/admin/books';
  publicApi = 'http://localhost:8082/api/books';

  showModal = false;
  isEdit = false;
  isDelete = false;  

  book: Partial<Book> = {};
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private http: HttpClient, private alertService: AlertService) {} // Added AlertService

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.http.get<Book[]>(this.publicApi + "/byadmin")
      .subscribe({
        next: (res) => {
          this.books = res.map(b => ({
            ...b,
            imageTimestamp: new Date().getTime() 
          }));
        },
        error: () => this.alertService.show('Error loading books', 'error')
      });
  }

  openAdd(): void {
    this.isEdit = false;
    this.isDelete = false;
    this.resetForm();
    this.showModal = true;
  }

  openEdit(b: Book): void {
    this.isEdit = true;
    this.isDelete = false;
    this.book = { ...b };
    this.selectedFile = null;
    this.showModal = true;
  }

  openDelete(b: Book): void {
    this.isDelete = true;
    this.isEdit = false;
    this.book = { ...b };
    this.selectedFile = null;
    this.showModal = true;
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files?.[0] || null;

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.previewUrl = null;
    }
  }

  save(): void {
    if (!this.book.title || !this.book.authorName) return;

    const bookData = { ...this.book };
    delete bookData.imageUrl;

    const request = this.isEdit
      ? this.http.put<Book>(`${this.api}/${this.book.id}`, bookData)
      : this.http.post<Book>(this.api, bookData);

    request.subscribe({
      next: (savedBook) => {
        if (this.selectedFile && savedBook.id) this.uploadImage(savedBook.id);
        this.alertService.show('Book saved successfully', 'success');
        this.closeModal();
        this.load();
      },
      error: () => this.alertService.show('Error saving book', 'error')
    });
  }

  uploadImage(bookId: number): void {
    const formData = new FormData();
    formData.append('file', this.selectedFile!, `${bookId}.png`);

    this.http.post(`${this.api}/${bookId}/image`, formData, { responseType: 'text' })
      .subscribe({
        next: () => this.alertService.show('Image uploaded', 'success'),
        error: () => this.alertService.show('Image upload failed', 'error')
      });
  }

  toggleStatus(id: number, active: boolean): void {
    this.http.put(`${this.api}/${id}/status?active=${!active}`, {}, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.alertService.show('Status updated', 'success');
          this.load();
        },
        error: () => this.alertService.show('Failed to update status', 'error')
      });
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
    this.isEdit = false;
    this.isDelete = false;
  }

  private resetForm(): void {
    this.book = {
      title: '',
      authorName: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      imageUrl: null
    };
    this.selectedFile = null;
    this.previewUrl = null;
  }

  getImageUrl(book: Partial<Book>): string {
    if (!book.imageUrl) return 'assets/book-placeholder.png';
    if (book.id) {
      return `http://localhost:8082/api/books/${book.id}/image?ts=${book.imageTimestamp || new Date().getTime()}`;
    }
    return 'assets/book-placeholder.png';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/book-placeholder.png';
  }

  addBook(): void {
    if (!this.book.title || !this.book.authorName) return;

    const bookData = { ...this.book };
    delete bookData.imageUrl;

    this.http.post<Book>(this.api, bookData).subscribe({
      next: (savedBook) => {
        if (this.selectedFile && savedBook.id) this.uploadImage(savedBook.id);
        this.alertService.show('Book added', 'success');
        this.cancelAdd();
        this.load();
      },
      error: () => this.alertService.show('Failed to add book', 'error')
    });
  }

  cancelAdd(): void {
    this.showModal = false;
    this.resetForm();
  }

  deleteBook(): void {
    if (!this.book.id) return;

    this.http.delete(`${this.api}/${this.book.id}`, { responseType: 'text' }).subscribe({
      next: () => {
        this.alertService.show('Book deleted', 'success');
        this.closeModal();
        this.load();
      },
      error: () => this.alertService.show('Delete failed', 'error')
    });
  }
}