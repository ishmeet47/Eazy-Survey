import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question, Survey } from '../modules/survey.module';
import { SurveyOption, SurveyQuestion } from '../modules/surveyQ_A.module';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserAnswerService {
  private baseUrl: string = 'http://localhost:5225';
  constructor(private http: HttpClient) {}

  getSurveys(userId: number): Observable<any[]> {
    console.log('I got some surveys the link is: ');
    console.log(`${this.baseUrl}/UserAnswer/getmysurvey/${userId}`);
    console.log(
      this.http.get<any[]>(`${this.baseUrl}/UserAnswer/getmysurvey/${userId}`)
    );
    return this.http.get<any[]>(
      `${this.baseUrl}/UserAnswer/getmysurvey/${userId}`
    );
  }

  getSubmittedSurveys(userId: number): Observable<any[]> {
    // console.log(
    //   'Calling' + `${this.baseUrl}/UserAnswer/getSubmittedSurvey/${userId}`
    // );

    console.log('getSubmittedSurveys');
    this.http
      .get<any[]>(`${this.baseUrl}/UserAnswer/getSubmittedSurvey/${userId}`)
      .subscribe((Response: any) => {
        console.log('Response:');
        console.log(Response);
      });

    return this.http.get<any[]>(
      `${this.baseUrl}/UserAnswer/getSubmittedSurvey/${userId}`
    );
  }

  getQuestions_new(QId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/UserAnswer/getquestion/${QId}`
    );
  }

  createSurvey(survey: {
    title: string;
    dueDate: Date;
    questions: string[];
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/survey/create`, survey);
  }

  createAnswerNew(ans: {
    UserId: number;
    OptionIdList: number[];
  }): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/UserAnswer/answerQuestion`,
      ans
    );
  }

  getOptions(QId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/UserAnswer/getoptions/${QId}`);
  }

  createAnswer(answer: { userId: number; optionId: number }): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/UserAnswer/answerQuestion`,
      answer
    );
  }

  submitSurvey(token: { userId: number; surveyId: number }): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/UserAnswer/submitsurvey`,
      token
    );
  }
}
