// alert.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface AlertMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertSubject = new Subject<AlertMessage>();

  alert$ = this.alertSubject.asObservable().pipe(
    filter((message) => message != null)
  );

  success(message: string) {
    this.alert({ type: 'success', text: message }); // Note the change here
  }

  error(message: string) {
    this.alert({ type: 'error', text: message }); // Note the change here
  }

  info(message: string) {
    this.alert({ type: 'info', text: message }); // Note the change here
  }

  private alert(message: AlertMessage) {
    this.alertSubject.next(message);
  }
}
