import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserAnswerService } from '../services/userAnswer.service';
import { SurveyAnswer, SurveyOption, SurveyQuestion, new_SAns, new_SOpt, new_SQus } from '../modules/surveyQ_A.module';
import { option, pause, question } from 'ngx-bootstrap-icons';
import { error } from 'console';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { Question } from '../modules/survey.module';
import { exit } from 'process';

@Component({
  selector: 'app-SurveyFilling',
  templateUrl: './SurveyFilling.component.html',
  styleUrls: ['./SurveyFilling.component.css']
})
export class SurveyFillingComponent implements OnInit {
  // SQList: new_SQus[] = [];
  SQList = new Array<new_SQus>()
  SOptList = new Array<new_SOpt>()
  SAnsList = new Array<new_SAns>()
  valid: Boolean = true;
  //SurveyOptionList: SurveyOption[] = [];
  //QuestionList: Question[] = [];
  // SurveyQList$: Observable<SurveyQuestion[]>;

  constructor(private UAService: UserAnswerService, private cd: ChangeDetectorRef) { 
    // this.SurveyQList$ = this.UAService.getQuestions(6);
  }

  ngOnInit(): void {
    this.loadQuestionsAndOptions();
  }

  // implimnet save draft function
  onSave():void{

  }

  onSubmit(): void{
    console.log("I CLICKED")
    console.log("len of SAnsList is " + this.SAnsList.length)
    
    // if valid, let user submit
    
    this.SAnsList.forEach(ans => {
      if(ans.optionId == 0){
        console.log("some question didn't answer");
        this.valid = false;
      }
    });


    // checker passed so create survey answer
    if(this.valid){
      this.SAnsList.forEach(ans => {
        //define a const
        const answer: any = {
          username: ans.userId,
          password: ans.optionId};
          console.log("created");
        // this.UAService.createAnswer(answer)
      });
    }


    // update user have completed the survey
    // this.submitSurvey()
    // clear local variable
    // this.logout();
  };


  // this function updates the SurveyUser DB add current user to the completed database
  submitSurvey(){
    const Token: any = {
      userId: Number(localStorage.getItem('user_id')),
      surveyId: Number(localStorage.getItem('surveyId'))
    }
    this.UAService.submitSurvey(Token);
  }

  // to update an answer
  updateAnswer(QuestionId: number, OptId: number){
    this.SAnsList.forEach(ans => {
      if(ans.QuestionId == QuestionId){
        ans.optionId = OptId;
        console.log("UPDATEEEEEED")
      }
    });
  }


  loadQuestionsAndOptions(): void{
    this.UAService.getQuestions_new(6).subscribe((data:any) =>
    {
      //console.log(Response);
      console.log("response is ++ ")
      console.log(data.$values);
      if(data && data.$values){
        data.$values.forEach((d:Question) => {
          const new_ques = new new_SQus(d.id, d.heading, d.surveyId)

          // also init null answers
          const new_ans = new new_SAns(Number(localStorage.getItem('user_id')), 0, d.id);
          this.SAnsList.push(new_ans);
          // now add all the options inside here
          this.UAService.getOptions(d.id).subscribe((opt:any) =>{
            if(opt && opt.$values){
              opt.$values.forEach((option: new_SOpt) => {
                const new_opt = new new_SOpt(option.id, option.label, d.id)
                this.SOptList.push(new_opt)
              });
            }
          });
          
          this.SQList.push(new_ques);
        });
      }else{
        console.log('sorry no question at this moment')
      }
      console.log("now array is");
      console.log(this.SQList);
    });
  }


  logout(){
    localStorage.removeItem('surveyId')
  }
  // loadOption_one():void{
  //   this.UAService.getOptions(1).subscribe((Response:any) =>{
  //     console.log(Response);
  //   })
  // }

  // loadOptions(): void{
  //   this.SQList.forEach((question:new_SQus) => {
  //     console.log("question")
  //     this.UAService.getOptions(question.id).subscribe((Response:any) => {
  //       if(Response && Response.$values){
  //         Response.$values.forEach((option: SurveyOption) => {
  //           //question.Options?.push(option)
  //         });
  //       }else{
  //         console.log("some error")
  //       }
  //       //question.Options.push();
  //     });
  //   });
  //   console.log("final qlist is ")
  //   console.log(this.SQList);
  // }

}
