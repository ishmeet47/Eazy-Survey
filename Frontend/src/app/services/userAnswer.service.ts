import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question, Survey } from '../modules/survey.module';
import { SurveyOption, SurveyQuestion } from '../modules/surveyQ_A.module';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAnswerService {
  private baseUrl: string = 'http://localhost:5225';
  constructor(private http: HttpClient) { }

  getSurveys(userId: number): Observable<any[]>{
    console.log("I got some surveys the link is: ");
    console.log(`${this.baseUrl}/UserAnswer/getmysurvey/${userId}`);
    console.log(this.http.get<any[]>(`${this.baseUrl}/UserAnswer/getmysurvey/${userId}`))
    return this.http.get<any[]>(`${this.baseUrl}/UserAnswer/getmysurvey/${userId}`);
  }
  getQuestions_new(QId: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/UserAnswer/getquestion/${QId}`)
  }

  // getQuestions(SId: number): Observable<Question[]>{
  //   return this.http.get<{ $id: string; $values: Question[]}>
  //   (`${this.baseUrl}/UserAnswer/getquestion/${SId}`).pipe(
  //     map(response => response.$values.map(question => {
  //       const survey = question.survey || {$ref: "" };
  //       const options = question.options || {$id: "", $values: []};
  //       const surveyAnswers = question.surveyAnswers || { $id: "", $values: []};

  //       return new Question(
  //         question.$id,
  //         question.heading,
  //         question.surveyId,
  //         {
  //           $ref: survey.$ref
  //         },
  //         {
  //           $id: options.$id,
  //           $values: options.$values
  //         },
  //         {
  //           $id: surveyAnswers.$id,
  //           $values: surveyAnswers.$values
  //         },
  //         question.id,
  //         question.lastUpdatedOn,
  //         question.lastUpdatedBy,
  //         question.isPublished
  //       );

  //     }))
  //   )
  // }

  getOptions(QId: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/UserAnswer/getoptions/${QId}`)
  }

  createAnswer(answer: { userId: number, optionId: number}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/UserAnswer/answerQuestion`, answer);
  }

  submitSurvey(token: {userId: number, surveyId: number}): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/UserAnswer/submitsurvey`, token);
  }

}
