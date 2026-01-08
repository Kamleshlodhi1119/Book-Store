import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/core/services/order.service';

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

// Add OrderService to your constructor
constructor(
  private cartService: CartService,
  private orderService: OrderService, // Inject this
  private alert: AlertService,
  private router: Router // Optional: to redirect after order
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

  // Inside CartComponent class

updateQuantity(bookId: number, newQuantity: number): void {
  if (newQuantity < 1) return; // Prevent negative or zero quantity

  const updateData = {
    bookId: bookId,
    quantity: newQuantity
  };

  this.cartService.update(updateData).subscribe({
    next: () => {
      // Reload the cart to get updated prices and totals from backend
      this.loadCart();
    },
    error: (err) => {
      this.alert.show('Failed to update quantity', 'error');
      console.error(err);
    }
  });
}

  // payment
  // openPayment(): void {
  //   if (this.cart?.items?.length > 0) {
  //     this.showPayment = true;
  //   } else {
  //     this.alert.show('Your cart is empty', 'error');
  //   }
  // }

  closePayment(): void {
    this.showPayment = false;
  }

  // confirmPayment(method: string): void {
  //   this.alert.show(`Payment successful via ${method}`, 'success');
  //   this.showPayment = false;
  //   this.clearCart(); 
  // }


// New checkout method to skip payment
checkout(): void {
  if (!this.cart?.items?.length) {
    this.alert.show('Your cart is empty', 'error');
    return;
  }

  this.loading = true;
  this.orderService.place().subscribe({
    next: (res) => {
      this.alert.show('Order placed successfully!', 'success');
      this.cart = null; // Clear local cart
      this.subtotal = 0;
      this.loading = false;
      // Optional: Navigate to my-orders page
      // this.router.navigate(['/orders']); 
    },
    error: (err) => {
      this.loading = false;
      this.alert.show('Failed to place order', 'error');
    }
  });
}



// Inside CartComponent class

// 1. Open the modal (The button in HTML will call this)
openPayment(): void {
  if (this.cart?.items?.length > 0) {
    this.showPayment = true;
  } else {
    this.alert.show('Your cart is empty', 'error');
  }
}

// 2. This is called when a user clicks 'UPI', 'Card', etc., inside the modal
confirmPayment(method: string): void {
  this.loading = true;
  this.showPayment = false; // Close modal

  // Now we call the backend to actually create the order
  this.orderService.place().subscribe({
    next: (res) => {
      this.alert.show(`Payment successful via ${method}. Order placed!`, 'success');
      this.cart = null; 
      this.subtotal = 0;
      this.loading = false;
      this.router.navigate(['/my-orders']); // Redirect to orders page
    },
    error: (err) => {
      this.loading = false;
      this.alert.show('Payment verified but failed to create order', 'error');
      console.error(err);
    }
  });
}


}