// export interface User {
//   id?: number; // ? makes the property optional
//   username: string;
//   password?: string; // Password is optional because you might not always want to send or receive it for security reasons
//   groupIds: number[];  // To associate a user with a group
//   // Add other properties as needed
// }



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
  // ... any other properties as needed
}

interface GroupResponse {
  $id?: string;
  $values?: any[];
  groups: any[];// Replace any[] with the appropriate type if known
}

interface SurveyResponse {
  $id?: string;
  $values?: any[];  // Replace any[] with the appropriate type if known
}


