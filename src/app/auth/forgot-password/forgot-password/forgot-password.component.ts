import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
selector: 'app-forgot-password',
templateUrl: './forgot-password.component.html',
styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {


email = '';
message = '';
loading = false;


constructor(private auth: AuthService) {}


submit() {
if (!this.email) {
this.message = 'Please enter your email';
return;
}


this.loading = true;


this.auth.forgotPassword(this.email).subscribe({
next: (res: any) => {
this.message = res;
this.loading = false;
},
error: err => {
this.message = err.error || 'Something went wrong';
this.loading = false;
}
});
}
}