import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  employeeId: string;
  role: "employee" | "authority" | "admin";
  name: string;
  email?: string;
  isAuthenticated: boolean;
  token?: string;
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

  const logout = () => {
    // Clean up all user-related data from localStorage
    if (user?.employeeId) {
      localStorage.removeItem(`notifications_${user.employeeId}`);
      localStorage.removeItem(`attendance_${user.employeeId}`);
    }
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
  };

  // Session timeout monitoring
  useEffect(() => {
    if (!user?.loginTime) return;

    const checkSession = () => {
      const now = Date.now();
      const sessionDuration = now - (user.loginTime || 0);
      const maxSessionTime = user.sessionTimeout || 8 * 60 * 60 * 1000;
      const warningTime = maxSessionTime - 30 * 60 * 1000; // 30 minutes before expiry

      if (sessionDuration >= maxSessionTime) {
        // Session expired
        alert("Your session has expired. Please log in again.");
        logout();
      } else if (sessionDuration >= warningTime) {
        // Session expiring soon
        const timeLeft = Math.ceil(
          (maxSessionTime - sessionDuration) / (60 * 1000),
        );
        if (
          confirm(
            `Your session will expire in ${timeLeft} minutes. Do you want to extend it?`,
          )
        ) {
          // Extend session
          const extendedUserData = {
            ...user,
            loginTime: Date.now(),
          };
          setUser(extendedUserData);
          localStorage.setItem("auth", JSON.stringify(extendedUserData));
        }
      }
    };

    const interval = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [user]);

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
            localStorage.removeItem("token");
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
    const enhancedUserData = {
      ...userData,
      loginTime: Date.now(),
      sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    };
    setUser(enhancedUserData);
    localStorage.setItem("auth", JSON.stringify(enhancedUserData));
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user?.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
