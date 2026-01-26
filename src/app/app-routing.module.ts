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
import { ShopComponent } from './user/shop/shop.component';
import { OrdersComponent } from './user/orders/orders.component';
import { BookDetailsComponent } from './user/book-details/book-details.component';
import { AboutusComponent } from './user/aboutus/aboutus.component';
import { ReturnsComponent } from './privacy/returns/returns.component';
import { TermsComponent } from './privacy/terms/terms.component';
import { PrivacyComponent } from './privacy/privacy/privacy.component';

const routes: Routes = [

  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  { path: 'home', component: UserHomeComponent},
  { path: 'aboutus', component: AboutusComponent},
  { path: 'cart', component: CartComponent , canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistComponent , canActivate: [AuthGuard] },
  { path: 'shop', component: ShopComponent},
  { path: 'orders', component: OrdersComponent , canActivate: [AuthGuard] },
  { path: 'book-details/:id', component: BookDetailsComponent },
  { path: 'privacy-policy', component:PrivacyComponent  },
  { path: 'terms-conditions', component:TermsComponent  },
  { path: 'return-policy', component: ReturnsComponent },
  // USER
  // { path: 'home', component: UserHomeComponent, canActivate: [AuthGuard] },
  // { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  // { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  // { path: 'shop', component: ShopComponent, canActivate: [AuthGuard] },
  // { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  // { path: 'book-details/:id', component: BookDetailsComponent, canActivate: [AuthGuard] },

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

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled' // This automatically scrolls to top on navigation
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
