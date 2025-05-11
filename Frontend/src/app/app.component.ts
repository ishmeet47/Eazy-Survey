import { Component, OnDestroy, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { AlertService, AlertMessage } from './services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'survey';
  message?: AlertMessage;
  private subscription: Subscription = new Subscription(); // To handle unsubscription

  constructor(private alertService: AlertService) {
    setTheme('bs5');
  }

  ngOnInit() {
    // Subscribe to the alert service stream
    this.subscription.add(
      this.alertService.alert$.subscribe(message => {
        this.message = message;

        // If a message is received, set it to disappear after 3 seconds
        if (message) {
          setTimeout(() => {
            this.clearMessage();
          }, 3000); // The message will disappear after 3 seconds
        }
      })
    );
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
  }

  clearMessage() {
    this.message = undefined; // This clears the message
  }
}
