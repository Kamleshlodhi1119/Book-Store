import { Component, OnInit } from '@angular/core';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

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

  remove(bookId: number) {
    this.wishlist.remove(bookId).subscribe({
      next: msg => {
        this.alertService.show('Removed from wishlist', 'success');
        this.list = this.list.filter(w => w.book.id !== bookId);
      },
      error: () => this.alertService.show('Remove failed', 'error')
    });
  }
}
