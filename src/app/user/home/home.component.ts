import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class UserHomeComponent implements OnInit {
  readonly imageApi = environment.bookImageBaseUrl;

  books: any[] = [];
 authors: any[] = [];
  displayAuthors: any[] = [];
  MAX_AUTHORS = 4;


  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.bookService.getAll().subscribe({
      next: res => this.books = res as any[],
      error: () => this.alertService.show('Failed to load books', 'error')
    });

      this.loadAuthors();
  }
loadAuthors() {
    this.bookService.getAuthors().subscribe({
      next: res => {
        this.authors = res;
        this.pickRandomAuthors();
      },
      error: err => {
        console.error('Failed to load authors', err);
      }
    });
  }

  pickRandomAuthors() {
    const shuffled = [...this.authors]
      .sort(() => 0.5 - Math.random());

    this.displayAuthors = shuffled.slice(0, this.MAX_AUTHORS);
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
