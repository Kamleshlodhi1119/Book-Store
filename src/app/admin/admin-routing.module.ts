import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../core/guards/admin.guard';
import { AdminBooksComponent } from './books/admin-books/admin-books.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminOrdersComponent } from './orders/admin-orders/admin-orders.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminUsersComponent } from './users/admin-users/admin-users.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'books', component: AdminBooksComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
