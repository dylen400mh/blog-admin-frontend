import React, { useState, createContext, useContext, useCallback } from "react";
import { isTokenExpired } from "../util/isTokenExpired";

interface AuthContextProps {
  isAuthenticated: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  validateToken: () => string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }, []);

  const validateToken = useCallback((): string | null => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      handleLogout();
      return null;
    } else {
      handleLogin();
      return token;
    }
  }, [handleLogin, handleLogout]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, handleLogin, handleLogout, validateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
