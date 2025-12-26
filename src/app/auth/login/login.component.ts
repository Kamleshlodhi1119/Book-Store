import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

login() {
  this.auth.login({ email: this.email, password: this.password })
    .subscribe(res => {

      this.auth.saveSession(res.token, res.role);

      if (res.role === 'ROLE_ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    });
}



}