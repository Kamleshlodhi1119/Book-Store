import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CartComponent } from './user/cart/cart.component';
import { WishlistComponent } from './user/wishlist/wishlist.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { UserHomeComponent } from './user/home/home.component';
import { LayoutModule } from './layout/layout.module';
import { AdminModule } from './admin/admin.module';
import { AlertComponent } from './alert/alert.component';
import { OrdersComponent } from './user/orders/orders.component';
import { ShopComponent } from './user/shop/shop.component';
import { BookDetailsComponent } from './user/book-details/book-details.component';
import { AboutusComponent } from './user/aboutus/aboutus.component';
import { TermsComponent } from './privacy/terms/terms.component';
import { LegalComponent } from './privacy/legal/legal.component';
import { ReturnsComponent } from './privacy/returns/returns.component';
import { PrivacyComponent } from './privacy/privacy/privacy.component';
import { AuthModalComponent } from './auth/auth-modal/auth-modal.component';
import { BlogItemsComponent } from './blogs/blog-items/blog-items.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CartComponent,
    WishlistComponent,
    UserHomeComponent,
    AlertComponent,
    OrdersComponent,
    ShopComponent,
    BookDetailsComponent,
    AboutusComponent,
    LegalComponent,
    TermsComponent,
    ReturnsComponent,
    PrivacyComponent,
    AuthModalComponent,
    BlogItemsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,    
    AppRoutingModule,
    AdminModule,     
    LayoutModule 
],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
