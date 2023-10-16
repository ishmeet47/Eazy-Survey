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

  completedSurveys = new Array<Survey>();
  uncompletedSurveys = new Array<Survey>();
  expiredSurveys = new Array<Survey>();

  constructor(private UAService: UserAnswerService) {
    this.completedSurveys = [];
    this.uncompletedSurveys = [];
    this.expiredSurveys = [];
  }

  ngOnInit() {
    this.loadSurveys();
    // this.checkCompletedSurveys();
  }

  loadSurveys(): void {
    console.log('Running loadSurveys()');

    this.UAService.getSurveys(
      Number(localStorage.getItem('user_id'))
    ).subscribe((Response: any) => {
      //console.log(Response);
      console.log(Response);
      if (Response) {
        this.surveys = Response;
        console.log('this.surveys:');
        console.log(this.surveys);
      } else {
        console.log('sorry no survey at this moment');
      }
      this.checkCompletedSurveys();
    });

    this.UAService.getSubmittedSurveys(
      Number(localStorage.getItem('user_id'))
    ).subscribe((Response: any) => {
      //console.log(Response);
      console.log(Response);
      if (Response) {
        this.completedSurveys = Response;
        console.log('this.completedSurveys:');
        console.log(this.completedSurveys);
      } else {
        console.log('sorry no survey at this moment');
      }
    });
  }

  checkCompletedSurveys(): void {
    this.completedSurveys = [];
    this.uncompletedSurveys = [];
    for (let i = 0; i < this.surveys.length; i++) {
      console.log('Completed By:');
      console.log(this.surveys[i].completedBy.$values);
    }
  }

  startAnswerSurvey(surveyId: number): void {
    console.log('I clicked survey Id ' + surveyId + ' changing to new board');
    localStorage.setItem('surveyId', surveyId.toString());
  }

  convertDateString(date: string): Date {
    return new Date(date);
  }
}
