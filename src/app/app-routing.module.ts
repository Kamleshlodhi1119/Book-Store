import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CartComponent } from './user/cart/cart.component';
import { WishlistComponent } from './user/wishlist/wishlist.component';
import { UserHomeComponent } from './user/home/home.component';

import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminUsersComponent } from './admin/users/admin-users/admin-users.component';
import { AdminBooksComponent } from './admin/books/admin-books/admin-books.component';
import { AdminOrdersComponent } from './admin/orders/admin-orders/admin-orders.component';

import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // USER
  { path: 'home', component: UserHomeComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },

  // ADMIN
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'books', component: AdminBooksComponent },
      { path: 'orders', component: AdminOrdersComponent }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
