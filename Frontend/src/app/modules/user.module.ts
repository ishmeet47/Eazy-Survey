export interface User {
  id?: number; // ? makes the property optional
  username: string;
  password?: string; // Password is optional because you might not always want to send or receive it for security reasons
  // Add other properties as needed
}
