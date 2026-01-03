import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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

  book: Partial<Book> = {};
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.http.get<Book[]>(this.publicApi)
      .subscribe(res => {
        this.books = res.map(b => ({
          ...b,
          imageTimestamp: new Date().getTime() // initial timestamp
        }));
      });
  }

  openAdd(): void {
    this.isEdit = false;
    this.resetForm();
    this.showModal = true;
  }

  openEdit(b: Book): void {
    this.isEdit = true;
    this.book = { ...b };
    this.selectedFile = null;
    this.showModal = true;
  }
  onFileChange(event: any): void {
  this.selectedFile = event.target.files?.[0] || null;

  if (this.selectedFile) {
    // create a temporary preview URL
    const reader = new FileReader();
    reader.onload = e => this.previewUrl = reader.result as string;
    reader.readAsDataURL(this.selectedFile);
  } else {
    this.previewUrl = null; // reset if no file selected
  }
}

  // save(): void {
  //   if (!this.book.title || !this.book.authorName) return;

  //   const request = this.isEdit
  //     ? this.http.put<Book>(`${this.api}/${this.book.id}`, this.book)
  //     : this.http.post<Book>(this.api, this.book);

  //   request.subscribe(savedBook => {

  //     if (this.selectedFile && savedBook.id) {
  //       this.uploadImage(savedBook.id);
  //     }

  //     this.closeModal();
  //     this.load();
  //   });
  // }

  // uploadImage(bookId: number): void {
  //   const formData = new FormData();
  //   formData.append('file', this.selectedFile!, `${bookId}.png`);

  //   this.http.post(
  //     `http://localhost:8082/api/admin/books/${bookId}/image`,
  //     formData
  //   ).subscribe(() => {
  //     // update timestamp to reload image immediately
  //     const b = this.books.find(x => x.id === bookId);
  //     if (b) b.imageTimestamp = new Date().getTime();
  //   });
  // }

  save(): void {
  if (!this.book.title || !this.book.authorName) return;

  // Remove imageUrl before sending
  const bookData = { ...this.book };
  delete bookData.imageUrl; // prevent large base64 from being sent

  const request = this.isEdit
    ? this.http.put<Book>(`${this.api}/${this.book.id}`, bookData)
    : this.http.post<Book>(this.api, bookData);

  request.subscribe(savedBook => {
    if (this.selectedFile && savedBook.id) {
      this.uploadImage(savedBook.id);
    }
    this.closeModal();
    this.load();
  });
}

  uploadImage(bookId: number): void {
  const formData = new FormData();
  formData.append('file', this.selectedFile!, `${bookId}.png`);

  this.http.post(
    `http://localhost:8082/api/admin/books/${bookId}/image`,
    formData
  ).subscribe();
}


  toggleStatus(id: number, active: boolean): void {
    this.http.put(`${this.api}/${id}/status?active=${!active}`, {})
      .subscribe(() => this.load());
  }

  closeModal(): void {
    this.showModal = false;
    this.load();
    this.resetForm();
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
    this.selectedFile = null;  // remove selected file
  this.previewUrl = null;    // remove preview URL
  }

  // ----------------- IMAGE HELPERS -----------------

  getImageUrl(book: Partial<Book>): string {
    if (!book.imageUrl) return 'assets/book-placeholder.png';

    // backend image
    if (book.id) {
      return `http://localhost:8082/api/books/${book.id}/image?ts=${book.imageTimestamp || new Date().getTime()}`;
    }

    // fallback to placeholder
    return 'assets/book-placeholder.png';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/book-placeholder.png';
  }
}
