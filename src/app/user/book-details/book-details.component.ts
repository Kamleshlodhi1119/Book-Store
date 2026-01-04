import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  book: any = null;
  loading = true;

  rating = 0;
  comment = '';

  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoggedIn = this.authService.isLoggedIn();

    if (id) {
      this.loadBook(id);
    } else {
      this.loading = false;
    }
  }

  loadBook(id: number) {
    this.loading = true;
    this.bookService.getById(id).subscribe({
      next: res => {
        this.book = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.show('Failed to load book details', 'error');
      }
    });
  }

  addToCart() {
    if (!this.book) return;

    this.cartService.add({ bookId: this.book.id, quantity: 1 }).subscribe({
      next: () => this.alertService.show('Added to cart', 'success'),
      error: err => {
        if (err.status === 200) {
          this.alertService.show('Added to cart', 'success');
        } else {
          this.alertService.show('Failed to add to cart', 'error');
        }
      }
    });
  }

  addToWishlist() {
    if (!this.book) return;

    this.wishlistService.add(this.book.id).subscribe({
      next: () => this.alertService.show('Added to wishlist', 'success'),
      error: () => this.alertService.show('Failed to add to wishlist', 'error')
    });
  }

  submitRating() {
    if (!this.isLoggedIn) {
      this.alertService.show('Please login to submit a rating', 'error');
      return;
    }

    if (this.rating === 0) {
      this.alertService.show('Please select a star rating', 'error');
      return;
    }

    if (!this.book) return;

    const email = localStorage.getItem('email');
    if (!email) return;

    this.bookService.addRating(
      this.book.id,
      this.rating,
      this.comment,
      email
    ).subscribe({
      next: () => {
        this.alertService.show('Rating submitted successfully', 'success');
        this.rating = 0;
        this.comment = '';
        this.loadBook(this.book.id);
      },
      error: () => this.alertService.show('Failed to submit rating', 'error')
    });
  }
}
