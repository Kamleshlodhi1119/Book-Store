import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  mobileMenuOpen = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private loginRegisterService: LoginRegisterService
  ) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.isLoggedIn = true;
      // this.username = this.auth.getUsername();
    }
  }

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
    this.closeMobileMenu();
    this.router.navigate(['/home']);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : 'auto';
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }
}
