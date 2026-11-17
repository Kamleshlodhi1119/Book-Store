import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './user/cart/cart.component';
import { WishlistComponent } from './user/wishlist/wishlist.component';
import { UserHomeComponent } from './user/home/home.component';

import { AuthGuard } from './core/guards/auth.guard';
import { ShopComponent } from './user/shop/shop.component';
import { OrdersComponent } from './user/orders/orders.component';
import { BookDetailsComponent } from './user/book-details/book-details.component';
import { ReturnsComponent } from './privacy/returns/returns.component';
import { TermsComponent } from './privacy/terms/terms.component';
import { PrivacyComponent } from './privacy/privacy/privacy.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password/reset-password.component';
import { ProfileDetailsComponent } from './user/profile-details/profile-details.component';
import { AllapisComponent } from './privacy/allapis/allapis.component';


const routes: Routes = [
  { path: 'home', component: UserHomeComponent},
  { path: 'aboutus', loadChildren: () => import('./user/aboutus/aboutus.module').then(module => module.AboutusModule) },
  { path: 'cart', component: CartComponent , canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistComponent , canActivate: [AuthGuard] },
  { path: 'shop', component: ShopComponent},
  { path: 'orders', component: OrdersComponent , canActivate: [AuthGuard] },
  { path: 'book-details/:id', component: BookDetailsComponent },
  { path: 'privacy-policy', component:PrivacyComponent  },
  { path: 'terms-conditions', component:TermsComponent  },
  { path: 'return-policy', component: ReturnsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
   { path: 'api-docs', component: AllapisComponent },
  
{ path: 'blog', loadChildren: () => import('./blogs/blog-items/blog-items.module').then(module => module.BlogItemsModule) },
{ path: 'ng ', component: ResetPasswordComponent },
{ path: 'profile', component: ProfileDetailsComponent, canActivate: [AuthGuard] },

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule)
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
