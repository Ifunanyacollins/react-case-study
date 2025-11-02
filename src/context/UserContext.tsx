import React, { createContext, useContext, useMemo } from "react";
import { currentUser } from "../constants/currentUser";

type UserRole = "admin" | "contributor";

interface User {
  name: string;
  role: UserRole;
}

interface UserContextType {
  user: User;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = currentUser.role === "admin";

  const value = useMemo(
    () => ({
      user: currentUser as User,
      isAdmin,
    }),
    [isAdmin]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};
