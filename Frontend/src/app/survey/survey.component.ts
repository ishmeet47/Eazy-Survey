import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserService } from '../services/user.service';
import { Survey } from '../modules/survey.module';
import { Group } from '../modules/group.module';
import { NavigationEnd, Router } from '@angular/router';
// import { bootstrap } from 'ngx-bootstrap-icons';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';

import { AbstractControl, NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { ClickOutsideDirective } from '../directives/ClickOutsideDirective';

declare var $: any; // if you're not using the jQuery type definition


// First, declare your types or interfaces outside the class
type NewSurvey = {
  questions: {
    $values: Array<{
      heading: string,
      options: {
        $values: Array<{
          id: number,
          label: string
        }>
      }
    }>
  }
};

type Option = {
  id: number,
  label: string
};

type ParsedResult = {
  [questionHeading: string]: Option[]
};



type CountResponse = {
  $values: Array<{
    optionId: number,
    count: number
  }>
};

type OptionWithCount = {
  id: number,
  label: string,
  count?: number
};

type ParsedResultWithCount = {
  [questionHeading: string]: OptionWithCount[]
};

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css'],
  encapsulation: ViewEncapsulation.Emulated // or None, or ShadowDom

})
export class SurveyComponent implements OnInit {
  @ViewChild('surveyForm', { static: false }) surveyForm!: NgForm;
  assignedTo: any;
  completedBy: any;
  lastUpdatedOn: any;
  lastUpdatedBy: any;
  groupSurveys: any;

  constructor(private router: Router, private http: HttpClient, private userService: UserService, private cd: ChangeDetectorRef) {
    // router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.loadGroups();
    //   }
    // });
  }
  submitted: boolean = false;
  questionsError!: string;
  title!: string;
  editTitle!: string;
  dueDate!: Date;
  editDueDate !: Date;
  // questions: string[] = []; // to hold questions from the textarea

  questions: any[] = [];

  surveys: Survey[] = [];
  selectedSurveyId!: number;
  editMode = false;
  message!: string;
  groups: any[] = [];
  editingGroups: any[] = [];
  questionsText: string = '';  // <-- Single string for the textarea binding
  editQuestionsText: string = '';
  assignedGroupsToSurvey: { surveyId: number, groupNames: string[] }[] = [];
  newgroups: any[] = [];
  private baseUrl = 'http://localhost:5225';
  dueDateString: string = '';
  editDueDateString: string = '';
  surveyId!: number;
  optionsText: string = '';
  editOptionsText: string = '';
  today = new Date().toISOString().split('T')[0];




  showAddQuestionPopup = false;
  questionsNew: any[] = [];
  newQuestionText = '';
  tempOptions: any[] = [];
  newOptionText = '';
  questionsNewError: string | null = null;
  submittedNew = false;



  // for editing question and option on the create sdurvey from :


  // New properties
  isEditing = false;
  editingIndex: number | null = null;
  editingOptionIndex: number | null = null;



  openModal() {
    const element = document.getElementById('publishModal');
    if (element) {
      const modal = new bootstrap.Modal(element);
      modal.show();
    } else {
      console.error('Modal element not found!');
    }
  }




  deleteQuestion(index: number): void {
    if (index > -1 && index < this.questions.length) {
      this.questions.splice(index, 1);
    }
    this.cd.detectChanges();  // If you have issues with change detection, use this line.
  }

  // Function to start editing a question
  startEditingQuestion(i: number): void {
    this.isEditing = true;
    this.editingQuestionIndex = i;
    // this.newQuestionText = this.questionsNew[i].QuestionText;
    console.log("the indes a", this.editingQuestionIndex);
    // new check for debugging

    this.newQuestionText = this.questions[i].heading;



    this.showAddQuestionFormFlag = true;
    this.addingOptionToExistingQuestion = false;

    this.cd.detectChanges();  // manually trigger change detection

  }

  startEditingOption(questionIndex: number, optionIndex: number): void {
    this.editingQuestionIndex = questionIndex;
    this.editingOptionIndex = optionIndex;
    // this.newOptionText = this.questionsNew[questionIndex].Options[optionIndex];


    // for edit survey debugging new property
    // this.newOptionText = this.questions[questionIndex].options[optionIndex];


    this.newOptionText = this.questions[questionIndex].options[optionIndex].label; // This function sets the value of newOptionText to the option's current text, and this value should be shown in the editing textarea for the option.


    this.addingOptionToExistingQuestion = false;

    this.showAddQuestionFormFlag = true; // to show the editing popup
    this.isEditing = false; // Ensure that we're not in question editing mode
  }

  isEditingExistingSurvey: boolean = false;
  nowSurevyisEdited(): void {
    this.isEditingExistingSurvey = true;

  }







  // version 3
  // new updated version for updatequestionandoptions so that empty option text will not render empty dot on the UI

  updateQuestionOrOption(): void {
    let currentQuestions = this.isEditingExistingSurvey ? this.questions : this.questions;

    if (this.editingQuestionIndex !== null) {
      if (!currentQuestions[this.editingQuestionIndex]) {
        console.error('No question found at index:', this.editingQuestionIndex);
        return;
      }

      if (this.editingOptionIndex !== null) {
        // If it's an option that's being edited
        let optionsProperty = 'options';  // It's the same for both cases now

        if (!currentQuestions[this.editingQuestionIndex][optionsProperty]) {
          console.error('No options array found for question at index:', this.editingQuestionIndex);
          return;
        }

        if (!this.newOptionText.trim()) { // If the edited option is empty
          // Remove the option from the list
          currentQuestions[this.editingQuestionIndex][optionsProperty].splice(this.editingOptionIndex, 1);
        } else {
          let updatedQuestion = { ...currentQuestions[this.editingQuestionIndex] };
          updatedQuestion[optionsProperty][this.editingOptionIndex].label = this.newOptionText;

          // Update the appropriate array in the component's state
          this.questions[this.editingQuestionIndex] = updatedQuestion;
        }
      } else {
        // If it's a question that's being edited
        let questionProperty = 'heading';
        currentQuestions[this.editingQuestionIndex][questionProperty] = this.newQuestionText;

        // Update the appropriate array in the component's state
        this.questions[this.editingQuestionIndex][questionProperty] = this.newQuestionText;
      }
    }

    this.cd.detectChanges();  // Force view update
    this.resetEditingState();
  }





  resetEditingState(): void {
    this.isEditing = false;
    // this.editingQuestionIndex = null;
    this.editingOptionIndex = null;
    this.newOptionText = '';
    this.newQuestionText = '';
    this.showAddQuestionFormFlag = false;
    this.addingOptionToExistingQuestion = false;
  }


  update(): void {
    // if (this.editingQuestionIndex !== null && this.editingOptionIndex !== null) {
    //   this.questionsNew[this.editingQuestionIndex].Options[this.editingOptionIndex] = this.newOptionText;
    // }

    // if (this.editingQuestionIndex !== null) {
    //   this.questionsNew[this.editingQuestionIndex].QuestionText = this.newQuestionText;
    // }



    if (this.editingQuestionIndex !== null && this.editingOptionIndex !== null) {
      this.questions[this.editingQuestionIndex].options[this.editingOptionIndex] = this.newOptionText;
    }

    if (this.editingQuestionIndex !== null) {
      this.questions[this.editingQuestionIndex].heading = this.newQuestionText;
    }

    // Reset the flags
    this.isEditing = false;
    this.editingQuestionIndex = null; // amandeep yha ni kiya
    this.editingOptionIndex = null;
    this.showAddQuestionFormFlag = false;
  }





  resetOptionError(): void {

    if (this.newOptionText.trim().length > 0) {
      this.noOptionsError = false;


      this.noOptionsSpecialError = false;

    }
    this.questionsNewError = '';
  }

  // Function to start editing an option
  // startEditingOption(questionIndex: number, optionIndex: number): void {
  //   this.isEditing = true;
  //   this.editingIndex = questionIndex;
  //   this.editingOptionIndex = optionIndex;
  //   this.newQuestionText = this.questionsNew[questionIndex].Options[optionIndex];
  //   this.showAddQuestionPopup = true;
  // }

  // Modified function to handle adding OR updating question
  // Modified function to handle adding OR updating question
  // Modified function to handle adding OR updating question
  addOrUpdateQuestion(): void {
    if (!this.newQuestionText) {
      this.noQuestionsError = true;
    } else {
      this.noQuestionsError = false;
      // ... the rest of your logic for adding/updating the question
    }


    if (this.tempOptions.length === 0) {
      this.questionsNewError = 'At least one option is required for the question!';
      return;
    } else {
      this.questionsNewError = ''; // Reset the error
      // ... (rest of your logic)
    }

    if (this.isEditing && this.editingIndex !== null) {
      // if (this.editingOptionIndex !== null) {
      //   this.questionsNew[this.editingIndex].Options[this.editingOptionIndex] = this.newQuestionText;
      // } else {
      //   this.questionsNew[this.editingIndex].QuestionText = this.newQuestionText;
      // }

      if (this.editingOptionIndex !== null) {
        this.questions[this.editingIndex].options[this.editingOptionIndex] = this.newQuestionText;
      } else {
        this.questions[this.editingIndex].heading = this.newQuestionText;
      }



      this.stopEditing();
      this.finalizeOptionsAndClose();
    } else {
      if (this.tempOptions.length === 0) {
        this.questionsNewError = 'At least one option is required for the question!';
        return;
      }
      this.questionsNew.push({
        QuestionText: this.newQuestionText,
        Options: [...this.tempOptions]
      });

      // this.questions.push({
      //   QuestionText: this.newQuestionText,
      //   Options: [...this.tempOptions]
      // });


      this.questions.push({
        heading: this.newQuestionText,
        options: [...this.tempOptions]
      });

      this.resetQuestionFields();
    }
    this.showAddQuestionFormFlag = false;

  }


  // Function to stop editing mode
  stopEditing(): void {
    this.isEditing = false;
    this.editingIndex = null;
    this.editingOptionIndex = null;
  }

  // Function to reset question fields
  // Function to reset question fields
  resetQuestionFields(): void {
    this.newQuestionText = '';
    this.tempOptions = [];
    // Do not close the popup here
  }

  // finalizeOptionsAndClose(): void {
  //   if (this.isEditing && this.editingIndex !== null) {
  //     // If editing, update the options for the selected question
  //     this.questionsNew[this.editingIndex].Options = [...this.tempOptions];
  //     this.stopEditing();
  //   }
  //   this.showAddQuestionPopup = false;
  //   this.resetQuestionFields();
  // }


  finalizeOptionsAndClose(): void {
    this.optionsFinalized = true;
    this.showAddQuestionPopup = false;
    this.resetQuestionFields();
  }






  showAddQuestionFormFlag: boolean = false;

  editingQuestionIndex: number | null = null;

  toggleAddQuestionForm(): void {
    // this.showAddQuestionFormFlag = true; // Directly set it to true
    // this.isEditing = false;
    // this.editingOptionIndex = null;
    // this.addingOptionToExistingQuestion = false;

    // // ... existing logic
    // this.newQuestionText = '';
    // this.noQuestionsError = false;
    this.submitted = false;  // Reset the submitted flag to false
    this.showValidationMessages = false




    this.showAddQuestionFormFlag = !this.showAddQuestionFormFlag;
    if (this.showAddQuestionFormFlag) {
      // Reset values when opening the form
      this.resetQuestionValidationState();
      this.newQuestionText = '';
      this.newOptionText = '';
      this.tempOptions = [];
      this.noQuestionsError = false;
      this.noOptionsError = false;
      this.isEditing = false;
      this.editingOptionIndex = null;
      this.addingOptionToExistingQuestion = false;
      this.noOptionsSpecialError = false
    }
  }





  addingOptionToExistingQuestion: boolean = false;  // Declare this at the class level

  showOptionInput(questionIndex: number): void {
    this.isEditing = false;  // We're not editing an existing question
    this.editingQuestionIndex = questionIndex;
    this.addingOptionToExistingQuestion = true;  // We're adding an option
    this.showAddQuestionFormFlag = true;
    this.newOptionText = '';
  }







  noOptionsError: boolean = false; // Add this to the class properties to track the error state

  confirmOptions(): void {
    if (this.editingQuestionIndex !== null) {
      if (this.tempOptions.length > 0) {
        if (this.isEditingExistingSurvey) {
          if (!this.questions[this.editingQuestionIndex].options) {
            this.questions[this.editingQuestionIndex].options = [];
          }
          this.questions[this.editingQuestionIndex].options = [...this.questions[this.editingQuestionIndex].options, ...this.tempOptions];
        } else {
          // if (!this.questionsNew[this.editingQuestionIndex].Options) {
          //   this.questionsNew[this.editingQuestionIndex].Options = [];
          // }
          // this.questionsNew[this.editingQuestionIndex].Options = [...this.questionsNew[this.editingQuestionIndex].Options, ...this.tempOptions];

          if (!this.questions[this.editingQuestionIndex].options) {
            this.questions[this.editingQuestionIndex].options = [];
          }
          this.questions[this.editingQuestionIndex].options = [...this.questions[this.editingQuestionIndex].options, ...this.tempOptions];


        }

        this.tempOptions = []; // Clear the temporary options
        this.showAddQuestionFormFlag = false; // Close the popup
        this.addingOptionToExistingQuestion = false; // Reset this flag
        this.noOptionsError = false; // Reset the no options error
        this.noOptionsSpecialError = false; // Set the error if there are no options

      } else {
        // this.noOptionsError = true; // Set the error if there are no options

        this.noOptionsSpecialError = true; // Set the error if there are no options

      }
    }
  }

  noOptionsSpecialError: boolean = false;

  showAddQuestionForm(): void {
    this.resetQuestionFields();
    this.showAddQuestionPopup = true;
    this.isEditing = false;
    this.editingOptionIndex = null;
  }

  // Flag to determine if options have been finalized
  optionsFinalized: boolean = false;






  addNewOption(): void {
    // if (this.newOptionText.trim().length === 0) {
    //   this.noOptionsError = true;
    // }


    if (!this.newOptionText.trim()) {
      this.questionsNewError = 'Option text is required!';
      return;
    }
    var option = {};

    // if (this.questions.length == 0 || this.editingQuestionIndex == 0 || this.editingQuestionIndex === null) {

    var newOptionId, IDQuestion;
    if (this.editingQuestionIndex === null) {
      if (this.questions && this.questions.length == 0) {
        IDQuestion = 999999;//this.questions[this.editingQuestionIndex].id;
        newOptionId = IDQuestion;
      }
    } else {
      if (this.questions && this.questions.length > 0) {
        if (this.questions[this.editingQuestionIndex].options == null) {

          if (this.questions[this.editingQuestionIndex].id) {
            IDQuestion = this.questions[this.editingQuestionIndex].id
            newOptionId = 999999
          } else {
            IDQuestion = 999999;//this.questions[this.editingQuestionIndex].id;
            newOptionId = IDQuestion;
          }


        } else if (this.questions[this.editingQuestionIndex].options && this.questions[this.editingQuestionIndex].options.length > 0) {
          const options_present = this.questions[this.editingQuestionIndex].options;
          IDQuestion = options_present[options_present.length - 1].questionId;
          newOptionId = 999999;
        }
      }

    }


    option = {
      id: newOptionId,
      label: this.newOptionText,
      questionId: IDQuestion  // Assuming `this.currentSurveyId` holds the ID of the currently selected survey.
    };





    this.tempOptions.push(option);
    this.newOptionText = ''; // Reset the input field
    this.noOptionsError = false;


    this.noOptionsSpecialError = false

  }


  resetForm(): void {
    this.submitted = false;
    this.submittedNew = false;
    this.title = '';
    this.dueDate = new Date();
    this.questions = [];
    this.editMode = false;
    this.questionsText = '';
    // this.groups = [];
    this.questionsError = '';

    // Reset new properties
    this.showAddQuestionPopup = false;
    this.questionsNew = [];
    this.newQuestionText = '';
    this.tempOptions = [];
    this.newOptionText = '';
    this.questionsNewError = null;

    // The following properties seem unrelated to the current form. If they aren't used in this form context, consider removing them.
    this.editTitle = '';
    this.editDueDate = new Date();
    this.editQuestionsText = '';
    this.editOptionsText = '';
    this.noQuestionsError = false;
    this.showValidationTitleMessage = false;
    this.showValidationDateMessage = false;
    this.dueDateString = '';
    this.description = ''
  }



  resetFormAndHide(): void {
    this.displayForm = false; // Hide the form
    this.title = ''; // Reset the title
    this.description = ''; // Reset the description
    this.dueDateString = ''; // Reset the due date string
    this.questions = []; // Reset the questions array
    this.editMode = false;
    // Add resets for other form-related properties as needed...

    // Reset group selections
    if (this.groupSurveys) {
      this.groupSurveys.forEach((group: any) => {
        group.selected = false;
      });
    }



    this.submitted = false;
    this.submittedNew = false;
    this.title = '';
    this.dueDate = new Date();
    this.questions = [];
    this.editMode = false;
    this.questionsText = '';
    // this.groups = [];
    this.questionsError = '';

    // Reset new properties
    this.showAddQuestionPopup = false;
    this.questionsNew = [];
    this.newQuestionText = '';
    this.tempOptions = [];
    this.newOptionText = '';
    this.questionsNewError = null;

    // The following properties seem unrelated to the current form. If they aren't used in this form context, consider removing them.
    this.editTitle = '';
    this.editDueDate = new Date();
    this.editQuestionsText = '';
    this.editOptionsText = '';
    this.noQuestionsError = false;
    this.showValidationTitleMessage = false;
    this.showValidationDateMessage = false;
  }

  ngOnInit(): void {
    // This is just a placeholder, you might want to fetch the actual groups from your backend
    this.loadGroups();  // Loading groups on component initialization

    this.loadSurveys();

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
        this.editingGroups = groups.map(group => ({ ...group, selected: false }));

        // this.cd.detectChanges(); // Manually trigger change detection

      } else {
        console.error("Unexpected data structure:", groups);
      }
      // this.cd.detectChanges();

      console.log("yoo", this.groups); // Check the output after loadGroups has been called
      console.log("editing groups are", this.editingGroups); // Check the output after loadGroups has been called


      this.groupSurveys = this.groups;
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

  createSurveyOld(): void {
    this.submitted = true;
    this.checkQuestionsValid(this.questionsText);


    // if (!this.checkQuestionsValid(this.questionsText)) {
    //   this.message = "Please enter options for your question.";
    //   return;  // Exit the function to stop the survey from being created
    // }

    if (this.questionsError) {
      return;  // Exit the function to stop the survey from being created
    }

    const questionsArray = this.questionsText.split('\n\n'); // Assuming two newlines separate each question
    const questionsWithOptions = this.parseQuestions(questionsArray);

    // Filter out the selected user groups
    const selectedGroups = this.groups.filter(group => group.selected).map(group => group.id);

    const surveyData = {
      title: this.title,
      dueDate: this.dueDateString,
      QuestionsWithOptions: questionsWithOptions,
      userGroupIds: selectedGroups  // Add the selected user group ids here
    };
    this.http.post(`${this.baseUrl}/survey/create`, surveyData)
      .pipe(catchError(error => {
        this.submitted = false; // Resetting the flag

        this.message = "Failed to create survey.";
        return throwError(error);
      }))
      .subscribe(response => {
        this.message = "Survey created successfully!";
        this.resetForm(); // Resetting form after successful creation
        this.loadGroups();
        this.loadSurveys();
      });
  }

  description!: string;

  showValidationTitleMessage: boolean = false;

  resetSubmittedTitle() {
    // this.submitted = false;
    this.showValidationTitleMessage = false;
    // this.showValidationDateMessage = false;
    this.cd.detectChanges();

  }



  // checkResults(surveyId: number) {


  //   this.surveyService.getSurveyById(surveyId).subscribe(surveyData => {
  //     this.showResults(surveyData);
  //   });
  // }



  extractQuestionsAndOptions(survey: NewSurvey): ParsedResult {
    let resultMap: ParsedResult = {};

    const questionsArray = survey.questions['$values'];

    for (const question of questionsArray) {
      const heading: string = question.heading;
      const optionsArray = question.options['$values'];

      let optionsList: Option[] = [];

      for (const option of optionsArray) {
        optionsList.push({
          id: option.id,
          label: option.label
        });
      }

      resultMap[heading] = optionsList;
    }

    return resultMap;
  }
  // Example usage:
  // const survey: Survey = { /* your survey object here */ };
  // const result = extractQuestionsAndOptions(survey);
  // console.log(result);

  updateCountInResultMap(countResponse: CountResponse, resultMap: ParsedResult): ParsedResultWithCount {
    let updatedResultMap: ParsedResultWithCount = {};

    for (const [question, options] of Object.entries(resultMap)) {
      updatedResultMap[question] = options.map(opt => {
        // Find matching count data
        const matchingCountData = countResponse.$values.find(item => item.optionId === opt.id);
        // If found, add the count to the result option
        if (matchingCountData) {
          return {
            ...opt,
            count: matchingCountData.count
          };
        }
        // Otherwise, return the option as is
        return opt;
      });
    }

    return updatedResultMap;
  }


  onChartClickOutside(): void {
    this.showResults = false;
  }


  showResults = false;
  // ng - apex chart fields :

  // parent.component.ts
  myStructure: { [key: string]: { id: number, label: string, count?: number }[] } = {};

  totalNumberOfUsers!: number;  // total number of users

  checkResults(survey: any) {
    // Extract option IDs
    const optionIds = this.getOptionIdsFromSurvey(survey);

    const result = this.extractQuestionsAndOptions(survey);


    console.log(result);

    const groupIds = this.getGroupIdsFromSurvey(survey);
    // Call the service method

    var data1, data2;
    var totalnoofusers = 0;

    this.getAnswersByOptionIds(optionIds).subscribe((response: any) => {
      // Handle the response, display data, or any other operations you want to perform.

      data1 = response;
      console.log(response);

      var finalParsedData = this.updateCountInResultMap(response, result);

      console.log("final parsed structure is ", finalParsedData);
      this.myStructure = finalParsedData;

      this.getAllUsersToWhichTheSurveyisAssigned(groupIds).subscribe((response: any) => {
        data2 = response;
        console.log(data2);
        response.$values.forEach((x: any) => {
          totalnoofusers += x.count;
        });
        console.log("total no of users ", totalnoofusers);
        this.totalNumberOfUsers = totalnoofusers;


      });


    });

    console.log("total no of users ", totalnoofusers);

    // this.showResults(response);

  }

  getOptionIdsFromSurvey(survey: any): number[] {
    let optionId: number[] = [];

    survey.questions.$values.forEach((question: any) => {
      question.options.$values.forEach((option: any) => {
        optionId.push(option.id);
      });
    });

    return optionId;
  }


  getGroupIdsFromSurvey(survey: any): number[] {
    let groupId: number[] = [];

    survey.groupSurveys.$values.forEach((group: any) => {
      // question.options.$values.forEach((option: any) => {
      groupId.push(group.groupId);
      // });
    });

    return groupId;
  }


  // showResults(surveyData: any) {
  //   const results: { optionId: number; userCount: number }[] = [];

  //   surveyData.$values.forEach((question: any) => {
  //     question.options.$values.forEach((option: any) => {
  //       const optionId = option.id;
  //       // This assumes that the answers in SurveyAnswers are linked to options by optionId.
  //       const userCount = option.answers.$values.length;
  //       results.push({ optionId, userCount });
  //     });
  //   });

  //   // this.displayChart(results);
  // }


  onChartDisplayed(event: boolean) {
    if (event) {
      // Handle the event, e.g., show a message or perform other actions.
    }
  }






  getAnswersByOptionIds(optionIds: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/survey/getAnswersByOptionIds`, optionIds)
      .pipe(
        catchError(error => {
          // Handle the error here - perhaps send it to an error logging service, show a user notification, etc.
          console.error("Error fetching answers by option IDs: ", error);
          return throwError(error);
        }),
        map(response => {
          // Process or transform the response if needed
          return response;
        })
      );
  }



  getAllUsersToWhichTheSurveyisAssigned(groupIds: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/survey/getUsersByGroupIds`, groupIds)
      .pipe(
        catchError(error => {
          // Handle the error here - perhaps send it to an error logging service, show a user notification, etc.
          console.error("Error fetching answers by option IDs: ", error);
          return throwError(error);
        }),
        map(response => {
          // Process or transform the response if needed
          return response;
        })
      );
  }




  resetSubmittedDate() {
    // this.submitted = false;
    // this.showValidationTitleMessage = false;
    this.showValidationDateMessage = false;
    this.cd.detectChanges();

  }

  resetQuestionValidationState() {
    this.newQuestionText = ''; // reset the question text
    this.showAddQuestionFormFlag = true; // set flag to show the add question form
    this.noQuestionsError = false;
    this.submitted = false;  // Reset the submitted flag to false
    this.showValidationMessages = false
    // Any other flags or properties related to the question validation should be reset here
  }


  resetQuestionValidationStateNew() {
    this.noQuestionsError = false;

    // Any other flags or properties related to the question validation should be reset here
  }

  dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight to compare dates without time

    if (inputDate < today) {
      return { 'dateInvalid': true };
    }
    return null;
  }

  noQuestionsError: boolean = false;
  showValidationDateMessage: boolean = false;

  createSurvey(): void {
    this.showValidationTitleMessage = true;
    this.showValidationDateMessage = true;

    this.submitted = true;



    // if (!this.questionsNew || this.questionsNew.length === 0) {
    //   this.noQuestionsError = true;
    //   this.questionsNewError = "At least one question with options is required.";
    //   // return;  // Exit the function to stop the survey from being created
    // }




    if (this.surveyForm.invalid) { // Assuming you've named your form 'form'
      this.showValidationMessages = true;
      // this.showOtherValidationMessages = true;
      return;
    }


    // this.cd.detectChanges();

    console.log('Is form valid:', this.surveyForm.valid);

    if (!this.surveyForm.valid) {
      return;
    }



    if (!this.questions || this.questions.length === 0) {
      this.noQuestionsError = true;
      this.questionsNewError = "At least one question with options is required.";
      return;  // Exit the function to stop the survey from being created
    }


    // Filter out the selected user groups
    const selectedGroups = this.groups.filter(group => group.selected).map(group => group.id);


    const transformedQuestions = this.questions;


    // const transformedQuestions = this.questions.map(question => {
    //   return {
    //     heading: question.heading,
    //     options: question.options.map((option: any) => option.label)  // Convert the options to an array of labels
    //   };
    // });

    const surveyData = {
      title: this.title,
      Description: this.description || "",
      dueDate: this.dueDateString,
      // QuestionsWithOptions: this.questionsNew,  // Using the new property directly
      QuestionsWithOptions: transformedQuestions,  // Using the new property directly

      userGroupIds: selectedGroups
    };

    this.http.post(`${this.baseUrl}/survey/create`, surveyData)
      .pipe(catchError(error => {
        this.submitted = false; // Resetting the flag
        this.message = "Failed to create survey.";
        setTimeout(() => {
          this.message = '';  // clear the message after 5 seconds
        }, 5000);
        return throwError(error);
      }))
      .subscribe(response => {
        this.message = "Survey created successfully!";
        setTimeout(() => {
          this.message = '';  // clear the message after 5 seconds
        }, 5000);
        this.resetForm(); // Resetting form after successful creation
        this.loadGroups();
        this.loadSurveys();
      });
  }


  optionsNewError: string = '';

  updateSurvey(): void {
    this.showValidationTitleMessage = true;
    this.showValidationDateMessage = true;

    this.submitted = true;

    if (this.surveyForm.invalid) { // Assuming you've named your form 'form'
      this.showValidationMessages = true;
      // this.showOtherValidationMessages = true;
      return;
    }


    // this.cd.detectChanges();

    console.log('Is form valid:', this.surveyForm.valid);

    if (!this.surveyForm.valid) {
      return;
    }

    // if (!this.questionsNew || this.questionsNew.length === 0) {
    //   this.noQuestionsError = true;
    //   this.questionsNewError = "At least one question with options is required.";
    //   return;  // Exit the function to stop the survey from being created
    // }

    var checker = false;
    if (!this.questions || this.questions.length === 0) {
      this.noQuestionsError = true;
      this.questionsNewError = "At least one question with options is required.";
      return;  // Exit the function to stop the survey from being created
    }
    else if (this.questions.length > 0) {
      this.questions.forEach(element => {
        if (element.options == null || element.options.length == 0) {
          this.noOptionsError = true;
          this.optionsNewError = "Please select some options for the question.";
          checker = true;
          return;  // Exit the function to stop the survey from being created


        }

      });
      // return;
    }
    if (checker) return;


    // Filter out the selected user groups
    const selectedGroups = this.groups.filter(group => group.selected).map(group => group.id);


    // const transformedQuestions = this.questions;

    const transformedQuestions = this.questions.map(question => {
      // Clone the question object to prevent mutating the original
      const transformedQuestion = { ...question };

      // If id property is not present but there are options, populate it with the questionId of the first option
      if (!transformedQuestion.id && transformedQuestion.options && transformedQuestion.options.length > 0) {
        transformedQuestion.id = 99999999//transformedQuestion.options[0].questionId;
      }

      // If surveyAnswers property is not present, add it as an empty array
      if (!transformedQuestion.hasOwnProperty('surveyAnswers')) {
        transformedQuestion.surveyAnswers = [];
      }

      return transformedQuestion;
    });


    // const transformedQuestions = this.questions.map(question => {
    //   return {
    //     heading: question.heading,
    //     options: question.options.map((option: any) => option.label)  // Convert the options to an array of labels
    //   };
    // });

    const surveyData = {
      id: this.surveyId,
      title: this.title,
      Description: this.description || "",
      dueDate: this.dueDateString,
      // QuestionsWithOptions: this.questionsNew,  // Using the new property directly
      QuestionsWithOptions: transformedQuestions,  // Using the new property directly

      userGroupIds: selectedGroups
    };

    this.http.put(`${this.baseUrl}/survey/updatesurvey/${this.surveyId}`, surveyData)
      .pipe(catchError(error => {
        this.submitted = false; // Resetting the flag
        this.message = "Failed to update survey.";
        setTimeout(() => {
          this.message = '';  // clear the message after 5 seconds
        }, 5000);
        return throwError(error);
      }))
      .subscribe(response => {
        this.message = "Survey updated successfully!";
        setTimeout(() => {
          this.message = '';  // clear the message after 5 seconds
        }, 5000);
        this.resetForm(); // Resetting form after successful creation
        this.loadGroups();
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


  // working version






  editSurveyNew(surveyId: number): void {
    this.surveyId = surveyId;
    const survey = this.surveys.find(s => s.id === surveyId);
    if (!survey) return;

    this.title = survey.title; // Directly set the title for the form model.
    this.dueDate = new Date(survey.dueDate); // Directly set the dueDate for the form model.

    // this.questionsNew = survey.questions.$values.map(q => {
    //   return {
    //     QuestionText: q.heading,
    //     Options: q.options.$values.map(opt => opt.label)
    //   };
    // });


    this.questions = survey.questions.$values.map(q => {
      return {
        QuestionText: q.heading,
        Options: q.options.$values.map(opt => opt.label)
      };
    });

    const assignedGroupsForSurvey = this.assignedGroupsToSurvey.find(ag => ag.surveyId === surveyId);
    if (assignedGroupsForSurvey) {
      const groupNamesAssigned = assignedGroupsForSurvey.groupNames;
      this.groups.forEach(group => {
        group.selected = groupNamesAssigned.includes(group.name);
      });
    } else {
      this.groups.forEach(group => group.selected = false);
    }

    this.editMode = true;
  }


  loadSurveys(): void {

    this.loadGroups();

    this.http.get<any>(`${this.baseUrl}/survey/getsurveys`)
      .pipe(catchError(error => {
        if (error.status !== 404) {
          this.message = "Failed to fetch surveys.";
        }
        return throwError(error);
      }))
      .subscribe(response => {
        this.surveys = response.$values;
        this.assignedGroupsToSurvey = [];

        // Go through each survey in the response
        for (const survey of this.surveys) {
          let groupNamesForThisSurvey = [];

          // Go through each groupSurvey entry for the current survey
          for (const groupSurvey of survey.groupSurveys.$values) {
            // Find the group from this.groups by matching the ID
            let matchedGroup = this.groups.find(group => group.id === groupSurvey.groupId);

            // If a match is found, push the group name to groupNamesForThisSurvey
            if (matchedGroup) {
              groupNamesForThisSurvey.push(matchedGroup.name);
            }
          }

          // Create an object representing the survey and its corresponding group names
          this.assignedGroupsToSurvey.push({
            surveyId: survey.id,
            groupNames: groupNamesForThisSurvey
          });
        }

        // this.cd.detectChanges();

        console.log("surveys are ", this.surveys);
        console.log("assigned groups are ", this.assignedGroupsToSurvey);
      });
  }





  // declare var $: any; // if you're not using the jQuery type definition

  // Add a function to show the modal when clicking edit or create survey button.
  // openCreateForm() {
  //     $('#surveyModal').modal('show');
  // }

  editSurvey(surveyId: number): void {
    this.surveyId = surveyId;
    const survey = this.surveys.find(s => s.id === surveyId);
    if (!survey) return;

    console.log('editing groups are ', this.editingGroups);
    this.selectedSurveyId = survey.id;
    // this.title = survey.title;
    // this.dueDate = new Date(survey.dueDate);

    // this.questionsText = survey.questions.$values.map(q => q.heading).join('\n\n');
    // this.optionsText = survey.questions.$values.map(q => q.options.$values.map(opt => opt.label).join(', ')).join('\n\n');

    this.editTitle = survey.title;
    this.editDueDate = new Date(survey.dueDate);
    this.editQuestionsText = survey.questions.$values.map(q => q.heading).join('\n\n');
    this.editOptionsText = survey.questions.$values.map(q => q.options.$values.map(opt => opt.label).join(', ')).join('\n\n');


    const date = new Date(survey.dueDate);
    this.editDueDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    // Here's the logic to set the 'selected' property of groups
    const assignedGroupsForSurvey = this.assignedGroupsToSurvey.find(ag => ag.surveyId === surveyId);
    if (assignedGroupsForSurvey) {

      console.log('assignedGroupsForSurvey ', this.assignedGroupsToSurvey);
      const groupNamesAssigned = assignedGroupsForSurvey.groupNames;
      this.editingGroups.forEach(editingGroup => {
        editingGroup.selected = groupNamesAssigned.includes(editingGroup.name);
      });
    } else {
      this.editingGroups.forEach(editingGroup => editingGroup.selected = false);
    }

    // this.cd.detectChanges();

    const element = document.getElementById('editModal');
    if (element) {
      const modal = new bootstrap.Modal(element);
      modal.show();
    } else {
      console.error('Modal element not found!');
    }
    // this.resetForm();
  }

  // for new approach when user clicks on the button to open the form :
  displayForm = false;




  openCreateForm() {
    this.editMode = false;
    this.resetForm();
    this.displayForm = true;


    // $('#surveyModal').modal('show'); // for the jquery pop up
  }



  publishedSurveyLink!: string;




  showPublishPopup(surveyId: number) {
    this.http.put<any>(`${this.baseUrl}/survey/publish/${surveyId}`, {})
      .pipe(catchError(error => {
        console.error('Failed to publish survey:', error);
        return of(null); // Emit null to proceed to the subscription without throwing an error
      }))
      .subscribe(response => {
        if (response && response.success) {
          // Rest of your logic...

          const sharingId = this.generateSharingId(surveyId);
          const baseUrl = window.location.origin;
          this.publishedSurveyLink = `${baseUrl}/login?shareId=${sharingId}`;

          const element = document.getElementById('publishModalNew');
          if (element) {
            const modal = new bootstrap.Modal(element);
            modal.show();
          } else {
            console.error('Modal element not found!');
          }
        } else {
          console.error(response ? response.message : 'Failed to publish survey');
        }

        this.loadSurveys();
        this.cd.detectChanges();
      });
  }






  generateSharingId(surveyId: number) {
    // Your logic to generate sharing ID for a survey goes here
    return surveyId.toString();
  }


  // openEditForm(survey: any) {
  //   this.editMode = true;
  //   this.displayForm = true;

  //   // Assuming survey has the properties: title, dueDate, etc.
  //   this.title = survey.title;
  //   this.dueDate = survey.dueDate;
  //   // ... populate other fields ...
  //   this.groups =
  //   // Set the current survey ID for the edit
  //   this.surveyId = survey.id;
  // }

  tmpSurveyForOption: any;

  openEditForm(survey: any) {
    this.tmpSurveyForOption = survey;
    this.editMode = true;
    this.displayForm = true;

    // Direct properties of the survey
    this.title = survey.title;
    this.description = survey.description;
    this.dueDate = survey.dueDate;

    // ocnverting in to string

    this.dueDateString = survey.dueDate.split("T")[0];



    this.assignedTo = survey.assignedTo;
    this.completedBy = survey.completedBy;
    this.surveyId = survey.id;
    this.lastUpdatedOn = survey.lastUpdatedOn;
    this.lastUpdatedBy = survey.lastUpdatedBy;

    // Questions
    this.questions = survey.questions.$values.map((question: any) => {
      return {
        heading: question.heading,
        surveyId: question.surveyId,
        isPublished: question.isPublished,
        options: question.options.$values.map((option: any) => {
          return {
            id: option.id,
            label: option.label,
            questionId: option.questionId
          };
        }),
        surveyAnswers: question.surveyAnswers.$values,
        id: question.id,
        lastUpdatedOn: question.lastUpdatedOn,
        lastUpdatedBy: question.lastUpdatedBy
      };
    });

    // GroupSurveys (if you want to handle it similarly)
    // this.groupSurveys = survey.groupSurveys.$values;

    // older loop version not working correctly::
    // this.groupSurveys.forEach((group: any) => {
    //   group.selected = survey.groupSurveys.$values.some((g: any) => g.id === group.id);
    // });

    for (let surveyGroup of survey.groupSurveys.$values) {
      for (let groupSurvey of this.groupSurveys) {
        if (surveyGroup.groupId === groupSurvey.id) {
          groupSurvey.selected = true;
          break; // No need to continue the inner loop once we found a match
        }
      }
    }


    console.log("updated gtroups are ", this.groupSurveys);
  }

  deleteOption(questionIndex: number, optionIndex: number) {
    // Remove the option from the question's options array
    this.questions[questionIndex].options.splice(optionIndex, 1);
  }


  updateSurveyold(): void {
    this.showValidationMessages = true;

    this.submitted = true;
    this.checkQuestionsValid(this.questionsText);

    // The error check can be done in the same manner as the createSurvey method
    // if (!this.checkQuestionsValid(this.questionsText)) {
    //   this.message = "Please enter options for your question.";
    //   return;  // Exit the function to stop the survey from being updated
    // }

    if (this.questionsError) {
      return;  // Exit the function to stop the survey from being updated
    }

    const questionsArray = this.questionsText.split('\n\n'); // Assuming two newlines separate each question
    const questionsWithOptions = this.parseQuestions(questionsArray);

    // Filter out the selected user groups
    const selectedGroups = this.groups.filter(group => group.selected).map(group => group.id);

    // Construct the data to be sent for the update
    const surveyData = {
      id: this.surveyId,  // Assuming you have the survey's ID stored in the component
      title: this.editTitle,
      dueDate: this.editDueDate,
      QuestionsWithOptions: questionsWithOptions,
      userGroupIds: selectedGroups  // Add the selected user group ids here
    };

    // Notice the change in endpoint, it now has the surveyId and the 'update' action
    this.http.put(`${this.baseUrl}/survey/updatesurvey/${this.surveyId}`, surveyData)
      .pipe(catchError(error => {
        this.message = "Failed to update survey.";
        return throwError(error);
      }))
      .subscribe(response => {
        this.message = "Survey updated successfully!";
        this.resetForm(); // Resetting form after successful update
        this.loadSurveys();
      });
  }



  checkQuestionsValid(questionsText: string): void {

    // Reset questionsError at the beginning.
    this.questionsError = "";

    // If there's no question mark
    if (!questionsText.includes('?')) {
      this.questionsError = "Please enter the question.";
      return;
    }

    // Split by question mark to get individual questions
    const questionsArray = questionsText.split('?');

    // Loop through all the parts except the last (because after the last '?' there's no question)
    for (let i = 0; i < questionsArray.length - 1; i++) {
      const question = questionsArray[i].trim();
      const nextQuestionOrOption = (questionsArray[i + 1] || "").trim();

      // If a question mark is present but is followed by nothing or only spaces, set the error message
      if (!nextQuestionOrOption) {
        this.questionsError = "Please enter options for your question.";
        return;
      }
    }

    // If all questions are valid, reset the error message
    this.questionsError = "";
  }


  showValidationMessages = false;



  resetQuestionError() {
    this.questionsError = "";
  }

  // updateSurvey(): void {
  //   const surveyData = {
  //     title: this.title,
  //     dueDate: this.dueDate,
  //     questions: this.questions
  //   };
  //   this.http.put(`${this.baseUrl}/survey/updatesurvey/${this.selectedSurveyId}`, surveyData)
  //     .pipe(catchError(error => {
  //       this.message = "Failed to update the survey.";
  //       return throwError(error);
  //     }))
  //     .subscribe(response => {
  //       this.message = "Survey updated successfully!";
  //       this.resetForm();
  //       this.loadSurveys();
  //     });
  // }

  deleteSurvey(id: number): void {
    this.http.delete(`${this.baseUrl}/survey/deletesurvey/${id}`)
      .pipe(catchError(error => {
        this.message = "Failed to delete the survey.";
        setTimeout(() => {
          this.message = '';  // clear the message after 5 seconds
        }, 5000);
        return throwError(error);
      }))
      .subscribe(response => {
        this.message = "Survey deleted successfully!";
        setTimeout(() => {
          this.message = '';  // clear the message after 5 seconds
        }, 5000);
        this.loadSurveys();
      });
  }
}
