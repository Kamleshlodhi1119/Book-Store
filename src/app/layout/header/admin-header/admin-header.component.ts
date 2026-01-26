import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginRegisterService } from 'src/app/core/services/login-register.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;
  username = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private loginRegisterService: LoginRegisterService
  ) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.isLoggedIn = true;
          if (this.isLoggedIn) {
      this.auth.me().subscribe({
        next: (user) => {
          this.username = user.email || user.username;
        }
      });
    }
      // this.username = this.auth.getUsername();
    }
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : 'auto';
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  logout() {
    this.auth.logout();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }
}