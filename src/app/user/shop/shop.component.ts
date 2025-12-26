import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  books: any[] = [];
  filtered: any[] = [];
  loading = true;
  searchText = '';

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    this.bookService.getAll().subscribe({
      next: res => {
        this.books = res as any[];
        this.filtered = this.books;
        this.loading = false;
      },
      error: () => {
        this.alertService.show('Failed to load books', 'error');
        this.loading = false;
      }
    });
  }

  search() {
    const q = this.searchText.toLowerCase();
    this.filtered = this.books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q)
    );
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
    this.router.navigate(['/books', id]);
  }
}
