import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';
import { CartResponse } from 'src/app/core/models/cart-item';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: CartResponse | null = null;
  loading = true;
  loadFailed = false;
  updatingBookId: number | null = null;

  showOrderConfirmation = false;
  ordering = false;

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
    this.loadFailed = false;

    this.cartService.getCart().subscribe({
      next: (res: CartResponse) => {
        this.cart = res;
        this.loading = false;
      },
      error: () => {
        this.alert.show('Failed to load cart', 'error');
        this.cart = null;
        this.loadFailed = true;
        this.loading = false;
      }
    });
  }

  // ---------------- CART ACTIONS ----------------

  updateQuantity(bookId: number, newQuantity: number): void {
    if (newQuantity < 1 || this.updatingBookId !== null) return;
    const item = this.cart?.items.find(cartItem => cartItem.bookId === bookId);
    if (!item) return;

    this.updatingBookId = bookId;
    this.cartService.update({
      bookId,
      quantity: newQuantity
    }).subscribe({
      next: () => {
        if (this.cart) {
          const items = this.cart.items.map(cartItem =>
            cartItem.bookId === bookId
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          );
          this.cart = {
            ...this.cart,
            items,
            totalAmount: items.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0)
          };
        }
        this.updatingBookId = null;
      },
      error: () => {
        this.updatingBookId = null;
        this.alert.show('Failed to update quantity', 'error');
      }
    });
  }

  remove(bookId: number): void {
    this.cartService.remove(bookId).subscribe({
      next: () => {
        this.alert.show('Item removed from cart', 'success');
        if (this.cart) {
          const items = this.cart.items.filter(item => item.bookId !== bookId);
          this.cart = {
            ...this.cart,
            items,
            totalAmount: items.reduce((total, item) => total + item.price * item.quantity, 0)
          };
        }
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
        this.cart = { items: [], totalAmount: 0 };
      },
      error: () => {
        this.alert.show('Failed to clear cart', 'error');
      }
    });
  }

  // ---------------- PAYMENT ----------------

  openOrderConfirmation(): void {
    if (!this.cart || this.cart.items.length === 0) {
      this.alert.show('Your cart is empty', 'error');
      return;
    }
    this.showOrderConfirmation = true;
  }

  closeOrderConfirmation(): void {
    if (!this.ordering) {
      this.showOrderConfirmation = false;
    }
  }

  confirmOrder(): void {
    if (this.ordering) return;
    this.ordering = true;

    this.orderService.place().subscribe({
      next: () => {
        this.alert.show('Your order was placed successfully', 'success');
        this.cart = null;
        this.ordering = false;
        this.showOrderConfirmation = false;
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.ordering = false;
        this.alert.show('Could not place your order. Please try again.', 'error');
      }
    });
  }
}
