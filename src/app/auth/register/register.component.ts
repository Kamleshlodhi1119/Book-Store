import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
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

  constructor(private auth: AuthService, private router: Router, private alertService: AlertService) { }

register() {
  this.auth.register({
    username: this.username,
    email: this.email,
    password: this.password
  }).subscribe({
    next: () => {    
      this.alertService.show('Registration successful!', 'success');
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error(err);
      this.alertService.show('Registration failed. Please try again.', 'error');
    }
  });
}
}