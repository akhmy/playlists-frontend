import { type User, type UserRole } from "@/types/user";
import { client } from "./clients";
import type { UserDto } from "./dto";

export const authApi = {
  signIn: (username: string, password: string) =>
    client.post("auth/jwt/create/", {
      username,
      password,
    }),

  signUp: (username: string, password: string, rePassword: string) =>
    client.post<string>("auth/users/", {
      username,
      password,
      re_password: rePassword,
    }),

  getMe: () => client.get<User>("auth/users/me/").then((res) => res.data),

  signOut: () => client.post("auth/jwt/logout/"),

  getUser: (username: string) =>
    client.get<UserDto>(`users/${username}`).then((res) => {
      const { is_staff, ...rest } = res.data;
      const role: UserRole = is_staff ? "admin" : "user";
      return { role, ...rest };
    }),
};
