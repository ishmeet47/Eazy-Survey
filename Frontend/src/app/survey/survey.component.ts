import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  // Variables for holding form data
  title!: string;
  dueDate!: Date;
  surveys: any[] = [];
  selectedSurveyId!: number;
  editMode = false;
  message!: string;

  private baseUrl = 'http://localhost:5225'; // Change 'your_api_url' to the actual API URL

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadSurveys();
  }

  createSurvey(): void {
    const surveyData = {
      title: this.title,
      dueDate: this.dueDate
    };
    this.http.post(`${this.baseUrl}/survey/create`, surveyData)
      .pipe(catchError(error => {
        this.message = "Failed to create survey.";
        return throwError(error);
      }))
      .subscribe(response => {
        this.message = "Survey created successfully!";
        this.loadSurveys(); // Reload list after creation
      });
  }

  loadSurveys(): void {
    this.http.get<any[]>(`${this.baseUrl}/survey/getsurveys`)
      .pipe(catchError(error => {
        this.message = "Failed to fetch surveys.";
        return throwError(error);
      }))
      .subscribe((surveys: any[]) => {
        this.surveys = surveys;
      });
  }


  loadSurveyById(): void {
    this.http.get(`${this.baseUrl}/survey/getsurvey/${this.selectedSurveyId}`)
      .pipe(catchError(error => {
        this.message = "Failed to fetch the survey.";
        return throwError(error);
      }))
      .subscribe((survey: any) => {
        this.title = survey.title;
        this.dueDate = new Date(survey.dueDate);
        this.editMode = true;
      });
  }

  updateSurvey(): void {
    const surveyData = {
      title: this.title,
      dueDate: this.dueDate
    };
    this.http.put(`${this.baseUrl}/survey/updatesurvey/${this.selectedSurveyId}`, surveyData)
      .pipe(catchError(error => {
        this.message = "Failed to update the survey.";
        return throwError(error);
      }))
      .subscribe(response => {
        this.message = "Survey updated successfully!";
        this.loadSurveys(); // Reload list after update
        this.editMode = false;
      });
  }

  deleteSurvey(id: number): void {
    this.http.delete(`${this.baseUrl}/survey/deletesurvey/${id}`)
      .pipe(catchError(error => {
        this.message = "Failed to delete the survey.";
        return throwError(error);
      }))
      .subscribe(response => {
        this.message = "Survey deleted successfully!";
        this.loadSurveys(); // Reload list after deletion
      });
  }

  // You can have a reset function to reset the form or any other additional functionalities.
}
