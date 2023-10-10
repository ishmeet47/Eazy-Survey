import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Survey } from '../modules/survey.module';

@Injectable({
  providedIn: 'root'
})
export class UserAnswerService {
  private baseUrl: string = 'http://localhost:5225';
  constructor(private http: HttpClient) { }

  getSurveys(userId: number): Observable<any[]>{
    console.log("I got some surveys the link is: ");
    console.log(`${this.baseUrl}/UserAnswer/getmygroup/${userId}`);
    console.log(this.http.get<any[]>(`${this.baseUrl}/UserAnswer/getmygroup/${userId}`))
    return this.http.get<any[]>(`${this.baseUrl}/UserAnswer/getmygroup/${userId}`);
  }
  
}
