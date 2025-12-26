import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertData {
  message: string;
  type: AlertType;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<AlertData>();
  alert$ = this.alertSubject.asObservable();

  show(message: string, type: AlertType = 'info') {
    this.alertSubject.next({ message, type });
  }
}
