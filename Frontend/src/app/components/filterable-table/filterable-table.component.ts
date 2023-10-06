import { Component, Input, OnInit } from '@angular/core';
import { IKeyValuePair } from 'src/app/models/IKeyValuePair';

@Component({
  selector: 'app-filterable-table',
  templateUrl: './filterable-table.component.html',
  styleUrls: ['./filterable-table.component.css'],
})
export class FilterableTableComponent {
  @Input() data: IKeyValuePair[] = [];
}
