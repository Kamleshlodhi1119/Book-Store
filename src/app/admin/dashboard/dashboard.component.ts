import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  books: any[] = [];

 constructor(
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router,
    private alertService: AlertService
  ) {}

 ngOnInit(): void {
    this.bookService.getAll().subscribe({
      next: (res) => {
        this.books = res as any[];
      },
      error: (err) => {
        console.error('Load error:', err);
        this.alertService.show('Failed to load books', 'error');
      }
    });
  }

  addToCart(bookId: number) {
   this.alertService.show('You Are Admin. Please login via User Account.', 'warning');   
  }

  addToWishlist(bookId: number) {
    this.alertService.show('You Are Admin. Please login via User Account.', 'warning');  }

 viewBook(id: number) {
  this.router.navigate(['/book-details', id]);
}
}
