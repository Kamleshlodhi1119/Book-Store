import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminHeaderComponent } from './header/admin-header/admin-header.component';
import { UserHeaderComponent } from './header/user-header/user-header.component';

@NgModule({
  declarations: [
    AdminHeaderComponent,
    UserHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule   // ✅ REQUIRED for routerLink
  ],
  exports: [
    AdminHeaderComponent,
    UserHeaderComponent
  ]
})
export class LayoutModule {}
