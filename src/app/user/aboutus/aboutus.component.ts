import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { Book } from 'src/app/core/services/book.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent  implements OnInit {
  books: Book[] = [];
  loadingBooks = true;
  booksFailed = false;

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedBooks();
  }

  loadFeaturedBooks(): void {
    this.loadingBooks = true;
    this.booksFailed = false;
    this.bookService.topRated().subscribe({
      next: books => {
        this.books = books;
        this.loadingBooks = false;
      },
      error: () => {
        this.booksFailed = true;
        this.loadingBooks = false;
        this.alertService.show('Failed to load featured books', 'error');
      }
    });
  }

  trackBookById(_index: number, book: Book): number {
    return book.id;
  }

  addToCart(bookId: number) {
    this.cartService.add({ bookId, quantity: 1 }).subscribe({
      next: msg => this.alertService.show('Added to cart', 'success'),
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
