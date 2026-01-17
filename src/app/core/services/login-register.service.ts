import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';


export type AuthMode = 'login' | 'register' | null;
@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {

private authState = new Subject<AuthMode>();
  // Observable for components to listen to
  authStatus$ = this.authState.asObservable();

  openLogin() {
    this.authState.next('login');
  }

  openRegister() {
    this.authState.next('register');
  }

  close() {
    this.authState.next(null);
  }
}
