import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  username = '';
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe(() => this.router.navigate(['/login']));
  }
}