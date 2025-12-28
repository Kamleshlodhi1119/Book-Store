import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  api = environment.apiUrl + '/admin/users';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.http.get<any[]>(this.api)
      .subscribe(res => this.users = res);
  }

  makeAdmin(id: number) {
    this.http.put(`${this.api}/${id}/role?role=ROLE_ADMIN`, {})
      .subscribe(() => this.load());
  }

   makeUser(id: number) {
    this.http.put(`${this.api}/${id}/role?role=ROLE_USER`, {})
      .subscribe(() => this.load());
  }
  deleteUser(id: number) {
    this.http.delete(`${this.api}/${id}`)
      .subscribe(() => this.load());
  }
}
