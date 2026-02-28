import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthMode, LoginRegisterService } from 'src/app/core/services/login-register.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit {

  mode: AuthMode | null = null;

  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  loading = false;

  // errors (shown below fields)
  usernameError = '';
  emailError = '';
  passwordError = '';
  confirmPasswordError = '';

  passwordStrength = '';

  constructor(
    private authModalService: LoginRegisterService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authModalService.authStatus$.subscribe(state => {
      this.mode = state;
      this.clearErrors();
    });
  }

  close() {
    this.authModalService.close();
  }

  clearErrors() {
    this.usernameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.passwordStrength = '';
  }

  /* ================= VALIDATION ================= */

  validateUsername() {
    if (!this.username.trim()) {
      this.usernameError = 'Username required';
    } else if (!/^[a-zA-Z0-9_ ]{3,30}$/.test(this.username)) {
      this.usernameError = '3-30 chars only';
    } else {
      this.usernameError = '';
    }
  }

  validateEmail() {
    if (!this.email.trim()) {
      this.emailError = 'Email required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError = 'Invalid email';
    } else {
      this.emailError = '';
    }
  }

  validatePassword() {
    const p = this.password;

    if (!p) {
      this.passwordError = 'Password required';
      this.passwordStrength = '';
      return;
    }

    if (p.length < 6) {
      this.passwordError = 'Min 6 characters';
    } else {
      this.passwordError = '';
    }

    let score = 0;
    if (p.length >= 6) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 1) this.passwordStrength = 'Weak';
    else if (score <= 3) this.passwordStrength = 'Medium';
    else this.passwordStrength = 'Strong';
  }

  validateConfirmPassword() {
    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Confirm password';
    } else if (this.confirmPassword !== this.password) {
      this.confirmPasswordError = 'Passwords do not match';
    } else {
      this.confirmPasswordError = '';
    }
  }

  /* ================= LOGIN ================= */

  handleLogin() {
    this.validateEmail();
    this.validatePassword();

    if (this.emailError || this.passwordError) return;

    this.loading = true;

    this.authService.login({
      email: this.email.trim(),
      password: this.password.trim()
    }).subscribe({
      next: (res) => {
        this.authService.saveSession(res.token, res.role);

        this.authService.me().subscribe(() => {
          const target = res.role === 'ROLE_ADMIN'
            ? '/admin/dashboard'
            : '/home';

          this.router.navigate([target]).then(() => window.location.reload());
        });
      },
      error: () => {
        this.passwordError = 'Invalid email or password';
        this.loading = false;
      }
    });
  }

  /* ================= REGISTER ================= */

  handleRegister() {
    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();

    if (this.usernameError || this.emailError || this.passwordError || this.confirmPasswordError) return;

    this.loading = true;

    this.authService.register({
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password.trim()
    }).subscribe({
      next: () => {
        this.mode = 'login';
        this.loading = false;
      },
      error: () => {
        this.emailError = 'Email already exists';
        this.loading = false;
      }
    });
  }
}