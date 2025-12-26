import { Component, OnInit } from '@angular/core';
import { AlertService, AlertData } from '../core/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  message: string | null = null;
  type: string = 'info';
  visible = false;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.alert$.subscribe((data: AlertData) => {
      this.message = data.message;
      this.type = data.type;
      this.visible = true;

      setTimeout(() => {
        this.visible = false;
        this.message = null;
      }, 3000);
    });
  }

  close() {
    this.visible = false;
    this.message = null;
  }
}
