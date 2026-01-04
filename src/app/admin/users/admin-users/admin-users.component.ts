import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  api = environment.apiUrl + '/admin/users';

  constructor(private http: HttpClient, private alertService: AlertService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.http.get<any[]>(this.api)
      .subscribe({
        next: (res) => this.users = res,
        error: () => this.alertService.show('Failed to load users', 'error')
      });
  }

  makeAdmin(id: number) {
    this.http.put(`${this.api}/${id}/role?role=ROLE_ADMIN`, {}, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.alertService.show('Role updated to Admin', 'success');
          this.load();
        },
        error: () => this.alertService.show('Error updating role', 'error')
      });
  }

  makeUser(id: number) {
    this.http.put(`${this.api}/${id}/role?role=ROLE_USER`, {}, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.alertService.show('Role updated to User', 'success');
          this.load();
        },
        error: () => this.alertService.show('Error updating role', 'error')
      });
  }

  deleteUser(id: number) {
    this.http.delete(`${this.api}/${id}`, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          this.alertService.show('User deleted successfully', 'success');
          this.load();
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.alertService.show('Could not delete user', 'error');
        }
      });
  }
}