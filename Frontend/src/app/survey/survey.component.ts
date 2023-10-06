import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UserService } from '../services/user.service';
import { Survey } from '../modules/survey.module';
import { Group } from '../modules/group.module';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css'],
  encapsulation: ViewEncapsulation.Emulated // or None, or ShadowDom

})
export class SurveyComponent implements OnInit {

  title!: string;
  dueDate!: Date;
  questions: string[] = []; // to hold questions from the textarea
  surveys: Survey[] = [];
  selectedSurveyId!: number;
  editMode = false;
  message!: string;
  groups: any[] = [];
  questionsText: string = '';  // <-- Single string for the textarea binding

  newgroups: any[] = [];
  private baseUrl = 'http://localhost:5225';

  constructor(private router: Router, private http: HttpClient, private userService: UserService, private cd: ChangeDetectorRef) {
    // router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.loadGroups();
    //   }
    // });
  }

  ngOnInit(): void {
    this.loadSurveys();
    // This is just a placeholder, you might want to fetch the actual groups from your backend
    this.loadGroups();  // Loading groups on component initialization


  }


  // loadGroups(): void {
  //   this.http.get<any[]>(`${this.baseUrl}/user/groups`)  // Assuming /user/groups is the endpoint to fetch groups
  //     .pipe(catchError(error => {
  //       this.message = "Failed to fetch user groups.";
  //       return throwError(error);
  //     }))
  //     .subscribe((groups: any[]) => {
  //       this.groups = groups;
  //     });
  // }


  loadGroups(): void {
    this.userService.getGroups().subscribe(groups => {
      console.log("Fetched groups:", groups); // Diagnostic log

      if (groups && Array.isArray(groups)) {
        this.groups = groups.map(group => ({ ...group, selected: false }));
        this.cd.detectChanges(); // Manually trigger change detection

      } else {
        console.error("Unexpected data structure:", groups);
      }
      this.cd.detectChanges();

      console.log("yoo", this.groups); // Check the output after loadGroups has been called

      // this.newgroups = [
      //   { id: 1, name: 'Test Group 1', selected: false },
      //   { id: 2, name: 'Test Group 2', selected: false }
      // ];
    },
      error => {
        console.error("Error fetching groups:", error); // Diagnostic log
        this.message = "Failed to fetch user groups.";
      });
  }

  createSurvey(): void {
    const questionsArray = this.questionsText.split('\n\n'); // Assuming two newlines separate each question
    const questionsWithOptions = this.parseQuestions(questionsArray);

    // Filter out the selected user groups
    const selectedGroups = this.groups.filter(group => group.selected).map(group => group.id);

    const surveyData = {
      title: this.title,
      dueDate: this.dueDate,
      QuestionsWithOptions: questionsWithOptions,
      userGroupIds: selectedGroups  // Add the selected user group ids here
    };
    this.http.post(`${this.baseUrl}/survey/create`, surveyData)
      .pipe(catchError(error => {
        this.message = "Failed to create survey.";
        return throwError(error);
      }))
      .subscribe(response => {
        this.message = "Survey created successfully!";
        this.resetForm(); // Resetting form after successful creation
        this.loadSurveys();
      });
  }

  // Helper function to transform questions array into structured format
  parseQuestions(questionsArray: string[]): Array<{ QuestionText: string, Options: string[] }> {
    const result: Array<{ QuestionText: string, Options: string[] }> = [];

    questionsArray.forEach(questionString => {
      const lines = questionString.split('\n');
      let questionText = '';
      const options: string[] = [];

      lines.forEach(line => {
        if (line.startsWith('Question:')) {
          questionText = line.replace('Question:', '').trim();
        } else if (line.startsWith('Ans ')) {
          const option = line.split(':').pop()?.trim() as string;
          options.push(option);
        }
      });

      if (questionText && options.length) {
        result.push({ QuestionText: questionText, Options: options });
      }
    });

    return result;
  }





  resetForm(): void {
    this.title = '';
    this.dueDate = new Date();
    this.questions = [];
    this.editMode = false;
  }

  loadSurveys(): void {
    this.http.get<any[]>(`${this.baseUrl}/survey/getsurveys`)
      .pipe(catchError(error => {
        // Assuming error.status exists. You may need to adjust based on actual error structure.
        if (error.status !== 404) { // Or another suitable condition to identify genuine errors
          this.message = "Failed to fetch surveys.";
        }
        return throwError(error);
      }))
      .subscribe((surveys: any[]) => {
        this.surveys = surveys;
        console.log("surveys are ", this.surveys);
      });
  }


  loadSurveyById(id: number): void {
    this.selectedSurveyId = id;

    this.http.get(`${this.baseUrl}/survey/getsurvey/${this.selectedSurveyId}`)
      .pipe(catchError(error => {
        this.message = "Failed to fetch the survey.";
        return throwError(error);
      }))
      .subscribe((survey: any) => {
        this.title = survey.title;
        this.dueDate = new Date(survey.dueDate);
        this.questions = survey.questions.join('\n'); // Convert the array of questions back to string format for the textarea
        this.editMode = true;
      });
  }

  updateSurvey(): void {
    const surveyData = {
      title: this.title,
      dueDate: this.dueDate,
      questions: this.questions
    };
    this.http.put(`${this.baseUrl}/survey/updatesurvey/${this.selectedSurveyId}`, surveyData)
      .pipe(catchError(error => {
        this.message = "Failed to update the survey.";
        return throwError(error);
      }))
      .subscribe(response => {
        this.message = "Survey updated successfully!";
        this.resetForm();
        this.loadSurveys();
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
        this.loadSurveys();
      });
  }
}
