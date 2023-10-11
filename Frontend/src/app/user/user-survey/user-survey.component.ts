import { Component, OnInit } from '@angular/core';
import { IKeyValuePair } from 'src/app/models/IKeyValuePair';

@Component({
  selector: 'app-user-survey',
  templateUrl: './user-survey.component.html',
  styleUrls: ['./user-survey.component.css'],
})
export class UserSurveyComponent implements OnInit {
  options: IKeyValuePair[] = [
    {
      key: 0,
      value: 'Dental Implants',
    },
    {
      key: 2,
      value: 'Permanent Retainers',
    },
    {
      key: 3,
      value: 'False Teeth',
    },
    {
      key: 4,
      value: 'Veneers',
    },
    {
      key: 5,
      value: 'None of the above',
    },
  ];

  selectedOption: number;

  onSelect(option: number) {
    this.selectedOption = option;
    console.log('Selected option: ' + this.selectedOption);
  }

  constructor() {
    this.selectedOption = -1;
  }

  ngOnInit() {}
}
