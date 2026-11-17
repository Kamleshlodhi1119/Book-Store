import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Book as CatalogBook } from 'src/app/core/services/book.service';

interface BookDetails extends CatalogBook {
  description: string;
}

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  book: BookDetails | null = null;
  bookRatings: any[] = []; // Direct list from the Ratings entity
  loading = true;
  bookNotFound = false;
  reviewsLoading = false;
  reviewsFailed = false;
  submittingReview = false;

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
    this.isLoggedIn = this.authService.isLoggedIn();

    // 1. If logged in, find out who "I am" to enable the Delete button
    if (this.isLoggedIn) {
      this.authService.me().subscribe({
        next: (user) => {
          this.currentUserEmail = user.email || user.username;
        }
      });
    }

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.book = null;
      this.bookRatings = [];
      this.bookNotFound = false;
      if (Number.isInteger(id) && id > 0) {
        this.loadBook(id);
      } else {
        this.loading = false;
        this.bookNotFound = true;
      }
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.bookService.getById(id).subscribe({
      next: (res) => {
        this.book = { ...res, description: res.description || '' };
        this.loadReviews(id); // Separate call to fix Lazy Loading issue
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.bookNotFound = true;
        this.alertService.show('Failed to load book details', 'error');
      }
    });
  }

  loadReviews(bookId: number): void {
    this.reviewsLoading = true;
    this.bookService.getRatingsForBook(bookId).subscribe({
      next: (res) => {
        this.bookRatings = res;
        this.reviewsLoading = false;
        this.reviewsFailed = false;
      },
      error: () => {
        this.reviewsLoading = false;
        this.reviewsFailed = true;
        this.alertService.show('Could not load book reviews', 'error');
      }
    });
  }

  // Check if a specific review username matches the logged-in user
  isMyReview(reviewUsername: string): boolean {
    return this.currentUserEmail === reviewUsername;
  }

  submitRating(): void {
    if (!this.book || this.submittingReview) return;
    const bookId = this.book.id;
    if (this.rating === 0) {
      this.alertService.show('Please select stars', 'error');
      return;
    }

    this.submittingReview = true;
    this.bookService.addRating(bookId, this.rating, this.comment, 'user')
      .subscribe({
        next: () => {
          this.alertService.show('Review saved!', 'success');
          this.rating = 0;
          this.comment = '';
          this.submittingReview = false;
          this.loadReviews(bookId);
        },
        error: () => {
          this.submittingReview = false;
          this.alertService.show('Failed to save review', 'error');
        }
      });
  }

  deleteMyReview(): void {
    if (!this.book) return;
    const bookId = this.book.id;
    if (confirm('Are you sure you want to delete your review?')) {
      this.bookService.deleteRating(bookId).subscribe({
        next: () => {
          this.alertService.show('Review deleted', 'success');
          this.loadReviews(bookId);
        },
        error: () => this.alertService.show('Failed to delete review', 'error')
      });
    }
  }

  addToCart(): void {
    if (!this.book) return;
    this.cartService.add({ bookId: this.book.id, quantity: 1 }).subscribe({
      next: () => this.alertService.show('Added to cart', 'success'),
      error: () => this.alertService.show('Failed to add to cart', 'error')
    });
  }

  addToWishlist(): void {
    if (!this.book) return;
    this.wishlistService.add(this.book.id).subscribe({
      next: () => this.alertService.show('Added to wishlist', 'success'),
      error: () => this.alertService.show('Failed to add to wishlist', 'error')
    });
  }
}