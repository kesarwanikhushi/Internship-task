export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  bio?: string;
  avatar?: string;
}
