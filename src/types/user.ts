export type UserRole = "user" | "admin";

export interface User {
  username: string;
  avatar: string | null;
  bio: string;
  role: UserRole;

  stars: number;
}
