import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {


  token = '';
  newPassword = '';
  confirmPassword = '';


  message = '';
  loading = false;


  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) { }


  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';


    if (!this.token) {
      this.message = 'Invalid or missing reset token';
    }
  }


  submit() {
    if (!this.newPassword || !this.confirmPassword) {
      this.message = 'All fields are required';
      return;
    }


    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }


    this.loading = true;


    this.auth.resetPassword({
      token: this.token,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: (res: any) => {
        this.message = res;
        this.loading = false;


        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: err => {
        this.message = err.error || 'Reset failed';
        this.loading = false;
      }
    });
  }
}