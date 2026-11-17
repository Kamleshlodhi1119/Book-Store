import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminHeaderComponent } from './header/admin-header/admin-header.component';
import { UserHeaderComponent } from './header/user-header/user-header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AdminHeaderComponent,
    UserHeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule   // ✅ REQUIRED for routerLink
  ],
  exports: [
    AdminHeaderComponent,
    UserHeaderComponent,
    FooterComponent
  ]
})
export class LayoutModule {}
