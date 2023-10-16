import { IKeyValuePair } from 'src/app/models/IKeyValuePair';
import { Component, OnInit } from '@angular/core';
import { UserAnswerService } from '../../services/userAnswer.service';
import { new_SAns, new_SOpt, new_SQus } from '../../modules/surveyQ_A.module';
import { Question } from '../../modules/survey.module';
import { SurveyQuestionAndOptions } from 'src/app/models/SurveyQuestionAndOptions';
import { Router } from '@angular/router';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { option } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-user-survey',
  templateUrl: './user-survey.component.html',
  styleUrls: ['./user-survey.component.css'],
})
export class UserSurveyComponent implements OnInit {
  surveyTitle: string = '';
  questionsAndOptions: SurveyQuestionAndOptions[];

  SQList = new Array<new_SQus>();
  // SQList: new_SQus[] = [];
  SOptList = new Array<new_SOpt>();
  SAnsList = new Array<new_SAns>();
  valid: Boolean = true;

  // Storing current viewing question
  currentQuestion: string = '';
  currentOptions: IKeyValuePair[] = [];
  currentQuestionNumber: number;

  selectedOption: number;

  private baseUrl = 'http://localhost:5225';

  constructor(private UAService: UserAnswerService, private router: Router, private http: HttpClient,) {
    this.selectedOption = -1;
    this.currentQuestionNumber = 0;
    this.questionsAndOptions = [];
  }

  ngOnInit(): void {
    this.loadQuestionsAndOptions();
    // TODO: Get survey title to display
  }

  onContinue(): void {
    this.updateAnswer(
      this.questionsAndOptions[this.currentQuestionNumber].question.key,
      this.selectedOption
    );
    this.selectedOption = -1;
    this.currentQuestionNumber++;
  }

  onSelect(option: number) {
    this.selectedOption = option;
    console.log('Selected option: ' + this.selectedOption);
  }

  // implement save draft function
  onSave(): void {}

  // getAllUsersToWhichTheSurveyisAssigned(groupIds: number[]): Observable<any> {
  //   return this.http
  //     .post(`${this.baseUrl}/survey/getUsersByGroupIds`, groupIds)
  //     .pipe(
  //       catchError((error) => {
  //         // Handle the error here - perhaps send it to an error logging service, show a user notification, etc.
  //         console.error('Error fetching answers by option IDs: ', error);
  //         return throwError(error);
  //       }),
  //       map((response) => {
  //         // Process or transform the response if needed
  //         return response;
  //       })
  //     );
  // }

  getAllOptiontoSurveyAnswers(optionIds: number[]): Observable<any>{
    return this.http
      .post(`${this.baseUrl}/survey/getAllOptiontoSurveyAnswers`, optionIds)
      .pipe(
        catchError((error) => {
            // Handle the error here - perhaps send it to an error logging service, show a user notification, etc.
            console.error('Error fetching answers by option IDs: ', error);
            return throwError(error);
          }),
        map((response) => {
          // Process or transform the response if needed
          return response;
        })
      );
  }

  createAnswers(){
    const optlist = new Array<number>();
    this.SAnsList.forEach(ans => {
      optlist.push(ans.optionId)
    });
    const answerPayload = {
      UserId: Number(localStorage.getItem('user_id')),
      OptionIdList: optlist,
    };

    this.UAService.createAnswerNew(answerPayload).subscribe(
      (response) => {
        // Handle successful creation (e.g., show a success message or refresh the list of surveys)
        // this.errorMessage = ''; // clear any previous error messages
        // this.newSurveyTitle = ''; // reset the fields
        // this.newSurveyDueDate = null;
        // this.newSurveyQuestions = '';

        // Optionally, show a success message or redirect somewhere or reload surveys
      },
      (error) => {
        // Handle error
        // this.errorMessage = 'Failed to create the survey. Please try again.';
      }
    );
  }
  

  onSubmit(): void {
    // Submit the last question
    this.updateAnswer(
      this.questionsAndOptions[this.currentQuestionNumber].question.key,
      this.selectedOption
    );

    console.log('I CLICKED');
    console.log('len of SAnsList is ' + this.SAnsList.length);

    // if valid, let user submit
    this.SAnsList.forEach((ans) => {
      if (ans.optionId == 0) {
        console.log("some question didn't answer");
        this.valid = false;
      }
    });

    // checker passed so create survey answer
    if (this.valid) {
      this.createAnswers();
    }

    console.log('this.SAnsList is: ');
    console.log(this.SAnsList);
    this.submitSurvey();
    
    
    this.router.navigate(['/dashboard']).then();
  }

  // this function updates the SurveyUser DB add current user to the completed database
  submitSurvey() {
    const Token: any = {
      UserId: Number(localStorage.getItem('user_id')),
      SurveyId: Number(localStorage.getItem('surveyId')),
    };
    this.UAService.submitSurvey(Token).subscribe();
    localStorage.removeItem('surveyId');
  }

  // to update an answer
  updateAnswer(QuestionId: number, OptId: number) {
    this.SAnsList.forEach((ans) => {
      if (ans.QuestionId == QuestionId) {
        ans.optionId = OptId;
        console.log(
          'Updated Answer with QuestionId: ' +
            QuestionId +
            ' and OptionId: ' +
            OptId
        );
      }
    });
  }

  loadQuestionsAndOptions(): void {
    this.UAService.getQuestions_new(
      Number(localStorage.getItem('surveyId'))
    ).subscribe((data: any) => {
      //console.log(Response);
      console.log('response is ++ ');
      console.log(data.$values);
      if (data && data.$values) {
        data.$values.forEach((d: Question) => {
          const new_ques = new new_SQus(d.id, d.heading, d.surveyId);

          // also init null answers
          const new_ans = new new_SAns(
            Number(localStorage.getItem('user_id')),
            0,
            d.id
          );
          this.SAnsList.push(new_ans);

          const options: IKeyValuePair[] = [];

          // now add all the options inside here
          this.UAService.getOptions(d.id).subscribe((opt: any) => {
            if (opt && opt.$values) {
              opt.$values.forEach((option: new_SOpt) => {
                const new_opt = new new_SOpt(option.id, option.label, d.id);
                this.SOptList.push(new_opt);

                options.push({
                  key: new_opt.id,
                  value: new_opt.label,
                });
              });
            }
          });

          this.SQList.push(new_ques);

          this.questionsAndOptions.push({
            question: {
              key: new_ques.id,
              value: new_ques.heading,
            },
            options: options,
          });
        });
      } else {
        console.log('sorry no question at this moment');
      }
      console.log('now array is');
      console.log(this.SQList);

      console.log('this.questions: ');
      console.log(this.questionsAndOptions);
    });
  }
}
