import { Component, OnInit } from '@angular/core';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';
import { WishlistItem } from 'src/app/core/models/wishlist-item';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  readonly imageApi = environment.bookImageBaseUrl;
  list: WishlistItem[] = [];
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
        this.list = res;
        this.loading = false;
      },
      error: () => {
        this.alertService.show('Failed to load wishlist', 'error');
        this.loading = false;
      }
    });
  }

  handleRemove(item: WishlistItem) {
    item.isRemoving = true;

    setTimeout(() => {
      this.remove(item.bookId);
    }, 500); // 0.5s feels better UX than 2s
  }

  remove(bookId: number) {
    this.wishlist.remove(bookId).subscribe({
      next: () => {
        this.alertService.show('Item removed', 'success');
        this.list = this.list.filter(i => i.bookId !== bookId);
      },
      error: () => this.loadWishlist()
    });
  }
}
