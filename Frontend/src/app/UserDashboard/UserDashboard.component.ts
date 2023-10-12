import { Component, OnInit } from '@angular/core';
import { UserAnswerService } from '../services/userAnswer.service';
import { Survey } from '../modules/survey.module';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-UserDashboard',
  templateUrl: './UserDashboard.component.html',
  styleUrls: ['./UserDashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  survey1 = new Array<Survey>()
  surveyList$: any;
  // surveyAnswerList 


  constructor(private UAService: UserAnswerService, private router: Router, private route: ActivatedRoute) { 
    
  }

  ngOnInit() {
    this.loadSurveys();
  }  

  loadSurveys(): void{
    this.UAService.getSurveys(Number(localStorage.getItem('user_id'))).subscribe((Response:any) =>
    {
      //console.log(Response);
      console.log(Response);
      if(Response){
        this.survey1 = Response;
      }else{
        console.log('sorry no survey at this moment')
      }
      console.log(this.survey1);
    });
  }

  
  startAnswerSurvey(surveyId: number): void{
    console.log("I clicked survey Id " + surveyId + " changing to new board")
    
    localStorage.setItem("surveyId", surveyId.toString());
  }
}
