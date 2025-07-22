import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  employeeId: string;
  role: "employee" | "authority" | "admin";
  name: string;
  isAuthenticated: boolean;
  loginTime?: number;
  sessionTimeout?: number;
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
    // Check if user is already logged in (from localStorage) with session validation
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      try {
        const userData = JSON.parse(savedAuth);
        if (userData.isAuthenticated && userData.loginTime) {
          const now = Date.now();
          const sessionDuration = now - userData.loginTime;
          const maxSessionTime = userData.sessionTimeout || 8 * 60 * 60 * 1000; // Default 8 hours

          // Check if session is still valid
          if (sessionDuration < maxSessionTime) {
            setUser(userData);
          } else {
            // Session expired, clear auth data
            console.log("Session expired, logging out user");
            localStorage.removeItem("auth");
            localStorage.removeItem(`notifications_${userData.employeeId}`);
            localStorage.removeItem(`attendance_${userData.employeeId}`);
          }
        } else {
          // Invalid auth data, clear it
          localStorage.removeItem("auth");
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
