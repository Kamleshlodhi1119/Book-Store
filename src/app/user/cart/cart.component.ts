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
    // Handling text response and error block
    this.cartService.remove(bookId).subscribe({
      next: () => {
        this.alert.show('Item removed from cart', 'success');
        this.loadCart();
      },
      error: (err) => {
        // If your service doesn't have responseType: 'text', 
        // we check if it's actually a successful deletion
        if (err.status === 200) {
          this.alert.show('Item removed', 'success');
          this.loadCart();
        } else {
          this.alert.show('Could not remove item', 'error');
        }
      }
    });
  }

  clearCart(): void {
    this.cartService.clear().subscribe({
      next: () => {
        this.alert.show('Cart cleared successfully', 'success');
        this.loadCart();
      },
      error: () => {
        this.alert.show('Failed to clear cart', 'error');
      }
    });
  }

  // payment
  openPayment(): void {
    if (this.cart?.items?.length > 0) {
      this.showPayment = true;
    } else {
      this.alert.show('Your cart is empty', 'error');
    }
  }

  closePayment(): void {
    this.showPayment = false;
  }

  confirmPayment(method: string): void {
    this.alert.show(`Payment successful via ${method}`, 'success');
    this.showPayment = false;
    this.clearCart(); 
  }
}