import { Component, OnInit } from '@angular/core';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  readonly imageApi = environment.bookImageBaseUrl;
  list: any[] = [];
  loading = true;

  constructor(
    private wishlist: WishlistService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.wishlist.get().subscribe({
      next: res => {
        this.list = res as any[];
        this.loading = false;
      },
      error: () => {
        this.alertService.show('Failed to load wishlist', 'error');
        this.loading = false;
      }
    });
  }

  // New method to handle the 2-second delay and animation
  handleRemove(item: any) {
    // 1. Start animation
    item.isRemoving = true;

    // 2. Wait 2 seconds then execute actual removal
    setTimeout(() => {
      this.remove(item.book.id);
    }, 2000);
  }

  remove(bookId: number) {
    this.wishlist.remove(bookId).subscribe({
      next: () => {
        this.alertService.show('Item removed', 'success');
        this.loadWishlist();
      },
      error: () => this.loadWishlist() 
    });
  }
}