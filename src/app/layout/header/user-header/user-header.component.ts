import {
  Component,
  OnInit,
  ElementRef,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginRegisterService } from 'src/app/core/services/login-register.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {

  isLoggedIn = false;
  username = '';
  role = '';

  profileOpen = false;
  profilePinned = false;   // 👈 NEW (for click sticky)

  mobileMenuOpen = false;
  isScrolled = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private loginRegisterService: LoginRegisterService,
    private el: ElementRef,
    private alertService: AlertService
  ) {}

  ngOnInit() {

    this.isLoggedIn = this.auth.isLoggedIn();

    if (this.isLoggedIn) {
      this.auth.me().subscribe({
        next: (user) => {
          this.username = user.email;
          this.role = user.role;
        }
      });
    }

    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 40;
    });
  }

  /* ================= PROFILE ================= */

  toggleProfile(event: MouseEvent) {
    event.stopPropagation();
    this.profilePinned = !this.profilePinned;
    this.profileOpen = this.profilePinned;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutside(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.profilePinned = false;
      this.profileOpen = false;
    }
  }

  onHoverEnter() {
    if (!this.profilePinned) this.profileOpen = true;
  }

  onHoverLeave() {
    if (!this.profilePinned) this.profileOpen = false;
  }

  /* ================= AUTH ================= */

  openLogin() {
    this.loginRegisterService.openLogin();
    this.closeMobileMenu();
  }

  openRegister() {
    this.loginRegisterService.openRegister();
    this.closeMobileMenu();
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.profileOpen = false;
    this.profilePinned = false;
    this.router.navigate(['/home']);
  }

  /* ================= NAV ================= */

  protectedNav(route: string) {
    if (!this.auth.isLoggedIn()) {
      this.alertService.show('Please login first', 'error');
      return;
    }
    this.router.navigate([route]);
    this.closeMobileMenu();
  }

  /* ================= MOBILE ================= */

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : 'auto';
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  get initials(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : '?';
  }
}