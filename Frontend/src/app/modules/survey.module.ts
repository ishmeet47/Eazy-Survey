<<<<<<< HEAD

import { SurveyUser, SurveyUsers } from "./surveyuser.module";



// ... [Your other classes remain unchanged]

=======
>>>>>>> 35c62de13b31a7893c7a86e017f964fa51247065
export class Survey {
  $id: string;
  isPublished: boolean;
  title: string;
  dueDate: string;
  assignedTo: string | null;
  completedBy: CompletedBy;
  questions: Questions;
  groupSurveys: GroupSurveys;
  id: number;
  lastUpdatedOn: string;
  lastUpdatedBy: number;
  description!: string | '';
  surveyUsers: SurveyUsers; // or Array<SurveyUser>; adding the new property


  constructor(
    $id: string,
    isPublished: boolean,
    title: string,
    dueDate: string,
    assignedTo: string | null,
    completedBy: CompletedBy,
    questions: Questions,
    groupSurveys: GroupSurveys,
    id: number,
    lastUpdatedOn: string,
    lastUpdatedBy: number,
    description: string,
    surveyUsers: SurveyUsers
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
    this.surveyUsers = surveyUsers; // initialize the new property

  }
}

export class CompletedBy {
  $id: string;
  $values: any[];

  constructor($id: string, $values: any[]) {
    this.$id = $id;
    this.$values = $values;
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
  group: null | any;

  constructor(
    $id: string,
    surveyId: number,
    survey: SurveyRef,
    groupId: number,
    group: null | any
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
    $id: string,
    heading: string,
    surveyId: number,
    survey: SurveyRef,
    options: Options,
    surveyAnswers: SurveyAnswers,
    id: number,
    lastUpdatedOn: string,
    lastUpdatedBy: number,
    isPublished: boolean
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
    $id: string,
    id: number,
    label: string,
    questionId: number,
    question: QuestionRef,
    answers: Answers
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
