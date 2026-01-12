import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router, private alertService: AlertService) {}

login() {
  this.auth.login({ email: this.email, password: this.password })
    .subscribe({
      next: (res) => {
        // SUCCESS: The server returned a 200 OK
        this.auth.saveSession(res.token, res.role);
        
        if (res.role === 'ROLE_ADMIN') {
          this.alertService.show('Logged-in as admin', 'success');
          this.router.navigate(['/admin/dashboard']);
        } else if (res.role === 'ROLE_USER') {
          this.alertService.show('Login Sccessfull', 'success');
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        // ERROR: This runs if the ID/Password is wrong (401 error)
        console.error(err);
        this.alertService.show('Invalid email or password', 'error');
      }
    });
}



}