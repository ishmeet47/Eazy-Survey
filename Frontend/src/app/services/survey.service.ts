import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  constructor(private http: HttpClient) {}

  private baseUrl: string = 'http://localhost:5225';

  createSurvey(survey: {
    title: string;
    dueDate: Date;
    questions: string[];
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/survey/create`, survey);
  }
}
