import { Component, OnInit } from '@angular/core';
import { Survey } from 'src/app/modules/survey.module';
import { UserAnswerService } from 'src/app/services/userAnswer.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  surveys = new Array<Survey>();
  surveyList$: any;
  today = new Date();

  constructor(private UAService: UserAnswerService) {}

  ngOnInit() {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.UAService.getSurveys(
      Number(localStorage.getItem('user_id'))
    ).subscribe((Response: any) => {
      //console.log(Response);
      console.log(Response);
      if (Response) {
        this.surveys = Response;
      } else {
        console.log('sorry no survey at this moment');
      }
      console.log(this.surveys);
    });
  }

  startAnswerSurvey(surveyId: number): void {
    console.log('I clicked survey Id ' + surveyId + ' changing to new board');
    localStorage.setItem('surveyId', surveyId.toString());
  }

  convertDateString(date: string): Date {
    return new Date(date);
  }
}
