import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginRegisterService } from 'src/app/core/services/login-register.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})

export class AdminHeaderComponent {
  isMenuOpen = false;
  isLoggedIn: any;
  username: any;


  constructor(private auth: AuthService, private router: Router,
      private loginRegisterService: LoginRegisterService
    ) {}
  openLogin() {
    this.loginRegisterService.openLogin();
  }

  openRegister() {
    this.loginRegisterService.openRegister();
  }

  logout() {
    this.auth.logout(); // Ensure your auth service handles clearing session
  }
  // logout() {
  //   this.auth.logout();
  //   this.router.navigate(['/login']);
  // }
}
