import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: any;
  loading = true;

  // payment popup
  showPayment = false;

  // frontend calculated subtotal
  subtotal = 0;

  constructor(
    private cartService: CartService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;

    this.cartService.getCart().subscribe({
      next: res => {
        this.cart = res;
        this.calculateSubtotal();
        this.loading = false;
      },
      error: () => {
        this.alert.show('Failed to load cart', 'error');
        this.loading = false;
      }
    });
  }

  calculateSubtotal(): void {
    if (!this.cart?.items) {
      this.subtotal = 0;
      return;
    }

    this.subtotal = this.cart.items.reduce(
      (sum: number, i: any) => sum + (i.book.price * i.quantity),
      0
    );
  }

  remove(bookId: number): void {
    this.cartService.remove(bookId).subscribe(() => {
      this.alert.show('Item removed', 'success');
      this.loadCart();
    });
  }

  clearCart(): void {
    this.cartService.clear().subscribe(() => {
      this.alert.show('Cart cleared', 'success');
      this.loadCart();
    });
  }

  // payment
  openPayment(): void {
    this.showPayment = true;
  }

  closePayment(): void {
    this.showPayment = false;
  }

  confirmPayment(method: string): void {
    this.alert.show(`Payment successful via ${method}`, 'success');
    this.showPayment = false;
    this.clearCart(); // optional
  }
}
