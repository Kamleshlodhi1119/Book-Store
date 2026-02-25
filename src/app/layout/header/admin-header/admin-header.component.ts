import {
  Component,
  OnInit,
  ElementRef,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  isMenuOpen = false;
  isLoggedIn = false;
  username = '';

  profileOpen = false;
  profilePinned = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();

    if (this.isLoggedIn) {
      this.auth.me().subscribe({
        next: (user) => {
          this.username = user.email || user.username;
        }
      });
    }
  }

  /* ================= PROFILE ================= */

  toggleProfile(event: MouseEvent) {
    event.stopPropagation();
    this.profilePinned = !this.profilePinned;
    this.profileOpen = this.profilePinned;
  }

  onHoverEnter() {
    if (!this.profilePinned) this.profileOpen = true;
  }

  onHoverLeave() {
    if (!this.profilePinned) this.profileOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeOutside(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.profilePinned = false;
      this.profileOpen = false;
    }
  }

  /* ================= MOBILE ================= */

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : 'auto';
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  /* ================= AUTH ================= */

  logout() {
    this.auth.logout();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }

  /* ================= HELPER ================= */

  get initials(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : 'A';
  }
}