import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, UserSession } from "@repo/domain";
import {
  getUserSession,
  removeSession,
  setUserSession,
} from "../utils/auth.tsx";

interface AuthState {
  user?: User;
  setUserSession: (userSession: UserSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  setUserSession: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.JSX.Element }) {
  const session = getUserSession();
  const [user, setUser] = useState<User | undefined>(session?.user);

  const state: AuthState = {
    user,
    setUserSession: (userSession) => {
      setUserSession(userSession);
      setUser(userSession.user);
    },
    logout: () => {
      setUser(undefined);
      removeSession();
    },
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthState => {
  return useContext(AuthContext);
};
