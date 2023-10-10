export interface LoginResponse {
  token: string;
  userType: string;
  groupIds?: {
    $id: string;
    $values: number[];
  };
}
