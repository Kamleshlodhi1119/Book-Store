import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: any = null;
  loading = true;

  constructor(
    private cartService: CartService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: res => {
        this.cart = this.parseCart(res);
        this.loading = false;
      },
      error: () => {
        this.alertService.show('Failed to load cart', 'error');
        this.loading = false;
      }
    });
  }

  remove(bookId: number) {
    this.cartService.remove(bookId).subscribe({
      next: msg => {
        this.alertService.show(msg, 'success');
        this.loadCart();
      },
      error: () => this.alertService.show('Remove failed', 'error')
    });
  }

  clearCart() {
    this.cartService.clear().subscribe({
      next: msg => {
        this.alertService.show(msg, 'success');
        this.cart = null;
      },
      error: () => this.alertService.show('Clear cart failed', 'error')
    });
  }

  // 🔐 SAFE PARSER (TEXT → OBJECT)
  private parseCart(res: any): any {
    if (!res) return null;

    if (typeof res === 'string') {
      try {
        return JSON.parse(res);
      } catch {
        return null;
      }
    }
    return res;
  }
}
