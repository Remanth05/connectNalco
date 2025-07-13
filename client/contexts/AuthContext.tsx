import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  employeeId: string;
  role: "employee" | "authority" | "admin";
  name: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      try {
        const userData = JSON.parse(savedAuth);
        if (userData.isAuthenticated) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error parsing saved auth data:", error);
        localStorage.removeItem("auth");
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("auth", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user?.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
