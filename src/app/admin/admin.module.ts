import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminBooksComponent } from './books/admin-books/admin-books.component';
import { AdminOrdersComponent } from './orders/admin-orders/admin-orders.component';
import { AdminUsersComponent } from './users/admin-users/admin-users.component';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminUsersComponent,
    AdminBooksComponent,
    AdminOrdersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule   // ✅ THIS MAKES app-admin-header WORK
  ]
})
export class AdminModule {}

