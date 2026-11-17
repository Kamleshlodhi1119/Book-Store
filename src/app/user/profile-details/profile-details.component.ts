import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CartResponse } from 'src/app/core/models/cart-item';
import { Order } from 'src/app/core/models/order';
import { WishlistItem } from 'src/app/core/models/wishlist-item';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { OrderService } from 'src/app/core/services/order.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';


interface UserProfile {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {

  // ================= PROFILE =================
  profile: UserProfile = {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    avatarUrl: ''
  };
  private profileBackup: UserProfile = { ...this.profile };
  loadingProfile = true;
  profileLoaded = false;

  editMode = false;
  avatarEditMode = false;
  passwordMode = false;

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  loading = false;
  message = '';

  private api = `${environment.apiBaseUrl}/profile`;



  // ================= AVATAR UPLOAD =================
uploadingAvatar = false;
uploadProgress = 0;

onAvatarSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files.length) return;

  const file = input.files[0];

  // Frontend validation
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    this.message = 'Only PNG, JPG, JPEG, WEBP allowed';
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    this.message = 'Image must be under 2MB';
    return;
  }

  this.uploadAvatar(file);
}

uploadAvatar(file: File) {
  this.uploadingAvatar = true;
  this.message = '';

  const formData = new FormData();
  formData.append('file', file);

  this.http.post(
    `${this.api}/avatar/upload`,
    formData,
    {
      reportProgress: true,
      observe: 'events'
    }
  ).subscribe({
    next: (event: any) => {
      if (event.type === 1 && event.total) {
        this.uploadProgress = Math.round(
          (event.loaded / event.total) * 100
        );
      }

      if (event.body) {
        this.profile.avatarUrl = event.body;
        this.profileBackup.avatarUrl = event.body;
        this.uploadingAvatar = false;
        this.avatarEditMode = false;
        this.message = 'Avatar uploaded successfully';
      }
    },
    error: err => {
      this.uploadingAvatar = false;
      this.message = err.error || 'Upload failed';
    }
  });
}

  // ================= STORE DATA =================
  cart: CartResponse = { items: [], totalAmount: 0 };
  wishlist: WishlistItem[] = [];
  orders: Order[] = [];
  authors: string[] = [];

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private orderService: OrderService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadCart();
    this.loadWishlist();
    this.loadOrders();
    this.loadAuthors();
  }

  // ================= PROFILE =================
  loadProfile() {
    this.http.get<UserProfile>(`${this.api}/me`).subscribe({
      next: data => {
        this.profile = data;
        this.profileBackup = { ...data };
        this.loadingProfile = false;
        this.profileLoaded = true;
      },
      error: () => {
        this.message = 'Failed to load profile';
        this.loadingProfile = false;
      }
    });
  }

  enableEdit() {
    this.editMode = true;
    this.passwordMode = false;
    this.message = '';
  }

  cancelEdit() {
    this.profile = { ...this.profileBackup };
    this.editMode = false;
    this.avatarEditMode = false;
  }

  saveProfile() {
    this.loading = true;
    this.message = '';

    const payload = {
      fullName: this.profile.fullName,
      phone: this.profile.phone,
      address: this.profile.address,
      city: this.profile.city,
      country: this.profile.country
    };

    this.http.put<UserProfile>(`${this.api}/update`, payload)
      .subscribe({
        next: data => {
          this.profile = data;
          this.profileBackup = { ...data };
          this.editMode = false;
          this.loading = false;
          this.message = 'Profile updated successfully';
        },
        error: () => {
          this.message = 'Update failed';
          this.loading = false;
        }
      });
  }

  // ================= AVATAR =================
  toggleAvatarEdit() {
    this.avatarEditMode = !this.avatarEditMode;
  }

  updateAvatar() {
    if (!this.profile.avatarUrl) return;

    this.http.post(`${this.api}/avatar`, null, {
      params: { avatarUrl: this.profile.avatarUrl },
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.avatarEditMode = false;
        this.profileBackup.avatarUrl = this.profile.avatarUrl;
        this.message = 'Avatar updated';
      },
      error: () => this.message = 'Avatar update failed'
    });
  }

  // ================= PASSWORD =================
  openPasswordMode() {
    this.passwordMode = true;
    this.editMode = false;
    this.message = '';
  }

  closePasswordMode() {
    this.passwordMode = false;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

 updatePassword() {
  this.message = '';

  if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
    this.message = 'Passwords do not match';
    return;
  }

  this.loading = true;

  this.http.put(
    `${environment.apiBaseUrl}/auth/password/change`,
    {
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword,
      confirmPassword: this.passwordForm.confirmPassword   // ✅ REQUIRED
    }
  ).subscribe({
    next: () => {
      this.message = 'Password updated successfully';
      this.loading = false;
      this.closePasswordMode();
    },
    error: err => {
      this.message = err.error || 'Password update failed';
      this.loading = false;
    }
  });
}

  // ================= CART =================
  loadCart() {
    this.cartService.getCart().subscribe({
      next: data => this.cart = data,
      error: () => this.message = 'Failed to load cart summary'
    });
  }

  // ================= WISHLIST =================
  loadWishlist() {
    this.wishlistService.get().subscribe({
      next: data => this.wishlist = data,
      error: () => this.message = 'Failed to load wishlist summary'
    });
  }

  removeWishlist(bookId: number) {
    this.wishlistService.remove(bookId).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(w => w.bookId !== bookId);
      },
      error: () => this.message = 'Could not remove this book from your wishlist'
    });
  }

  // ================= ORDERS =================
  loadOrders() {
    this.orderService.myOrders().subscribe({
      next: data => this.orders = data,
      error: () => this.message = 'Failed to load order summary'
    });
  }

  // ================= AUTHORS =================
  loadAuthors() {
    this.bookService.getAuthors().subscribe({
      next: data => this.authors = data.map(author => author.name || author),
      error: () => this.message = 'Failed to load authors'
    });
  }

  get initials(): string {
    const name = this.profile.fullName || '';
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'B';
  }

  get totalCartItems(): number {
    return this.cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  }
}
