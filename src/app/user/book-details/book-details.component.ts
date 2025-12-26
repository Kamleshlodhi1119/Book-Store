import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  book: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
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
      error: () => {
        this.alertService.show('Failed to load book details', 'error');
        this.loading = false;
      }
    });
  }

  addToCart() {
    this.cartService.add({ bookId: this.book.id, quantity: 1 }).subscribe({
      next: msg => this.alertService.show(msg, 'success'),
      error: () => this.alertService.show('Add to cart failed', 'error')
    });
  }

  addToWishlist() {
    this.wishlistService.add(this.book.id).subscribe({
      next: () => this.alertService.show('Added to wishlist', 'success'),
      error: () => this.alertService.show('Wishlist failed', 'error')
    });
  }
}
