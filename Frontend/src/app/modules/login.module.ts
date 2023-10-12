export interface LoginResponse {
  userId: any;
  token: string;
  userType: string;
  groupIds?: {
    $id: string;
    $values: number[];
  };
}
