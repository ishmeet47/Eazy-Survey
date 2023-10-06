import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-card',
  templateUrl: './admin-card.component.html',
  styleUrls: ['./admin-card.component.css'],
})
export class AdminCardComponent {
  @Input() title: string | undefined;
}
