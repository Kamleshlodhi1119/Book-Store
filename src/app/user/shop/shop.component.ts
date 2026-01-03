import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  books: any[] = [];
  filtered: any[] = [];
  authors: any[] = [];

  loading = true;
  maxBookPrice = 0;

  filters = {
    name: '',
    author: '',
    maxPrice: 0
  };

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private alertService: AlertService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
  }

  loadBooks() {
    this.loading = true;

    this.bookService.getAll().subscribe({
      next: res => {
        this.books = res as any[];
        this.filtered = res as any[];
        this.maxBookPrice = Math.max(...this.books.map(b => b.price));
        this.filters.maxPrice = this.maxBookPrice;
        this.loading = false;
      },
      error: () => {
        this.alertService.show('Failed to load books', 'error');
        this.loading = false;
      }
    });
  }


loadAuthors() {
  this.bookService.getAuthors().subscribe({
    next: res => this.authors = res,
    error: () => this.alertService.show('Failed to load authors', 'error')
  });
}


applyFilters() {

  const params: any = {};

  if (this.filters.name?.trim()) {
    params.name = this.filters.name.trim();
  }

  if (this.filters.author) {
    params.author = this.filters.author;
  }

  if (this.filters.maxPrice > 0) {
    params.maxPrice = this.filters.maxPrice;
  }

  console.log('FILTER PARAMS 👉', params); // 🔥 IMPORTANT

  this.bookService.filterBooks(params).subscribe({
    next: res => this.filtered = res,
    error: err => console.error('Filter error', err)
  });
}


  addToCart(bookId: number) {
    this.cartService.add({ bookId, quantity: 1 }).subscribe({
      next: msg => this.alertService.show(msg, 'success'),
      error: () => this.alertService.show('Add to cart failed', 'error')
    });
  }

  addToWishlist(bookId: number) {
    this.wishlistService.add(bookId).subscribe({
      next: () => this.alertService.show('Added to wishlist', 'success'),
      error: () => this.alertService.show('Wishlist failed', 'error')
    });
  }

  viewBook(id: number) {
    this.router.navigate(['/book-details', id]);
  }
}
