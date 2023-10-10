// // // survey.module.ts

// // export class Survey {
// //   id: number;
// //   title: string;
// //   questions: string[]; // This can be a more complex type if needed

// //   constructor(id: number, title: string, questions: string[] = []) {
// //       this.id = id;
// //       this.title = title;
// //       this.questions = questions;
// //   }
// // }


// export interface Survey {
//   $id: string;
//   isPublished: boolean;
//   title: string;
//   dueDate: string;
//   assignedTo: string | null;
//   completedBy: string | null;
//   questions: Questions;
//   id: number;
//   lastUpdatedOn: string;
//   lastUpdatedBy: number;
// }

// interface Questions {
//   $id: string;
//   $values: Question[];
// }

// interface Question {
//   $id: string;
//   heading: string;
//   surveyId: number;
//   survey: SurveyRef;
//   options: Options;
//   surveyAnswers: SurveyAnswers;
//   id: number;
//   lastUpdatedOn: string;
//   lastUpdatedBy: number;
//   isPublished: boolean;
// }

// interface SurveyRef {
//   $ref: string;
// }

// interface Options {
//   $id: string;
//   $values: Option[];
// }

// interface Option {
//   $id: string;
//   id: number;
//   label: string;
//   questionId: number;
//   question: QuestionRef;
//   answers: Answers;
// }

// interface QuestionRef {
//   $ref: string;
// }

// interface Answers {
//   $id: string;
//   $values: any[];
// }

// interface SurveyAnswers {
//   $id: string;
//   $values: any[];
// }




// final class verison :


// ... [Your other classes remain unchanged]

export class Survey {
  $id: string;
  isPublished: boolean;
  title: string;
  dueDate: string;
  assignedTo: string | null;
  completedBy: string | null;
  questions: Questions;
  groupSurveys: GroupSurveys; // Note the type change here
  id: number;
  lastUpdatedOn: string;
  lastUpdatedBy: number;
  description!: string | "";

  constructor(
    $id: string, isPublished: boolean, title: string, dueDate: string,
    assignedTo: string | null, completedBy: string | null, questions: Questions,
    groupSurveys: GroupSurveys, // Note the parameter type change
    id: number, lastUpdatedOn: string, lastUpdatedBy: number, description: string
  ) {
    this.$id = $id;
    this.isPublished = isPublished;
    this.title = title;
    this.dueDate = dueDate;
    this.assignedTo = assignedTo;
    this.completedBy = completedBy;
    this.questions = questions;
    this.groupSurveys = groupSurveys;
    this.id = id;
    this.lastUpdatedOn = lastUpdatedOn;
    this.lastUpdatedBy = lastUpdatedBy;
    this.description = description;
  }
}


// New GroupSurveys class to represent the groupSurveys object with $values property
export class GroupSurveys {
  $id: string;
  $values: GroupSurvey[];

  constructor($id: string, $values: GroupSurvey[]) {
    this.$id = $id;
    this.$values = $values;
  }
}

// New GroupSurvey class to represent each groupSurvey object
export class GroupSurvey {
  $id: string;
  surveyId: number;
  survey: SurveyRef;
  groupId: number;
  group: null | any; // Depending on the expected structure of 'group', you may need to refine this type

  constructor(
    $id: string, surveyId: number, survey: SurveyRef,
    groupId: number, group: null | any
  ) {
    this.$id = $id;
    this.surveyId = surveyId;
    this.survey = survey;
    this.groupId = groupId;
    this.group = group;
  }
}


export class Questions {
  $id: string;
  $values: Question[];

  constructor($id: string, $values: Question[]) {
    this.$id = $id;
    this.$values = $values;
  }
}

export class Question {
  $id: string;
  heading: string;
  surveyId: number;
  survey: SurveyRef;
  options: Options;
  surveyAnswers: SurveyAnswers;
  id: number;
  lastUpdatedOn: string;
  lastUpdatedBy: number;
  isPublished: boolean;

  constructor(
    $id: string, heading: string, surveyId: number, survey: SurveyRef,
    options: Options, surveyAnswers: SurveyAnswers, id: number,
    lastUpdatedOn: string, lastUpdatedBy: number, isPublished: boolean
  ) {
    this.$id = $id;
    this.heading = heading;
    this.surveyId = surveyId;
    this.survey = survey;
    this.options = options;
    this.surveyAnswers = surveyAnswers;
    this.id = id;
    this.lastUpdatedOn = lastUpdatedOn;
    this.lastUpdatedBy = lastUpdatedBy;
    this.isPublished = isPublished;
  }
}

export class SurveyRef {
  $ref: string;

  constructor($ref: string) {
    this.$ref = $ref;
  }
}

export class Options {
  $id: string;
  $values: Option[];

  constructor($id: string, $values: Option[]) {
    this.$id = $id;
    this.$values = $values;
  }
}

export class Option {
  $id: string;
  id: number;
  label: string;
  questionId: number;
  question: QuestionRef;
  answers: Answers;

  constructor(
    $id: string, id: number, label: string, questionId: number,
    question: QuestionRef, answers: Answers
  ) {
    this.$id = $id;
    this.id = id;
    this.label = label;
    this.questionId = questionId;
    this.question = question;
    this.answers = answers;
  }
}

export class QuestionRef {
  $ref: string;

  constructor($ref: string) {
    this.$ref = $ref;
  }
}

export class Answers {
  $id: string;
  $values: any[];

  constructor($id: string, $values: any[]) {
    this.$id = $id;
    this.$values = $values;
  }
}

export class SurveyAnswers {
  $id: string;
  $values: any[];

  constructor($id: string, $values: any[]) {
    this.$id = $id;
    this.$values = $values;
  }
}
