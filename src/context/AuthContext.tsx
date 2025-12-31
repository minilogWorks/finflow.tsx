// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Tokens } from "../types";
import { StorageService } from "../services/StorageService";

interface User {
  id: number;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  isAuthenticated: boolean;
  authLoading: boolean;
  user: User | null;
  tokens: Tokens | null;
  login: (tokens: Tokens) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const tokens = StorageService.getTokens();
    if (tokens) {
      setTokens(tokens);
      setIsAuthenticated(true);
    }
    setAuthLoading(false);
  }, []);

  const login = (tokens: Tokens) => {
    setTokens(tokens);
    StorageService.saveTokens(tokens);

    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    StorageService.deleteTokens();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, authLoading, user, tokens, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
