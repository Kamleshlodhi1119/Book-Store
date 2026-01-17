import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthMode, LoginRegisterService } from 'src/app/core/services/login-register.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit {
  mode: AuthMode = null; // 'login', 'register', or null
  
  // Form Fields
  username = '';
  email = '';
  password = '';

  constructor(
    private authModalService: LoginRegisterService,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authModalService.authStatus$.subscribe(state => {
      this.mode = state;
    });
  }

  close() {
    this.authModalService.close();
  }

  handleLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.authService.saveSession(res.token, res.role);
        this.alertService.show('Welcome back!', 'success');
        this.close(); // Closes the blur
        this.router.navigate([res.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/home']);
      },
      error: () => this.alertService.show('Invalid Credentials', 'error')
    });
  }

  handleRegister() {
    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.alertService.show('Account created! Please login.', 'success');
        this.mode = 'login'; // Switch to login view after success
      },
      error: () => this.alertService.show('Registration failed', 'error')
    });
  }
}