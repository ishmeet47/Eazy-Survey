// First, we define related types to represent the nested data structures.

type SurveyReference = {
  $ref: string;
};

type UserGroup = {
  $id: string;
  $values: any[]; // Replace 'any' with the actual type of values.
};

type CompletedSurvey = {
  $id: string;
  $values: any[]; // Replace 'any' with the actual type of values.
};

export class User {
  $id: string;
  username: string;
  password: string; // Note: It's unusual to handle passwords directly on the client-side.
  passwordKey: string;
  userType: string;
  userGroups: UserGroup;
  surveysCompleted: CompletedSurvey;
  surveyUsers: SurveyUsers; // This is recursive and should be handled based on your actual logic.
  id: number;
  lastUpdatedOn: string;
  lastUpdatedBy: number;
  isPublished: boolean;

  constructor(
    $id: string,
    username: string,
    password: string,
    passwordKey: string,
    userType: string,
    userGroups: UserGroup,
    surveysCompleted: CompletedSurvey,
    surveyUsers: SurveyUsers,
    id: number,
    lastUpdatedOn: string,
    lastUpdatedBy: number,
    isPublished: boolean
  ) {
    this.$id = $id;
    this.username = username;
    this.password = password;
    this.passwordKey = passwordKey;
    this.userType = userType;
    this.userGroups = userGroups;
    this.surveysCompleted = surveysCompleted;
    this.surveyUsers = surveyUsers;
    this.id = id;
    this.lastUpdatedOn = lastUpdatedOn;
    this.lastUpdatedBy = lastUpdatedBy;
    this.isPublished = isPublished;
  }
}

export class SurveyUser {
  $id: string;
  userId: number;
  user: User; // This now refers to the nested 'User' type we've created above.
  surveyId: number;
  survey: SurveyReference; // Assuming this only contains a reference identifier.

  constructor(
    $id: string,
    userId: number,
    user: User,
    surveyId: number,
    survey: SurveyReference
  ) {
    this.$id = $id;
    this.userId = userId;
    this.user = user;
    this.surveyId = surveyId;
    this.survey = survey;
  }
}

// The 'SurveyUsers' type is used to handle the list of 'SurveyUser' objects.
export type SurveyUsers = {
  $id: string;
  $values: SurveyUser[];
};
