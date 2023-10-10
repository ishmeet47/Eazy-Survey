import { Component, OnInit } from '@angular/core';
import { UserAnswerService } from '../services/userAnswer.service';
import { Survey } from '../modules/survey.module';

@Component({
  selector: 'app-UserDashboard',
  templateUrl: './UserDashboard.component.html',
  styleUrls: ['./UserDashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  surveyList: any[] = [];
  surveyList$: any;
  // surveyAnswerList 


  constructor(private UAService: UserAnswerService) { 
    this.surveyList$ = this.UAService.getSurveys(Number(localStorage.getItem('user_id')))
    console.log(this.surveyList$);
  }

  ngOnInit() {
    this.loadSurveys();
  }  

  loadSurveys(): void{
    this.UAService.getSurveys(Number(localStorage.getItem('user_id'))).subscribe((Response:any) =>
    {
      //console.log(Response);
      if(Response){
        this.surveyList = Response;
      }
      console.log(this.surveyList);
    });
  }

}
