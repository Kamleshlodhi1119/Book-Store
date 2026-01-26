import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';
import { environment } from 'src/environments/environment';
import { CartResponse } from 'src/app/core/models/cart-item';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  readonly imageApi = environment.bookImageBaseUrl;

  cart: CartResponse | null = null;
  loading = true;

  // payment popup
  showPayment = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private alert: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // ---------------- LOAD CART ----------------

  loadCart(): void {
    this.loading = true;

    this.cartService.getCart().subscribe({
      next: (res: CartResponse) => {
        this.cart = res;
        this.loading = false;
      },
      error: () => {
        this.alert.show('Failed to load cart', 'error');
        this.cart = null;
        this.loading = false;
      }
    });
  }

  // ---------------- CART ACTIONS ----------------

  updateQuantity(bookId: number, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.cartService.update({
      bookId,
      quantity: newQuantity
    }).subscribe({
      next: () => this.loadCart(),
      error: () => {
        this.alert.show('Failed to update quantity', 'error');
      }
    });
  }

  remove(bookId: number): void {
    this.cartService.remove(bookId).subscribe({
      next: () => {
        this.alert.show('Item removed from cart', 'success');
        this.loadCart();
      },
      error: () => {
        this.alert.show('Could not remove item', 'error');
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

  // ---------------- PAYMENT ----------------

  openPayment(): void {
    if (!this.cart || this.cart.items.length === 0) {
      this.alert.show('Your cart is empty', 'error');
      return;
    }
    this.showPayment = true;
  }

  closePayment(): void {
    this.showPayment = false;
  }

  confirmPayment(method: string): void {
    this.loading = true;
    this.showPayment = false;

    this.orderService.place().subscribe({
      next: () => {
        this.alert.show(`Payment successful via ${method}. Order placed!`, 'success');
        this.cart = null;
        this.loading = false;
        this.router.navigate(['/my-orders']);
      },
      error: () => {
        this.loading = false;
        this.alert.show('Payment verified but failed to create order', 'error');
      }
    });
  }
}
