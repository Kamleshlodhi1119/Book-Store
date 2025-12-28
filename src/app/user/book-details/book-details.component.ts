import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  book: any;
  loading = true;

  // rating form
  rating = 0;
  comment = '';

  isLoggedIn = false;
  username: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.isLoggedIn = this.authService.isLoggedIn();
    this.username = localStorage.getItem('email');

    if (id) {
      this.loadBook(id);
    }
  }

  loadBook(id: number) {
    this.loading = true;
    this.bookService.getById(id).subscribe({
      next: res => {
        this.book = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  addToCart() {
    this.cartService.add({ bookId: this.book.id, quantity: 1 }).subscribe();
  }

  addToWishlist() {
    this.wishlistService.add(this.book.id).subscribe();
  }
submitRating() {
  if (!this.isLoggedIn || this.rating === 0) return;

  const username = localStorage.getItem('email');
  if (!username) {
    console.error('Username missing');
    return;
  }

  this.bookService.addRating(
    this.book.id,
    this.rating,
    this.comment,
    username
  ).subscribe(() => {
    this.rating = 0;
    this.comment = '';
    this.loadBook(this.book.id);
  });
}
}
