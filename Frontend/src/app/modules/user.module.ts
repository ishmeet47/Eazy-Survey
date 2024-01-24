export interface User {
  $id?: string;
  id?: number;
  username: string;
  password?: string;
  passwordKey?: string;
  userType?: string;
  userGroups?: GroupResponse;
  surveysCompleted?: SurveyResponse;
  lastUpdatedOn?: string;
  lastUpdatedBy?: number;
  groupIds: number[];
  changePassword: boolean;
  // ... any other properties as needed
}

interface GroupResponse {
  $id?: string;
  $values?: any[];
  groups: any[];
}

interface SurveyResponse {
  $id?: string;
  $values?: any[];
}
