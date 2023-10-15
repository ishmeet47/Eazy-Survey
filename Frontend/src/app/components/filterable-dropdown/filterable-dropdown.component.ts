import { Component, Input, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { IKeyValuePair } from 'src/app/models/IKeyValuePair';

@Component({
  selector: 'app-filterable-dropdown',
  templateUrl: './filterable-dropdown.component.html',
  styleUrls: ['./filterable-dropdown.component.css'],
  providers: [
    {
      provide: BsDropdownConfig,
      useValue: { isAnimated: true, autoClose: true, insideClick: true },
    },
  ],
})
export class FilterableDropdownComponent implements OnInit {
  @Input()
  data: IKeyValuePair[] = [];

  constructor() {}

  ngOnInit() {}
}
