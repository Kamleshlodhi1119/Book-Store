import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  readonly imageApi = environment.bookImageBaseUrl;
  book: any = null;
  bookRatings: any[] = []; // Direct list from the Ratings entity
  loading = true;

  rating = 0;
  comment = '';
  isLoggedIn = false;
  currentUserEmail: string | null = null; // Used to identify your own review

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

    // 1. If logged in, find out who "I am" to enable the Delete button
    if (this.isLoggedIn) {
      this.authService.me().subscribe({
        next: (user) => {
          this.currentUserEmail = user.email || user.username;
        }
      });
    }

    // 2. Load Book and its specific reviews
    if (id) {
      this.loadBook(id);
    } else {
      this.loading = false;
    }
  }

  loadBook(id: number) {
    this.loading = true;
    this.bookService.getById(id).subscribe({
      next: (res) => {
        this.book = res;
        this.loadReviews(id); // Separate call to fix Lazy Loading issue
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.show('Failed to load book details', 'error');
      }
    });
  }

  loadReviews(bookId: number) {
    this.bookService.getRatingsForBook(bookId).subscribe({
      next: (res) => {
        this.bookRatings = res;
      },
      error: (err) => console.error('Could not load reviews', err)
    });
  }

  // Check if a specific review username matches the logged-in user
  isMyReview(reviewUsername: string): boolean {
    return this.currentUserEmail === reviewUsername;
  }

  submitRating() {
    if (this.rating === 0) {
      this.alertService.show('Please select stars', 'error');
      return;
    }

    this.bookService.addRating(this.book.id, this.rating, this.comment, "user")
      .subscribe({
        next: () => {
          this.alertService.show('Review saved!', 'success');
          this.rating = 0;
          this.comment = '';
          this.loadReviews(this.book.id); // Refresh only the review list
        },
        error: () => this.alertService.show('Failed to save review', 'error')
      });
  }

  deleteMyReview() {
    if (confirm('Are you sure you want to delete your review?')) {
      this.bookService.deleteRating(this.book.id).subscribe({
        next: () => {
          this.alertService.show('Review deleted', 'success');
          this.loadReviews(this.book.id); // Instantly remove from UI
        },
        error: () => this.alertService.show('Failed to delete review', 'error')
      });
    }
  }

  addToCart() {
    if (!this.book) return;
    this.cartService.add({ bookId: this.book.id, quantity: 1 }).subscribe({
      next: () => this.alertService.show('Added to cart', 'success'),
      error: (err) => {
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
}