import { createContext, useContext } from "react";
import type { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth called outside AuthProvider boundaries");
  return ctx;
};
