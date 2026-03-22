import { useEffect, useState } from "react";
import type { User } from "../types/user";
import { AuthContext } from "@/hooks/useAuth";
import { authApi } from "@/api/authApi";
import { client } from "@/api/clients";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    client
      .post("auth/jwt/refresh/")
      .catch(() => {})
      .then(() => authApi.getMe().then(setUser).catch(() => {}));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
